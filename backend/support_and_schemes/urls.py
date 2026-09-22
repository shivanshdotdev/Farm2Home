from django.urls import path
from .views import GovernmentSchemeListView, WhatsAppWebhookView, SupportTicketListView

urlpatterns = [
    path('schemes/', GovernmentSchemeListView.as_view(), name='schemes-list'),
    path('support/whatsapp/', WhatsAppWebhookView.as_view(), name='whatsapp-webhook'),
    path('support/tickets/', SupportTicketListView.as_view(), name='support-tickets'),
]
