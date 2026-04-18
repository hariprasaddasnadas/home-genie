import React, { useState, useEffect } from 'react';

export default function ServiceConfigModal({ service, onClose, onAction, actionText = "Checkout" }) {
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (service?.questions) {
      const initial = {};
      service.questions.forEach(q => {
        initial[q.id] = q.default;
      });
      setAnswers(initial);
    }
  }, [service]);

  if (!service) return null;

  const handleSelect = (qId, val) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const calculatePrice = () => {
    let basePrice = parseInt(service.price, 10) || 0;
    let multiplier = 1;
    let extraCost = 0;

    if (service.questions) {
      service.questions.forEach(q => {
        const val = answers[q.id];
        if (val === undefined) return;

        if (q.type === 'number' && q.isMultiplier) {
          multiplier = Math.max(1, parseInt(val, 10) || 1);
        } else if (q.type === 'select' && q.options) {
          const opt = q.options.find(o => (typeof o === 'string' ? o === val : o.label === val));
          if (opt && typeof opt !== 'string' && opt.extra) {
            extraCost += opt.extra;
          }
        }
      });
    }

    return (basePrice + extraCost) * multiplier;
  };

  const handleComplete = () => {
    onAction({ ...answers, finalPrice: calculatePrice() });
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
    }}>
      <div className="modal-content" style={{
        backgroundColor: '#fff', borderRadius: '16px', padding: '24px',
        width: '90%', maxWidth: '420px', position: 'relative', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        animation: 'modalSlideIn 0.3s ease-out forwards'
      }}>
        <style>
          {`
            @keyframes modalSlideIn {
              from { transform: translateY(20px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}
        </style>
        
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent',
          fontSize: '28px', lineHeight: '20px', cursor: 'pointer', color: '#999',
          padding: '4px', transition: 'color 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.color = '#333'}
        onMouseOut={(e) => e.currentTarget.style.color = '#999'}
        >
          &times;
        </button>
        
        <h3 style={{ marginTop: 0, marginBottom: '8px', color: '#222', fontSize: '1.5rem', fontWeight: 'bold' }}>
          {service.name}
        </h3>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>
          Please provide a few details to continue with your booking.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
          {service.questions && service.questions.map(q => (
            <div key={q.id}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#444', fontSize: '0.95rem' }}>
                {q.label}
              </label>
              {q.type === 'select' ? (
                <select 
                  value={answers[q.id] || ''} 
                  onChange={(e) => handleSelect(q.id, e.target.value)}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd',
                    fontSize: '15px', outline: 'none', transition: 'border-color 0.2s',
                    backgroundColor: '#fafafa', cursor: 'pointer'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6a38c2'}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                >
                  {q.options.map(opt => {
                    const label = typeof opt === 'string' ? opt : opt.label;
                    return <option key={label} value={label}>{label}</option>
                  })}
                </select>
              ) : q.type === 'number' ? (
                <input 
                  type="number" 
                  min={q.min} max={q.max} 
                  value={answers[q.id] || ''} 
                  onChange={(e) => handleSelect(q.id, e.target.value)}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd',
                    fontSize: '15px', outline: 'none', transition: 'border-color 0.2s',
                    backgroundColor: '#fafafa'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6a38c2'}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
              ) : null}
            </div>
          ))}
          {(!service.questions || service.questions.length === 0) && (
            <p style={{ color: '#888', fontSize: '0.9rem', fontStyle: 'italic' }}>
              No extra details needed for this service.
            </p>
          )}
        </div>
        
        <button onClick={handleComplete} style={{
          width: '100%', padding: '14px', borderRadius: '8px', backgroundColor: '#6a38c2',
          color: '#fff', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
          transition: 'background-color 0.2s', boxShadow: '0 4px 12px rgba(106, 56, 194, 0.3)'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#582bba'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6a38c2'}
        >
          {actionText === 'Checkout' ? (
            <>Checkout - Rs. {calculatePrice()} <i className="bi bi-arrow-right ms-2" style={{ fontSize: '0.9em' }}></i></>
          ) : (
            <>Add to Cart - Rs. {calculatePrice()} <i className="bi bi-cart-plus ms-2" style={{ fontSize: '0.9em' }}></i></>
          )}
        </button>
      </div>
    </div>
  );
}
