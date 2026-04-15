import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function UserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
              <span className="section-label">User Login</span>
              <h1 className="login-title">Welcome back to HomeGenie.</h1>
              <p className="login-copy">
                Sign in to manage bookings, track active services, review previous orders,
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
                <i className="bi bi-person-circle"></i>
                Account access
              </span>

              <h2 className="content-title mb-2">Sign in to your account</h2>
              <p className="content-copy mb-4">
                Use your registered email and password to continue.
              </p>

              <form className="login-form" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold" htmlFor="login-email">
                    Email address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" htmlFor="login-password">
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
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
                  Login
                </button>
              </form>

              <div className="login-footer-copy">
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
