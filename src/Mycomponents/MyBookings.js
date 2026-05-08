import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authHeaders, fetchJson, getAuthState } from '../api';

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const authState = getAuthState();

  useEffect(() => {
    if (authState.role !== 'user' || !authState.token) {
      navigate('/login', { state: { from: '/my-bookings' } });
      return;
    }

    const loadBookings = async () => {
      setIsLoading(true);
      setError('');
      try {
        const { response, data } = await fetchJson('/api/bookings/my/', {
          headers: authHeaders(),
        });
        if (!response.ok) {
          setError(data.detail || 'Could not load your bookings.');
          return;
        }
        setBookings(data.results || []);
      } catch (loadError) {
        setError('Could not load your bookings.');
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, [authState.role, authState.token, navigate]);

  return (
    <main className="inner-page">
      <section className="inner-hero">
        <div className="container">
          <span className="section-label">My bookings</span>
          <h1 className="inner-title">Track every confirmed service in one place.</h1>
          <p className="inner-copy">
            Review your latest confirmed bookings, saved address details, and service status updates.
          </p>
        </div>
      </section>

      <section className="inner-section">
        <div className="container">
          {isLoading ? (
            <div className="content-card">
              <p className="content-copy mb-0">Loading your bookings...</p>
            </div>
          ) : error ? (
            <div className="content-card">
              <p className="content-copy text-danger mb-3">{error}</p>
              <Link to="/services" className="btn-book text-decoration-none px-4 py-2 d-inline-block" style={{ width: 'auto' }}>
                Explore services
              </Link>
            </div>
          ) : bookings.length === 0 ? (
            <div className="content-card">
              <h2 className="content-title">No bookings yet</h2>
              <p className="content-copy mb-3">
                You have not confirmed any services yet. Start with a service and finish checkout to see bookings here.
              </p>
              <Link to="/services" className="btn-book text-decoration-none px-4 py-2 d-inline-block" style={{ width: 'auto' }}>
                Browse services
              </Link>
            </div>
          ) : (
            <div className="services-grid services-grid--page">
              {bookings.map((booking) => (
                <article className="service-card" key={booking.id}>
                  {booking.service_image ? (
                    <img src={booking.service_image} alt={booking.service_name} />
                  ) : null}
                  <div className="service-card-body">
                    <span className="service-tag">Booking #{booking.id}</span>
                    <div className="service-topline">
                      <span className="service-rating">
                        <i className="bi bi-bag-check-fill"></i>
                        {booking.service_category || 'Home service'}
                      </span>
                      <span className="service-price">Rs. {booking.configured_price}</span>
                    </div>
                    <h3>{booking.service_name}</h3>
                    <p className="mb-1"><strong>Status:</strong> {booking.status}</p>
                    <p className="mb-1"><strong>Payment status:</strong> {booking.payment_state}</p>
                    <p className="mb-1"><strong>Payment:</strong> {booking.payment_method === 'online' ? 'Online payment' : 'Cash on delivery'}</p>
                    <p className="mb-1"><strong>Address:</strong> {booking.street}, {booking.city} - {booking.pincode}</p>
                    <p className="service-extra mb-0">
                      Confirmed on: {new Date(booking.created_at).toLocaleString()}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
