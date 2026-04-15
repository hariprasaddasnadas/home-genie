import React, { useState } from 'react';

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
  const [profile] = useState(initialProfile);
  const [services, setServices] = useState(initialServices);
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
        </div>
      </section>
    </main>
  );
}
