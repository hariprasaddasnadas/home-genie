import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './navbar.css';

export default function Header({ cartCount = 0 }) {
  const [pincode, setPincode] = useState('');
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleBookServiceClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="hg-header sticky-top">
      <div className="container py-3">
        <div className="header-shell">
          <Link className="brand-lockup text-decoration-none" to="/">
            <span className="brand-mark">
              <i className="bi bi-stars" aria-hidden="true"></i>
            </span>
            <span>
              Home<span className="brand-accent">Genie</span>
            </span>
          </Link>

          <div className="search-wrapper d-none d-lg-flex" role="search" aria-label="Site search">
            <div className="search-field search-field--compact d-flex align-items-center gap-2">
              <i className="bi bi-geo-alt fs-5 text-muted"></i>
              <div className="flex-grow-1">
                <label htmlFor="header-pincode">Location</label>
                <input
                  id="header-pincode"
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter pincode"
                  maxLength="6"
                  value={pincode}
                  onChange={(event) => setPincode(event.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>

            <div className="search-field d-flex align-items-center gap-2">
              <div className="flex-grow-1 ms-2">
                <label htmlFor="header-search">Service</label>
                <input
                  id="header-search"
                  type="text"
                  placeholder="AC repair, home cleaning..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </div>

            <button type="button" className="search-action" aria-label="Search services">
              <i className="bi bi-search"></i>
            </button>
          </div>

          <div className="header-actions align-items-center">
            <Link to="/partner" className="partner nav-link-custom text-decoration-none d-none d-md-inline-block">
              Partner with us
            </Link>

            <span className="book nav-link-custom text-decoration-none d-none d-md-inline-block" style={{ cursor: 'pointer' }} onClick={handleBookServiceClick}>
              Book a service
            </span>

            <Link to="/cart" className="cart-wrapper text-decoration-none text-dark position-relative mx-3 d-flex align-items-center">
              <i className="bi bi-cart3 fs-4" style={{ color: '#14213d' }}></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                {cartCount}
                <span className="visually-hidden">products in cart</span>
              </span>
            </Link>

            <button type="button" className="btn-login ms-1 border-0 rounded-4">
              Login
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
