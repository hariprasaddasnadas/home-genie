import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [pincode, setPincode] = useState("");

  return (
    <header className="hg-header sticky-top">
      <div className="container py-3">
        <div className="d-flex align-items-center justify-content-between">
          
          {/* 1. BRAND LOGO */}
          <Link className="navbar-brand d-flex align-items-center fw-bold fs-3 text-dark text-decoration-none" to="/">
            <i className="bi bi-magic me-2" style={{ color: '#673AB7' }}></i>
            Home<span style={{ color: '#673AB7' }}>Genie</span>
          </Link>

          {/* 2. THE SEARCH PILL (Matches the new CSS .search-wrapper) */}
          <div className="search-wrapper d-none d-lg-flex flex-grow-1 mx-5 rounded-pill p-1 align-items-center">
            {/* Location Section */}
            <div className="px-3 border-end d-flex align-items-center">
              <i className="bi bi-geo-alt-fill text-primary me-2"></i>
              <input 
                type="text" 
                className="form-control border-0 bg-transparent shadow-none fw-bold p-0" 
                placeholder="Pincode" 
                style={{ width: '85px', fontSize: '14px' }}
                maxLength="6"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>
            
            {/* Global Search Section */}
            <div className="flex-grow-1 px-3">
              <input 
                type="text" 
                className="form-control border-0 bg-transparent shadow-none" 
                placeholder="Search for 'AC Repair', 'Cleaning'..." 
                style={{ fontSize: '14px' }}
              />
            </div>
            
            <i className="bi bi-search text-muted me-3"></i>
          </div>

          {/* 3. RIGHT SIDE ACTIONS */}
          <div className="d-flex align-items-center gap-3">
            <Link to="/partner" className="nav-link-custom partner-link d-none d-md-block text-decoration-none">
              Become a Partner
            </Link>
            
            {/* Login Button with the new .btn-login class */}
            <button className="btn-login shadow-sm">
              Login
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}