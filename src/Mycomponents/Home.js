import React from 'react';
import { Link } from 'react-router-dom';

const services = [
  {
    id: 1,
    name: 'AC Deep Cleaning',
    price: '599',
    rating: '4.8',
    description: 'Jet-cleaned coils, filter wash, airflow check, and indoor unit hygiene.',
    image:
      'https://images.pexels.com/photos/9242831/pexels-photo-9242831.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 2,
    name: 'Home Sanitization',
    price: '1499',
    rating: '4.9',
    description: 'Whole-home disinfection for kitchens, bedrooms, high-touch points, and surfaces.',
    image:
      'https://images.pexels.com/photos/4099467/pexels-photo-4099467.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 3,
    name: 'Salon at Home',
    price: '899',
    rating: '4.7',
    description: 'Professional beauty services with premium products and hygienic setup.',
    image:
      'https://images.pexels.com/photos/3993311/pexels-photo-3993311.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 4,
    name: 'Expert Electrician',
    price: '149',
    rating: '4.8',
    description: 'Quick fixes, safe diagnostics, fittings, switches, fans, and smart upgrades.',
    image:
      'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

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

export default function Home() {
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
                      <div className="hero-field">
                        <label htmlFor="serviceNeed">What do you need?</label>
                        <input
                          id="serviceNeed"
                          type="text"
                          placeholder="Try AC servicing, sofa cleaning, salon..."
                        />
                      </div>

                      <div className="hero-field">
                        <label htmlFor="areaPincode">Your area</label>
                        <input id="areaPincode" type="text" placeholder="6-digit pincode" />
                      </div>

                      <button type="button" className="hero-btn">
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
                <div className="hero-media">
                  <div className="hero-media-card">
                    <img
                      src="https://images.pexels.com/photos/6195129/pexels-photo-6195129.jpeg?auto=compress&cs=tinysrgb&w=1200"
                      alt="Home professional helping a customer"
                    />
                    <div className="trust-card">
                      <div>
                        <strong>Trusted by modern households</strong>
                        <span>Repairs, wellness, cleaning, and seasonal care</span>
                      </div>
                      <div>
                        <strong>98%</strong>
                        <span>on-time arrival score</span>
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

      <section className="section-spacing pt-0">
        <div className="container">
          <div className="d-flex flex-column flex-lg-row align-items-lg-end justify-content-between gap-3 mb-4 mb-lg-5">
            <div className="section-heading mb-0">
              <span className="section-label">Popular categories</span>
              <h2 className="section-title mb-3">Most-booked services this week.</h2>
              <p className="section-subtitle mb-0">
                Explore curated home services designed for speed, quality, and peace of mind.
              </p>
            </div>
            <Link to="/partner" className="text-decoration-none fw-semibold">
              Become a service partner <i className="bi bi-arrow-right-short"></i>
            </Link>
          </div>

          <div className="services-grid">
            {services.map((service) => (
              <article className="service-card" key={service.id}>
                <img src={service.image} alt={service.name} />
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
                  <button type="button" className="btn-book">
                    Book now
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
