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
    list_display = ("id", "full_name", "phone", "pincode", "service_type", "is_active_partner", "created_at")
    search_fields = ("full_name", "phone", "pincode", "user__email", "user__username")
    list_filter = ("service_type", "is_active_partner", "created_at")
    autocomplete_fields = ("user",)
    actions = ("activate_partners", "deactivate_partners")

    @admin.action(description="Mark selected partners as active")
    def activate_partners(self, request, queryset):
        queryset.update(is_active_partner=True)

    @admin.action(description="Mark selected partners as inactive")
    def deactivate_partners(self, request, queryset):
        queryset.update(is_active_partner=False)


@admin.register(PartnerBookingRequest)
class PartnerBookingRequestAdmin(admin.ModelAdmin):
    list_display = ("id", "customer_name", "customer_phone", "partner", "status", "created_at")
    search_fields = ("customer_name", "customer_phone", "customer_address", "partner__full_name")
    list_filter = ("created_at", "partner__service_type", "status")
    autocomplete_fields = ("partner",)
    actions = ("mark_requests_accepted", "mark_requests_declined")

    @admin.action(description="Mark selected partner requests as accepted")
    def mark_requests_accepted(self, request, queryset):
        queryset.update(status=PartnerBookingRequest.STATUS_ACCEPTED)

    @admin.action(description="Mark selected partner requests as declined")
    def mark_requests_declined(self, request, queryset):
        queryset.update(status=PartnerBookingRequest.STATUS_DECLINED)


@admin.register(ServiceCatalog)
class ServiceCatalogAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "slug", "category", "price", "is_active", "updated_at")
    search_fields = ("name", "slug", "category")
    list_filter = ("category", "is_active")
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = ("created_at", "updated_at")


@admin.register(PartnerServiceOffering)
class PartnerServiceOfferingAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "partner", "price", "is_active", "created_at")
    search_fields = ("title", "partner__full_name", "partner__user__email")
    list_filter = ("is_active", "created_at")
    autocomplete_fields = ("partner",)
    actions = ("activate_services", "deactivate_services")

    @admin.action(description="Mark selected partner services as active")
    def activate_services(self, request, queryset):
        queryset.update(is_active=True)

    @admin.action(description="Mark selected partner services as inactive")
    def deactivate_services(self, request, queryset):
        queryset.update(is_active=False)


@admin.register(CustomerBooking)
class CustomerBookingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "service_name",
        "customer_name",
        "customer_phone",
        "payment_method",
        "payment_state",
        "status",
        "created_at",
    )
    search_fields = ("service_name", "customer_name", "customer_phone", "user__email")
    list_filter = ("payment_method", "payment_state", "status", "created_at")
    readonly_fields = (
        "gateway_order_id",
        "gateway_payment_id",
        "gateway_signature",
        "checkout_group",
        "created_at",
        "updated_at",
    )
    autocomplete_fields = ("user", "service")
    actions = (
        "mark_bookings_confirmed",
        "mark_bookings_scheduled",
        "mark_bookings_in_progress",
        "mark_bookings_completed",
        "mark_bookings_cancelled",
    )

    @admin.action(description="Mark selected bookings as confirmed")
    def mark_bookings_confirmed(self, request, queryset):
        queryset.update(status=CustomerBooking.STATUS_CONFIRMED)

    @admin.action(description="Mark selected bookings as scheduled")
    def mark_bookings_scheduled(self, request, queryset):
        queryset.update(status=CustomerBooking.STATUS_SCHEDULED)

    @admin.action(description="Mark selected bookings as in progress")
    def mark_bookings_in_progress(self, request, queryset):
        queryset.update(status=CustomerBooking.STATUS_IN_PROGRESS)

    @admin.action(description="Mark selected bookings as completed")
    def mark_bookings_completed(self, request, queryset):
        queryset.update(status=CustomerBooking.STATUS_COMPLETED)

    @admin.action(description="Mark selected bookings as cancelled")
    def mark_bookings_cancelled(self, request, queryset):
        queryset.update(status=CustomerBooking.STATUS_CANCELLED)
