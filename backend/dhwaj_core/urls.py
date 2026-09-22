"""
URL configuration for dhwaj_core project.
SIH 2026 - Dhwaj Direct Farmer-to-Consumer Agricultural Platform
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@extend_schema(responses={200: dict})
@api_view(['GET'])
@permission_classes([AllowAny])
def api_root_index(request):
    return Response({
        "project": "Dhwaj - Smart India Hackathon 2026",
        "description": "Direct Farmer-to-Consumer Platform with Government Identity & MSP Protection",
        "version": "1.0.0",
        "endpoints": {
            "swagger_documentation": "/api/docs/",
            "auth": {
                "register": "/api/auth/register/",
                "login": "/api/auth/login/",
                "aadhaar_gen_otp": "/api/auth/aadhaar/gen-otp/",
                "aadhaar_verify_otp": "/api/auth/aadhaar/verify-otp/",
                "digilocker_url": "/api/auth/digilocker/url/",
                "digilocker_callback": "/api/auth/digilocker/callback/",
                "profile": "/api/auth/me/"
            },
            "farmer": {
                "verify": "/api/farmer/verify/ (AgriStack, KCC, Bhulekh DILRMP)",
                "profile": "/api/farmer/profile/",
                "create_listing": "/api/listings/create/",
                "my_listings": "/api/listings/my/"
            },
            "marketplace": {
                "msp_master": "/api/msp/",
                "browse_listings": "/api/listings/ (with geo-matching & filters)",
                "listing_detail": "/api/listings/<id>/"
            },
            "orders_and_logistics": {
                "logistics_quote": "/api/logistics/quote/ (Delhivery & Porter)",
                "create_order": "/api/orders/create/ (with Escrow lock)",
                "my_orders": "/api/orders/my/",
                "order_detail": "/api/orders/<id>/",
                "update_status": "/api/orders/<id>/status/"
            },
            "disputes": {
                "raise_dispute": "/api/orders/<id>/dispute/ (Mandatory unboxing video proof + Fault matrix)",
                "dispute_detail": "/api/orders/<id>/dispute/detail/"
            },
            "support_and_schemes": {
                "whatsapp_webhook": "/api/support/whatsapp/ (Bot AutoReply)",
                "government_schemes": "/api/schemes/",
                "support_tickets": "/api/support/tickets/"
            }
        }
    })


urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Root Index & Documentation
    path('', api_root_index, name='api-root-index'),
    path('api/', api_root_index, name='api-index'),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # Modular Domain APIs
    path('api/auth/', include('authentication.urls')),
    path('api/farmer/', include('farmer_verification.urls')),
    path('api/', include('marketplace.urls')),
    path('api/', include('orders_and_logistics.urls')),
    path('api/', include('disputes.urls')),
    path('api/', include('support_and_schemes.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
