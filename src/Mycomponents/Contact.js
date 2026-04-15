import React from 'react';

const contactMethods = [
  {
    icon: 'bi-telephone',
    title: 'Call us',
    detail: '+91 98765 43210',
    note: 'Available for service questions and booking support.',
  },
  {
    icon: 'bi-envelope',
    title: 'Email support',
    detail: 'support@homegenie.in',
    note: 'Best for detailed queries, business inquiries, and follow-ups.',
  },
  {
    icon: 'bi-geo-alt',
    title: 'Office location',
    detail: 'Bengaluru, India',
    note: 'Serving modern households with reliable doorstep professionals.',
  },
];

export default function Contact() {
  return (
    <main className="inner-page">
      <section className="inner-hero">
        <div className="container">
          <span className="section-label">Contact Us</span>
          <h1 className="inner-title">Get in touch with the HomeGenie team.</h1>
          <p className="inner-copy">
            Reach out for booking support, provider inquiries, partner onboarding, or general
            assistance. We are here to help customers and service professionals move faster.
          </p>
        </div>
      </section>

      <section className="inner-section">
        <div className="container">
          <div className="contact-layout">
            <div className="content-card">
              <h2 className="content-title">How can we help?</h2>
              <p className="content-copy">
                If you have a service issue, need booking support, or want to join as a provider,
                contact the team through any of the options below.
              </p>
              <div className="info-cards-grid mt-4">
                {contactMethods.map((item) => (
                  <article className="info-card" key={item.title}>
                    <span className="icon-wrap">
                      <i className={`bi ${item.icon}`}></i>
                    </span>
                    <h3>{item.title}</h3>
                    <p className="contact-detail">{item.detail}</p>
                    <p>{item.note}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="content-card">
              <h2 className="content-title">Support hours</h2>
              <ul className="simple-list">
                <li>Monday to Saturday: 8:00 AM to 9:00 PM</li>
                <li>Sunday: 9:00 AM to 6:00 PM</li>
                <li>Emergency booking categories: extended availability</li>
              </ul>

              <div className="info-panel mt-4">
                <h3>Need faster help?</h3>
                <p className="mb-0">
                  For urgent service issues, use the emergency mode booking flow or call support
                  directly so we can prioritize the request.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
