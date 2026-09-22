import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone


class FarmerProfile(models.Model):
    class VerificationTypeChoices(models.TextChoices):
        AGRISTACK = 'AGRISTACK', 'AgriStack ID (State DB)'
        KCC = 'KCC', 'Kisan Credit Card (Bank / C-DAC)'
        BHULEKH = 'BHULEKH', 'Bhulekh Record (DILRMP Land Registry)'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='farmer_profile'
    )
    verification_type = models.CharField(
        max_length=20,
        choices=VerificationTypeChoices.choices,
        default=VerificationTypeChoices.AGRISTACK
    )

    # Unique Government Registry Identifiers with DB constraints
    agristack_id = models.CharField(max_length=50, unique=True, null=True, blank=True, db_index=True)
    kcc_number = models.CharField(max_length=50, unique=True, null=True, blank=True, db_index=True)
    
    # Bhulekh Land Record Information (DILRMP)
    land_record_khata = models.CharField(max_length=50, null=True, blank=True)
    land_khasra_plot = models.CharField(max_length=50, null=True, blank=True)
    land_owner_name = models.CharField(max_length=255, null=True, blank=True)
    land_holding_acres = models.DecimalField(max_digits=7, decimal_places=2, default=1.0)
    
    # Administrative hierarchy
    state = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    tehsil = models.CharField(max_length=100, blank=True, null=True)
    village = models.CharField(max_length=100, blank=True, null=True)

    # Verification status & badge
    is_verified = models.BooleanField(default=False)
    verified_at = models.DateTimeField(null=True, blank=True)
    verification_badge_id = models.CharField(max_length=64, blank=True, null=True)
    verification_meta = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def mark_as_verified(self, method: str, meta: dict):
        self.is_verified = True
        self.verification_type = method
        self.verified_at = timezone.now()
        self.verification_badge_id = f"DHW-FARMER-{uuid.uuid4().hex[:8].upper()}"
        self.verification_meta = meta
        self.save()

        # Update User entity status as well
        self.user.role = 'FARMER'
        self.user.is_identity_verified = True
        self.user.save()

    def __str__(self):
        return f"FarmerProfile ({self.user.phone_number}) - Verified: {self.is_verified}"
