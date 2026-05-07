from django.contrib.auth.models import User
from django.db import models


class PartnerProfile(models.Model):
    SERVICE_CHOICES = [
        ("electrician", "Electrician"),
        ("plumber", "Plumber"),
        ("cleaning", "Cleaning"),
        ("appliance_repair", "Appliance Repair"),
        ("carpenter", "Carpenter"),
        ("other", "Other"),
    ]

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="partner_profile"
    )
    full_name = models.CharField(max_length=120)
    phone = models.CharField(max_length=20)
    pincode = models.CharField(max_length=10, db_index=True)
    city = models.CharField(max_length=100, blank=True)
    service_type = models.CharField(max_length=40, choices=SERVICE_CHOICES)
    experience_years = models.PositiveIntegerField(default=0)
    is_active_partner = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.full_name} ({self.pincode})"


class PartnerBookingRequest(models.Model):
    STATUS_PENDING = "pending"
    STATUS_ACCEPTED = "accepted"
    STATUS_DECLINED = "declined"
    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_ACCEPTED, "Accepted"),
        (STATUS_DECLINED, "Declined"),
    ]

    partner = models.ForeignKey(
        PartnerProfile, on_delete=models.CASCADE, related_name="booking_requests"
    )
    customer_name = models.CharField(max_length=120)
    customer_phone = models.CharField(max_length=20)
    customer_address = models.CharField(max_length=255)
    issue_details = models.TextField(blank=True)
    preferred_time = models.CharField(max_length=120, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.customer_name} -> {self.partner.full_name}"
