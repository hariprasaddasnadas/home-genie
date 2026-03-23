import React, { useState } from 'react';

export default function PartnerRegistration() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    serviceCategory: 'Plumbing',
    pincode: '',
    experience: '1-3 Years'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Partner Lead:", formData);
    alert("Genie Request Sent! Our team will contact you for verification.");
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center bg-light py-5">
      <div className="container">
        <div className="row g-5 align-items-center">
          
          {/* Left Side: Marketing/Benefits */}
          <div className="col-lg-6">
            <h1 className="display-4 fw-bold mb-4">
              Become a <span style={{ color: '#673AB7' }}>HomeGenie</span> Partner
            </h1>
            <p className="lead mb-5 text-secondary">
              Join India's fastest-growing service network. Get consistent leads, 
              timely payments, and grow your business with a magic touch.
            </p>

            <div className="d-flex mb-4">
              <div className="bg-white p-3 rounded-circle shadow-sm me-3">
                <i className="bi bi-wallet2 fs-3 text-success"></i>
              </div>
              <div>
                <h5 className="fw-bold">Weekly Payouts</h5>
                <p className="text-muted">Get your hard-earned money directly in your bank account every week.</p>
              </div>
            </div>

            <div className="d-flex mb-4">
              <div className="bg-white p-3 rounded-circle shadow-sm me-3">
                <i className="bi bi-graph-up-arrow fs-3 text-primary"></i>
              </div>
              <div>
                <h5 className="fw-bold">Business Growth</h5>
                <p className="text-muted">Access to 10,000+ customers looking for experts in your area.</p>
              </div>
            </div>
          </div>

          {/* Right Side: The Registration Form */}
          <div className="col-lg-5 offset-lg-1">
            <div className="card border-0 shadow-lg p-4 p-md-5 rounded-4">
              <h3 className="fw-bold mb-4">Start Earning Today</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Full Name</label>
                  <input 
                    type="text" 
                    className="form-control form-control-lg bg-light border-0" 
                    name="fullName"
                    placeholder="e.g. Rahul Sharma"
                    onChange={handleChange}
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">Phone Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">+91</span>
                    <input 
                      type="tel" 
                      className="form-control form-control-lg bg-light border-0" 
                      name="phone"
                      placeholder="10 digit mobile"
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold small">Service Type</label>
                    <select className="form-select form-select-lg bg-light border-0" name="serviceCategory" onChange={handleChange}>
                      <option>Plumbing</option>
                      <option>Electrician</option>
                      <option>AC Repair</option>
                      <option>Cleaning</option>
                      <option>Salon</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold small">Base Pincode</label>
                    <input 
                      type="text" 
                      className="form-control form-control-lg bg-light border-0" 
                      name="pincode"
                      placeholder="6-digit"
                      maxLength="6"
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small">Years of Experience</label>
                  <select className="form-select form-select-lg bg-light border-0" name="experience" onChange={handleChange}>
                    <option>Less than 1 Year</option>
                    <option>1-3 Years</option>
                    <option>3-5 Years</option>
                    <option>5+ Years</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-lg w-100 text-white fw-bold shadow" style={{ backgroundColor: '#673AB7' }}>
                  Register as Genie
                </button>
                <p className="text-center mt-3 text-muted small">
                  By joining, you agree to HomeGenie's Partner Terms.
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}