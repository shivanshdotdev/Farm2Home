from rest_framework import status, views, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema, OpenApiParameter

from .models import GovernmentMSP, ProductListing
from .serializers import (
    GovernmentMSPSerializer,
    ProductListingCreateSerializer,
    ProductListingDetailSerializer
)
from .services import GeoMatchingService


class GovernmentMSPListView(generics.ListAPIView):
    """
    GET /api/msp/
    Public master list of Government Minimum Support Prices (MSP) for crops.
    """
    queryset = GovernmentMSP.objects.filter(is_active=True).order_by('crop_name')
    serializer_class = GovernmentMSPSerializer
    permission_classes = [AllowAny]


class ListingCreateView(views.APIView):
    """
    POST /api/listings/create/
    Creates a new produce listing. Strictly validates and enforces Government MSP price floor.
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(request=ProductListingCreateSerializer, responses={201: ProductListingDetailSerializer})
    def post(self, request):
        user = request.user
        serializer = ProductListingCreateSerializer(data=request.data)
        if serializer.is_valid():
            listing = serializer.save(
                farmer=user,
                farm_pincode=serializer.validated_data.get('farm_pincode') or user.pincode or '221001',
                farm_state=serializer.validated_data.get('farm_state') or user.state or 'Uttar Pradesh',
                farm_district=serializer.validated_data.get('farm_district') or user.district or 'Varanasi',
                farm_latitude=serializer.validated_data.get('farm_latitude') or user.latitude,
                farm_longitude=serializer.validated_data.get('farm_longitude') or user.longitude,
            )
            return Response({
                "message": "Produce listing created successfully with MSP floor protection.",
                "listing": ProductListingDetailSerializer(listing).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FarmerMyListingsView(views.APIView):
    """
    GET /api/listings/my/
    Returns all product listings published by the authenticated farmer.
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: ProductListingDetailSerializer(many=True)})
    def get(self, request):
        listings = ProductListing.objects.filter(farmer=request.user).order_by('-created_at')
        serializer = ProductListingDetailSerializer(listings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ListingListView(views.APIView):
    """
    GET /api/listings/
    Consumers browse and search listings with category/crop filters and geo-matching proximity.
    """
    permission_classes = [AllowAny]

    @extend_schema(
        parameters=[
            OpenApiParameter('crop', str, description='Filter by crop name (e.g. Wheat)'),
            OpenApiParameter('category', str, description='Filter by category (GRAINS, PULSES, etc.)'),
            OpenApiParameter('max_price', float, description='Filter by max price per kg'),
            OpenApiParameter('pincode', str, description='Filter by farm pincode'),
            OpenApiParameter('lat', float, description='User latitude for geo-matching'),
            OpenApiParameter('lon', float, description='User longitude for geo-matching'),
            OpenApiParameter('radius_km', float, description='Max radius in km for local produce'),
        ],
        responses={200: ProductListingDetailSerializer(many=True)}
    )
    def get(self, request):
        queryset = ProductListing.objects.filter(is_active=True).select_related('farmer')

        crop = request.query_params.get('crop')
        category = request.query_params.get('category')
        max_price = request.query_params.get('max_price')
        pincode = request.query_params.get('pincode')

        if crop:
            queryset = queryset.filter(crop_name__icontains=crop)
        if category:
            queryset = queryset.filter(category=category.upper())
        if max_price:
            queryset = queryset.filter(price_per_kg__lte=max_price)
        if pincode:
            queryset = queryset.filter(farm_pincode=pincode)

        user_lat = request.query_params.get('lat')
        user_lon = request.query_params.get('lon')
        radius_km = request.query_params.get('radius_km')

        if user_lat and user_lon:
            try:
                listings = GeoMatchingService.annotate_distance(
                    queryset,
                    float(user_lat),
                    float(user_lon),
                    float(radius_km) if radius_km else None
                )
                serializer = ProductListingDetailSerializer(listings, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except ValueError:
                pass

        serializer = ProductListingDetailSerializer(queryset.order_by('-created_at'), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ListingDetailView(views.APIView):
    """
    GET /api/listings/{id}/
    Retrieves full details for a specific listing including verified farmer badge.
    """
    permission_classes = [AllowAny]

    @extend_schema(responses={200: ProductListingDetailSerializer})
    def get(self, request, pk):
        listing = get_object_or_404(ProductListing.objects.select_related('farmer'), pk=pk)
        return Response(ProductListingDetailSerializer(listing).data, status=status.HTTP_200_OK)
