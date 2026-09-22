from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field
from .models import GovernmentMSP, ProductListing
from farmer_verification.models import FarmerProfile


class GovernmentMSPSerializer(serializers.ModelSerializer):
    class Meta:
        model = GovernmentMSP
        fields = [
            'id', 'crop_name', 'category', 'msp_per_quintal',
            'msp_per_kg', 'marketing_season', 'is_active'
        ]


class ProductListingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductListing
        fields = [
            'id', 'crop_name', 'category', 'variety', 'description',
            'quantity_available_kg', 'price_per_kg', 'harvest_date',
            'shelf_life_days', 'is_organic', 'farm_pincode',
            'farm_district', 'farm_state', 'farm_latitude',
            'farm_longitude', 'image_url'
        ]
        read_only_fields = ['id']

    def validate(self, attrs):
        crop_name = attrs.get('crop_name', '').strip()
        price = attrs.get('price_per_kg')

        msp_record = GovernmentMSP.objects.filter(crop_name__iexact=crop_name, is_active=True).first()
        if msp_record and price < msp_record.msp_per_kg:
            raise serializers.ValidationError({
                "price_per_kg": (
                    f"Listing rejected! Price ₹{price}/kg is below official Government Minimum Support Price (MSP) "
                    f"of ₹{msp_record.msp_per_kg}/kg (₹{msp_record.msp_per_quintal}/quintal) for {crop_name}. "
                    f"Price floor protection prevents lowballing."
                )
            })
        return attrs


class ProductListingDetailSerializer(serializers.ModelSerializer):
    farmer_phone = serializers.CharField(source='farmer.phone_number', read_only=True)
    farmer_name = serializers.CharField(source='farmer.full_name', read_only=True)
    is_farmer_verified = serializers.BooleanField(source='farmer.is_identity_verified', read_only=True)
    farmer_badge_id = serializers.SerializerMethodField()
    distance_km = serializers.FloatField(required=False, read_only=True)

    class Meta:
        model = ProductListing
        fields = [
            'id', 'crop_name', 'category', 'variety', 'description',
            'quantity_available_kg', 'price_per_kg', 'msp_floor_applied',
            'harvest_date', 'shelf_life_days', 'is_organic',
            'farm_pincode', 'farm_district', 'farm_state',
            'farm_latitude', 'farm_longitude', 'image_url',
            'is_active', 'farmer_name', 'farmer_phone', 'is_farmer_verified',
            'farmer_badge_id', 'distance_km', 'created_at'
        ]

    @extend_schema_field(str)
    def get_farmer_badge_id(self, obj):
        try:
            profile = obj.farmer.farmer_profile
            return profile.verification_badge_id if profile.is_verified else None
        except Exception:
            return None
