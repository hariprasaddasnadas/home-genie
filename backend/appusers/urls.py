from django.urls import path

from .views import (
    CustomerBookingCreateView,
    CustomerBookingListView,
    RazorpayCreateOrderView,
    RazorpayVerifyPaymentView,
    ServiceCatalogListView,
    SignUpView,
    LoginView,
    PartnerSignUpView,
    PartnerLoginView,
    PartnerListView,
    PartnerBookingRequestView,
    PartnerRequestListView,
    PartnerBookingStatusUpdateView,
    CustomerBookingStatusView,
    PartnerServiceOfferingListCreateView,
)

urlpatterns = [
    path("signup/", SignUpView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("partner/signup/", PartnerSignUpView.as_view(), name="partner-signup"),
    path("partner/login/", PartnerLoginView.as_view(), name="partner-login"),
    path("services/", ServiceCatalogListView.as_view(), name="service-catalog"),
    path("partners/", PartnerListView.as_view(), name="partner-list"),
    path("bookings/", CustomerBookingCreateView.as_view(), name="customer-booking-create"),
    path("bookings/my/", CustomerBookingListView.as_view(), name="customer-booking-list"),
    path("payments/razorpay/order/", RazorpayCreateOrderView.as_view(), name="razorpay-create-order"),
    path("payments/razorpay/verify/", RazorpayVerifyPaymentView.as_view(), name="razorpay-verify-payment"),
    path("partner/book/", PartnerBookingRequestView.as_view(), name="partner-book"),
    path("partner/requests/", PartnerRequestListView.as_view(), name="partner-requests"),
    path("partner/request-action/", PartnerBookingStatusUpdateView.as_view(), name="partner-request-action"),
    path("partner/services/", PartnerServiceOfferingListCreateView.as_view(), name="partner-services"),
    path("customer/booking-status/", CustomerBookingStatusView.as_view(), name="customer-booking-status"),
]
