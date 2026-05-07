import React, { useEffect, useState } from 'react';

const initialProfile = {
  partnerName: 'Rahul Services Hub',
  ownerName: 'Rahul Sharma',
  email: 'rahul.partner@example.com',
  phone: '+91 9876543210',
  category: 'AC Repair & Electrical',
  pincode: '560001',
};

const initialServices = [
  {
    id: 1,
    title: 'Split AC Installation',
    image:
      'https://images.pexels.com/photos/5691624/pexels-photo-5691624.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: '799',
    description: 'Professional AC installation with wall mount setup, wiring check, and clean finish.',
  },
];

export default function PartnerDashboard() {
  const getProfileFromStorage = () => {
    try {
      const stored = localStorage.getItem('partnerAuth');
      if (!stored) return initialProfile;
      const parsed = JSON.parse(stored);
      const partner = parsed?.partner_profile;
      const user = parsed?.user;
      if (!partner || !user) return initialProfile;

      return {
        partnerName: partner.full_name || initialProfile.partnerName,
        ownerName: partner.full_name || initialProfile.ownerName,
        email: user.email || initialProfile.email,
        phone: partner.phone ? `+91 ${partner.phone}` : initialProfile.phone,
        category: partner.service_type || initialProfile.category,
        pincode: partner.pincode || initialProfile.pincode,
      };
    } catch (error) {
      return initialProfile;
    }
  };

  const [profile] = useState(getProfileFromStorage);
  const [services, setServices] = useState(initialServices);
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState('');
  const [requestActionLoadingId, setRequestActionLoadingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    price: '',
    description: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: name === 'price' ? value.replace(/[^\d]/g, '') : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newService = {
      id: Date.now(),
      title: formData.title,
      image: formData.image,
      price: formData.price,
      description: formData.description,
    };

    setServices((current) => [newService, ...current]);
    setFormData({
      title: '',
      image: '',
      price: '',
      description: '',
    });
  };

  const fetchPartnerRequests = async () => {
      try {
        const stored = localStorage.getItem('partnerAuth');
        if (!stored) return;
        const parsed = JSON.parse(stored);
        const email = parsed?.user?.email;
        if (!email) return;

        setRequestsLoading(true);
        setRequestsError('');
        const response = await fetch(`http://127.0.0.1:8000/api/partner/requests/?email=${encodeURIComponent(email)}`);
        const data = await response.json();
        if (!response.ok) {
          setRequestsError(data.detail || 'Could not load customer requests.');
          return;
        }
        setRequests(data.results || []);
      } catch (error) {
        setRequestsError('Could not load customer requests.');
      } finally {
        setRequestsLoading(false);
      }
    };

  useEffect(() => {
    fetchPartnerRequests();
  }, []);

  const updateRequestStatus = async (requestId, action) => {
    setRequestActionLoadingId(requestId);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/partner/request-action/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: requestId, action }),
      });
      const data = await response.json();
      if (!response.ok) {
        setRequestsError(data.detail || 'Could not update request status.');
        return;
      }
      await fetchPartnerRequests();
    } catch (error) {
      setRequestsError('Could not update request status.');
    } finally {
      setRequestActionLoadingId(null);
    }
  };

  return (
    <main className="partner-dashboard-page">
      <section className="partner-dashboard-section">
        <div className="container">
          <div className="partner-dashboard-hero">
            <div>
              <span className="section-label">Partner workspace</span>
              <h1 className="partner-dashboard-title">Manage your partner account and publish your services.</h1>
              <p className="partner-dashboard-copy">
                Review your account details, keep your business information updated, and add new
                service listings with price, image, and a strong description for customers.
              </p>
            </div>

            <div className="partner-dashboard-status">
              <span className="partner-status-badge">
                <i className="bi bi-patch-check-fill"></i>
                Verified partner
              </span>
              <span className="partner-status-text">Active in {profile.pincode}</span>
            </div>
          </div>

          <div className="partner-dashboard-layout">
            <section className="partner-account-card">
              <h2 className="content-title mb-3">Account details</h2>
              <div className="partner-account-grid">
                <div className="partner-account-item">
                  <span>Shop / brand</span>
                  <strong>{profile.partnerName}</strong>
                </div>
                <div className="partner-account-item">
                  <span>Owner name</span>
                  <strong>{profile.ownerName}</strong>
                </div>
                <div className="partner-account-item">
                  <span>Email</span>
                  <strong>{profile.email}</strong>
                </div>
                <div className="partner-account-item">
                  <span>Phone</span>
                  <strong>{profile.phone}</strong>
                </div>
                <div className="partner-account-item">
                  <span>Category</span>
                  <strong>{profile.category}</strong>
                </div>
                <div className="partner-account-item">
                  <span>Base pincode</span>
                  <strong>{profile.pincode}</strong>
                </div>
              </div>
            </section>

            <section className="partner-service-form-card">
              <span className="partner-kicker">
                <i className="bi bi-cloud-arrow-up-fill"></i>
                Share your service
              </span>
              <h2 className="content-title mb-2">Add a new service</h2>
              <p className="content-copy mb-4">
                Fill in your service details so customers can see what you offer.
              </p>

              <form className="partner-form" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small" htmlFor="serviceTitle">
                    Service name
                  </label>
                  <input
                    id="serviceTitle"
                    type="text"
                    className="form-control"
                    name="title"
                    placeholder="AC servicing, deep cleaning, wiring fix..."
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small" htmlFor="serviceImage">
                    Service image URL
                  </label>
                  <input
                    id="serviceImage"
                    type="url"
                    className="form-control"
                    name="image"
                    placeholder="Paste image URL"
                    value={formData.image}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small" htmlFor="servicePrice">
                    Price
                  </label>
                  <input
                    id="servicePrice"
                    type="text"
                    className="form-control"
                    name="price"
                    placeholder="Enter service price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small" htmlFor="serviceDescription">
                    Work description
                  </label>
                  <textarea
                    id="serviceDescription"
                    className="form-control partner-service-textarea"
                    name="description"
                    placeholder="Describe the work you provide, what is included, and why customers should book it."
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="partner-submit">
                  Publish service
                </button>
              </form>
            </section>
          </div>

          <section className="partner-listings-section">
            <div className="d-flex flex-column flex-lg-row align-items-lg-end justify-content-between gap-3 mb-4">
              <div>
                <span className="section-label">Published services</span>
                <h2 className="content-title mb-2">Your active service listings</h2>
                <p className="content-copy mb-0">
                  These are the services currently visible in your partner workspace.
                </p>
              </div>
              <div className="partner-service-count">
                <i className="bi bi-grid-1x2-fill"></i>
                {services.length} service{services.length > 1 ? 's' : ''}
              </div>
            </div>

            <div className="services-grid services-grid--page">
              {services.map((service) => (
                <article className="service-card" key={service.id}>
                  <img src={service.image} alt={service.title} />
                  <div className="service-card-body">
                    <span className="service-tag">Partner listing</span>
                    <div className="service-topline">
                      <span className="service-rating">
                        <i className="bi bi-person-workspace"></i>
                        {profile.category}
                      </span>
                      <span className="service-price">Rs. {service.price}</span>
                    </div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="partner-listings-section mt-4">
            <div className="d-flex flex-column flex-lg-row align-items-lg-end justify-content-between gap-3 mb-4">
              <div>
                <span className="section-label">Customer requests</span>
                <h2 className="content-title mb-2">Incoming service requests</h2>
                <p className="content-copy mb-0">Customers who selected your profile will appear here.</p>
              </div>
              <div className="partner-service-count">
                <i className="bi bi-telephone-inbound-fill"></i>
                {requests.length} request{requests.length > 1 ? 's' : ''}
              </div>
            </div>

            {requestsLoading ? (
              <p className="content-copy mb-0">Loading customer requests...</p>
            ) : requestsError ? (
              <p className="content-copy mb-0 text-danger">{requestsError}</p>
            ) : requests.length === 0 ? (
              <p className="content-copy mb-0">No requests yet. They will appear here when customers contact you.</p>
            ) : (
              <div className="services-grid services-grid--page">
                {requests.map((request) => (
                  <article className="service-card" key={request.id}>
                    <div className="service-card-body">
                      <span className="service-tag">Status: {request.status || 'pending'}</span>
                      <h3>{request.customer_name}</h3>
                      <p className="mb-1"><strong>Phone:</strong> +91 {request.customer_phone}</p>
                      <p className="mb-1"><strong>Address:</strong> {request.customer_address}</p>
                      <p className="mb-1"><strong>Issue:</strong> {request.issue_details || 'Not provided'}</p>
                      <p className="mb-2"><strong>Preferred time:</strong> {request.preferred_time || 'Not provided'}</p>
                      {request.status === 'pending' && (
                        <div className="d-flex gap-2 mb-2">
                          <button
                            type="button"
                            className="btn-book text-center border-0"
                            style={{ background: '#198754', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold' }}
                            disabled={requestActionLoadingId === request.id}
                            onClick={() => updateRequestStatus(request.id, 'accept')}
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            className="btn-book text-center border-0"
                            style={{ background: '#dc3545', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold' }}
                            disabled={requestActionLoadingId === request.id}
                            onClick={() => updateRequestStatus(request.id, 'decline')}
                          >
                            Decline
                          </button>
                        </div>
                      )}
                      <p className="service-extra mb-0">
                        Requested on: {new Date(request.created_at).toLocaleString()}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
