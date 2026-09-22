from rest_framework import serializers
from .models import OrderDispute, DisputeReasonChoices


class OrderDisputeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderDispute
        fields = [
            'dispute_reason', 'video_proof_url', 'description', 'received_weight_kg'
        ]

    def validate(self, attrs):
        video_url = attrs.get('video_proof_url', '').strip()
        if not video_url:
            raise serializers.ValidationError({
                "video_proof_url": "Mandatory unboxing video proof URL is required to raise a dispute under SIH 2026 guidelines."
            })
        
        reason = attrs.get('dispute_reason')
        if reason == DisputeReasonChoices.WEIGHT_SHORTFALL and not attrs.get('received_weight_kg'):
            raise serializers.ValidationError({
                "received_weight_kg": "Measured weight (kg) must be specified for weight shortfall claims."
            })
        return attrs


class OrderDisputeDetailSerializer(serializers.ModelSerializer):
    order_id = serializers.UUIDField(source='order.id', read_only=True)
    crop_name = serializers.CharField(source='order.listing.crop_name', read_only=True)
    buyer_name = serializers.CharField(source='raised_by.full_name', read_only=True)

    class Meta:
        model = OrderDispute
        fields = [
            'id', 'order_id', 'crop_name', 'buyer_name', 'dispute_reason',
            'video_proof_url', 'description', 'received_weight_kg',
            'fault_party', 'refund_percentage', 'refund_amount',
            'farmer_payout_amount', 'status', 'evaluation_notes',
            'carrier_insurance_claimed', 'created_at'
        ]
        read_only_fields = [
            'id', 'fault_party', 'refund_percentage', 'refund_amount',
            'farmer_payout_amount', 'status', 'evaluation_notes',
            'carrier_insurance_claimed', 'created_at'
        ]
