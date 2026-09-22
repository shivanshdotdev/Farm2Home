from decimal import Decimal
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from authentication.models import CustomUser
from marketplace.models import ProductListing, CropCategoryChoices
from orders_and_logistics.models import Order, OrderStatusChoices, EscrowStatusChoices
from orders_and_logistics.services import EscrowManagementService
from disputes.models import OrderDispute, DisputeReasonChoices, FaultPartyChoices, DisputeStatusChoices


class DisputeFaultMatrixTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.farmer = CustomUser.objects.create(
            username="+919876522221",
            phone_number="+919876522221",
            role=CustomUser.RoleChoices.FARMER,
            full_name="Kisan Dev",
            is_identity_verified=True
        )
        self.buyer = CustomUser.objects.create(
            username="+919876522222",
            phone_number="+919876522222",
            role=CustomUser.RoleChoices.CONSUMER,
            full_name="Anjali Verma",
            is_identity_verified=True
        )
        self.listing = ProductListing.objects.create(
            farmer=self.farmer,
            crop_name="Tomato",
            category=CropCategoryChoices.VEGETABLES,
            quantity_available_kg=Decimal('100.00'),
            price_per_kg=Decimal('30.00'),
            farm_pincode="221001"
        )
        # Create an Order of 50kg @ ₹30 = ₹1500 + delivery ₹120 = ₹1620
        self.order = Order.objects.create(
            buyer=self.buyer,
            farmer=self.farmer,
            listing=self.listing,
            quantity_kg=Decimal('50.00'),
            unit_price_per_kg=Decimal('30.00'),
            produce_amount=Decimal('1500.00'),
            delivery_fee=Decimal('120.00'),
            total_amount=Decimal('1620.00'),
            delivery_address="Lanka, Varanasi",
            buyer_pincode="221005",
            buyer_phone="+919876522222",
            status=OrderStatusChoices.DELIVERED
        )
        # Setup Escrow
        self.escrow = EscrowManagementService.create_escrow_transaction(self.order, provider='TAZAPAY')
        self.client.force_authenticate(user=self.buyer)

    def test_dispute_requires_mandatory_video_proof(self):
        """Filing dispute without video proof URL must be rejected."""
        payload = {
            "dispute_reason": "SPOILED_PRODUCE",
            "video_proof_url": "",  # Empty video proof!
            "description": "Tomatoes arrived rotten."
        }
        res = self.client.post(f'/api/orders/{self.order.id}/dispute/', payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("video_proof_url", res.data)

    def test_spoiled_produce_fault_matrix_100_percent_refund(self):
        """Spoiled produce with video proof triggers 100% refund to consumer from Escrow."""
        payload = {
            "dispute_reason": "SPOILED_PRODUCE",
            "video_proof_url": "https://storage.supabase.co/sih-videos/unboxing_proof_123.mp4",
            "description": "Produce arrived rotten and moldy as visible in unboxing video."
        }
        res = self.client.post(f'/api/orders/{self.order.id}/dispute/', payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        dispute_data = res.data["dispute"]
        self.assertEqual(dispute_data["fault_party"], "FARMER")
        self.assertEqual(Decimal(str(dispute_data["refund_percentage"])), Decimal('100.00'))
        self.assertEqual(Decimal(str(dispute_data["refund_amount"])), Decimal('1620.00'))
        self.assertEqual(dispute_data["status"], DisputeStatusChoices.RESOLVED_FULL_REFUND)

        # Check Escrow status updated to REFUNDED_TO_BUYER
        self.order.refresh_from_db()
        self.escrow.refresh_from_db()
        self.assertEqual(self.escrow.status, EscrowStatusChoices.REFUNDED_TO_BUYER)

    def test_weight_shortfall_fault_matrix_partial_refund(self):
        """Weight discrepancy (e.g. ordered 50kg, received 40kg -> 20% shortfall) triggers pro-rata partial refund."""
        payload = {
            "dispute_reason": "WEIGHT_SHORTFALL",
            "video_proof_url": "https://storage.supabase.co/sih-videos/unboxing_weight_check.mp4",
            "received_weight_kg": 40.0,  # 10kg shortfall on 50kg = 20%
            "description": "Package weighed on digital scale during continuous unboxing shows 40kg instead of 50kg."
        }
        res = self.client.post(f'/api/orders/{self.order.id}/dispute/', payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        dispute_data = res.data["dispute"]
        self.assertEqual(dispute_data["fault_party"], "SPLIT")
        self.assertEqual(Decimal(str(dispute_data["refund_percentage"])), Decimal('20.00'))
        # 20% of 1500 = ₹300.00
        self.assertEqual(Decimal(str(dispute_data["refund_amount"])), Decimal('300.00'))
        self.assertEqual(dispute_data["status"], DisputeStatusChoices.RESOLVED_PARTIAL_REFUND)

        # Escrow should reflect partial refund
        self.escrow.refresh_from_db()
        self.assertEqual(self.escrow.status, EscrowStatusChoices.PARTIALLY_REFUNDED)
        self.assertEqual(self.escrow.refunded_amount, Decimal('300.00'))
