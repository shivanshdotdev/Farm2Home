from decimal import Decimal
from rest_framework import serializers
from .models import Order, EscrowTransaction, OrderStatusChoices, LogisticsPartnerChoices
from marketplace.models import ProductListing


class LogisticsQuoteRequestSerializer(serializers.Serializer):
    origin_pincode = serializers.CharField(max_length=10)
    destination_pincode = serializers.CharField(max_length=10)
    weight_kg = serializers.FloatField(min_value=0.5)
    partner = serializers.ChoiceField(
        choices=LogisticsPartnerChoices.choices,
        default=LogisticsPartnerChoices.DELHIVERY
    )


class OrderCreateSerializer(serializers.Serializer):
    listing_id = serializers.UUIDField()
    quantity_kg = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=Decimal('1.00'))
    delivery_address = serializers.CharField()
    buyer_pincode = serializers.CharField(max_length=10)
    buyer_phone = serializers.CharField(max_length=15)
    logistics_partner = serializers.ChoiceField(
        choices=LogisticsPartnerChoices.choices,
        default=LogisticsPartnerChoices.DELHIVERY
    )
    escrow_provider = serializers.ChoiceField(
        choices=['TAZAPAY', 'RAZORPAY_ESCROW'],
        default='TAZAPAY'
    )

    def validate(self, attrs):
        try:
            listing = ProductListing.objects.get(id=attrs['listing_id'], is_active=True)
        except ProductListing.DoesNotExist:
            raise serializers.ValidationError({"listing_id": "Listing not found or inactive."})

        if attrs['quantity_kg'] > listing.quantity_available_kg:
            raise serializers.ValidationError({
                "quantity_kg": f"Requested quantity ({attrs['quantity_kg']}kg) exceeds stock ({listing.quantity_available_kg}kg)."
            })

        attrs['listing'] = listing
        return attrs


class EscrowTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EscrowTransaction
        fields = [
            'id', 'provider', 'escrow_reference_id', 'amount',
            'status', 'buyer_paid_at', 'released_at', 'refunded_at',
            'refunded_amount'
        ]


class OrderDetailSerializer(serializers.ModelSerializer):
    buyer_name = serializers.CharField(source='buyer.full_name', read_only=True)
    farmer_name = serializers.CharField(source='farmer.full_name', read_only=True)
    farmer_phone = serializers.CharField(source='farmer.phone_number', read_only=True)
    crop_name = serializers.CharField(source='listing.crop_name', read_only=True)
    escrow = EscrowTransactionSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'crop_name', 'farmer_name', 'farmer_phone', 'buyer_name',
            'quantity_kg', 'unit_price_per_kg', 'produce_amount',
            'logistics_partner', 'delivery_fee', 'total_amount',
            'delivery_address', 'buyer_pincode', 'buyer_phone',
            'tracking_number', 'status', 'escrow', 'created_at'
        ]


class OrderStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=OrderStatusChoices.choices)
    tracking_number = serializers.CharField(required=False, allow_blank=True)
