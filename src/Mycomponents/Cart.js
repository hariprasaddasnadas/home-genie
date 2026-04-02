import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart({ cartItems = [], removeFromCart }) {
  const navigate = useNavigate();
  const totalAmount = cartItems.reduce((acc, item) => acc + parseInt(item.price, 10), 0);

  return (
    <main className="cart-page-container container my-5" style={{ minHeight: '60vh' }}>
      <div className="d-flex align-items-center mb-4">
        <h2 className="mb-0 fw-bold" style={{ color: '#14213d' }}>
          Your Cart
        </h2>
        <span className="ms-3 badge rounded-pill bg-light text-dark border border-secondary" style={{ fontSize: '0.9rem' }}>
          {cartItems.length} service(s)
        </span>
      </div>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-5 border rounded-4 bg-white shadow-sm" style={{ borderColor: 'rgba(67, 35, 122, 0.08)' }}>
          <i className="bi bi-cart-x text-muted mb-3 d-block" style={{ fontSize: '4.5rem' }}></i>
          <h4 className="text-muted fw-bold mb-3">Your cart is currently empty</h4>
          <p className="text-muted mb-4">Looks like you haven't added any services yet.</p>
          <Link to="/" className="btn-book d-inline-block text-decoration-none px-4 py-2" style={{ width: 'auto' }}>
            Explore Services
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-card d-flex align-items-start gap-3 p-3 mb-3 bg-white rounded-4 shadow-sm border" style={{ borderColor: 'rgba(67, 35, 122, 0.08)' }}>
                  <img src={item.image} alt={item.name} className="rounded-3" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <h5 className="mb-1 fw-bold text-dark fs-5">{item.name}</h5>
                      <button 
                        className="btn btn-light rounded-circle text-danger border-0 flex-shrink-0 shadow-sm" 
                        onClick={() => removeFromCart(item.id)}
                        title="Remove service"
                        style={{ width: '38px', height: '38px' }}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </div>
                    <p className="mb-2 text-muted small pe-4">{item.description}</p>
                    <div className="mt-2 d-inline-block fw-bold" style={{ color: '#6a38c2', background: 'rgba(106, 56, 194, 0.08)', padding: '0.2rem 0.6rem', borderRadius: '8px' }}>
                      Rs. {item.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-4 ">
            <div className="cart-summary-card p-4 bg-white rounded-4 shadow-sm border sticky-top" style={{ borderColor: 'rgba(67, 35, 122, 0.08)', top: '100px' }}>
              <h4 className="fw-bold mb-4 border-bottom pb-3 text-dark">Order Summary</h4>
              <div className="d-flex justify-content-between mb-3 text-muted">
                <span>Subtotal ({cartItems.length} items)</span>
                <span className="fw-semibold text-dark">Rs. {totalAmount}</span>
              </div>
              <div className="d-flex justify-content-between mb-4 text-muted">
                <span>Taxes & Fees</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="d-flex justify-content-between fw-bold fs-5 mb-4 border-top pt-3 text-dark">
                <span>Total Amount</span>
                <span style={{ color: '#6a38c2' }}>Rs. {totalAmount}</span>
              </div>
              <button 
                className="btn-book w-100 py-3 rounded-4 shadow-sm fs-6" 
                style={{ background: '#6a38c2', color: 'white' }}
                onClick={() => navigate('/checkout')}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
