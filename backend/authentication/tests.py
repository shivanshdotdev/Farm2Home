from decimal import Decimal
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from authentication.models import CustomUser, AadhaarSession, compute_sha256_hash
from authentication.services import AadhaarUIDAIService


class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_aadhaar_otp_generation_and_verification(self):
        gen_res = self.client.post('/api/auth/aadhaar/gen-otp/', {
            "aadhaar_number": "123456789012",
            "phone_number": "+919876543210",
            "role": "CONSUMER"
        })
        self.assertEqual(gen_res.status_code, status.HTTP_200_OK)
        self.assertIn("session_token", gen_res.data)
        self.assertIn("sandbox_demo_otp", gen_res.data)

        session_token = gen_res.data["session_token"]
        otp = gen_res.data.get("sandbox_demo_otp") or AadhaarSession.objects.get(session_token=session_token).otp_code

        verify_res = self.client.post('/api/auth/aadhaar/verify-otp/', {
            "session_token": session_token,
            "otp_code": otp,
            "full_name": "Test Verified Consumer"
        })
        self.assertEqual(verify_res.status_code, status.HTTP_200_OK)
        self.assertTrue(verify_res.data["is_identity_verified"])
        self.assertIn("tokens", verify_res.data)
        self.assertIn("access", verify_res.data["tokens"])

        # Verify SHA-256 hash was stored and user exists
        expected_hash = compute_sha256_hash("123456789012")
        user = CustomUser.objects.get(phone_number="+919876543210")
        self.assertEqual(user.identity_hash, expected_hash)
        self.assertEqual(user.aadhaar_last4, "9012")

    def test_unique_sha256_constraint_prevents_duplicate_identity(self):
        # Create user with a specific hash
        h = compute_sha256_hash("999988887777")
        CustomUser.objects.create(
            username="+919999999991",
            phone_number="+919999999991",
            identity_hash=h,
            aadhaar_last4="7777",
            is_identity_verified=True
        )

        # Generating and verifying OTP with same Aadhaar for a second number should deduplicate/link rather than crash
        gen_res = self.client.post('/api/auth/aadhaar/gen-otp/', {
            "aadhaar_number": "999988887777",
            "phone_number": "+919999999992",
            "role": "CONSUMER"
        })
        session_token = gen_res.data["session_token"]
        otp = gen_res.data.get("sandbox_demo_otp") or AadhaarSession.objects.get(session_token=session_token).otp_code

        verify_res = self.client.post('/api/auth/aadhaar/verify-otp/', {
            "session_token": session_token,
            "otp_code": otp
        })
        self.assertEqual(verify_res.status_code, status.HTTP_200_OK)
        # Should link to existing identity user
        self.assertFalse(verify_res.data["is_new_user"])

    def test_digilocker_authorization_url(self):
        res = self.client.get('/api/auth/digilocker/url/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("authorization_url", res.data)
        self.assertIn("client_id", res.data)
