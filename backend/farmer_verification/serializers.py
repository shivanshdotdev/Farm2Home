from rest_framework import serializers
from .models import FarmerProfile


class FarmerVerificationRequestSerializer(serializers.Serializer):
    verification_method = serializers.ChoiceField(
        choices=['AGRISTACK', 'KCC', 'BHULEKH']
    )
    
    # AgriStack fields
    agristack_id = serializers.CharField(required=False, allow_blank=True)
    
    # KCC fields
    kcc_number = serializers.CharField(required=False, allow_blank=True)
    bank_ifsc = serializers.CharField(required=False, allow_blank=True, default="SBIN0001234")
    
    # Bhulekh fields
    state = serializers.CharField(required=False, allow_blank=True, default="Uttar Pradesh")
    district = serializers.CharField(required=False, allow_blank=True)
    tehsil = serializers.CharField(required=False, allow_blank=True)
    khata_number = serializers.CharField(required=False, allow_blank=True)
    khasra_plot = serializers.CharField(required=False, allow_blank=True)
    land_owner_name = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        method = attrs.get('verification_method')
        if method == 'AGRISTACK' and not attrs.get('agristack_id'):
            raise serializers.ValidationError({"agristack_id": "AgriStack ID is required for AgriStack verification."})
        elif method == 'KCC' and not attrs.get('kcc_number'):
            raise serializers.ValidationError({"kcc_number": "KCC Number is required for KCC verification."})
        elif method == 'BHULEKH':
            if not attrs.get('khata_number') or not attrs.get('land_owner_name'):
                raise serializers.ValidationError({
                    "error": "khata_number and land_owner_name are required for Bhulekh DILRMP verification."
                })
        return attrs


class FarmerProfileSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(source='user.phone_number', read_only=True)
    farmer_name = serializers.CharField(source='user.full_name', read_only=True)

    class Meta:
        model = FarmerProfile
        fields = [
            'id', 'phone_number', 'farmer_name', 'verification_type',
            'agristack_id', 'kcc_number', 'land_record_khata', 'land_owner_name',
            'land_holding_acres', 'state', 'district', 'tehsil', 'village',
            'is_verified', 'verified_at', 'verification_badge_id', 'verification_meta',
            'created_at'
        ]
        read_only_fields = ['id', 'is_verified', 'verified_at', 'verification_badge_id', 'created_at']
