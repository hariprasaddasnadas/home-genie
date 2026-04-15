import React, { useState, useEffect } from 'react';
import './App.css';
import './Mycomponents/Mobile.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Mycomponents/Header';
import PartnerRegistration from './Mycomponents/PartnerRegistration';
import Home from './Mycomponents/Home'; 
import Footer from './Mycomponents/Footer';
import Cart from './Mycomponents/Cart';
import Checkout from './Mycomponents/Checkout';
import About from './Mycomponents/About';
import Contact from './Mycomponents/Contact';
import FAQ from './Mycomponents/FAQ';
import Services from './Mycomponents/Services';
import EmergencyMode from './Mycomponents/EmergencyMode';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('hg-theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('hg-theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('hg-theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const addToCart = (service) => {
    const isAlreadyAdded = cartItems.some((item) => item.id === service.id);
    if (isAlreadyAdded) {
      showToast("You have already added this service in your cart!", "danger");
    } else {
      setCartItems((prevItems) => [...prevItems, service]);
      showToast("Item added to the cart", "success");
    }
  };

  const removeFromCart = (serviceId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== serviceId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <Router>
      <div className={`App ${isDarkMode ? 'dark-mode-active' : ''}`}>
        <Header cartCount={cartItems.length} addToCart={addToCart} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cartItems={cartItems} removeFromCart={removeFromCart} />} />
          <Route path="/checkout" element={<Checkout cartItems={cartItems} clearCart={clearCart} showToast={showToast} />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/emergency" element={<EmergencyMode addToCart={addToCart} />} />
          <Route path="/partner" element={<PartnerRegistration />} />
        </Routes>
        <Footer />
        
        {/* Toast Notification */}
        {toast.show && (
          <div className="position-fixed bottom-0 end-0 p-4" style={{ zIndex: 1050 }}>
            <div className={`toast show align-items-center text-bg-${toast.type} border-0 rounded-4 shadow-lg`} role="alert" aria-live="assertive" aria-atomic="true">
              <div className="d-flex">
                <div className="toast-body fw-semibold px-4 py-3">
                  <i className={`bi ${toast.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'} me-2`}></i>
                  {toast.message}
                </div>
                <button type="button" className="btn-close btn-close-white me-3 m-auto" onClick={() => setToast({ show: false, message: '', type: 'success' })} aria-label="Close"></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
