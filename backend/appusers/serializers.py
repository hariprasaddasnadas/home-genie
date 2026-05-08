from django.contrib.auth.models import User
from django.db import transaction
from rest_framework import serializers
from .models import (
    CustomerBooking,
    PartnerBookingRequest,
    PartnerProfile,
    PartnerServiceOffering,
    ServiceCatalog,
)


class SignUpSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email is already registered.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("Username is already taken.")
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match."}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        return User.objects.create_user(**validated_data)
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class PartnerLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class PartnerBookingRequestSerializer(serializers.Serializer):
    partner_id = serializers.IntegerField()
    customer_name = serializers.CharField(max_length=120)
    customer_phone = serializers.CharField(max_length=20)
    customer_address = serializers.CharField(max_length=255)
    issue_details = serializers.CharField(required=False, allow_blank=True)
    preferred_time = serializers.CharField(max_length=120, required=False, allow_blank=True)

    def validate_partner_id(self, value):
        if not PartnerProfile.objects.filter(id=value, is_active_partner=True).exists():
            raise serializers.ValidationError("Selected partner is not available.")
        return value

    def create(self, validated_data):
        partner = PartnerProfile.objects.get(id=validated_data["partner_id"])
        return PartnerBookingRequest.objects.create(
            partner=partner,
            customer_name=validated_data["customer_name"],
            customer_phone=validated_data["customer_phone"],
            customer_address=validated_data["customer_address"],
            issue_details=validated_data.get("issue_details", ""),
            preferred_time=validated_data.get("preferred_time", ""),
        )


class PartnerBookingStatusUpdateSerializer(serializers.Serializer):
    request_id = serializers.IntegerField()
    action = serializers.ChoiceField(choices=["accept", "decline"])


class ServiceCatalogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCatalog
        fields = [
            "id",
            "slug",
            "name",
            "price",
            "rating",
            "description",
            "image",
            "keywords",
            "details",
            "duration",
            "category",
            "available_pincodes",
            "questions",
            "is_active",
        ]


class PartnerServiceOfferingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnerServiceOffering
        fields = [
            "id",
            "title",
            "image",
            "price",
            "description",
            "is_active",
            "created_at",
        ]
        read_only_fields = ["id", "created_at", "is_active"]


class CustomerBookingCreateSerializer(serializers.Serializer):
    service_id = serializers.IntegerField()
    configured_price = serializers.IntegerField(min_value=1)
    config_options = serializers.JSONField(required=False)
    customer_name = serializers.CharField(max_length=120)
    customer_phone = serializers.CharField(max_length=20)
    street = serializers.CharField(max_length=255)
    city = serializers.CharField(max_length=100)
    pincode = serializers.CharField(max_length=10)
    payment_method = serializers.ChoiceField(choices=CustomerBooking.PAYMENT_CHOICES)

    def validate_service_id(self, value):
        if not ServiceCatalog.objects.filter(id=value, is_active=True).exists():
            raise serializers.ValidationError("Selected service is not available.")
        return value

    def validate_customer_phone(self, value):
        digits = "".join(ch for ch in value if ch.isdigit())
        if len(digits) < 10:
            raise serializers.ValidationError("Please enter a valid phone number.")
        return digits

    def validate_pincode(self, value):
        digits = "".join(ch for ch in value if ch.isdigit())
        if len(digits) < 6:
            raise serializers.ValidationError("Please enter a valid pincode.")
        return digits

    def validate(self, attrs):
        service = ServiceCatalog.objects.get(id=attrs["service_id"])
        available_pincodes = service.available_pincodes or []
        if available_pincodes and attrs["pincode"] not in available_pincodes:
            raise serializers.ValidationError(
                {"pincode": "This service is not available in the selected pincode yet."}
            )
        attrs["service"] = service
        return attrs

    def create(self, validated_data):
        service = validated_data["service"]
        user = self.context["request"].user
        return CustomerBooking.objects.create(
            user=user,
            service=service,
            service_name=service.name,
            service_slug=service.slug,
            service_image=service.image,
            service_category=service.category,
            configured_price=validated_data["configured_price"],
            config_options=validated_data.get("config_options", {}),
            customer_name=validated_data["customer_name"],
            customer_phone=validated_data["customer_phone"],
            street=validated_data["street"],
            city=validated_data["city"],
            pincode=validated_data["pincode"],
            payment_method=validated_data["payment_method"],
            status=CustomerBooking.STATUS_CONFIRMED,
        )


class CustomerBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerBooking
        fields = [
            "id",
            "service_name",
            "service_slug",
            "service_image",
            "service_category",
            "configured_price",
            "config_options",
            "customer_name",
            "customer_phone",
            "street",
            "city",
            "pincode",
            "payment_method",
            "status",
            "created_at",
        ]


class PartnerSignUpSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=120)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    pincode = serializers.CharField(max_length=10)
    city = serializers.CharField(max_length=100, required=False, allow_blank=True)
    service_type = serializers.ChoiceField(choices=PartnerProfile.SERVICE_CHOICES)
    experience_years = serializers.IntegerField(min_value=0)
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email is already registered.")
        return value

    def validate_phone(self, value):
        digits = "".join(ch for ch in value if ch.isdigit())
        if len(digits) < 10:
            raise serializers.ValidationError("Please enter a valid phone number.")
        return digits

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match."}
            )
        return attrs

    def _build_unique_username(self, base_name):
        base_slug = "".join(ch.lower() if ch.isalnum() else "_" for ch in base_name).strip("_")
        if not base_slug:
            base_slug = "partner_user"
        username = base_slug[:130]
        suffix = 1
        while User.objects.filter(username__iexact=username).exists():
            candidate = f"{base_slug[:120]}_{suffix}"
            username = candidate[:150]
            suffix += 1
        return username

    @transaction.atomic
    def create(self, validated_data):
        password = validated_data.pop("password")
        validated_data.pop("confirm_password")

        email = validated_data["email"]
        full_name = validated_data["full_name"]

        user = User.objects.create_user(
            username=self._build_unique_username(full_name),
            email=email,
            password=password,
            first_name=full_name,
        )

        partner = PartnerProfile.objects.create(
            user=user,
            full_name=full_name,
            phone=validated_data["phone"],
            pincode=validated_data["pincode"],
            city=validated_data.get("city", ""),
            service_type=validated_data["service_type"],
            experience_years=validated_data["experience_years"],
        )
        return user, partner
