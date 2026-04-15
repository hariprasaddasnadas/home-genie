import React from 'react';

const values = [
  {
    icon: 'bi-stars',
    title: 'Verified professionals',
    description: 'We focus on trusted partners who show up prepared, respectful, and service-ready.',
  },
  {
    icon: 'bi-lightning-charge',
    title: 'Faster response',
    description: 'From everyday maintenance to urgent jobs, we aim to reduce waiting and confusion.',
  },
  {
    icon: 'bi-clipboard-data',
    title: 'Clear visibility',
    description: 'Customers should understand provider quality, service progress, and support options.',
  },
];

export default function About() {
  return (
    <main className="inner-page">
      <section className="inner-hero">
        <div className="container">
          <span className="section-label">About HomeGenie</span>
          <h1 className="inner-title">Home services built around trust, speed, and clarity.</h1>
          <p className="inner-copy">
            HomeGenie helps households book dependable service professionals for cleaning,
            electrical work, AC servicing, repairs, and more. We want the booking experience to
            feel as polished as the service itself.
          </p>
        </div>
      </section>

      <section className="inner-section">
        <div className="container">
          <div className="content-card">
            <div className="content-grid">
              <div>
                <h2 className="content-title">Why we are building this</h2>
                <p className="content-copy">
                  Many home-service platforms feel uncertain for customers. People often do not
                  know who is coming, when they will arrive, or whether the service quality will
                  match the promise. HomeGenie is designed to reduce that gap.
                </p>
                <p className="content-copy mb-0">
                  Our goal is simple: make booking home services more professional, more
                  transparent, and easier to trust.
                </p>
              </div>

              <div className="info-panel">
                <h3>What HomeGenie stands for</h3>
                <ul className="simple-list">
                  <li>Reliable doorstep service</li>
                  <li>Better provider visibility</li>
                  <li>Faster matching for urgent needs</li>
                  <li>Professional support throughout the booking</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="info-cards-grid mt-4">
            {values.map((value) => (
              <article className="info-card" key={value.title}>
                <span className="icon-wrap">
                  <i className={`bi ${value.icon}`}></i>
                </span>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
