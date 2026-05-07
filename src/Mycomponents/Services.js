import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { services } from '../data';
import ServiceConfigModal from './ServiceConfigModal';

export default function Services({ currentPincode }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeService, setActiveService] = useState(null);
  const [partners, setPartners] = useState([]);
  const [partnersLoading, setPartnersLoading] = useState(false);
  const [activePartnerForm, setActivePartnerForm] = useState(null);
  const [bookingLoadingId, setBookingLoadingId] = useState(null);
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    issueDetails: '',
    preferredTime: '',
  });
  const [statusPhone, setStatusPhone] = useState('');
  const [statusResults, setStatusResults] = useState([]);
  const [statusLoading, setStatusLoading] = useState(false);
  const selectedService = searchParams.get('service') || '';
  const selectedSearch = searchParams.get('search') || '';
  const selectedPincode = searchParams.get('pincode') || currentPincode || '';
  const normalizedSearch = selectedSearch.toLowerCase().trim();

  const inferPartnerTypes = (text) => {
    const normalized = (text || '').toLowerCase();
    const typeMatchers = [
      { type: 'electrician', terms: ['electrician', 'eletrician', 'electrcian', 'electrical', 'wiring', 'switch', 'light', 'fan'] },
      { type: 'plumber', terms: ['plumber', 'plumbing', 'pipe', 'leak', 'tap', 'drain'] },
      { type: 'cleaning', terms: ['cleaning', 'sanitize', 'sanitization', 'disinfect', 'housekeeping'] },
      { type: 'appliance_repair', terms: ['ac', 'appliance', 'repair', 'service', 'servicing'] },
      { type: 'carpenter', terms: ['carpenter', 'carpentry', 'wood', 'furniture'] },
    ];

    return typeMatchers
      .filter(({ terms }) => terms.some((term) => normalized.includes(term)))
      .map(({ type }) => type);
  };

  const selectedServiceData = selectedService
    ? services.find((service) => service.slug === selectedService)
    : null;

  const selectedServiceTypes = inferPartnerTypes(
    selectedServiceData
      ? `${selectedServiceData.name} ${selectedServiceData.description} ${(selectedServiceData.keywords || []).join(' ')}`
      : ''
  );
  const inferredSearchTypes = inferPartnerTypes(normalizedSearch);
  const activePartnerServiceType = inferredSearchTypes[0] || selectedServiceTypes[0] || '';
  const showAllElectricians = activePartnerServiceType === 'electrician';

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

  useEffect(() => {
    if (!selectedPincode && !activePartnerServiceType) {
      setPartners([]);
      return;
    }

    const fetchPartners = async () => {
      setPartnersLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedPincode && !showAllElectricians) {
          params.set('pincode', selectedPincode);
        }
        if (activePartnerServiceType) {
          params.set('service_type', activePartnerServiceType);
        }
        const response = await fetch(`http://127.0.0.1:8000/api/partners/?${params.toString()}`);
        const data = await response.json();
        if (response.ok) {
          setPartners(data.results || []);
        } else {
          setPartners([]);
        }
      } catch (error) {
        setPartners([]);
      } finally {
        setPartnersLoading(false);
      }
    };

    fetchPartners();
  }, [selectedPincode, activePartnerServiceType, showAllElectricians]);

  const filteredPartners = partners.filter((partner) => {
    const partnerType = (partner.service_type || '').toLowerCase();
    const partnerTypeLabel = (partner.service_type_display || '').toLowerCase();
    const partnerBlob = `${partnerType} ${partnerTypeLabel}`;

    const searchTypes = inferPartnerTypes(normalizedSearch);
    const matchesSearch = normalizedSearch
      ? searchTypes.length > 0
        ? searchTypes.includes(partnerType)
        : partnerBlob.includes(normalizedSearch)
      : true;

    const matchesSelectedService = selectedService
      ? selectedServiceTypes.length > 0
        ? selectedServiceTypes.includes(partnerType)
        : true
      : true;

    return matchesSearch && matchesSelectedService;
  });
  const shouldHideCatalogServices = Boolean(activePartnerServiceType && filteredPartners.length > 0);

  const handleBookingChange = (event) => {
    const { name, value } = event.target;
    setBookingForm((current) => ({
      ...current,
      [name]: name === 'customerPhone' ? value.replace(/\D/g, '') : value,
    }));
  };

  const submitPartnerBooking = async (event, partnerId) => {
    event.preventDefault();
    setBookingMessage('');
    setBookingLoadingId(partnerId);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/partner/book/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partner_id: partnerId,
          customer_name: bookingForm.customerName,
          customer_phone: bookingForm.customerPhone,
          customer_address: bookingForm.customerAddress,
          issue_details: bookingForm.issueDetails,
          preferred_time: bookingForm.preferredTime,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setBookingMessage(data.detail || Object.values(data)[0]?.[0] || 'Could not submit request.');
        return;
      }
      setBookingMessage('Request sent successfully. Partner will contact you soon.');
      setBookingForm({
        customerName: '',
        customerPhone: '',
        customerAddress: '',
        issueDetails: '',
        preferredTime: '',
      });
      setActivePartnerForm(null);
    } catch (error) {
      setBookingMessage('Backend not reachable. Please try again.');
    } finally {
      setBookingLoadingId(null);
    }
  };

  const checkBookingStatus = async (event) => {
    event.preventDefault();
    setStatusLoading(true);
    setStatusResults([]);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/customer/booking-status/?phone=${statusPhone}`);
      const data = await response.json();
      if (!response.ok) {
        setBookingMessage(data.detail || 'Could not fetch booking status.');
        return;
      }
      setStatusResults(data.results || []);
    } catch (error) {
      setBookingMessage('Could not fetch booking status.');
    } finally {
      setStatusLoading(false);
    }
  };

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

          {(selectedPincode || activePartnerServiceType) && (
            <div className="content-card mb-4">
              <h2 className="content-title mb-2">
                {activePartnerServiceType
                  ? `Available ${activePartnerServiceType.replace('_', ' ')} partners${selectedPincode && !showAllElectricians ? ` in ${selectedPincode}` : ''}`
                  : `Available Partners In ${selectedPincode}`}
              </h2>
              {partnersLoading ? (
                <p className="content-copy mb-0">Loading partners...</p>
              ) : filteredPartners.length === 0 ? (
                <p className="content-copy mb-0">
                  {selectedSearch || selectedService
                    ? 'No matching partners found for this service in the selected pincode yet.'
                    : 'No partner profiles found for this pincode yet.'}
                </p>
              ) : (
                <div className="services-grid services-grid--page mt-3">
                  {filteredPartners.map((partner) => (
                    <article className="service-card" key={partner.id}>
                      <div className="service-card-body">
                        <span className="service-tag">Verified partner</span>
                        <div className="service-topline">
                          <span className="service-rating">
                            <i className="bi bi-briefcase-fill"></i>
                            {partner.service_type_display}
                          </span>
                          <span className="service-price">{partner.experience_years}+ yrs</span>
                        </div>
                        <h3>{partner.full_name}</h3>
                        <p>
                          Service area: {partner.pincode}
                          {partner.city ? `, ${partner.city}` : ''}
                        </p>
                        <p className="service-extra">Phone: +91 {partner.phone}</p>
                        <div className="service-actions">
                          <button
                            type="button"
                            className="btn-book text-center w-100 border-0"
                            style={{ background: '#14213d', color: '#fff', padding: '10px', borderRadius: '8px', fontWeight: 'bold' }}
                            onClick={() => {
                              setBookingMessage('');
                              setActivePartnerForm(activePartnerForm === partner.id ? null : partner.id);
                            }}
                          >
                            {activePartnerForm === partner.id ? 'Close request form' : 'Request this partner'}
                          </button>
                        </div>
                        {activePartnerForm === partner.id && (
                          <form className="mt-3" onSubmit={(event) => submitPartnerBooking(event, partner.id)}>
                            <input
                              type="text"
                              name="customerName"
                              className="form-control mb-2"
                              placeholder="Your name"
                              value={bookingForm.customerName}
                              onChange={handleBookingChange}
                              required
                            />
                            <input
                              type="text"
                              name="customerPhone"
                              className="form-control mb-2"
                              placeholder="Your phone"
                              maxLength="10"
                              value={bookingForm.customerPhone}
                              onChange={handleBookingChange}
                              required
                            />
                            <input
                              type="text"
                              name="customerAddress"
                              className="form-control mb-2"
                              placeholder="Service address"
                              value={bookingForm.customerAddress}
                              onChange={handleBookingChange}
                              required
                            />
                            <textarea
                              name="issueDetails"
                              className="form-control mb-2"
                              placeholder="What service do you need?"
                              value={bookingForm.issueDetails}
                              onChange={handleBookingChange}
                              rows={3}
                            />
                            <input
                              type="text"
                              name="preferredTime"
                              className="form-control mb-2"
                              placeholder="Preferred time (e.g. Today 6 PM)"
                              value={bookingForm.preferredTime}
                              onChange={handleBookingChange}
                              required
                            />
                            <button
                              type="submit"
                              className="btn-book text-center w-100 border-0"
                              style={{ background: '#6a38c2', color: '#fff', padding: '10px', borderRadius: '8px', fontWeight: 'bold' }}
                              disabled={bookingLoadingId === partner.id}
                            >
                              {bookingLoadingId === partner.id ? 'Sending request...' : 'Send request'}
                            </button>
                          </form>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
              {bookingMessage && (
                <p className="content-copy mt-3 mb-0">{bookingMessage}</p>
              )}
            </div>
          )}

          <div className="content-card mb-4">
            <h2 className="content-title mb-2">Track your partner request</h2>
            <form onSubmit={checkBookingStatus}>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Enter your phone number"
                maxLength="10"
                value={statusPhone}
                onChange={(event) => setStatusPhone(event.target.value.replace(/\D/g, ''))}
                required
              />
              <button type="submit" className="btn-book text-center w-100 border-0" style={{ background: '#14213d', color: '#fff', padding: '10px', borderRadius: '8px', fontWeight: 'bold' }}>
                {statusLoading ? 'Checking...' : 'Check status'}
              </button>
            </form>
            {statusResults.length > 0 && (
              <div className="services-grid services-grid--page mt-3">
                {statusResults.map((item) => (
                  <article className="service-card" key={item.id}>
                    <div className="service-card-body">
                      <span className="service-tag">Request #{item.id}</span>
                      <h3>{item.service_type} - {item.partner_name}</h3>
                      <p className="mb-1"><strong>Status:</strong> {item.status}</p>
                      <p className="mb-1"><strong>Preferred time:</strong> {item.preferred_time || 'Not provided'}</p>
                      <p className="mb-1"><strong>Partner phone:</strong> +91 {item.partner_phone}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {!shouldHideCatalogServices && visibleServices.length === 0 ? (
            <div className="content-card">
              <h2 className="content-title">No services found for this area.</h2>
              <p className="content-copy mb-0">
                Try another pincode or remove the selected service filter to see more options.
              </p>
            </div>
          ) : !shouldHideCatalogServices ? (
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
          ) : (
            <div className="service-filter-note">
              Showing matched partners only for your service search.
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
