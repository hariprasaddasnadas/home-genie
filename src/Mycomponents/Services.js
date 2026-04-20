import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { services } from '../data';
import ServiceConfigModal from './ServiceConfigModal';

export default function Services({ currentPincode }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeService, setActiveService] = useState(null);
  const selectedService = searchParams.get('service') || '';
  const selectedSearch = searchParams.get('search') || '';
  const selectedPincode = searchParams.get('pincode') || currentPincode || '';

  const visibleServices = services.filter((service) => {
    const matchesService = selectedService ? service.slug === selectedService : true;
    const matchesSearch = selectedSearch
      ? service.name.toLowerCase().includes(selectedSearch.toLowerCase()) ||
      service.description.toLowerCase().includes(selectedSearch.toLowerCase()) ||
      service.keywords?.some((keyword) =>
        keyword.toLowerCase().includes(selectedSearch.toLowerCase())
      )
      : true;
    const matchesPincode = selectedPincode
      ? service.availablePincodes.includes(selectedPincode)
      : true;

    return matchesService && matchesSearch && matchesPincode;
  });

  return (
    <main className="inner-page">
      <section className="inner-hero">
        <div className="container">
          <span className="section-label">Services</span>
          <h1 className="inner-title">
            {selectedService ? 'Service available for your selected area.' : 'Explore HomeGenie services designed for speed and trust.'}
          </h1>
          <p className="inner-copy">
            {selectedPincode
              ? `Showing services available in pincode ${selectedPincode}.`
              : 'Browse our most-requested home services, compare categories, and choose the support that fits your home needs best.'}
          </p>
        </div>
      </section>

      <section className="inner-section">
        <div className="container">
          {selectedPincode && (
            <div className="service-filter-note mb-4">
              <strong>Area filter:</strong> {selectedPincode}
            </div>
          )}

          {visibleServices.length === 0 ? (
            <div className="content-card">
              <h2 className="content-title">No services found for this area.</h2>
              <p className="content-copy mb-0">
                Try another pincode or remove the selected service filter to see more options.
              </p>
            </div>
          ) : (
            <div className="services-grid services-grid--page">
              {visibleServices.map((service) => (
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
                      <button
                        type="button" 
                        onClick={() => { setActiveService(service); setIsModalOpen(true); }} 
                        className="btn-book text-center w-100 border-0"
                        style={{ background: '#6a38c2', color: '#fff', padding: '10px', borderRadius: '8px', fontWeight: 'bold' }}
                      >
                        Book now
                      </button>
                      {/* <span className="service-link-text">{service.details}</span> */}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      {isModalOpen && (
        <ServiceConfigModal
          service={activeService}
          onClose={() => setIsModalOpen(false)}
          actionText="Checkout"
          onAction={(answers) => {
            setIsModalOpen(false);
            navigate('/checkout', { state: { service: activeService, configOptions: answers } });
          }}
        />
      )}
    </main>
  );
}
