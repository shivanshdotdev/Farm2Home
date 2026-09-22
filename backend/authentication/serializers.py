from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = CustomUser
        fields = [
            'id', 'phone_number', 'password', 'full_name', 'role',
            'state', 'district', 'pincode', 'address'
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')
        role = validated_data.get('role', CustomUser.RoleChoices.CONSUMER)
        user = CustomUser(
            username=validated_data['phone_number'],
            **validated_data
        )
        user.set_password(password)
        user.save()
        return user


class UserLoginSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        phone = attrs.get('phone_number')
        password = attrs.get('password')
        
        user = CustomUser.objects.filter(phone_number=phone).first()
        if not user or not user.check_password(password):
            raise serializers.ValidationError("Invalid phone number or password.")
        
        attrs['user'] = user
        return attrs


class AadhaarGenOtpSerializer(serializers.Serializer):
    aadhaar_number = serializers.CharField(min_length=12, max_length=14)
    phone_number = serializers.CharField(max_length=15)
    role = serializers.ChoiceField(
        choices=CustomUser.RoleChoices.choices,
        default=CustomUser.RoleChoices.CONSUMER
    )


class AadhaarVerifyOtpSerializer(serializers.Serializer):
    session_token = serializers.CharField()
    otp_code = serializers.CharField(min_length=6, max_length=6)
    full_name = serializers.CharField(required=False, default="Verified Citizen")


class DigiLockerCallbackSerializer(serializers.Serializer):
    code = serializers.CharField()
    phone_number = serializers.CharField(required=False, allow_null=True)
    role = serializers.ChoiceField(
        choices=CustomUser.RoleChoices.choices,
        default=CustomUser.RoleChoices.CONSUMER,
        required=False
    )
    full_name = serializers.CharField(required=False, default="DigiLocker Citizen")


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'phone_number', 'full_name', 'role', 'identity_hash',
            'aadhaar_last4', 'is_identity_verified', 'verification_source',
            'digilocker_id', 'state', 'district', 'pincode', 'address',
            'created_at'
        ]
        read_only_fields = ['id', 'identity_hash', 'is_identity_verified', 'created_at']
