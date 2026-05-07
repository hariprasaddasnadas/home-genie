from django.urls import path

from .views import (
    SignUpView,
    LoginView,
    PartnerSignUpView,
    PartnerLoginView,
    PartnerListView,
    PartnerBookingRequestView,
    PartnerRequestListView,
    PartnerBookingStatusUpdateView,
    CustomerBookingStatusView,
)

urlpatterns = [
    path("signup/", SignUpView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("partner/signup/", PartnerSignUpView.as_view(), name="partner-signup"),
    path("partner/login/", PartnerLoginView.as_view(), name="partner-login"),
    path("partners/", PartnerListView.as_view(), name="partner-list"),
    path("partner/book/", PartnerBookingRequestView.as_view(), name="partner-book"),
    path("partner/requests/", PartnerRequestListView.as_view(), name="partner-requests"),
    path("partner/request-action/", PartnerBookingStatusUpdateView.as_view(), name="partner-request-action"),
    path("customer/booking-status/", CustomerBookingStatusView.as_view(), name="customer-booking-status"),
]
