import uuid
from decimal import Decimal
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError


class CropCategoryChoices(models.TextChoices):
    GRAINS = 'GRAINS', 'Cereals & Grains'
    PULSES = 'PULSES', 'Pulses & Legumes'
    OILSEEDS = 'OILSEEDS', 'Oilseeds'
    VEGETABLES = 'VEGETABLES', 'Vegetables'
    FRUITS = 'FRUITS', 'Fruits'
    COMMERCIAL = 'COMMERCIAL', 'Commercial & Cash Crops'


class GovernmentMSP(models.Model):
    """
    Master record of official Government Minimum Support Prices (MSP).
    Protects farmers from predatory pricing and lowballing.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    crop_name = models.CharField(max_length=100, unique=True, db_index=True)
    category = models.CharField(
        max_length=20,
        choices=CropCategoryChoices.choices,
        default=CropCategoryChoices.GRAINS
    )
    msp_per_quintal = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Government MSP in INR per quintal (100 kg)"
    )
    msp_per_kg = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Government MSP in INR per kg (msp_per_quintal / 100)"
    )
    marketing_season = models.CharField(max_length=50, default="2025-2026")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.msp_per_quintal and not self.msp_per_kg:
            self.msp_per_kg = (Decimal(str(self.msp_per_quintal)) / Decimal('100.00')).quantize(Decimal('0.01'))
        elif self.msp_per_kg and not self.msp_per_quintal:
            self.msp_per_quintal = (Decimal(str(self.msp_per_kg)) * Decimal('100.00')).quantize(Decimal('0.01'))
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.crop_name} - MSP: ₹{self.msp_per_kg}/kg (₹{self.msp_per_quintal}/quintal)"


class ProductListing(models.Model):
    """
    Farmer produce listing on the Dhwaj marketplace.
    Enforces the MSP price floor: price_per_kg cannot be lower than government minimum.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    farmer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='listings'
    )
    crop_name = models.CharField(max_length=100, db_index=True)
    category = models.CharField(
        max_length=20,
        choices=CropCategoryChoices.choices,
        default=CropCategoryChoices.GRAINS
    )
    variety = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    
    quantity_available_kg = models.DecimalField(max_digits=12, decimal_places=2)
    price_per_kg = models.DecimalField(max_digits=10, decimal_places=2)
    msp_floor_applied = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    harvest_date = models.DateField(null=True, blank=True)
    shelf_life_days = models.PositiveIntegerField(default=14)
    is_organic = models.BooleanField(default=False)
    
    # Origin location coordinates for geo-matching consumers with local farmers
    farm_pincode = models.CharField(max_length=10, db_index=True)
    farm_district = models.CharField(max_length=100, blank=True)
    farm_state = models.CharField(max_length=100, blank=True)
    farm_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    farm_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    image_url = models.URLField(blank=True, default="https://images.unsplash.com/photo-1500937386664-56d1dfef3854")
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        super().clean()
        # Enforce Government Minimum Support Price (MSP) floor
        msp_record = GovernmentMSP.objects.filter(
            crop_name__iexact=self.crop_name.strip(),
            is_active=True
        ).first()

        if msp_record:
            self.msp_floor_applied = msp_record.msp_per_kg
            if self.price_per_kg < msp_record.msp_per_kg:
                raise ValidationError({
                    'price_per_kg': (
                        f"Price manipulation rejected! Government Minimum Support Price (MSP) for "
                        f"{self.crop_name} is ₹{msp_record.msp_per_kg}/kg (₹{msp_record.msp_per_quintal}/quintal). "
                        f"Listing price of ₹{self.price_per_kg}/kg violates MSP floor protection."
                    )
                })

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.crop_name} ({self.quantity_available_kg} kg @ ₹{self.price_per_kg}/kg) - {self.farmer.phone_number}"
