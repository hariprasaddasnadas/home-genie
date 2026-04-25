import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function UserSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <main className="login-page">
      <section className="login-section">
        <div className="container">
          <div className="login-layout">
            <div className="login-intro-card">
              <span className="section-label">User Sign Up</span>
              <h1 className="login-title">Join HomeGenie today.</h1>
              <p className="login-copy">
                Create an account to manage bookings, track active services, review previous orders,
                and keep your home-care routine organized in one place.
              </p>

              <div className="login-feature-list">
                <div className="login-feature-item">
                  <span className="login-feature-icon">
                    <i className="bi bi-bag-check-fill"></i>
                  </span>
                  <div>
                    <h3>Track bookings</h3>
                    <p>See scheduled services, upcoming visits, and service history.</p>
                  </div>
                </div>

                <div className="login-feature-item">
                  <span className="login-feature-icon">
                    <i className="bi bi-shield-check"></i>
                  </span>
                  <div>
                    <h3>Safer access</h3>
                    <p>Keep your account details, saved addresses, and preferences secure.</p>
                  </div>
                </div>

                <div className="login-feature-item">
                  <span className="login-feature-icon">
                    <i className="bi bi-stars"></i>
                  </span>
                  <div>
                    <h3>Faster checkout</h3>
                    <p>Return to your saved service flow without filling the same details again.</p>
                  </div>
                </div>
              </div>

              <div className="login-side-note">
                Want to work with HomeGenie?
                <Link to="/partner" className="ms-2 text-decoration-none fw-bold">
                  Become a partner
                </Link>
              </div>
            </div>

            <div className="login-form-card">
              <span className="login-kicker">
                <i className="bi bi-person-plus-fill"></i>
                Create account
              </span>

              <h2 className="content-title mb-2">Sign up for an account</h2>
              <p className="content-copy mb-4">
                Enter your email and create a password to get started.
              </p>

              <form className="login-form" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold" htmlFor="signup-email">
                    Email address
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" htmlFor="signup-password">
                    Password
                  </label>
                  <div className="position-relative">
                    <input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      className="form-control pe-5"
                      placeholder="Create a password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                    <button
                      type="button"
                      className="btn border-0 position-absolute top-50 end-0 translate-middle-y"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      style={{ color: '#7a8296', background: 'transparent', zIndex: 5 }}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <div className="login-form-row">
                  <label className="remember-check">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                    />
                    <span>Remember me</span>
                  </label>

                  <Link to="/contact" className="login-inline-link text-decoration-none">
                    Forgot password?
                  </Link>
                </div>

                <button type="submit" className="login-submit-btn">
                  Sign Up
                </button>

                <div className="mt-4 text-center">
                  <Link to="/login" className="login-submit-btn text-decoration-none d-flex align-items-center justify-content-center w-100">
                    Do you already have an account? Sign in
                  </Link>
                </div>
              </form>

              <div className="login-footer-copy mt-3">
                New to HomeGenie?
                <Link to="/services" className="ms-2 text-decoration-none fw-bold">
                  Explore services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
