import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';
import { services } from '../data';

export default function Header({
  cartCount = 0,
  addToCart,
  isDarkMode,
  toggleTheme,
  currentPincode,
  setCurrentPincode,
}) {
  const [query, setQuery] = useState('');
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOtherSearch = () => setQuery('');
    window.addEventListener('homeSearchActive', handleOtherSearch);
    return () => window.removeEventListener('homeSearchActive', handleOtherSearch);
  }, []);

  useEffect(() => {
    const handleDocumentClick = () => setIsLoginMenuOpen(false);
    if (isLoginMenuOpen) {
      document.addEventListener('click', handleDocumentClick);
    }
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [isLoginMenuOpen]);

  const filteredServices = query
    ? services.filter((service) => {
        const searchTerm = query.toLowerCase();
        return (
          service.name.toLowerCase().includes(searchTerm) ||
          service.description.toLowerCase().includes(searchTerm) ||
          service.keywords?.some((kw) => kw.toLowerCase().includes(searchTerm))
        );
      })
    : [];

  return (
    <>
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

          <div className="search-wrapper d-none d-lg-flex position-relative" role="search" aria-label="Site search">
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
                  value={currentPincode}
                  onChange={(event) => setCurrentPincode(event.target.value.replace(/\D/g, ''))}
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
                  onChange={(event) => {
                    setQuery(event.target.value);
                    window.dispatchEvent(new CustomEvent('headerSearchActive'));
                  }}
                  onFocus={() => window.dispatchEvent(new CustomEvent('headerSearchActive'))}
                  autoComplete="off"
                />
              </div>
            </div>

            <button
              type="button"
              className="search-action"
              aria-label="Search services"
              onClick={() => {
                const params = new URLSearchParams();
                if (query.trim()) {
                  params.set('search', query.trim());
                }
                if (currentPincode) {
                  params.set('pincode', currentPincode);
                }
                navigate(`/services${params.toString() ? `?${params.toString()}` : ''}`);
                setQuery('');
              }}
            >
              <i className="bi bi-search"></i>
            </button>

            {query && (
              <div className="search-dropdown shadow rounded-4 p-3 bg-white position-absolute w-100 mt-2 top-100 start-0 border" style={{ zIndex: 1050, maxHeight: '400px', overflowY: 'auto' }}>
                {filteredServices.length > 0 ? (
                  <div className="d-flex flex-column gap-3">
                    {filteredServices.map(service => (
                      <div key={service.id} className="search-result-item d-flex align-items-center justify-content-between border-bottom pb-2">
                        <div className="d-flex align-items-center gap-3">
                          <img src={service.image} alt={service.name} className="rounded" style={{ width: '48px', height: '48px', objectFit: 'cover' }} />
                          <div>
                            <h6 className="mb-0 fw-bold">{service.name}</h6>
                            <small className="text-muted">Rs. {service.price}</small>
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <button type="button" className="btn btn-sm btn-outline-primary rounded-pill px-3" onClick={() => { addToCart && addToCart(service); setQuery(''); }}>Add to cart</button>
                          <button type="button" className="btn btn-sm btn-primary rounded-pill px-3" style={{ backgroundColor: '#6a38c2', borderColor: '#6a38c2' }} onClick={() => { navigate('/services?service=' + service.slug + (currentPincode ? '&pincode=' + currentPincode : '')); setQuery(''); }}>View in area</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted py-3">No services found for "{query}"</div>
                )}
              </div>
            )}
          </div>

          <div className="header-actions align-items-center">
            <button
              type="button"
              onClick={toggleTheme}
              className="theme-toggle-btn border-0 d-flex align-items-center justify-content-center me-1"
              aria-label="Toggle Dark Mode"
              style={{ 
                width: '42px', height: '42px', borderRadius: '50%', 
                background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(106, 56, 194, 0.08)',
                transition: 'all 0.3s ease'
              }}
            >
              {isDarkMode ? (
                <i className="bi bi-sun-fill text-warning fs-5"></i>
              ) : (
                <i className="bi bi-moon-fill fs-5" style={{ color: '#6a38c2' }}></i>
              )}
            </button>

            <Link to="/cart" className="cart-wrapper text-decoration-none text-dark position-relative mx-3 d-flex align-items-center">
              <i className="bi bi-cart3 fs-4" style={{ color: '#14213d' }}></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                {cartCount}
                <span className="visually-hidden">products in cart</span>
              </span>
            </Link>

            <Link to="/signup" className="btn-login border-0 rounded-4 d-inline-flex align-items-center justify-content-center text-decoration-none fw-semibold ms-1 me-2" style={{ fontSize: '0.95rem' }}>
              Sign Up
            </Link>

            <div className="login-menu-wrapper ms-1">
              <button
                type="button"
                className="btn-login border-0 rounded-4 d-inline-flex align-items-center gap-2"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsLoginMenuOpen((prev) => !prev);
                }}
                aria-expanded={isLoginMenuOpen}
                aria-haspopup="menu"
              >
                Login
                <i className={`bi ${isLoginMenuOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
              </button>

              {isLoginMenuOpen && (
                <div
                  className="login-menu-dropdown"
                  role="menu"
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    className="login-menu-item"
                    role="menuitem"
                    onClick={() => {
                      setIsLoginMenuOpen(false);
                      navigate('/login');
                    }}
                  >
                    <i className="bi bi-person-circle"></i>
                    User login
                  </button>
                  <button
                    type="button"
                    className="login-menu-item"
                    role="menuitem"
                    onClick={() => {
                      setIsLoginMenuOpen(false);
                      navigate('/partner/dashboard');
                    }}
                  >
                    <i className="bi bi-briefcase"></i>
                    Partner login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>

    </>
  );
}
