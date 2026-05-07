from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import PartnerProfile, PartnerBookingRequest

from .serializers import (
    SignUpSerializer,
    LoginSerializer,
    PartnerSignUpSerializer,
    PartnerLoginSerializer,
    PartnerBookingRequestSerializer,
    PartnerBookingStatusUpdateSerializer,
)


class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignUpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "message": "Signup successful.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
            },
            status=status.HTTP_201_CREATED,
        )
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        user_obj = User.objects.filter(email__iexact=email).first()
        if not user_obj:
            return Response(
                {"detail": "Invalid email or password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(username=user_obj.username, password=password)
        if not user:
            return Response(
                {"detail": "Invalid email or password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "message": "Login successful.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
            },
            status=status.HTTP_200_OK,
        )


class PartnerSignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PartnerSignUpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user, partner = serializer.save()
        return Response(
            {
                "message": "Partner signup successful.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
                "partner_profile": {
                    "full_name": partner.full_name,
                    "phone": partner.phone,
                    "pincode": partner.pincode,
                    "city": partner.city,
                    "service_type": partner.service_type,
                    "experience_years": partner.experience_years,
                    "is_active_partner": partner.is_active_partner,
                },
            },
            status=status.HTTP_201_CREATED,
        )


class PartnerLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PartnerLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        user_obj = User.objects.filter(email__iexact=email).first()
        if not user_obj:
            return Response(
                {"detail": "Invalid email or password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(username=user_obj.username, password=password)
        if not user:
            return Response(
                {"detail": "Invalid email or password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        partner = getattr(user, "partner_profile", None)
        if not partner:
            return Response(
                {"detail": "Partner profile not found for this account."},
                status=status.HTTP_403_FORBIDDEN,
            )

        return Response(
            {
                "message": "Partner login successful.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
                "partner_profile": {
                    "full_name": partner.full_name,
                    "phone": partner.phone,
                    "pincode": partner.pincode,
                    "city": partner.city,
                    "service_type": partner.service_type,
                    "experience_years": partner.experience_years,
                    "is_active_partner": partner.is_active_partner,
                },
            },
            status=status.HTTP_200_OK,
        )


class PartnerListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        pincode = request.query_params.get("pincode", "").strip()
        service_type = request.query_params.get("service_type", "").strip()

        queryset = PartnerProfile.objects.filter(is_active_partner=True)
        if pincode:
            queryset = queryset.filter(pincode=pincode)
        if service_type:
            queryset = queryset.filter(service_type=service_type)

        partners = [
            {
                "id": partner.id,
                "full_name": partner.full_name,
                "phone": partner.phone,
                "pincode": partner.pincode,
                "city": partner.city,
                "service_type": partner.service_type,
                "service_type_display": partner.get_service_type_display(),
                "experience_years": partner.experience_years,
            }
            for partner in queryset.select_related("user")
        ]

        return Response({"count": len(partners), "results": partners}, status=status.HTTP_200_OK)


class PartnerBookingRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PartnerBookingRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()
        return Response(
            {
                "message": "Booking request submitted. Partner will contact you soon.",
                "request_id": booking.id,
            },
            status=status.HTTP_201_CREATED,
        )


class PartnerRequestListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        email = request.query_params.get("email", "").strip()
        if not email:
            return Response({"detail": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        user_obj = User.objects.filter(email__iexact=email).first()
        if not user_obj:
            return Response({"detail": "Partner account not found."}, status=status.HTTP_404_NOT_FOUND)

        partner = getattr(user_obj, "partner_profile", None)
        if not partner:
            return Response(
                {"detail": "Partner profile not found for this account."},
                status=status.HTTP_404_NOT_FOUND,
            )

        requests_data = [
            {
                "id": booking.id,
                "customer_name": booking.customer_name,
                "customer_phone": booking.customer_phone,
                "customer_address": booking.customer_address,
                "issue_details": booking.issue_details,
                "preferred_time": booking.preferred_time,
                "status": booking.status,
                "created_at": booking.created_at,
            }
            for booking in PartnerBookingRequest.objects.filter(partner=partner)
        ]

        return Response({"count": len(requests_data), "results": requests_data}, status=status.HTTP_200_OK)


class PartnerBookingStatusUpdateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PartnerBookingStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        request_id = serializer.validated_data["request_id"]
        action = serializer.validated_data["action"]

        booking = PartnerBookingRequest.objects.filter(id=request_id).first()
        if not booking:
            return Response({"detail": "Request not found."}, status=status.HTTP_404_NOT_FOUND)

        booking.status = (
            PartnerBookingRequest.STATUS_ACCEPTED
            if action == "accept"
            else PartnerBookingRequest.STATUS_DECLINED
        )
        booking.save(update_fields=["status"])
        return Response(
            {"message": f"Request {booking.status}.", "status": booking.status},
            status=status.HTTP_200_OK,
        )


class CustomerBookingStatusView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        phone = request.query_params.get("phone", "").strip()
        if not phone:
            return Response({"detail": "Phone is required."}, status=status.HTTP_400_BAD_REQUEST)

        requests_data = [
            {
                "id": booking.id,
                "partner_name": booking.partner.full_name,
                "partner_phone": booking.partner.phone,
                "service_type": booking.partner.get_service_type_display(),
                "preferred_time": booking.preferred_time,
                "status": booking.status,
                "created_at": booking.created_at,
            }
            for booking in PartnerBookingRequest.objects.filter(customer_phone=phone).select_related("partner")
        ]
        return Response({"count": len(requests_data), "results": requests_data}, status=status.HTTP_200_OK)
