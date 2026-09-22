import uuid
import hashlib
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


def compute_sha256_hash(value: str) -> str:
    """Computes SHA-256 hash for secure deduplication and government ID verification."""
    clean_val = str(value).strip().replace(" ", "").replace("-", "")
    return hashlib.sha256(clean_val.encode('utf-8')).hexdigest()


class CustomUser(AbstractUser):
    """
    Custom user model for Dhwaj agricultural platform.
    Supports UUID primary keys, role-based access, and SHA-256 identity deduplication.
    """
    class RoleChoices(models.TextChoices):
        FARMER = 'FARMER', 'Farmer'
        CONSUMER = 'CONSUMER', 'Consumer'
        ADMIN = 'ADMIN', 'Admin'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone_number = models.CharField(max_length=15, unique=True, db_index=True)
    role = models.CharField(
        max_length=20,
        choices=RoleChoices.choices,
        default=RoleChoices.CONSUMER,
        db_index=True
    )
    full_name = models.CharField(max_length=255, blank=True)

    # Cryptographic SHA-256 identity hash for preventing duplicate accounts while preserving privacy
    identity_hash = models.CharField(
        max_length=64,
        unique=True,
        null=True,
        blank=True,
        db_index=True,
        help_text="SHA-256 hashed national/Aadhaar identity with UNIQUE DB constraint"
    )
    aadhaar_last4 = models.CharField(max_length=4, blank=True, null=True)
    is_identity_verified = models.BooleanField(
        default=False,
        help_text="True if identity verified via Aadhaar OTP or DigiLocker"
    )
    verification_source = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="Source of identity verification: AADHAAR_OTP, DIGILOCKER, AGRISTACK, etc."
    )
    digilocker_id = models.CharField(max_length=100, blank=True, null=True, unique=True)
    
    # Location & address details for geo-matching
    state = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    pincode = models.CharField(max_length=10, blank=True, null=True, db_index=True)
    address = models.TextField(blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.phone_number
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.phone_number} ({self.get_role_display()}) - {'Verified' if self.is_identity_verified else 'Unverified'}"


class AadhaarSession(models.Model):
    """
    Ephemeral session tracking for UIDAI / Setu Aadhaar OTP flow.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session_token = models.CharField(max_length=128, unique=True, db_index=True)
    aadhaar_hash = models.CharField(max_length=64, db_index=True)
    aadhaar_last4 = models.CharField(max_length=4)
    otp_code = models.CharField(max_length=6)
    phone_number = models.CharField(max_length=15)
    role = models.CharField(max_length=20, default='CONSUMER')
    is_verified = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self) -> bool:
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"Aadhaar OTP Session for ...{self.aadhaar_last4} (expires {self.expires_at})"
