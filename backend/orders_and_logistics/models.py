import uuid
from decimal import Decimal
from django.db import models
from django.conf import settings
from marketplace.models import ProductListing


class OrderStatusChoices(models.TextChoices):
    PENDING = 'PENDING', 'Pending Payment'
    ESCROW_FUNDED = 'ESCROW_FUNDED', 'Escrow Funded (Funds Locked)'
    DISPATCHED = 'DISPATCHED', 'Dispatched by Farmer'
    IN_TRANSIT = 'IN_TRANSIT', 'In Transit (Logistics Courier)'
    DELIVERED = 'DELIVERED', 'Delivered to Customer'
    COMPLETED = 'COMPLETED', 'Completed (Funds Released to Farmer)'
    DISPUTED = 'DISPUTED', 'Disputed (Funds Frozen in Escrow)'
    CANCELLED = 'CANCELLED', 'Cancelled'
    REFUNDED = 'REFUNDED', 'Refunded'


class LogisticsPartnerChoices(models.TextChoices):
    DELHIVERY = 'DELHIVERY', 'Delhivery Surface & Express'
    PORTER = 'PORTER', 'Porter Intra-City Mini Truck'
    DIRECT_PICKUP = 'DIRECT_PICKUP', 'Direct Farm Pickup'


class EscrowStatusChoices(models.TextChoices):
    INITIATED = 'INITIATED', 'Initiated'
    LOCKED_IN_ESCROW = 'LOCKED_IN_ESCROW', 'Funds Locked in Escrow'
    RELEASED_TO_FARMER = 'RELEASED_TO_FARMER', 'Released to Farmer'
    REFUNDED_TO_BUYER = 'REFUNDED_TO_BUYER', 'Refunded to Buyer'
    PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED', 'Partially Refunded via Fault Matrix'


class Order(models.Model):
    """
    Direct farmer-consumer order with guaranteed Escrow lock and integrated logistics.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    buyer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='purchased_orders'
    )
    listing = models.ForeignKey(
        ProductListing,
        on_delete=models.CASCADE,
        related_name='orders'
    )
    farmer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sales_orders'
    )
    quantity_kg = models.DecimalField(max_digits=10, decimal_places=2)
    unit_price_per_kg = models.DecimalField(max_digits=10, decimal_places=2)
    produce_amount = models.DecimalField(max_digits=12, decimal_places=2)

    # Logistics coordination (Porter + Delhivery)
    logistics_partner = models.CharField(
        max_length=20,
        choices=LogisticsPartnerChoices.choices,
        default=LogisticsPartnerChoices.DELHIVERY
    )
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)

    delivery_address = models.TextField()
    buyer_pincode = models.CharField(max_length=10)
    buyer_phone = models.CharField(max_length=15)
    tracking_number = models.CharField(max_length=50, blank=True, null=True)

    status = models.CharField(
        max_length=20,
        choices=OrderStatusChoices.choices,
        default=OrderStatusChoices.PENDING,
        db_index=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{str(self.id)[:8]} - {self.listing.crop_name} ({self.quantity_kg}kg) -> {self.status}"


class EscrowTransaction(models.Model):
    """
    Escrow record securing funds via Tazapay or Razorpay Escrow.
    Protects both parties: funds are held until delivery verification or dispute resolution.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='escrow')
    provider = models.CharField(max_length=50, default='TAZAPAY')
    escrow_reference_id = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(
        max_length=30,
        choices=EscrowStatusChoices.choices,
        default=EscrowStatusChoices.INITIATED
    )
    buyer_paid_at = models.DateTimeField(null=True, blank=True)
    released_at = models.DateTimeField(null=True, blank=True)
    refunded_at = models.DateTimeField(null=True, blank=True)
    refunded_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    provider_payload = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Escrow #{self.escrow_reference_id} ({self.status}) - ₹{self.amount}"
