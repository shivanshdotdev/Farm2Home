from django.urls import path
from .views import (
    GovernmentMSPListView,
    ListingCreateView,
    FarmerMyListingsView,
    ListingListView,
    ListingDetailView,
)

urlpatterns = [
    path('msp/', GovernmentMSPListView.as_view(), name='msp-list'),
    path('listings/create/', ListingCreateView.as_view(), name='listing-create'),
    path('listings/my/', FarmerMyListingsView.as_view(), name='listing-my'),
    path('listings/', ListingListView.as_view(), name='listing-list'),
    path('listings/<uuid:pk>/', ListingDetailView.as_view(), name='listing-detail'),
]
