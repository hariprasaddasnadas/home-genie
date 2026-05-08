from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .models import CustomerBooking, PartnerBookingRequest, PartnerProfile, ServiceCatalog


class AuthApiTests(APITestCase):
    def test_user_signup_returns_token(self):
        response = self.client.post(
            "/api/signup/",
            {
                "username": "hari",
                "email": "hari@example.com",
                "password": "securepass123",
                "confirm_password": "securepass123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("token", response.data["user"])


class BookingApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="customer",
            email="customer@example.com",
            password="securepass123",
        )
        self.token = Token.objects.create(user=self.user)
        self.service = ServiceCatalog.objects.first()
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        self.payload = {
            "service_id": self.service.id,
            "configured_price": self.service.price,
            "config_options": {"rooms": 2},
            "customer_name": "Customer One",
            "customer_phone": "9876543210",
            "street": "12 MG Road",
            "city": "Bengaluru",
            "pincode": self.service.available_pincodes[0],
            "payment_method": "cod",
        }

    def test_create_cod_booking(self):
        response = self.client.post("/api/bookings/", self.payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        booking = CustomerBooking.objects.get()
        self.assertEqual(booking.status, CustomerBooking.STATUS_CONFIRMED)
        self.assertEqual(booking.payment_state, CustomerBooking.PAYMENT_STATE_CAPTURED)

    def test_duplicate_active_booking_is_blocked(self):
        first_response = self.client.post("/api/bookings/", self.payload, format="json")
        second_response = self.client.post("/api/bookings/", self.payload, format="json")

        self.assertEqual(first_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(second_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("active booking", str(second_response.data).lower())


class PartnerActionApiTests(APITestCase):
    def setUp(self):
        self.partner_user = User.objects.create_user(
            username="partnerone",
            email="partnerone@example.com",
            password="securepass123",
        )
        self.partner_profile = PartnerProfile.objects.create(
            user=self.partner_user,
            full_name="Partner One",
            phone="9876543210",
            pincode="560001",
            city="Bengaluru",
            service_type="electrician",
            experience_years=4,
        )
        self.other_partner_user = User.objects.create_user(
            username="partnertwo",
            email="partnertwo@example.com",
            password="securepass123",
        )
        self.other_partner_profile = PartnerProfile.objects.create(
            user=self.other_partner_user,
            full_name="Partner Two",
            phone="9999999999",
            pincode="560001",
            city="Bengaluru",
            service_type="electrician",
            experience_years=5,
        )
        self.booking_request = PartnerBookingRequest.objects.create(
            partner=self.partner_profile,
            customer_name="Customer One",
            customer_phone="9876543210",
            customer_address="12 MG Road",
            issue_details="Fan repair",
            preferred_time="Tomorrow 10 AM",
        )
        self.other_token = Token.objects.create(user=self.other_partner_user)

    def test_partner_request_action_requires_authentication(self):
        response = self.client.post(
            "/api/partner/request-action/",
            {"request_id": self.booking_request.id, "action": "accept"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_partner_cannot_update_another_partners_request(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.other_token.key}")
        response = self.client.post(
            "/api/partner/request-action/",
            {"request_id": self.booking_request.id, "action": "accept"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
