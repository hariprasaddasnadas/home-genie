import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiUrl } from '../api';

export default function PartnerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(apiUrl('/api/partner/login/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        const errorText = data.detail || Object.values(data)[0]?.[0] || 'Partner login failed.';
        setSubmitError(errorText);
        return;
      }

      localStorage.setItem('partnerAuth', JSON.stringify(data));
      localStorage.removeItem('userAuth');
      localStorage.setItem('activeAuthType', 'partner');
      window.dispatchEvent(new CustomEvent('authChanged'));
      navigate('/partner/dashboard');
    } catch (error) {
      setSubmitError('Could not connect to backend. Please ensure Django server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-section">
        <div className="container">
          <div className="login-layout">
            <div className="login-intro-card">
              <span className="section-label">Partner Login</span>
              <h1 className="login-title">Welcome back, partner.</h1>
              <p className="login-copy">
                Sign in to manage your profile, publish services, and keep your listings updated
                for customers in your area.
              </p>
            </div>

            <div className="login-form-card">
              <span className="login-kicker">
                <i className="bi bi-briefcase-fill"></i>
                Partner access
              </span>

              <h2 className="content-title mb-2">Sign in to partner dashboard</h2>
              <p className="content-copy mb-4">Use your registered partner email and password.</p>

              <form className="login-form" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold" htmlFor="partner-login-email">
                    Email address
                  </label>
                  <input
                    id="partner-login-email"
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" htmlFor="partner-login-password">
                    Password
                  </label>
                  <div className="position-relative">
                    <input
                      id="partner-login-password"
                      type={showPassword ? 'text' : 'password'}
                      className="form-control pe-5"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn border-0 position-absolute top-50 end-0 translate-middle-y"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      style={{ color: '#7a8296', background: 'transparent', zIndex: 5 }}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                {submitError && <p className="text-danger small mb-3">{submitError}</p>}

                <button type="submit" className="login-submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Logging in...' : 'Partner login'}
                </button>
              </form>

              <div className="login-footer-copy">
                New partner?
                <Link to="/partner" className="ms-2 text-decoration-none fw-bold">
                  Create partner account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
