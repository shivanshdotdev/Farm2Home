from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    AadhaarGenOtpView,
    AadhaarVerifyOtpView,
    DigiLockerUrlView,
    DigiLockerCallbackView,
    UserProfileView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('login/', LoginView.as_view(), name='auth-login'),
    path('aadhaar/gen-otp/', AadhaarGenOtpView.as_view(), name='auth-aadhaar-gen-otp'),
    path('aadhaar/verify-otp/', AadhaarVerifyOtpView.as_view(), name='auth-aadhaar-verify-otp'),
    path('digilocker/url/', DigiLockerUrlView.as_view(), name='auth-digilocker-url'),
    path('digilocker/callback/', DigiLockerCallbackView.as_view(), name='auth-digilocker-callback'),
    path('me/', UserProfileView.as_view(), name='auth-me'),
]
