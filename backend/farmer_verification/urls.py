from django.urls import path
from .views import FarmerVerifyView, FarmerProfileDetailView

urlpatterns = [
    path('verify/', FarmerVerifyView.as_view(), name='farmer-verify'),
    path('profile/', FarmerProfileDetailView.as_view(), name='farmer-profile'),
]
