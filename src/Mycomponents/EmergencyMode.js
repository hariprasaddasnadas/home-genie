import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { services } from '../data';

const responseSteps = [
  {
    icon: 'bi-bell-fill',
    title: 'Raise a priority request',
    description: 'Tell us what went wrong and we immediately move your request into the urgent queue.',
  },
  {
    icon: 'bi-lightning-charge-fill',
    title: 'Get matched faster',
    description: 'Priority categories are routed to the nearest available professionals with emergency-ready slots.',
  },
  {
    icon: 'bi-geo-alt-fill',
    title: 'Track the arrival',
    description: 'Stay updated while the provider heads to your location and support keeps the booking on track.',
  },
];

const emergencyChecks = [
  'Switch off the power source if there is sparking or electrical smell.',
  'Shut the water valve if there is active leakage or overflow.',
  'Move children and pets away from the affected area.',
  'Keep your phone nearby so the assigned professional can reach you quickly.',
];

export default function EmergencyMode({ addToCart, currentPincode }) {
  const navigate = useNavigate();
  const priorityServices = services.filter((service) => {
    const isPriorityService = [1, 2, 4].includes(service.id);
    const matchesPincode = currentPincode
      ? service.availablePincodes.includes(currentPincode)
      : true;

    return isPriorityService && matchesPincode;
  });

  return (
    <main className="inner-page emergency-page">
      <section className="emergency-hero">
        <div className="container">
          <div className="emergency-hero-shell">
            <div className="emergency-hero-copy">
              <span className="section-label emergency-label">Emergency Mode</span>
              <h1 className="inner-title">Rapid support for urgent home issues that cannot wait.</h1>
              <p className="inner-copy">
                Emergency Mode is built for high-priority electrical, AC, and safety-sensitive
                service needs. Raise an urgent request, get faster matching, and move from panic
                to action with a clearer response flow.
              </p>

              <div className="emergency-chip-row">
                <span className="emergency-chip">
                  <i className="bi bi-stopwatch-fill"></i>
                  Priority queue activation
                </span>
                <span className="emergency-chip">
                  <i className="bi bi-shield-fill-check"></i>
                  Verified service partners
                </span>
                <span className="emergency-chip">
                  <i className="bi bi-broadcast-pin"></i>
                  Real-time coordination
                </span>
              </div>

              <div className="emergency-actions">
                <a className="emergency-primary-btn" href="#emergency-services">
                  View priority services
                </a>
                <Link className="emergency-secondary-btn" to="/contact">
                  Talk to support
                </Link>
              </div>
            </div>

            <aside className="emergency-alert-card">
              <div className="emergency-alert-badge">
                <i className="bi bi-exclamation-triangle-fill"></i>
                Active response mode
              </div>
              <h2>What Emergency Mode helps with</h2>
              <ul className="emergency-alert-list">
                <li>Unexpected electrical faults and unsafe fittings</li>
                <li>AC failure during extreme heat and airflow breakdown</li>
                <li>Post-incident sanitization and urgent cleanup support</li>
              </ul>
              <div className="emergency-alert-note">
                <strong>Before booking:</strong> If there is fire, severe injury, or immediate danger,
                contact local emergency services first.
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="inner-section">
        <div className="container">
          <div className="info-cards-grid emergency-info-grid">
            {responseSteps.map((step) => (
              <article className="info-card emergency-info-card" key={step.title}>
                <span className="icon-wrap emergency-icon-wrap">
                  <i className={`bi ${step.icon}`}></i>
                </span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="inner-section" id="emergency-services">
        <div className="container">
          <div className="content-card emergency-services-shell">
            <div className="emergency-services-heading">
              <div>
                <span className="section-label">Priority categories</span>
                <h2 className="content-title mb-2">Fastest-response services for urgent situations.</h2>
                <p className="content-copy mb-0">
                  These services are best suited for situations where the issue is disruptive,
                  safety-sensitive, or likely to get worse if ignored.
                </p>
                {currentPincode && (
                  <div className="service-filter-note mt-3">
                    <strong>Area filter:</strong> {currentPincode}
                  </div>
                )}
              </div>
              <div className="emergency-support-pill">
                <i className="bi bi-headset"></i>
                Support-led coordination available
              </div>
            </div>

            {priorityServices.length === 0 ? (
              <div className="content-card">
                <h3 className="content-title">No emergency services found for this area.</h3>
                <p className="content-copy mb-0">
                  Try another pincode to see available emergency support near you.
                </p>
              </div>
            ) : (
              <div className="services-grid services-grid--page emergency-services-grid">
                {priorityServices.map((service) => (
                  <article className="service-card emergency-service-card" key={service.id}>
                    <img src={service.image} alt={service.name} />
                    <div className="service-card-body">
                      <span className="service-tag emergency-service-tag">Priority dispatch</span>
                      <div className="service-topline">
                        <span className="service-rating">
                          <i className="bi bi-star-fill"></i>
                          {service.rating}
                        </span>
                        <span className="service-price">From Rs. {service.price}</span>
                      </div>
                      <h3>{service.name}</h3>
                      <p>{service.description}</p>
                      <div className="emergency-service-meta">
                        <span>
                          <i className="bi bi-clock-history"></i>
                          Faster matching priority
                        </span>
                        <span>
                          <i className="bi bi-check2-circle"></i>
                          Verified professionals
                        </span>
                      </div>
                      <div className="d-flex flex-column gap-2 mt-3">
                        <button
                          type="button"
                          className="btn-cart"
                          onClick={() => addToCart(service)}
                        >
                          Add to cart
                        </button>
                        <button
                          type="button"
                          className="btn-book"
                          onClick={() => navigate('/checkout', { state: { service, emergency: true } })}
                        >
                          Book emergency service
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="inner-section">
        <div className="container">
          <div className="content-grid emergency-bottom-grid">
            <div className="content-card">
              <span className="section-label">Safety checklist</span>
              <h2 className="content-title">Do these first while help is on the way.</h2>
              <ul className="simple-list emergency-check-list">
                {emergencyChecks.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="info-panel emergency-panel">
              <span className="section-label">Need regular booking?</span>
              <h3>Not every issue needs Emergency Mode.</h3>
              <p>
                For non-urgent requests, you can browse all services, add them to cart, and book at
                your own pace.
              </p>
              <Link
                to={currentPincode ? `/services?pincode=${currentPincode}` : '/services'}
                className="emergency-secondary-btn emergency-panel-link"
              >
                Browse all services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
