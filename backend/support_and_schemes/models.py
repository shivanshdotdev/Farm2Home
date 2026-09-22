import uuid
from django.db import models
from django.conf import settings


class GovernmentSchemeCategory(models.TextChoices):
    FINANCIAL_SUPPORT = 'FINANCIAL_SUPPORT', 'Direct Financial Support (PM-KISAN)'
    DIGITIZATION = 'DIGITIZATION', 'Digital Registries & Identity (AgriStack)'
    INSURANCE = 'INSURANCE', 'Crop Insurance & Risk Mitigation (PMFBY)'
    CREDIT = 'CREDIT', 'Institutional Credit (KCC / JanSamarth)'
    SUBSIDY = 'SUBSIDY', 'Inputs, Soil & Irrigation Subsidies'


class GovernmentScheme(models.Model):
    """
    In-app Government scheme updates to keep farmers informed of national initiatives.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    category = models.CharField(
        max_length=30,
        choices=GovernmentSchemeCategory.choices,
        default=GovernmentSchemeCategory.FINANCIAL_SUPPORT
    )
    description = models.TextField()
    eligibility = models.TextField()
    benefits_summary = models.TextField()
    portal_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    published_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.get_category_display()})"


class SupportTicket(models.Model):
    class ChannelChoices(models.TextChoices):
        WHATSAPP = 'WHATSAPP', 'WhatsApp Business Bot'
        WEB = 'WEB', 'Web / App Portal'

    class StatusChoices(models.TextChoices):
        OPEN = 'OPEN', 'Open'
        BOT_RESOLVED = 'BOT_RESOLVED', 'Resolved by Bot AutoReply'
        ESCALATED_AGENT = 'ESCALATED_AGENT', 'Escalated to Support Officer'
        CLOSED = 'CLOSED', 'Closed'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket_number = models.CharField(max_length=32, unique=True, db_index=True)
    phone_number = models.CharField(max_length=15, db_index=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='support_tickets'
    )
    channel = models.CharField(
        max_length=20,
        choices=ChannelChoices.choices,
        default=ChannelChoices.WHATSAPP
    )
    subject = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.OPEN
    )
    conversation_log = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Ticket {self.ticket_number} - {self.phone_number} ({self.status})"
