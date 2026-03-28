import React from 'react';
import { Link } from 'react-router-dom';

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Become a Partner', to: '/partner' },
  { label: 'Popular Services', to: '/' },
];

const serviceLinks = ['AC Service', 'Cleaning', 'Electrician', 'Salon at Home'];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-shell">
          <div className="footer-brand-block">
            <Link className="footer-brand text-decoration-none" to="/">
              <span className="footer-brand-mark">
                <i className="bi bi-stars" aria-hidden="true"></i>
              </span>
              <span>
                Home<span className="brand-accent">Genie</span>
              </span>
            </Link>
            <p className="footer-copy">
              Reliable home services, verified professionals, and a polished booking experience
              for modern households.
            </p>
            <div className="footer-socials">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="footer-title">Quick links</h3>
            <ul className="footer-links">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="footer-title">Top services</h3>
            <ul className="footer-links">
              {serviceLinks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="footer-title">Contact</h3>
            <ul className="footer-links footer-contact">
              <li>support@homegenie.in</li>
              <li>+91 98765 43210</li>
              <li>Bengaluru, India</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 HomeGenie. All rights reserved.</span>
          <div className="footer-bottom-links">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
