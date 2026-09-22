from decimal import Decimal
from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema

from .models import Order, OrderStatusChoices
from .serializers import (
    LogisticsQuoteRequestSerializer,
    OrderCreateSerializer,
    OrderDetailSerializer,
    OrderStatusUpdateSerializer,
)
from .services import LogisticsRateService, EscrowManagementService


class LogisticsQuoteView(views.APIView):
    """
    GET /api/logistics/quote/
    Calculates live logistics rates across Porter and Delhivery APIs based on weight and pincodes.
    """
    permission_classes = [AllowAny]

    @extend_schema(parameters=[LogisticsQuoteRequestSerializer], responses={200: dict})
    def get(self, request):
        serializer = LogisticsQuoteRequestSerializer(data=request.query_params)
        if serializer.is_valid():
            data = serializer.validated_data
            quote = LogisticsRateService.calculate_quote(
                origin_pincode=data['origin_pincode'],
                dest_pincode=data['destination_pincode'],
                weight_kg=data['weight_kg'],
                partner=data['partner']
            )
            return Response(quote, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderCreateView(views.APIView):
    """
    POST /api/orders/create/
    Creates a new direct produce order: calculates logistics, deducts stock, and locks funds in Escrow.
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(request=OrderCreateSerializer, responses={201: OrderDetailSerializer})
    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        listing = data['listing']
        quantity = data['quantity_kg']
        buyer = request.user

        # Calculate produce total
        produce_amount = (quantity * listing.price_per_kg).quantize(Decimal('0.01'))

        # Calculate logistics quote
        logistics_quote = LogisticsRateService.calculate_quote(
            origin_pincode=listing.farm_pincode or '221001',
            dest_pincode=data['buyer_pincode'],
            weight_kg=float(quantity),
            partner=data['logistics_partner']
        )
        delivery_fee = Decimal(str(logistics_quote['delivery_fee']))
        total_amount = produce_amount + delivery_fee

        # Deduct quantity from listing
        listing.quantity_available_kg -= quantity
        if listing.quantity_available_kg <= 0:
            listing.is_active = False
        listing.save()

        # Create Order
        order = Order.objects.create(
            buyer=buyer,
            listing=listing,
            farmer=listing.farmer,
            quantity_kg=quantity,
            unit_price_per_kg=listing.price_per_kg,
            produce_amount=produce_amount,
            logistics_partner=data['logistics_partner'],
            delivery_fee=delivery_fee,
            total_amount=total_amount,
            delivery_address=data['delivery_address'],
            buyer_pincode=data['buyer_pincode'],
            buyer_phone=data['buyer_phone'],
            status=OrderStatusChoices.PENDING
        )

        # Lock funds in Escrow vault
        escrow = EscrowManagementService.create_escrow_transaction(
            order=order,
            provider=data.get('escrow_provider', 'TAZAPAY')
        )

        return Response({
            "message": "Order created successfully. Funds are secured in Escrow.",
            "order": OrderDetailSerializer(order).data,
            "escrow_reference": escrow.escrow_reference_id
        }, status=status.HTTP_201_CREATED)


class OrderMyListView(views.APIView):
    """
    GET /api/orders/my/
    Retrieves order history: sales orders if Farmer, purchase orders if Consumer.
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: OrderDetailSerializer(many=True)})
    def get(self, request):
        user = request.user
        if user.role == 'FARMER':
            orders = Order.objects.filter(farmer=user).select_related('buyer', 'farmer', 'listing', 'escrow').order_by('-created_at')
        else:
            orders = Order.objects.filter(buyer=user).select_related('buyer', 'farmer', 'listing', 'escrow').order_by('-created_at')

        serializer = OrderDetailSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OrderDetailView(views.APIView):
    """
    GET /api/orders/{id}/
    Common endpoint: retrieves details of a specific order.
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: OrderDetailSerializer})
    def get(self, request, pk):
        order = get_object_or_404(
            Order.objects.select_related('buyer', 'farmer', 'listing', 'escrow'),
            pk=pk
        )
        # Ensure only parties involved can view
        if request.user not in (order.buyer, order.farmer) and not request.user.is_staff:
            return Response({"error": "Unauthorized to view this order."}, status=status.HTTP_403_FORBIDDEN)

        return Response(OrderDetailSerializer(order).data, status=status.HTTP_200_OK)


class OrderStatusUpdateView(views.APIView):
    """
    PUT /api/orders/{id}/status/
    Common endpoint: updates order status along the lifecycle state machine.
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(request=OrderStatusUpdateSerializer, responses={200: OrderDetailSerializer})
    def put(self, request, pk):
        order = get_object_or_404(Order.objects.select_related('escrow'), pk=pk)
        user = request.user

        if user not in (order.buyer, order.farmer) and not user.is_staff:
            return Response({"error": "Unauthorized to modify this order."}, status=status.HTTP_403_FORBIDDEN)

        serializer = OrderStatusUpdateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        new_status = serializer.validated_data['status']
        tracking = serializer.validated_data.get('tracking_number')

        # Role state transitions
        if new_status == OrderStatusChoices.DISPATCHED:
            if user != order.farmer and not user.is_staff:
                return Response({"error": "Only the farmer can mark the order as Dispatched."}, status=status.HTTP_403_FORBIDDEN)
            order.status = OrderStatusChoices.DISPATCHED
            if tracking:
                order.tracking_number = tracking

        elif new_status == OrderStatusChoices.IN_TRANSIT:
            order.status = OrderStatusChoices.IN_TRANSIT
            if tracking:
                order.tracking_number = tracking

        elif new_status == OrderStatusChoices.DELIVERED:
            order.status = OrderStatusChoices.DELIVERED

        elif new_status == OrderStatusChoices.COMPLETED:
            # Releasing escrow funds to farmer
            EscrowManagementService.release_funds_to_farmer(order)

        else:
            order.status = new_status

        order.save()
        return Response({
            "message": f"Order status updated to {order.status}.",
            "order": OrderDetailSerializer(order).data
        }, status=status.HTTP_200_OK)
