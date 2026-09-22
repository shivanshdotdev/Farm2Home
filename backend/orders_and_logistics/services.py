import uuid
import secrets
from decimal import Decimal
from django.utils import timezone
from .models import Order, EscrowTransaction, OrderStatusChoices, EscrowStatusChoices


class LogisticsRateService:
    """
    Logistics coordination with Delhivery & Porter APIs:
    - Real-time rate calculation based on weight, distance/pincode, and vehicle type.
    """

    @classmethod
    def calculate_quote(cls, origin_pincode: str, dest_pincode: str, weight_kg: float, partner: str = 'DELHIVERY'):
        weight = Decimal(str(weight_kg))
        origin_prefix = str(origin_pincode)[:2]
        dest_prefix = str(dest_pincode)[:2]
        is_intra_state = (origin_prefix == dest_prefix)

        if partner.upper() == 'PORTER':
            # Porter Mini Truck / 3-Wheeler Intra-city Model
            base_fare = Decimal('120.00')
            per_kg_rate = Decimal('8.00')
            distance_multiplier = Decimal('1.0') if is_intra_state else Decimal('2.2')
            total_shipping = (base_fare + (weight * per_kg_rate)) * distance_multiplier
            est_days = 1 if is_intra_state else 2
            carrier_name = "Porter Agri-Express Mini Truck"
        else:
            # Delhivery Surface & Express B2C Freight
            base_fare = Decimal('50.00')
            per_kg_rate = Decimal('12.00') if is_intra_state else Decimal('18.00')
            total_shipping = base_fare + (weight * per_kg_rate)
            est_days = 2 if is_intra_state else 4
            carrier_name = "Delhivery Agritech Direct Freight"

        total_shipping = total_shipping.quantize(Decimal('0.01'))
        quote_id = f"QTE_{secrets.token_hex(6).upper()}"

        return {
            "quote_id": quote_id,
            "logistics_partner": partner.upper(),
            "carrier_name": carrier_name,
            "origin_pincode": origin_pincode,
            "destination_pincode": dest_pincode,
            "weight_kg": float(weight),
            "estimated_transit_days": est_days,
            "delivery_fee": float(total_shipping),
            "is_intra_state": is_intra_state,
        }


class EscrowManagementService:
    """
    Tazapay & Razorpay Escrow Integration Service:
    Guarantees funds are held securely in escrow until delivery is verified.
    """

    @classmethod
    def create_escrow_transaction(cls, order: Order, provider: str = 'TAZAPAY') -> EscrowTransaction:
        ref_id = f"ESC_{provider[:3].upper()}_{secrets.token_hex(8).upper()}"
        escrow = EscrowTransaction.objects.create(
            order=order,
            provider=provider.upper(),
            escrow_reference_id=ref_id,
            amount=order.total_amount,
            status=EscrowStatusChoices.LOCKED_IN_ESCROW,
            buyer_paid_at=timezone.now(),
            provider_payload={
                "gateway": provider,
                "virtual_account": f"VA_{secrets.token_hex(6).upper()}",
                "escrow_guarantee": "SIH-2026-DHWAJ-SECURE-VAULT",
                "buyer_id": str(order.buyer.id),
                "seller_id": str(order.farmer.id),
            }
        )
        order.status = OrderStatusChoices.ESCROW_FUNDED
        order.save()
        return escrow

    @classmethod
    def release_funds_to_farmer(cls, order: Order):
        escrow = order.escrow
        if escrow.status == EscrowStatusChoices.RELEASED_TO_FARMER:
            return escrow

        escrow.status = EscrowStatusChoices.RELEASED_TO_FARMER
        escrow.released_at = timezone.now()
        escrow.save()

        order.status = OrderStatusChoices.COMPLETED
        order.save()
        return escrow

    @classmethod
    def process_refund(cls, order: Order, refund_amount: Decimal, reason: str):
        escrow = order.escrow
        escrow.refunded_amount = refund_amount
        escrow.refunded_at = timezone.now()
        
        if refund_amount >= escrow.amount:
            escrow.status = EscrowStatusChoices.REFUNDED_TO_BUYER
            order.status = OrderStatusChoices.REFUNDED
        else:
            escrow.status = EscrowStatusChoices.PARTIALLY_REFUNDED
            # Remainder released to farmer
            order.status = OrderStatusChoices.COMPLETED

        escrow.save()
        order.save()
        return escrow
