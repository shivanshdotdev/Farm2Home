from decimal import Decimal
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from marketplace.models import GovernmentMSP, CropCategoryChoices
from support_and_schemes.models import SupportTicket


class WhatsAppSupportTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        GovernmentMSP.objects.create(
            crop_name="Wheat",
            category=CropCategoryChoices.GRAINS,
            msp_per_quintal=Decimal('2275.00'),
            msp_per_kg=Decimal('22.75'),
            is_active=True
        )

    def test_whatsapp_webhook_verification_challenge(self):
        res = self.client.get('/api/support/whatsapp/', {
            "hub.mode": "subscribe",
            "hub.verify_token": "dhwaj_sih_webhook_verify_token_2026",
            "hub.challenge": "1158201244"
        })
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, 1158201244)

    def test_whatsapp_bot_autoreply_msp_query(self):
        payload = {
            "phone": "+919876543210",
            "message": "2 Wheat"
        }
        res = self.client.post('/api/support/whatsapp/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("bot_reply", res.data)
        reply_text = res.data["bot_reply"]["reply_text"]
        self.assertIn("Wheat", reply_text)
        self.assertIn("22.75", reply_text)

    def test_whatsapp_bot_autoreply_escalation(self):
        payload = {
            "phone": "+919876543210",
            "message": "5"
        }
        res = self.client.post('/api/support/whatsapp/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["bot_reply"]["status"], SupportTicket.StatusChoices.ESCALATED_AGENT)
