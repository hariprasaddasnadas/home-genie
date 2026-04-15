import React from 'react';

const faqItems = [
  {
    question: 'How do I book a service with HomeGenie?',
    answer:
      'Search for the service you need, choose your location, and submit a request. We then match you with an available professional.',
  },
  {
    question: 'Can I request urgent help for emergencies?',
    answer:
      'Yes. Emergency mode is designed for urgent categories like plumbing, electrician support, AC breakdowns, and similar priority needs.',
  },
  {
    question: 'How do provider ratings work?',
    answer:
      'We aim to highlight provider quality through ratings based on workmanship, punctuality, communication, and service consistency.',
  },
  {
    question: 'Can I become a HomeGenie partner?',
    answer:
      'Yes. Service professionals can apply through the partner page and our onboarding team will review their profile and category fit.',
  },
];

export default function FAQ() {
  return (
    <main className="inner-page">
      <section className="inner-hero">
        <div className="container">
          <span className="section-label">FAQ</span>
          <h1 className="inner-title">Answers to common customer and partner questions.</h1>
          <p className="inner-copy">
            These quick answers help explain how HomeGenie bookings, support, and partner
            onboarding are intended to work.
          </p>
        </div>
      </section>

      <section className="inner-section">
        <div className="container">
          <div className="faq-stack">
            {faqItems.map((item) => (
              <article className="faq-card" key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
