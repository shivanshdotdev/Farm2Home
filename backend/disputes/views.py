from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema

from orders_and_logistics.models import Order, OrderStatusChoices
from .models import OrderDispute
from .serializers import OrderDisputeCreateSerializer, OrderDisputeDetailSerializer
from .fault_matrix import DisputeFaultMatrixEngine


class OrderDisputeCreateView(views.APIView):
    """
    POST /api/orders/{id}/dispute/
    Raises an order dispute with mandatory unboxing video proof and triggers fault matrix evaluation.
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(request=OrderDisputeCreateSerializer, responses={201: OrderDisputeDetailSerializer})
    def post(self, request, pk):
        order = get_object_or_404(Order.objects.select_related('escrow'), pk=pk)

        # Only buyer can raise dispute
        if request.user != order.buyer and not request.user.is_staff:
            return Response({"error": "Only the buyer who placed this order can raise a dispute."}, status=status.HTTP_403_FORBIDDEN)

        if hasattr(order, 'dispute'):
            return Response({"error": "A dispute has already been filed for this order."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = OrderDisputeCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        dispute = serializer.save(
            order=order,
            raised_by=request.user
        )

        # Trigger automated fault matrix evaluation and escrow settlement
        evaluated_dispute = DisputeFaultMatrixEngine.evaluate_and_settle(dispute)

        return Response({
            "message": "Dispute filed with video proof. Fault matrix evaluation completed.",
            "dispute": OrderDisputeDetailSerializer(evaluated_dispute).data
        }, status=status.HTTP_201_CREATED)


class OrderDisputeDetailView(views.APIView):
    """
    GET /api/orders/{id}/dispute/
    Inspects the status and fault matrix resolution for an order dispute.
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: OrderDisputeDetailSerializer})
    def get(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        if not hasattr(order, 'dispute'):
            return Response({"error": "No dispute found for this order."}, status=status.HTTP_404_NOT_FOUND)

        if request.user not in (order.buyer, order.farmer) and not request.user.is_staff:
            return Response({"error": "Unauthorized to view this dispute."}, status=status.HTTP_403_FORBIDDEN)

        return Response(OrderDisputeDetailSerializer(order.dispute).data, status=status.HTTP_200_OK)
