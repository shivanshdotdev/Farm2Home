from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema

from .serializers import FarmerVerificationRequestSerializer, FarmerProfileSerializer
from .services import FarmerVerificationService
from .models import FarmerProfile


class FarmerVerifyView(views.APIView):
    """
    POST /api/farmer/verify/
    Verifies farmer identity via AgriStack, Kisan Credit Card (KCC), or Bhulekh (DILRMP).
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(request=FarmerVerificationRequestSerializer, responses={200: FarmerProfileSerializer})
    def post(self, request):
        serializer = FarmerVerificationRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        method = data['verification_method']
        user = request.user

        try:
            if method == 'AGRISTACK':
                profile = FarmerVerificationService.verify_agristack(
                    user=user,
                    agristack_id=data['agristack_id'],
                    state=data.get('state', 'Uttar Pradesh')
                )
            elif method == 'KCC':
                profile = FarmerVerificationService.verify_kcc(
                    user=user,
                    kcc_number=data['kcc_number'],
                    bank_ifsc=data.get('bank_ifsc', 'SBIN0001234')
                )
            elif method == 'BHULEKH':
                profile = FarmerVerificationService.verify_bhulekh(
                    user=user,
                    state=data.get('state', 'Uttar Pradesh'),
                    district=data.get('district', 'Varanasi'),
                    tehsil=data.get('tehsil', 'Pindra'),
                    khata_number=data['khata_number'],
                    khasra_plot=data.get('khasra_plot', '102/4'),
                    land_owner_name=data['land_owner_name']
                )
            else:
                return Response({"error": "Unsupported verification method."}, status=status.HTTP_400_BAD_REQUEST)

            return Response({
                "message": f"Farmer identity successfully verified via {method}!",
                "badge_id": profile.verification_badge_id,
                "profile": FarmerProfileSerializer(profile).data
            }, status=status.HTTP_200_OK)

        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class FarmerProfileDetailView(views.APIView):
    """
    GET /api/farmer/profile/
    Retrieves current authenticated farmer's verification badge and status.
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: FarmerProfileSerializer})
    def get(self, request):
        profile, _ = FarmerProfile.objects.get_or_create(user=request.user)
        return Response(FarmerProfileSerializer(profile).data, status=status.HTTP_200_OK)
