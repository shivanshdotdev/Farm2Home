import os
from rest_framework import status, views, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from drf_spectacular.utils import extend_schema

from .models import GovernmentScheme, SupportTicket
from .serializers import (
    GovernmentSchemeSerializer,
    SupportTicketSerializer,
    WhatsAppWebhookSerializer,
)
from .services import WhatsAppBotService


class GovernmentSchemeListView(generics.ListAPIView):
    """
    GET /api/schemes/
    Public feed of Government Schemes (PM-KISAN, AgriStack, PMFBY, Soil Health Card).
    """
    queryset = GovernmentScheme.objects.filter(is_active=True).order_by('-published_date')
    serializer_class = GovernmentSchemeSerializer
    permission_classes = [AllowAny]


class WhatsAppWebhookView(views.APIView):
    """
    Webhook endpoint for WhatsApp Business API.
    GET: Webhook verification challenge from Meta/WhatsApp Cloud.
    POST: Processes incoming message and triggers Bot AutoReply.
    """
    permission_classes = [AllowAny]

    @extend_schema(responses={200: str})
    def get(self, request):
        mode = request.query_params.get('hub.mode')
        token = request.query_params.get('hub.verify_token')
        challenge = request.query_params.get('hub.challenge')
        
        expected_token = os.getenv('WHATSAPP_VERIFY_TOKEN', 'dhwaj_sih_webhook_verify_token_2026')
        if mode == 'subscribe' and token == expected_token:
            return Response(int(challenge) if challenge.isdigit() else challenge, status=status.HTTP_200_OK)
        return Response({"error": "Verification token mismatch"}, status=status.HTTP_403_FORBIDDEN)

    @extend_schema(request=WhatsAppWebhookSerializer, responses={200: dict})
    def post(self, request):
        data = request.data
        sender_phone = None
        message_text = None

        # 1. Simple direct payload: {"phone": "+919876543210", "message": "1"}
        if 'phone' in data and 'message' in data:
            sender_phone = data['phone']
            message_text = data['message']
        
        # 2. WhatsApp Cloud Webhook standard nested payload
        elif 'entry' in data:
            try:
                entry = data['entry'][0]
                changes = entry['changes'][0]['value']
                message_obj = changes['messages'][0]
                sender_phone = message_obj['from']
                message_text = message_obj['text']['body']
            except (KeyError, IndexError):
                return Response({"status": "ignored_non_message_event"}, status=status.HTTP_200_OK)

        if not sender_phone or not message_text:
            return Response({"error": "Missing phone or message body in payload."}, status=status.HTTP_400_BAD_REQUEST)

        # Process via AutoReply Bot Service
        bot_response = WhatsAppBotService.process_incoming_message(
            sender_phone=sender_phone,
            message_body=message_text
        )

        return Response({
            "status": "success",
            "bot_reply": bot_response
        }, status=status.HTTP_200_OK)


class SupportTicketListView(generics.ListAPIView):
    """
    GET /api/support/tickets/
    Retrieves support tickets for authenticated user or all tickets for admin.
    """
    serializer_class = SupportTicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return SupportTicket.objects.all().order_by('-created_at')
        return SupportTicket.objects.filter(phone_number=user.phone_number).order_by('-created_at')
