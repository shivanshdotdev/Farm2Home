from rest_framework import serializers
from .models import GovernmentScheme, SupportTicket


class GovernmentSchemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GovernmentScheme
        fields = [
            'id', 'title', 'category', 'description', 'eligibility',
            'benefits_summary', 'portal_url', 'is_active', 'published_date'
        ]


class SupportTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportTicket
        fields = [
            'id', 'ticket_number', 'phone_number', 'channel',
            'subject', 'status', 'conversation_log', 'created_at'
        ]


class WhatsAppWebhookSerializer(serializers.Serializer):
    """
    Standard incoming WhatsApp Business API message payload simulator/adapter.
    Supports both direct format {phone, message} and WhatsApp Cloud API nested webhook format.
    """
    phone = serializers.CharField(required=False)
    message = serializers.CharField(required=False)
    
    # WhatsApp Cloud Webhook standard fields
    entry = serializers.ListField(required=False)
    object = serializers.CharField(required=False)
