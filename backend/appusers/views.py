import base64
import hashlib
import hmac
import json
import os
from urllib import error, request as urllib_request

from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.conf import settings
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
    RazorpayOrderCreateSerializer,
    RazorpayPaymentVerifySerializer,
    SignUpSerializer,
    LoginSerializer,
    PartnerSignUpSerializer,
    PartnerLoginSerializer,
    PartnerBookingRequestSerializer,
    PartnerBookingStatusUpdateSerializer,
    PartnerServiceOfferingSerializer,
    ServiceCatalogSerializer,
    create_pending_online_bookings,
    new_checkout_group,
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


def get_razorpay_credentials():
    key_id = os.getenv("RAZORPAY_KEY_ID", "").strip()
    key_secret = os.getenv("RAZORPAY_KEY_SECRET", "").strip()
    return key_id, key_secret


def razorpay_request(*, method, path, payload):
    key_id, key_secret = get_razorpay_credentials()
    if not key_id or not key_secret:
        raise ValueError("Razorpay credentials are not configured on the server.")

    url = f"https://api.razorpay.com{path}"
    auth = base64.b64encode(f"{key_id}:{key_secret}".encode("utf-8")).decode("utf-8")
    data = json.dumps(payload).encode("utf-8")
    req = urllib_request.Request(
        url,
        data=data,
        method=method,
        headers={
            "Authorization": f"Basic {auth}",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib_request.urlopen(req, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))
    except error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(body) from exc


def verify_razorpay_signature(*, order_id, payment_id, signature, key_secret):
    body = f"{order_id}|{payment_id}".encode("utf-8")
    expected = hmac.new(
        key_secret.encode("utf-8"), body, digestmod=hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)


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

        queryset = PartnerProfile.objects.all()
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
                "is_active_partner": partner.is_active_partner,
                "offerings": PartnerServiceOfferingSerializer(partner.service_offerings.filter(is_active=True), many=True, context={"request": request}).data,
            }
            for partner in queryset.prefetch_related("service_offerings").select_related("user")
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


class RazorpayCreateOrderView(AuthenticatedAPIView):
    def post(self, request):
        serializer = RazorpayOrderCreateSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        key_id, _ = get_razorpay_credentials()
        if not key_id:
            return Response(
                {"detail": "Online payment is not configured yet."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        total_amount = sum(item["configured_price"] for item in validated_data["items"])
        checkout_group = new_checkout_group()
        receipt = f"hg_{checkout_group[:20]}"

        try:
            order = razorpay_request(
                method="POST",
                path="/v1/orders",
                payload={
                    "amount": total_amount * 100,
                    "currency": "INR",
                    "receipt": receipt,
                    "notes": {
                        "checkout_group": checkout_group,
                        "user_id": str(request.user.id),
                    },
                },
            )
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except RuntimeError as exc:
            return Response(
                {"detail": "Could not create payment order.", "gateway_error": str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        bookings = create_pending_online_bookings(
            user=request.user,
            validated_data=validated_data,
            checkout_group=checkout_group,
            gateway_order_id=order["id"],
        )

        return Response(
            {
                "message": "Payment order created successfully.",
                "key": key_id,
                "amount": order["amount"],
                "currency": order["currency"],
                "order_id": order["id"],
                "checkout_group": checkout_group,
                "bookings": CustomerBookingSerializer(bookings, many=True).data,
            },
            status=status.HTTP_201_CREATED,
        )


class RazorpayVerifyPaymentView(AuthenticatedAPIView):
    def post(self, request):
        serializer = RazorpayPaymentVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        _, key_secret = get_razorpay_credentials()
        if not key_secret:
            return Response(
                {"detail": "Online payment is not configured yet."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        order_id = validated_data["razorpay_order_id"]
        payment_id = validated_data["razorpay_payment_id"]
        signature = validated_data["razorpay_signature"]

        if not verify_razorpay_signature(
            order_id=order_id,
            payment_id=payment_id,
            signature=signature,
            key_secret=key_secret,
        ):
            return Response(
                {"detail": "Payment signature verification failed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        bookings = list(
            CustomerBooking.objects.filter(
                user=request.user,
                gateway_order_id=order_id,
                payment_method=CustomerBooking.PAYMENT_ONLINE,
            )
        )
        if not bookings:
            return Response(
                {"detail": "No pending bookings found for this payment order."},
                status=status.HTTP_404_NOT_FOUND,
            )

        total_amount = sum(booking.configured_price for booking in bookings)
        try:
            capture_response = razorpay_request(
                method="POST",
                path=f"/v1/payments/{payment_id}/capture",
                payload={"amount": total_amount * 100, "currency": "INR"},
            )
        except RuntimeError as exc:
            return Response(
                {"detail": "Payment capture failed.", "gateway_error": str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        for booking in bookings:
            booking.gateway_payment_id = payment_id
            booking.gateway_signature = signature
            booking.payment_state = capture_response.get(
                "status", CustomerBooking.PAYMENT_STATE_CAPTURED
            )
            booking.status = CustomerBooking.STATUS_CONFIRMED
            booking.save(
                update_fields=[
                    "gateway_payment_id",
                    "gateway_signature",
                    "payment_state",
                    "status",
                    "updated_at",
                ]
            )

        return Response(
            {
                "message": "Payment verified and booking confirmed.",
                "bookings": CustomerBookingSerializer(bookings, many=True).data,
            },
            status=status.HTTP_200_OK,
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
                "is_priority": booking.is_priority,
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

        if action == "accept":
            booking.status = PartnerBookingRequest.STATUS_ACCEPTED
        elif action == "decline":
            booking.status = PartnerBookingRequest.STATUS_DECLINED
        elif action == "work_done":
            booking.status = PartnerBookingRequest.STATUS_COMPLETED
            # Also update linked CustomerBooking if it exists
            CustomerBooking.objects.filter(partner_request=booking).update(status=CustomerBooking.STATUS_COMPLETED)

        booking.save(update_fields=["status"])

        if booking.customer_email:
            subject = f"Your HomeGenie Request has been {booking.status.capitalize()}"
            message = (
                f"Hello {booking.customer_name},\n\n"
                f"Your request for {booking.partner.get_service_type_display()} has been {booking.status}.\n"
                f"Partner Name: {booking.partner.full_name}\n"
                f"Partner Phone: {booking.partner.phone}\n\n"
                "Thank you for using HomeGenie!"
            )
            try:
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL if hasattr(settings, 'DEFAULT_FROM_EMAIL') else 'noreply@homegenie.com',
                    [booking.customer_email],
                    fail_silently=True,
                )
            except Exception as e:
                print(f"Failed to send email: {e}")

        return Response(
            {"message": f"Request {booking.status}.", "status": booking.status},
            status=status.HTTP_200_OK,
        )


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

        if booking.customer_email:
            subject = f"Your HomeGenie Request has been {booking.status.capitalize()}"
            message = (
                f"Hello {booking.customer_name},\n\n"
                f"Your request for {booking.partner.get_service_type_display()} has been {booking.status}.\n"
                f"Partner Name: {booking.partner.full_name}\n"
                f"Partner Phone: {booking.partner.phone}\n\n"
                "Thank you for using HomeGenie!"
            )
            try:
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL if hasattr(settings, 'DEFAULT_FROM_EMAIL') else 'noreply@homegenie.com',
                    [booking.customer_email],
                    fail_silently=True,
                )
            except Exception as e:
                print(f"Failed to send email: {e}")

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
                "partner_pincode": booking.partner.pincode,
                "service_type": booking.partner.get_service_type_display(),
                "service_name": booking.service_name or booking.partner.get_service_type_display(),
                "service_price": booking.service_price,
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
        serializer = PartnerServiceOfferingSerializer(queryset, many=True, context={"request": request})
        return Response({"count": len(serializer.data), "results": serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        partner = self.get_partner(request)
        if not partner:
            return Response(
                {"detail": "Partner profile not found for this account."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = PartnerServiceOfferingSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        offering = serializer.save(partner=partner)
        return Response(
            {
                "message": "Service published successfully.",
                "service": PartnerServiceOfferingSerializer(offering, context={"request": request}).data,
            },
            status=status.HTTP_201_CREATED,
        )

class PartnerAvailabilityToggleView(AuthenticatedAPIView):
    def post(self, request):
        partner = getattr(request.user, "partner_profile", None)
        if not partner:
            return Response(
                {"detail": "Partner profile not found for this account."},
                status=status.HTTP_404_NOT_FOUND,
            )
        is_active = request.data.get("is_active_partner")
        if is_active is not None:
            partner.is_active_partner = bool(is_active)
            partner.save(update_fields=["is_active_partner"])
        return Response(
            {
                "message": "Availability updated successfully.",
                "is_active_partner": partner.is_active_partner,
            },
            status=status.HTTP_200_OK,
        )
