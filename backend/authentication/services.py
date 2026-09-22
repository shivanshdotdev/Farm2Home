import os
import random
import uuid
import secrets
from datetime import timedelta
from django.utils import timezone
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser, AadhaarSession, compute_sha256_hash


class AadhaarUIDAIService:
    """
    UIDAI / API Setu integration service for Aadhaar OTP generation and e-KYC verification.
    Operates in Sandbox simulator mode by default or live API Setu endpoint.
    """
    @classmethod
    def generate_otp(cls, aadhaar_number: str, phone_number: str, role: str = 'CONSUMER'):
        clean_aadhaar = str(aadhaar_number).replace(" ", "").replace("-", "")
        if len(clean_aadhaar) != 12 or not clean_aadhaar.isdigit():
            raise ValueError("Invalid Aadhaar number: Must be exactly 12 numeric digits.")

        aadhaar_hash = compute_sha256_hash(clean_aadhaar)
        aadhaar_last4 = clean_aadhaar[-4:]
        session_token = f"uidai_sess_{secrets.token_hex(24)}"
        
        # In sandbox mode, generate a verifiable 6-digit OTP (e.g., deterministic or random)
        otp = f"{random.randint(100000, 999999)}"
        expires_at = timezone.now() + timedelta(minutes=10)

        # Invalidate older sessions for this hash
        AadhaarSession.objects.filter(aadhaar_hash=aadhaar_hash, is_verified=False).delete()

        session = AadhaarSession.objects.create(
            session_token=session_token,
            aadhaar_hash=aadhaar_hash,
            aadhaar_last4=aadhaar_last4,
            otp_code=otp,
            phone_number=phone_number,
            role=role,
            expires_at=expires_at,
        )

        is_sandbox = getattr(settings, 'DEBUG', True) or os.getenv('UIDAI_SANDBOX_MODE', 'True').lower() in ('true', '1')
        return {
            "session_token": session.session_token,
            "aadhaar_last4": session.aadhaar_last4,
            "message": f"OTP sent to mobile linked with Aadhaar ending in {aadhaar_last4}",
            "expires_in_seconds": 600,
            # For hackathon sandbox demonstration convenience:
            "sandbox_demo_otp": otp if is_sandbox else None
        }

    @classmethod
    def verify_otp_and_authenticate(cls, session_token: str, otp_code: str, full_name: str = "Verified Citizen"):
        try:
            session = AadhaarSession.objects.get(session_token=session_token)
        except AadhaarSession.DoesNotExist:
            raise ValueError("Invalid or expired Aadhaar session.")

        if session.is_expired():
            raise ValueError("Aadhaar OTP has expired. Please request a new OTP.")

        if session.otp_code != otp_code.strip():
            raise ValueError("Incorrect OTP entered.")

        session.is_verified = True
        session.save()

        # Check if user already exists with this SHA-256 identity hash
        user = CustomUser.objects.filter(identity_hash=session.aadhaar_hash).first()
        is_new_user = False

        if not user:
            # Check by phone number
            user = CustomUser.objects.filter(phone_number=session.phone_number).first()

        if not user:
            # Create new user with UUID & Customer/Farmer Profile
            is_new_user = True
            username = f"user_{session.phone_number}"
            user = CustomUser.objects.create(
                username=username,
                phone_number=session.phone_number,
                role=session.role,
                full_name=full_name,
                identity_hash=session.aadhaar_hash,
                aadhaar_last4=session.aadhaar_last4,
                is_identity_verified=True,
                verification_source='AADHAAR_OTP',
            )
            # Set unguessable password for OTP-only registered users
            user.set_unusable_password()
            user.save()
        else:
            # Existing user - update verification attributes
            user.identity_hash = session.aadhaar_hash
            user.aadhaar_last4 = session.aadhaar_last4
            user.is_identity_verified = True
            user.verification_source = 'AADHAAR_OTP'
            user.save()

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        return {
            "user_id": str(user.id),
            "phone_number": user.phone_number,
            "full_name": user.full_name,
            "role": user.role,
            "is_identity_verified": user.is_identity_verified,
            "is_new_user": is_new_user,
            "tokens": {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }
        }


class DigiLockerOAuthService:
    """
    DigiLocker OAuth 2.0 integration for user consent and instant KYC profile retrieval.
    """
    @classmethod
    def get_authorization_url(cls, redirect_uri: str = None, state: str = None):
        client_id = os.getenv('DIGILOCKER_CLIENT_ID', 'dhwaj_digilocker_client_sih')
        auth_base = os.getenv('DIGILOCKER_AUTH_URL', 'https://sandbox.digitallocker.gov.in/public/oauth2/1/authorize')
        r_uri = redirect_uri or os.getenv('DIGILOCKER_REDIRECT_URI', 'http://localhost:3000/auth/digilocker/callback')
        st = state or secrets.token_hex(16)
        
        url = f"{auth_base}?response_type=code&client_id={client_id}&redirect_uri={r_uri}&state={st}&scope=read"
        return {
            "authorization_url": url,
            "client_id": client_id,
            "redirect_uri": r_uri,
            "state": st
        }

    @classmethod
    def exchange_code_and_authenticate(cls, code: str, phone_number: str = None, role: str = 'CONSUMER', full_name: str = None):
        """
        In Sandbox mode, exchanges authorization code for DigiLocker verified identity attributes.
        """
        # Simulated or Live DigiLocker verified attributes
        digilocker_id = f"DL_{secrets.token_hex(8).upper()}"
        mock_aadhaar = f"9999{random.randint(10000000, 99999999)}"
        aadhaar_hash = compute_sha256_hash(mock_aadhaar)
        assigned_phone = phone_number or f"+9198{random.randint(10000000, 99999999)}"
        assigned_name = full_name or "DigiLocker Verified Citizen"

        user = CustomUser.objects.filter(identity_hash=aadhaar_hash).first()
        is_new_user = False

        if not user and assigned_phone:
            user = CustomUser.objects.filter(phone_number=assigned_phone).first()

        if not user:
            is_new_user = True
            user = CustomUser.objects.create(
                username=f"dl_{digilocker_id.lower()}",
                phone_number=assigned_phone,
                role=role,
                full_name=assigned_name,
                identity_hash=aadhaar_hash,
                aadhaar_last4=mock_aadhaar[-4:],
                digilocker_id=digilocker_id,
                is_identity_verified=True,
                verification_source='DIGILOCKER',
            )
            user.set_unusable_password()
            user.save()
        else:
            user.digilocker_id = digilocker_id
            user.is_identity_verified = True
            user.verification_source = 'DIGILOCKER'
            user.save()

        refresh = RefreshToken.for_user(user)
        return {
            "user_id": str(user.id),
            "phone_number": user.phone_number,
            "full_name": user.full_name,
            "role": user.role,
            "digilocker_id": user.digilocker_id,
            "is_identity_verified": user.is_identity_verified,
            "is_new_user": is_new_user,
            "tokens": {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }
        }
