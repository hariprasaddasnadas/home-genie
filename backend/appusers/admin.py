from django.contrib import admin
from .models import (
    CustomerBooking,
    PartnerBookingRequest,
    PartnerProfile,
    PartnerServiceOffering,
    ServiceCatalog,
)


@admin.register(PartnerProfile)
class PartnerProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "full_name", "phone", "pincode", "service_type", "is_active_partner")
    search_fields = ("full_name", "phone", "pincode", "user__email", "user__username")
    list_filter = ("service_type", "is_active_partner", "created_at")


@admin.register(PartnerBookingRequest)
class PartnerBookingRequestAdmin(admin.ModelAdmin):
    list_display = ("id", "customer_name", "customer_phone", "partner", "status", "created_at")
    search_fields = ("customer_name", "customer_phone", "customer_address", "partner__full_name")
    list_filter = ("created_at", "partner__service_type", "status")


@admin.register(ServiceCatalog)
class ServiceCatalogAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "slug", "category", "price", "is_active")
    search_fields = ("name", "slug", "category")
    list_filter = ("category", "is_active")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(PartnerServiceOffering)
class PartnerServiceOfferingAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "partner", "price", "is_active", "created_at")
    search_fields = ("title", "partner__full_name", "partner__user__email")
    list_filter = ("is_active", "created_at")


@admin.register(CustomerBooking)
class CustomerBookingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "service_name",
        "customer_name",
        "customer_phone",
        "payment_method",
        "status",
        "created_at",
    )
    search_fields = ("service_name", "customer_name", "customer_phone", "user__email")
    list_filter = ("payment_method", "status", "created_at")
