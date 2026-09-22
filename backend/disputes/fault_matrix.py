from decimal import Decimal
from .models import OrderDispute, DisputeReasonChoices, FaultPartyChoices, DisputeStatusChoices
from orders_and_logistics.models import OrderStatusChoices
from orders_and_logistics.services import EscrowManagementService


class DisputeFaultMatrixEngine:
    """
    Automated Dispute Fault Matrix System (as specified in SIH 2026 slide):
    - Video-verified chain of custody.
    - Fault attribution to Farmer, Logistics, or Consumer.
    - Partial refund calculation and escrow settlement.
    """

    @classmethod
    def evaluate_and_settle(cls, dispute: OrderDispute) -> OrderDispute:
        order = dispute.order
        produce_amount = order.produce_amount
        total_amount = order.total_amount

        # Freeze order in DISPUTED state during evaluation
        order.status = OrderStatusChoices.DISPUTED
        order.save()

        # Enforce video proof check
        if not dispute.video_proof_url:
            dispute.status = DisputeStatusChoices.RESOLVED_REJECTED
            dispute.fault_party = FaultPartyChoices.CONSUMER
            dispute.evaluation_notes = "Dispute rejected: Mandatory continuous unboxing video proof was not provided."
            dispute.save()
            # Release escrow to farmer
            EscrowManagementService.release_funds_to_farmer(order)
            return dispute

        reason = dispute.dispute_reason

        if reason == DisputeReasonChoices.SPOILED_PRODUCE:
            # 100% produce refund to buyer, farmer held responsible
            dispute.fault_party = FaultPartyChoices.FARMER
            dispute.refund_percentage = Decimal('100.00')
            dispute.refund_amount = total_amount
            dispute.farmer_payout_amount = Decimal('0.00')
            dispute.status = DisputeStatusChoices.RESOLVED_FULL_REFUND
            dispute.evaluation_notes = "Video proof validated: Spoiled produce confirmed upon delivery. Full refund issued to buyer."

        elif reason == DisputeReasonChoices.TRANSIT_DAMAGE:
            # Logistics mishandling: 100% refund to consumer, carrier insurance claim filed for farmer
            dispute.fault_party = FaultPartyChoices.LOGISTICS
            dispute.refund_percentage = Decimal('100.00')
            dispute.refund_amount = total_amount
            dispute.farmer_payout_amount = produce_amount  # Covered by carrier insurance
            dispute.carrier_insurance_claimed = True
            dispute.status = DisputeStatusChoices.RESOLVED_FULL_REFUND
            dispute.evaluation_notes = (
                f"Video proof confirmed packaging breach during {order.get_logistics_partner_display()} transit. "
                "100% refund credited to buyer. Carrier logistics insurance claim filed for farmer payout."
            )

        elif reason == DisputeReasonChoices.WEIGHT_SHORTFALL:
            ordered_kg = order.quantity_kg
            received_kg = dispute.received_weight_kg or (ordered_kg * Decimal('0.8'))
            
            if received_kg >= ordered_kg:
                dispute.fault_party = FaultPartyChoices.CONSUMER
                dispute.refund_percentage = Decimal('0.00')
                dispute.refund_amount = Decimal('0.00')
                dispute.farmer_payout_amount = produce_amount
                dispute.status = DisputeStatusChoices.RESOLVED_REJECTED
                dispute.evaluation_notes = "Video scale calibration showed no shortfall. Claim closed."
            else:
                shortfall_kg = ordered_kg - received_kg
                shortfall_ratio = shortfall_kg / ordered_kg
                refund_produce = (shortfall_ratio * produce_amount).quantize(Decimal('0.01'))
                
                dispute.fault_party = FaultPartyChoices.SPLIT
                dispute.refund_percentage = (shortfall_ratio * Decimal('100.00')).quantize(Decimal('0.01'))
                dispute.refund_amount = refund_produce
                dispute.farmer_payout_amount = produce_amount - refund_produce
                dispute.status = DisputeStatusChoices.RESOLVED_PARTIAL_REFUND
                dispute.evaluation_notes = (
                    f"Pro-rata partial refund applied for {shortfall_kg}kg weight discrepancy "
                    f"({dispute.refund_percentage}% of produce). Remainder disbursed to farmer."
                )

        elif reason == DisputeReasonChoices.QUALITY_MISREPRESENTATION:
            # Grade mismatch (e.g. Grade A promised, Grade B received): 40% partial refund
            dispute.fault_party = FaultPartyChoices.FARMER
            dispute.refund_percentage = Decimal('40.00')
            refund_val = (produce_amount * Decimal('0.40')).quantize(Decimal('0.01'))
            dispute.refund_amount = refund_val
            dispute.farmer_payout_amount = produce_amount - refund_val
            dispute.status = DisputeStatusChoices.RESOLVED_PARTIAL_REFUND
            dispute.evaluation_notes = (
                "Video evidence indicates lower quality grade than listed. "
                "40% compensatory price adjustment refunded to buyer. 60% disbursed to farmer."
            )

        elif reason == DisputeReasonChoices.INCORRECT_ITEM:
            dispute.fault_party = FaultPartyChoices.FARMER
            dispute.refund_percentage = Decimal('100.00')
            dispute.refund_amount = total_amount
            dispute.farmer_payout_amount = Decimal('0.00')
            dispute.status = DisputeStatusChoices.RESOLVED_FULL_REFUND
            dispute.evaluation_notes = "Wrong item delivery confirmed via video. Full refund approved."

        dispute.save()

        # Execute refund in Escrow
        if dispute.refund_amount > 0:
            EscrowManagementService.process_refund(
                order=order,
                refund_amount=dispute.refund_amount,
                reason=dispute.evaluation_notes
            )
        else:
            EscrowManagementService.release_funds_to_farmer(order)

        return dispute
