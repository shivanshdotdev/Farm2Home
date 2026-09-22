from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from drf_spectacular.utils import extend_schema

from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    AadhaarGenOtpSerializer,
    AadhaarVerifyOtpSerializer,
    DigiLockerCallbackSerializer,
    UserProfileSerializer,
)
from .services import AadhaarUIDAIService, DigiLockerOAuthService


class RegisterView(views.APIView):
    permission_classes = [AllowAny]

    @extend_schema(request=UserRegistrationSerializer, responses={201: UserProfileSerializer})
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "User registered successfully.",
                "user": UserProfileSerializer(user).data,
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token)
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(views.APIView):
    permission_classes = [AllowAny]

    @extend_schema(request=UserLoginSerializer, responses={200: dict})
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Login successful.",
                "user": UserProfileSerializer(user).data,
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token)
                }
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AadhaarGenOtpView(views.APIView):
    permission_classes = [AllowAny]

    @extend_schema(request=AadhaarGenOtpSerializer, responses={200: dict})
    def post(self, request):
        serializer = AadhaarGenOtpSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            try:
                res = AadhaarUIDAIService.generate_otp(
                    aadhaar_number=data['aadhaar_number'],
                    phone_number=data['phone_number'],
                    role=data['role']
                )
                return Response(res, status=status.HTTP_200_OK)
            except ValueError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AadhaarVerifyOtpView(views.APIView):
    permission_classes = [AllowAny]

    @extend_schema(request=AadhaarVerifyOtpSerializer, responses={200: dict})
    def post(self, request):
        serializer = AadhaarVerifyOtpSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            try:
                auth_result = AadhaarUIDAIService.verify_otp_and_authenticate(
                    session_token=data['session_token'],
                    otp_code=data['otp_code'],
                    full_name=data.get('full_name', 'Verified Citizen')
                )
                return Response(auth_result, status=status.HTTP_200_OK)
            except ValueError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DigiLockerUrlView(views.APIView):
    permission_classes = [AllowAny]

    @extend_schema(responses={200: dict})
    def get(self, request):
        redirect_uri = request.query_params.get('redirect_uri')
        state = request.query_params.get('state')
        res = DigiLockerOAuthService.get_authorization_url(redirect_uri=redirect_uri, state=state)
        return Response(res, status=status.HTTP_200_OK)


class DigiLockerCallbackView(views.APIView):
    permission_classes = [AllowAny]

    @extend_schema(request=DigiLockerCallbackSerializer, responses={200: dict})
    def post(self, request):
        serializer = DigiLockerCallbackSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            try:
                auth_result = DigiLockerOAuthService.exchange_code_and_authenticate(
                    code=data['code'],
                    phone_number=data.get('phone_number'),
                    role=data.get('role', 'CONSUMER'),
                    full_name=data.get('full_name')
                )
                return Response(auth_result, status=status.HTTP_200_OK)
            except ValueError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(views.APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: UserProfileSerializer})
    def get(self, request):
        return Response(UserProfileSerializer(request.user).data, status=status.HTTP_200_OK)
