import React from 'react';
import { Link } from 'react-router-dom';
import { services } from './servicesData';

export default function Services() {
  return (
    <main className="inner-page">
      <section className="inner-hero">
        <div className="container">
          <span className="section-label">Services</span>
          <h1 className="inner-title">Explore HomeGenie services designed for speed and trust.</h1>
          <p className="inner-copy">
            Browse our most-requested home services, compare categories, and choose the support
            that fits your home needs best.
          </p>
        </div>
      </section>

      <section className="inner-section">
        <div className="container">
          <div className="services-grid services-grid--page">
            {services.map((service) => (
              <article className="service-card" key={service.id}>
                <img src={service.image} alt={service.name} />
                <div className="service-card-body">
                  <span className="service-tag">{service.category}</span>
                  <div className="service-topline">
                    <span className="service-rating">
                      <i className="bi bi-star-fill"></i>
                      {service.rating}
                    </span>
                    <span className="service-price">From Rs. {service.price}</span>
                  </div>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <p className="service-extra">Typical duration: {service.duration}</p>
                  <div className="service-actions">
                    <Link to="/contact" className="btn-book text-decoration-none text-center">
                      Book now
                    </Link>
                    <span className="service-link-text">{service.details}</span>
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
