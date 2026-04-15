import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { services } from '../data';

const highlights = [
  {
    icon: 'bi-patch-check',
    title: 'Background-verified professionals',
    description: 'Every partner is screened, trained, and reviewed before serving customers.',
  },
  {
    icon: 'bi-lightning-charge',
    title: 'Fast doorstep availability',
    description: 'Same-day slots across popular categories with real-time availability planning.',
  },
  {
    icon: 'bi-shield-check',
    title: 'Transparent pricing and support',
    description: 'Upfront estimates, clear scope, and follow-up care if something needs attention.',
  },
];

export default function Home({ addToCart, currentPincode, setCurrentPincode }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleOtherSearch = () => setQuery('');
    window.addEventListener('headerSearchActive', handleOtherSearch);
    return () => window.removeEventListener('headerSearchActive', handleOtherSearch);
  }, []);

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
    <main>
      <section className="hero-section">
        <div className="container">
          <div className="hero-shell">
            <div className="row align-items-center g-0">
              <div className="col-lg-7">
                <div className="hero-content p-4 p-md-5 p-xl-5">
                  <span className="eyebrow">
                    <i className="bi bi-house-heart-fill"></i>
                    Trusted home services across your city
                  </span>

                  <h1 className="hero-title mt-4 mb-3">
                    Premium help for every corner of your home.
                  </h1>

                  <p className="hero-copy mb-4">
                    From urgent repairs to recurring upkeep, HomeGenie helps families book
                    dependable professionals with polished service, transparent pricing, and
                    consistent quality.
                  </p>

                  <div className="hero-search-card">
                    <div className="hero-search-grid">
                      <div className="hero-field position-relative" style={{ zIndex: 10 }}>
                        <label htmlFor="serviceNeed">What do you need?</label>
                        <input
                          id="serviceNeed"
                          type="text"
                          placeholder="Try AC servicing, plumbing, electrician..."
                          value={query}
                          onChange={(e) => {
                            setQuery(e.target.value);
                            window.dispatchEvent(new CustomEvent('homeSearchActive'));
                          }}
                          onFocus={() => window.dispatchEvent(new CustomEvent('homeSearchActive'))}
                          autoComplete="off"
                        />
                        {query && (
                          <div className="search-dropdown shadow rounded-4 p-3 bg-white position-absolute mt-2 top-100 start-0 border hero-search-dropdown" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {filteredServices.length > 0 ? (
                              <div className="d-flex flex-column gap-3">
                                {filteredServices.map(service => (
                                  <div key={service.id} className="search-result-item d-flex align-items-center justify-content-between border-bottom pb-2">
                                    <div className="d-flex align-items-center gap-2 gap-md-3">
                                      <img src={service.image} alt={service.name} className="rounded d-none d-sm-block" style={{ width: '48px', height: '48px', objectFit: 'cover' }} />
                                      <div>
                                        <h6 className="mb-0 fw-bold text-dark" style={{ fontSize: '0.95rem' }}>{service.name}</h6>
                                        <small className="text-muted">Rs. {service.price}</small>
                                      </div>
                                    </div>
                                    <div className="d-flex flex-column flex-sm-row gap-2">
                                      <button type="button" className="btn btn-sm btn-outline-primary rounded-pill px-2 px-sm-3" style={{ fontSize: '0.8rem' }} onClick={() => { addToCart && addToCart(service); setQuery(''); }}>Add to cart</button>
                                      <button type="button" className="btn btn-sm btn-primary rounded-pill px-2 px-sm-3" style={{ backgroundColor: '#6a38c2', borderColor: '#6a38c2', fontSize: '0.8rem' }} onClick={() => { navigate('/services?service=' + service.slug + (currentPincode ? '&pincode=' + currentPincode : '')); setQuery(''); }}>View in area</button>
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

                      <div className="hero-field">
                        <label htmlFor="areaPincode">Your area</label>
                        <input
                          id="areaPincode"
                          type="text"
                          placeholder="6-digit pincode"
                          maxLength="6"
                          value={currentPincode}
                          onChange={(event) => setCurrentPincode(event.target.value.replace(/\D/g, ''))}
                        />
                      </div>

                      <button
                        type="button"
                        className="hero-btn"
                        onClick={() => {
                          const params = new URLSearchParams();
                          if (query.trim()) {
                            params.set('search', query.trim());
                          }
                          if (currentPincode) {
                            params.set('pincode', currentPincode);
                          }
                          navigate(`/services${params.toString() ? `?${params.toString()}` : ''}`);
                        }}
                      >
                        Search
                      </button>
                    </div>

                    <div className="hero-meta">
                      <span>
                        <i className="bi bi-check-circle-fill me-2"></i>
                        30-minute response for priority categories
                      </span>
                      <span>
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Verified experts and support-backed bookings
                      </span>
                    </div>
                  </div>

                  <div className="hero-stats">
                    <div className="hero-stat">
                      <strong>25k+</strong>
                      <span>completed bookings</span>
                    </div>
                    <div className="hero-stat">
                      <strong>4.8/5</strong>
                      <span>average service rating</span>
                    </div>
                    <div className="hero-stat">
                      <strong>120+</strong>
                      <span>trusted service partners</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="hero-side-panel">
                  <div className="hero-panel-card hero-panel-main">
                    <span className="hero-panel-badge">Live Platform Features</span>
                    <h3>Why HomeGenie feels different</h3>
                    <p>
                      Built for faster response, better transparency, and smarter service
                      decisions for urgent and everyday home care.
                    </p>
                  </div>

                  <div className="hero-feature-list">
                    <div className="hero-feature-item">
                      <div className="hero-feature-icon">
                        <i className="bi bi-broadcast-pin"></i>
                      </div>
                      <div>
                        <h4>Real-Time Provider</h4>
                        <p>See active nearby professionals before you confirm a booking.</p>
                      </div>
                    </div>

                    <Link to="/emergency" className="hero-feature-item emergency-item hero-feature-link">
                      <div className="hero-feature-icon emergency">
                        <i className="bi bi-exclamation-octagon-fill"></i>
                      </div>
                      <div>
                        <h4>Emergency Mode</h4>
                        <p>Priority matching for urgent electrical, plumbing, and AC issues.</p>
                      </div>
                    </Link>

                    <div className="hero-feature-item">
                      <div className="hero-feature-icon">
                        <i className="bi bi-geo-alt-fill"></i>
                      </div>
                      <div>
                        <h4>Service Tracking</h4>
                        <p>Track provider movement, arrival, and live job status updates.</p>
                      </div>
                    </div>

                    <div className="hero-feature-item">
                      <div className="hero-feature-icon">
                        <i className="bi bi-award-fill"></i>
                      </div>
                      <div>
                        <h4>Skill Rating</h4>
                        <p>Choose experts using quality, punctuality, and work-score insights.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section-spacing">
        <div className="container">
          <div className="section-heading mb-4 mb-lg-5">
            <span className="section-label">Why HomeGenie</span>
            <h2 className="section-title mb-3">A cleaner, calmer way to manage home services.</h2>
            <p className="section-subtitle mb-0">
              We focus on reliability from discovery to doorstep, so the booking experience feels
              as polished as the service itself.
            </p>
          </div>

          <div className="highlights-grid">
            {highlights.map((item) => (
              <article className="section-card" key={item.title}>
                <span className="icon-wrap">
                  <i className={`bi ${item.icon}`}></i>
                </span>
                <h3>{item.title}</h3>
                <p className="mb-0">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing pt-0" id="services-section">
        <div className="container">
          <div className="d-flex flex-column flex-lg-row align-items-lg-end justify-content-between gap-3 mb-4 mb-lg-5">
            <div className="section-heading mb-0">
              <span className="section-label">Popular categories</span>
              <h2 className="section-title mb-3">Most-booked services this week.</h2>
              <p className="section-subtitle mb-0">
                Explore curated home services designed for speed, quality, and peace of mind.
              </p>
            </div>
            <Link to={currentPincode ? `/services?pincode=${currentPincode}` : '/services'} className="text-decoration-none fw-semibold">
              View all services <i className="bi bi-arrow-right-short"></i>
            </Link>
          </div>

          <div className="services-grid">
            {services.map((service) => (
              <article className="service-card" key={service.id}>
                <Link to={`/services?service=${service.slug}${currentPincode ? `&pincode=${currentPincode}` : ''}`} className="text-decoration-none">
                  <img src={service.image} alt={service.name} />
                </Link>
                <div className="service-card-body">
                  <div className="service-topline">
                    <span className="service-rating">
                      <i className="bi bi-star-fill"></i>
                      {service.rating}
                    </span>
                    <span className="service-price">From Rs. {service.price}</span>
                  </div>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <div className="d-flex flex-column gap-2 mt-auto">
                    <button type="button" className="btn-cart" onClick={() => addToCart(service)}>
                      Add to cart
                    </button>
                    <button type="button" className="btn-book" onClick={() => navigate(`/services?service=${service.slug}${currentPincode ? `&pincode=${currentPincode}` : ''}`)}>
                      View in area
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
