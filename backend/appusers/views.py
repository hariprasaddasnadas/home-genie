from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import (
    CustomerBooking,
    PartnerBookingRequest,
    PartnerProfile,
    PartnerServiceOffering,
    ServiceCatalog,
)

from .serializers import (
    CustomerBookingCreateSerializer,
    CustomerBookingSerializer,
    SignUpSerializer,
    LoginSerializer,
    PartnerSignUpSerializer,
    PartnerLoginSerializer,
    PartnerBookingRequestSerializer,
    PartnerBookingStatusUpdateSerializer,
    PartnerServiceOfferingSerializer,
    ServiceCatalogSerializer,
)


class AuthenticatedAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]


def build_user_payload(user, token=None):
    payload = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
    }
    if token:
        payload["token"] = token.key
    return payload


def build_partner_payload(partner):
    return {
        "id": partner.id,
        "full_name": partner.full_name,
        "phone": partner.phone,
        "pincode": partner.pincode,
        "city": partner.city,
        "service_type": partner.service_type,
        "experience_years": partner.experience_years,
        "is_active_partner": partner.is_active_partner,
    }


class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignUpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                "message": "Signup successful.",
                "user": build_user_payload(user, token),
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
        token, _ = Token.objects.get_or_create(user=user)

        return Response(
            {
                "message": "Login successful.",
                "user": build_user_payload(user, token),
            },
            status=status.HTTP_200_OK,
        )


class PartnerSignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PartnerSignUpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user, partner = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                "message": "Partner signup successful.",
                "user": build_user_payload(user, token),
                "partner_profile": build_partner_payload(partner),
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
        token, _ = Token.objects.get_or_create(user=user)

        return Response(
            {
                "message": "Partner login successful.",
                "user": build_user_payload(user, token),
                "partner_profile": build_partner_payload(partner),
            },
            status=status.HTTP_200_OK,
        )


class ServiceCatalogListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        queryset = ServiceCatalog.objects.filter(is_active=True)
        serializer = ServiceCatalogSerializer(queryset, many=True)
        return Response({"count": len(serializer.data), "results": serializer.data}, status=status.HTTP_200_OK)


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


class CustomerBookingCreateView(AuthenticatedAPIView):
    def post(self, request):
        serializer = CustomerBookingCreateSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()
        return Response(
            {
                "message": "Booking confirmed successfully.",
                "booking": CustomerBookingSerializer(booking).data,
            },
            status=status.HTTP_201_CREATED,
        )


class CustomerBookingListView(AuthenticatedAPIView):
    def get(self, request):
        queryset = CustomerBooking.objects.filter(user=request.user)
        serializer = CustomerBookingSerializer(queryset, many=True)
        return Response({"count": len(serializer.data), "results": serializer.data}, status=status.HTTP_200_OK)


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


class PartnerRequestListView(AuthenticatedAPIView):

    def get(self, request):
        partner = getattr(request.user, "partner_profile", None)
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


class PartnerBookingStatusUpdateView(AuthenticatedAPIView):

    def post(self, request):
        serializer = PartnerBookingStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        partner = getattr(request.user, "partner_profile", None)
        if not partner:
            return Response(
                {"detail": "Partner profile not found for this account."},
                status=status.HTTP_404_NOT_FOUND,
            )

        request_id = serializer.validated_data["request_id"]
        action = serializer.validated_data["action"]

        booking = PartnerBookingRequest.objects.filter(id=request_id).first()
        if not booking:
            return Response({"detail": "Request not found."}, status=status.HTTP_404_NOT_FOUND)
        if booking.partner_id != partner.id:
            return Response({"detail": "You cannot update this request."}, status=status.HTTP_403_FORBIDDEN)

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


class PartnerServiceOfferingListCreateView(AuthenticatedAPIView):
    def get_partner(self, request):
        return getattr(request.user, "partner_profile", None)

    def get(self, request):
        partner = self.get_partner(request)
        if not partner:
            return Response(
                {"detail": "Partner profile not found for this account."},
                status=status.HTTP_404_NOT_FOUND,
            )

        queryset = PartnerServiceOffering.objects.filter(partner=partner, is_active=True)
        serializer = PartnerServiceOfferingSerializer(queryset, many=True)
        return Response({"count": len(serializer.data), "results": serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        partner = self.get_partner(request)
        if not partner:
            return Response(
                {"detail": "Partner profile not found for this account."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = PartnerServiceOfferingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        offering = serializer.save(partner=partner)
        return Response(
            {
                "message": "Service published successfully.",
                "service": PartnerServiceOfferingSerializer(offering).data,
            },
            status=status.HTTP_201_CREATED,
        )
