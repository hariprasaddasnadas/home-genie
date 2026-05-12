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
import UserLogin from './Mycomponents/UserLogin';
import UserSignup from './Mycomponents/UserSignup';
import PartnerDashboard from './Mycomponents/PartnerDashboard';
import PartnerLogin from './Mycomponents/PartnerLogin';
import MyBookings from './Mycomponents/MyBookings';
import ProtectedRoute from './Mycomponents/ProtectedRoute';
import { fetchJson } from './api';

function App() {
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [currentPincode, setCurrentPincode] = useState('');
  const [acceptedRequests, setAcceptedRequests] = useState([]);
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

  useEffect(() => {
    const fetchAccepted = async () => {
      const phone = localStorage.getItem('hg_last_phone');
      if (!phone) return;
      try {
        const { response, data } = await fetchJson(`/api/customer/booking-status/?phone=${phone}`);
        if (response.ok && data.results) {
          const accepted = data.results.filter(r => r.status === 'accepted').map(r => ({
            id: r.id,
            request_id: r.id,
            name: r.service_name || r.service_type,
            price: r.service_price || 299,
            description: `Partner: ${r.partner_name} (${r.partner_phone})`,
            image: 'https://images.pexels.com/photos/6474475/pexels-photo-6474475.jpeg?auto=compress&cs=tinysrgb&w=200'
          }));
          setAcceptedRequests(accepted);
        }
      } catch (e) {}
    };
    fetchAccepted();
    const interval = setInterval(fetchAccepted, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const removeFromCart = (requestId) => {
    setAcceptedRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  return (
    <Router>
      <div className={`App ${isDarkMode ? 'dark-mode-active' : ''}`}>
        <Header
          cartCount={acceptedRequests.length}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          currentPincode={currentPincode}
          setCurrentPincode={setCurrentPincode}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                currentPincode={currentPincode}
                setCurrentPincode={setCurrentPincode}
              />
            }
          />
          <Route path="/cart" element={<Cart cartItems={acceptedRequests} removeFromCart={removeFromCart} />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute allow="user" redirectTo="/login">
                <Checkout cartItems={acceptedRequests} clearCart={() => setAcceptedRequests([])} showToast={showToast} />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services currentPincode={currentPincode} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route
            path="/emergency"
            element={<EmergencyMode currentPincode={currentPincode} />}
          />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route
            path="/my-bookings"
            element={(
              <ProtectedRoute allow="user" redirectTo="/login">
                <MyBookings />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/partner/dashboard"
            element={(
              <ProtectedRoute allow="partner" redirectTo="/partner/login">
                <PartnerDashboard />
              </ProtectedRoute>
            )}
          />
          <Route path="/partner/login" element={<PartnerLogin />} />
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
