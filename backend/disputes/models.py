import uuid
from decimal import Decimal
from django.db import models
from django.conf import settings
from orders_and_logistics.models import Order


class DisputeReasonChoices(models.TextChoices):
    SPOILED_PRODUCE = 'SPOILED_PRODUCE', 'Spoiled or Rotten Produce'
    WEIGHT_SHORTFALL = 'WEIGHT_SHORTFALL', 'Weight Shortfall / Discrepancy'
    QUALITY_MISREPRESENTATION = 'QUALITY_MISREPRESENTATION', 'Quality Misrepresentation / Lower Grade'
    TRANSIT_DAMAGE = 'TRANSIT_DAMAGE', 'Transit Mishandling or Physical Damage'
    INCORRECT_ITEM = 'INCORRECT_ITEM', 'Incorrect Produce Delivered'


class FaultPartyChoices(models.TextChoices):
    FARMER = 'FARMER', 'Farmer Fault'
    LOGISTICS = 'LOGISTICS', 'Logistics Carrier Fault'
    CONSUMER = 'CONSUMER', 'Consumer Error'
    SPLIT = 'SPLIT', 'Shared Fault'
    PENDING_ASSESSMENT = 'PENDING_ASSESSMENT', 'Pending Assessment'


class DisputeStatusChoices(models.TextChoices):
    SUBMITTED = 'SUBMITTED', 'Submitted (Under Video Verification)'
    INVESTIGATING = 'INVESTIGATING', 'Fault Matrix Evaluation in Progress'
    RESOLVED_FULL_REFUND = 'RESOLVED_FULL_REFUND', 'Resolved: Full Refund to Consumer'
    RESOLVED_PARTIAL_REFUND = 'RESOLVED_PARTIAL_REFUND', 'Resolved: Partial Refund Applied'
    RESOLVED_REJECTED = 'RESOLVED_REJECTED', 'Resolved: Claim Rejected (Escrow Released to Farmer)'


class OrderDispute(models.Model):
    """
    Dispute record with mandatory unboxing video proof and automated fault matrix evaluation.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='dispute')
    raised_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='raised_disputes'
    )
    dispute_reason = models.CharField(
        max_length=30,
        choices=DisputeReasonChoices.choices,
        default=DisputeReasonChoices.SPOILED_PRODUCE
    )
    
    # Mandatory Video Proof Rule (per SIH Specifications)
    video_proof_url = models.URLField(
        help_text="Mandatory continuous unboxing video proof link (e.g. S3/Supabase Storage/Cloudinary URL)"
    )
    unboxing_video_file = models.FileField(upload_to='dispute_videos/', null=True, blank=True)
    description = models.TextField(help_text="Detailed description of the issue observed")

    # Metrics for quantitative evaluation
    received_weight_kg = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Weight measured upon unboxing (for WEIGHT_SHORTFALL claims)"
    )

    # Fault Matrix & Refund Outcomes
    fault_party = models.CharField(
        max_length=30,
        choices=FaultPartyChoices.choices,
        default=FaultPartyChoices.PENDING_ASSESSMENT
    )
    refund_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00'))
    refund_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    farmer_payout_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    
    status = models.CharField(
        max_length=30,
        choices=DisputeStatusChoices.choices,
        default=DisputeStatusChoices.SUBMITTED,
        db_index=True
    )
    evaluation_notes = models.TextField(blank=True)
    carrier_insurance_claimed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Dispute on Order #{str(self.order.id)[:8]} ({self.dispute_reason}) -> {self.status}"
