from django.contrib import admin
from .models import PartnerProfile, PartnerBookingRequest


@admin.register(PartnerProfile)
class PartnerProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "full_name", "phone", "pincode", "service_type", "is_active_partner")
    search_fields = ("full_name", "phone", "pincode", "user__email", "user__username")
    list_filter = ("service_type", "is_active_partner", "created_at")


@admin.register(PartnerBookingRequest)
class PartnerBookingRequestAdmin(admin.ModelAdmin):
    list_display = ("id", "customer_name", "customer_phone", "partner", "created_at")
    search_fields = ("customer_name", "customer_phone", "customer_address", "partner__full_name")
    list_filter = ("created_at", "partner__service_type")
