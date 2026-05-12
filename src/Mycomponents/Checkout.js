import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { authHeaders, extractApiError, fetchJson, getAuthState } from '../api';

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector('script[data-razorpay-checkout="true"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true), { once: true });
      existingScript.addEventListener('error', () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.razorpayCheckout = 'true';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function Checkout({ cartItems = [], clearCart, showToast }) {
  const location = useLocation();
  const navigate = useNavigate();

  // If a user clicks "Book now" straight from Home, the service is passed via state.
  // Otherwise, we check out everything inside the global cart.
  const isSingleCheckout = !!location.state?.service;
  
  let singleServiceItem = null;
  if (isSingleCheckout) {
    singleServiceItem = { ...location.state.service };
    if (location.state.configOptions && location.state.configOptions.finalPrice) {
      singleServiceItem.price = location.state.configOptions.finalPrice;
    }
  }

  const itemsToCheckout = isSingleCheckout ? [singleServiceItem] : cartItems;

  const totalAmount = itemsToCheckout.reduce((acc, item) => acc + parseInt(item.price, 10), 0);

  // Address State
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    pincode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const authState = getAuthState();

  // Load saved address on mount
  useEffect(() => {
    const saved = localStorage.getItem('hg_user_address');
    if (saved) {
      try {
        setAddress(JSON.parse(saved));
      } catch (e) {
        console.error("Failed parsing saved address");
      }
    }
  }, []);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    const normalizedValue = name === 'phone' || name === 'pincode'
      ? value.replace(/\D/g, '')
      : value;
    setAddress((prev) => ({
      ...prev,
      [name]: normalizedValue
    }));
    setFieldErrors((current) => ({ ...current, [name]: '' }));
  };

  const validateAddress = () => {
    const nextErrors = {};
    if (!address.fullName.trim()) nextErrors.fullName = 'Please enter your full name.';
    if (!/^\d{10}$/.test(address.phone)) nextErrors.phone = 'Phone number must be exactly 10 digits.';
    if (!address.street.trim()) nextErrors.street = 'Please enter your street or area.';
    if (!address.city.trim()) nextErrors.city = 'Please enter your city.';
    if (!/^\d{6}$/.test(address.pincode)) nextErrors.pincode = 'Pincode must be exactly 6 digits.';
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const bookingItemsPayload = itemsToCheckout.map((item) => ({
    service_id: item.request_id ? undefined : item.id,
    partner_request_id: item.request_id,
    configured_price: parseInt(item.price, 10),
    config_options: item.configOptions || location.state?.configOptions || {},
  }));

  const bookingCustomerPayload = {
    customer_name: address.fullName,
    customer_phone: address.phone,
    street: address.street,
    city: address.city,
    pincode: address.pincode,
  };

  const submitBooking = async () => {
    if (!authState.token || authState.role !== 'user') {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    setSubmitError('');
    if (!validateAddress()) {
      return;
    }
    setIsSubmitting(true);
    try {
      for (const item of itemsToCheckout) {
        const payload = {
          service_id: item.request_id ? undefined : item.id,
          partner_request_id: item.request_id,
          configured_price: parseInt(item.price, 10),
          config_options: item.configOptions || location.state?.configOptions || {},
          ...bookingCustomerPayload,
          payment_method: paymentMethod,
        };

        const { response, data } = await fetchJson('/api/bookings/', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          setSubmitError(extractApiError(data, 'Could not confirm your booking.'));
          return;
        }
      }

      localStorage.setItem('hg_user_address', JSON.stringify(address));
      if (!isSingleCheckout) {
        clearCart();
      }
      showToast('Your booking has been confirmed successfully!', 'success');
      navigate('/my-bookings');
    } catch (error) {
      setSubmitError('Could not connect to backend. Please ensure Django server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOnlinePayment = async (paymentResponse) => {
      const { response, data } = await fetchJson('/api/payments/razorpay/verify/', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(paymentResponse),
    });
    if (!response.ok) {
      throw new Error(extractApiError(data, 'Payment verification failed.'));
    }
  };

  const startOnlinePayment = async () => {
    if (!authState.token || authState.role !== 'user') {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    setSubmitError('');
    if (!validateAddress()) {
      return;
    }
    setIsSubmitting(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setSubmitError('Could not load the payment gateway. Please check your internet connection and try again.');
        setIsSubmitting(false);
        return;
      }

      const { response, data } = await fetchJson('/api/payments/razorpay/order/', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          items: bookingItemsPayload,
          ...bookingCustomerPayload,
        }),
      });

      if (!response.ok) {
        setSubmitError(extractApiError(data, 'Could not start online payment.'));
        setIsSubmitting(false);
        return;
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'HomeGenie',
        description: itemsToCheckout.length > 1 ? 'Home services checkout' : `${itemsToCheckout[0]?.name || 'Home service'} booking`,
        order_id: data.order_id,
        image: 'https://images.pexels.com/photos/6474475/pexels-photo-6474475.jpeg?auto=compress&cs=tinysrgb&w=200',
        handler: async (paymentResponse) => {
          try {
            await verifyOnlinePayment(paymentResponse);
            localStorage.setItem('hg_user_address', JSON.stringify(address));
            if (!isSingleCheckout) {
              clearCart();
            }
            showToast('Payment successful and booking confirmed!', 'success');
            navigate('/my-bookings');
          } catch (error) {
            setSubmitError(error.message || 'Payment verification failed.');
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: address.fullName,
          email: authState.email,
          contact: address.phone,
        },
        notes: {
          city: address.city,
          pincode: address.pincode,
        },
        theme: {
          color: '#6a38c2',
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (failureResponse) => {
        setSubmitError(
          failureResponse?.error?.description || 'Payment was not completed. Please try again.'
        );
        setIsSubmitting(false);
      });
      razorpay.open();
    } catch (error) {
      setSubmitError('Could not connect to backend. Please ensure Django server is running.');
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (paymentMethod === 'online') {
      await startOnlinePayment();
      return;
    }
    await submitBooking();
  };

  if (itemsToCheckout.length === 0) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
        <h3 className="mb-3 text-muted">Nothing to checkout</h3>
        <Link to="/" className="btn-book text-decoration-none px-4 py-2 d-inline-block" style={{ width: 'auto' }}>
          Explore Services
        </Link>
      </div>
    );
  }

  return (
    <main className="container my-5" style={{ minHeight: '60vh' }}>
      <h2 className="mb-4 fw-bold" style={{ color: '#14213d' }}>Secure Checkout</h2>
      
      <div className="row g-4">
        <div className="col-lg-8">
          
          <div className="bg-white p-4 rounded-4 shadow-sm border mb-4" style={{ borderColor: 'rgba(67, 35, 122, 0.08)' }}>
            <h4 className="fw-bold mb-4 border-bottom pb-2 text-dark">
              <i className="bi bi-geo-alt-fill text-muted me-2"></i> Service Address
            </h4>
            <form id="checkout-form" onSubmit={handleFormSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted">Full Name</label>
                  <input type="text" className="form-control" name="fullName" value={address.fullName} onChange={handleAddressChange} required />
                  {fieldErrors.fullName && <div className="text-danger small mt-1">{fieldErrors.fullName}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted">Mobile Number</label>
                  <input type="tel" className="form-control" name="phone" maxLength="10" value={address.phone} onChange={handleAddressChange} required />
                  {fieldErrors.phone && <div className="text-danger small mt-1">{fieldErrors.phone}</div>}
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold small text-muted">Street / Flat / Area</label>
                  <input type="text" className="form-control" name="street" value={address.street} onChange={handleAddressChange} required />
                  {fieldErrors.street && <div className="text-danger small mt-1">{fieldErrors.street}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted">City</label>
                  <input type="text" className="form-control" name="city" value={address.city} onChange={handleAddressChange} required />
                  {fieldErrors.city && <div className="text-danger small mt-1">{fieldErrors.city}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted">Pincode</label>
                  <input type="text" className="form-control" name="pincode" maxLength="6" value={address.pincode} onChange={handleAddressChange} required />
                  {fieldErrors.pincode && <div className="text-danger small mt-1">{fieldErrors.pincode}</div>}
                </div>
              </div>
              {submitError && <p className="text-danger small mt-3 mb-0">{submitError}</p>}
            </form>
          </div>

          <div className="bg-white p-4 rounded-4 shadow-sm border" style={{ borderColor: 'rgba(67, 35, 122, 0.08)' }}>
            <h4 className="fw-bold mb-4 border-bottom pb-2 text-dark">
              <i className="bi bi-credit-card-fill text-muted me-2"></i> Payment Options
            </h4>
            
            <div className="d-flex flex-column gap-3">
              <label 
                className={`p-3 border rounded-3 d-flex align-items-center gap-3 cursor-pointer ${paymentMethod === 'online' ? 'bg-light' : 'bg-white'}`} 
                style={{ cursor: 'pointer', borderColor: paymentMethod === 'online' ? '#6a38c2' : '#e1e4ed' }}
              >
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="online" 
                  checked={paymentMethod === 'online'} 
                  onChange={() => setPaymentMethod('online')} 
                  className="form-check-input mt-0" 
                  style={{ width: '1.2rem', height: '1.2rem' }}
                />
                <div>
                  <h6 className="mb-0 fw-bold">Online Payment</h6>
                  <small className="text-muted">Pay securely using Cards, UPI or Wallets</small>
                </div>
              </label>

              <label 
                className={`p-3 border rounded-3 d-flex align-items-center gap-3 cursor-pointer ${paymentMethod === 'cod' ? 'bg-light' : 'bg-white'}`} 
                style={{ cursor: 'pointer', borderColor: paymentMethod === 'cod' ? '#6a38c2' : '#e1e4ed' }}
              >
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="cod" 
                  checked={paymentMethod === 'cod'} 
                  onChange={() => setPaymentMethod('cod')} 
                  className="form-check-input mt-0" 
                  style={{ width: '1.2rem', height: '1.2rem' }}
                />
                <div>
                  <h6 className="mb-0 fw-bold">Cash on Delivery</h6>
                  <small className="text-muted">Pay after the service is completed</small>
                </div>
              </label>
            </div>
          </div>

        </div>

        <div className="col-lg-4">
          <div className="p-4 bg-white rounded-4 shadow-sm border sticky-top" style={{ borderColor: 'rgba(67, 35, 122, 0.08)', top: '100px' }}>
            <h4 className="fw-bold mb-4 border-bottom pb-3 text-dark">Order Breakdown</h4>
            
            <div className="mb-4">
              {itemsToCheckout.map((item, idx) => (
                <div key={idx} className="d-flex justify-content-between mb-2 text-muted small">
                  <span className="text-truncate pe-2">{item.name}</span>
                  <span className="fw-semibold text-dark text-nowrap">Rs. {item.price}</span>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between fw-bold fs-5 mb-4 border-top pt-3 text-dark">
              <span>Total to Pay</span>
              <span style={{ color: '#6a38c2' }}>Rs. {totalAmount}</span>
            </div>
            
            <button 
              type="submit" 
              form="checkout-form"
              disabled={isSubmitting}
              className="btn-book w-100 py-3 rounded-4 shadow-sm fs-6" 
              style={{ background: '#6a38c2', color: 'white' }}
            >
              {isSubmitting ? 'Processing...' : paymentMethod === 'online' ? 'Pay & Confirm Booking' : 'Confirm Booking'}
            </button>
            <p className="text-center text-muted small mt-3 mb-0">By confirming, you agree to our terms of service.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
