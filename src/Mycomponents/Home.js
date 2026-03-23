import React from 'react';

export default function Home() {
  const services = [
    { id: 1, name: "AC Deep Cleaning", price: "599", rating: "4.8", img: "https://images.pexels.com/photos/9242831/pexels-photo-9242831.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: 2, name: "Home Sanitization", price: "1499", rating: "4.9", img: "https://images.pexels.com/photos/4099467/pexels-photo-4099467.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: 3, name: "Salon at Home", price: "899", rating: "4.7", img: "https://images.pexels.com/photos/3993311/pexels-photo-3993311.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: 4, name: "Expert Electrician", price: "149", rating: "4.8", img: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400" },
  ];

  return (
    <div>
      {/* HERO SECTION */}
      <section className="hero-gradient">
        <div className="container">
          <div className="row align-items-center">
            {/* Left Content */}
            <div className="col-lg-6 py-5">
              <h1 className="display-3 fw-bold mb-4">Your Wish,<br/>Our Command.</h1>
              <p className="lead mb-5 opacity-75">Verified experts for every home need.</p>
              
              <div className="bg-white rounded-pill p-2 d-flex shadow-lg" style={{ maxWidth: '500px' }}>
                <input type="text" className="form-control border-0 shadow-none px-4 text-dark" placeholder="What service do you need?" />
                <button className="btn btn-dark rounded-pill px-4">Search</button>
              </div>
            </div>
            
            {/* Right Image */}
            <div className="col-lg-6 d-none d-lg-block hero-image-container">
              <img src="https://images.pexels.com/photos/6195129/pexels-photo-6195129.jpeg?auto=compress&cs=tinysrgb&w=600" 
                   className="img-fluid" alt="Genie" />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE TILES SECTION */}
      <div className="container py-5 mt-5">
        <h2 className="fw-bold mb-5 text-center">Trending Services</h2>
        <div className="row g-4">
          {services.map((s) => (
            <div className="col-lg-3 col-md-6" key={s.id}>
              <div className="service-tile p-3 h-100">
                <div className="service-img-wrapper mb-3">
                  <img src={s.img} alt={s.name} />
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="small text-muted">⭐ {s.rating}</span>
                  <span className="fw-bold text-purple">₹{s.price}</span>
                </div>
                <h6 className="fw-bold mb-3">{s.name}</h6>
                <button className="btn btn-book w-100">Book Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}