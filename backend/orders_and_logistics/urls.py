from django.urls import path
from .views import (
    LogisticsQuoteView,
    OrderCreateView,
    OrderMyListView,
    OrderDetailView,
    OrderStatusUpdateView,
)

urlpatterns = [
    path('logistics/quote/', LogisticsQuoteView.as_view(), name='logistics-quote'),
    path('orders/create/', OrderCreateView.as_view(), name='order-create'),
    path('orders/my/', OrderMyListView.as_view(), name='order-my'),
    path('orders/<uuid:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('orders/<uuid:pk>/status/', OrderStatusUpdateView.as_view(), name='order-status-update'),
]
