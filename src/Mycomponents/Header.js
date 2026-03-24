import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

export default function Header() {
  const [pincode, setPincode] = useState('');
  const [query, setQuery] = useState('');

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
            <div className="search-field search-field--compact">
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

            <div className="search-field">
              <label htmlFor="header-search">Service</label>
              <input
                id="header-search"
                type="text"
                placeholder="AC repair, home cleaning, plumbing..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            <button type="button" className="search-action" aria-label="Search services">
              <i className="bi bi-search"></i>
            </button>
          </div>

          <div className="header-actions">
            <Link to="/partner" className="nav-link-custom text-decoration-none">
              Partner with us
            </Link>
            <button type="button" className="btn-login">
              Book a service
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
