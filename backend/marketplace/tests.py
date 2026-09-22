from decimal import Decimal
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from authentication.models import CustomUser
from marketplace.models import GovernmentMSP, ProductListing, CropCategoryChoices


class MarketplaceMSPTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.farmer = CustomUser.objects.create(
            username="+919876511111",
            phone_number="+919876511111",
            role=CustomUser.RoleChoices.FARMER,
            full_name="Farmer Ramesh",
            is_identity_verified=True,
            pincode="221001",
            state="Uttar Pradesh",
            district="Varanasi"
        )
        self.client.force_authenticate(user=self.farmer)

        # Set official MSP: Wheat at ₹2275/quintal -> ₹22.75/kg
        self.msp_wheat = GovernmentMSP.objects.create(
            crop_name="Wheat",
            category=CropCategoryChoices.GRAINS,
            msp_per_quintal=Decimal('2275.00'),
            msp_per_kg=Decimal('22.75'),
            is_active=True
        )

    def test_listing_below_msp_is_strictly_rejected(self):
        """Verify hardcoded MSP price floor rejects listings below government minimums."""
        payload = {
            "crop_name": "Wheat",
            "category": "GRAINS",
            "variety": "Sharbati",
            "quantity_available_kg": 500.0,
            "price_per_kg": 19.50,  # Below MSP 22.75!
            "farm_pincode": "221001"
        }
        res = self.client.post('/api/listings/create/', payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("price_per_kg", res.data)
        # Verify the error message mentions MSP protection
        error_msg = str(res.data["price_per_kg"])
        self.assertIn("Minimum Support Price", error_msg)

    def test_listing_above_or_equal_to_msp_is_accepted(self):
        """Verify listings at or above MSP succeed."""
        payload = {
            "crop_name": "Wheat",
            "category": "GRAINS",
            "variety": "Sharbati",
            "quantity_available_kg": 500.0,
            "price_per_kg": 25.00,  # Above MSP 22.75!
            "farm_pincode": "221001"
        }
        res = self.client.post('/api/listings/create/', payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Decimal(str(res.data["listing"]["price_per_kg"])), Decimal('25.00'))

    def test_msp_public_api_list(self):
        unauth_client = APIClient()
        res = unauth_client.get('/api/msp/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(len(res.data["results"]) >= 1)
