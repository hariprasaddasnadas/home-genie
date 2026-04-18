import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

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
    setAddress((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConfirmOrder = (e) => {
    e.preventDefault();

    // Store address for next time
    localStorage.setItem('hg_user_address', JSON.stringify(address));

    // If it was a cart checkout, clear the cart.
    if (!isSingleCheckout) {
      clearCart();
    }

    // Since Stripe will be integrated later, we do simple success logic.
    showToast('Your booking has been confirmed successfully!', 'success');
    navigate('/');
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
            <form id="checkout-form" onSubmit={handleConfirmOrder}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted">Full Name</label>
                  <input type="text" className="form-control" name="fullName" value={address.fullName} onChange={handleAddressChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted">Mobile Number</label>
                  <input type="tel" className="form-control" name="phone" value={address.phone} onChange={handleAddressChange} required />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold small text-muted">Street / Flat / Area</label>
                  <input type="text" className="form-control" name="street" value={address.street} onChange={handleAddressChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted">City</label>
                  <input type="text" className="form-control" name="city" value={address.city} onChange={handleAddressChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted">Pincode</label>
                  <input type="text" className="form-control" name="pincode" value={address.pincode} onChange={handleAddressChange} required />
                </div>
              </div>
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
              className="btn-book w-100 py-3 rounded-4 shadow-sm fs-6" 
              style={{ background: '#6a38c2', color: 'white' }}
            >
              Confirm Booking
            </button>
            <p className="text-center text-muted small mt-3 mb-0">By confirming, you agree to our terms of service.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
