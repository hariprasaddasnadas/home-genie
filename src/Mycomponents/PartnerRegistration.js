import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../api';

const benefitItems = [
  {
    icon: 'bi-wallet2',
    title: 'Reliable weekly payouts',
    description: 'Clear earnings, predictable settlement cycles, and support for payment queries.',
  },
  {
    icon: 'bi-graph-up-arrow',
    title: 'Consistent local demand',
    description: 'Access repeat customers in your area without spending extra on marketing.',
  },
  {
    icon: 'bi-mortarboard',
    title: 'Operational guidance',
    description: 'Get onboarding help, service standards, and training support to grow faster.',
  },
  {
    icon: 'bi-headset',
    title: 'Partner-first support',
    description: 'Escalation help for jobs, schedules, and customer communication when needed.',
  },
];

export default function PartnerRegistration() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [formData, setFormData] = useState({
    partnerName: '',
    email: '',
    phone: '',
    serviceCategory: 'Plumbing',
    pincode: '',
    experience: '1-3 Years',
    city: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: name === 'phone' || name === 'pincode' ? value.replace(/\D/g, '') : value,
    }));
  };

  const mapServiceType = (category) => {
    const serviceMap = {
      Plumbing: 'plumber',
      Electrician: 'electrician',
      'AC Repair': 'appliance_repair',
      Cleaning: 'cleaning',
      Carpentry: 'carpenter',
      Salon: 'other',
    };
    return serviceMap[category] || 'other';
  };

  const mapExperienceYears = (value) => {
    const yearsMap = {
      'Less than 1 Year': 0,
      '1-3 Years': 2,
      '3-5 Years': 4,
      '5+ Years': 5,
    };
    return yearsMap[value] ?? 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const response = await fetch(apiUrl('/api/partner/signup/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.partnerName,
          email: formData.email,
          phone: formData.phone,
          pincode: formData.pincode,
          city: formData.city,
          service_type: mapServiceType(formData.serviceCategory),
          experience_years: mapExperienceYears(formData.experience),
          password: formData.password,
          confirm_password: formData.confirmPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        const errorText = data.detail || Object.values(data)[0]?.[0] || 'Partner signup failed.';
        setSubmitError(errorText);
        return;
      }

      localStorage.setItem('partnerAuth', JSON.stringify(data));
      localStorage.removeItem('userAuth');
      localStorage.setItem('activeAuthType', 'partner');
      window.dispatchEvent(new CustomEvent('authChanged'));
      setSubmitSuccess('Partner account created successfully. Redirecting to partner dashboard...');
      setTimeout(() => navigate('/partner/dashboard'), 900);
    } catch (error) {
      setSubmitError('Could not connect to backend. Please ensure Django server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="partner-section">
      <div className="container">
        <div className="partner-layout">
          <div className="partner-card">
            <span className="partner-kicker">
              <i className="bi bi-briefcase-fill"></i>
              Grow with HomeGenie
            </span>

            <h1 className="partner-title">
              Build a stronger service business with a trusted customer pipeline.
            </h1>

            <p className="partner-copy mt-3 mb-0">
              Join a network designed for skilled professionals who want dependable leads,
              efficient operations, and a brand customers already trust in their homes.
            </p>

            <div className="partner-metrics">
              <div className="partner-metric">
                <strong>10k+</strong>
                <span>monthly customer requests</span>
              </div>
              <div className="partner-metric">
                <strong>48 hrs</strong>
                <span>average onboarding review</span>
              </div>
              <div className="partner-metric">
                <strong>20+</strong>
                <span>active service categories</span>
              </div>
            </div>

            <div className="benefits-grid mt-4">
              {benefitItems.map((item) => (
                <article className="benefit-card" key={item.title}>
                  <span className="icon-wrap">
                    <i className={`bi ${item.icon}`}></i>
                  </span>
                  <h3>{item.title}</h3>
                  <p className="mb-0">{item.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="partner-card">
            <h2 className="section-title fs-2 mb-2">Partner application</h2>
            <p className="partner-note mb-4">
              Fill in your details and our onboarding team will review your profile for the next
              available service slots in your area.
            </p>

            <form className="partner-form" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold small" htmlFor="partnerName">
                  Person name or shop name
                </label>
                <input
                  id="partnerName"
                  type="text"
                  className="form-control"
                  name="partnerName"
                  placeholder="Enter person name or shop name"
                  value={formData.partnerName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small" htmlFor="phone">
                  Mobile number
                </label>
                <div className="input-group">
                  <span className="input-group-text">+91</span>
                  <input
                    id="phone"
                    type="tel"
                    className="form-control"
                    name="phone"
                    placeholder="10-digit mobile number"
                    maxLength="10"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold small" htmlFor="serviceCategory">
                    Service category
                  </label>
                  <select
                    id="serviceCategory"
                    className="form-select"
                    name="serviceCategory"
                    value={formData.serviceCategory}
                    onChange={handleChange}
                  >
                    <option>Plumbing</option>
                    <option>Electrician</option>
                    <option>AC Repair</option>
                    <option>Cleaning</option>
                    <option>Salon</option>
                    <option>Carpentry</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold small" htmlFor="pincode">
                    Base pincode
                  </label>
                  <input
                    id="pincode"
                    type="text"
                    className="form-control"
                    name="pincode"
                    placeholder="6-digit service area"
                    maxLength="6"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold small" htmlFor="city">
                    City (optional)
                  </label>
                  <input
                    id="city"
                    type="text"
                    className="form-control"
                    name="city"
                    placeholder="Enter your city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small" htmlFor="experience">
                  Years of experience
                </label>
                <select
                  id="experience"
                  className="form-select"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                >
                  <option>Less than 1 Year</option>
                  <option>1-3 Years</option>
                  <option>3-5 Years</option>
                  <option>5+ Years</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small" htmlFor="confirmPassword">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="form-control"
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {submitError && <p className="text-danger small mb-3">{submitError}</p>}
              {submitSuccess && <p className="text-success small mb-3">{submitSuccess}</p>}

              <button type="submit" className="partner-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit application'}
              </button>

              <p className="partner-note text-center mt-3 mb-0 small">
                By applying, you agree to HomeGenie partner onboarding and verification terms.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
