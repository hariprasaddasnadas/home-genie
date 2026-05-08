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


class ServiceCatalog(models.Model):
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=120)
    price = models.PositiveIntegerField()
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=4.5)
    description = models.TextField()
    image = models.URLField()
    keywords = models.JSONField(default=list, blank=True)
    details = models.TextField(blank=True)
    duration = models.CharField(max_length=80, blank=True)
    category = models.CharField(max_length=80, blank=True)
    available_pincodes = models.JSONField(default=list, blank=True)
    questions = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class PartnerServiceOffering(models.Model):
    partner = models.ForeignKey(
        PartnerProfile, on_delete=models.CASCADE, related_name="service_offerings"
    )
    title = models.CharField(max_length=120)
    image = models.URLField()
    price = models.PositiveIntegerField()
    description = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} - {self.partner.full_name}"


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


class CustomerBooking(models.Model):
    STATUS_PENDING = "pending"
    STATUS_CONFIRMED = "confirmed"
    STATUS_COMPLETED = "completed"
    STATUS_CANCELLED = "cancelled"
    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_CONFIRMED, "Confirmed"),
        (STATUS_COMPLETED, "Completed"),
        (STATUS_CANCELLED, "Cancelled"),
    ]

    PAYMENT_ONLINE = "online"
    PAYMENT_COD = "cod"
    PAYMENT_CHOICES = [
        (PAYMENT_ONLINE, "Online"),
        (PAYMENT_COD, "Cash on Delivery"),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="customer_bookings"
    )
    service = models.ForeignKey(
        ServiceCatalog,
        on_delete=models.SET_NULL,
        related_name="bookings",
        null=True,
        blank=True,
    )
    service_name = models.CharField(max_length=120)
    service_slug = models.SlugField(blank=True)
    service_image = models.URLField(blank=True)
    service_category = models.CharField(max_length=80, blank=True)
    configured_price = models.PositiveIntegerField()
    config_options = models.JSONField(default=dict, blank=True)
    customer_name = models.CharField(max_length=120)
    customer_phone = models.CharField(max_length=20)
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10, db_index=True)
    payment_method = models.CharField(
        max_length=20, choices=PAYMENT_CHOICES, default=PAYMENT_COD
    )
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default=STATUS_CONFIRMED
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.service_name} booking for {self.customer_name}"
