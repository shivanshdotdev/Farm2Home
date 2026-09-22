from django.urls import path
from .views import OrderDisputeCreateView, OrderDisputeDetailView

urlpatterns = [
    path('orders/<uuid:pk>/dispute/', OrderDisputeCreateView.as_view(), name='order-dispute-create'),
    path('orders/<uuid:pk>/dispute/detail/', OrderDisputeDetailView.as_view(), name='order-dispute-detail'),
]
