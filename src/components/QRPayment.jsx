import { useState } from 'react'
import QRCode from 'react-qr-code'
import './QRPayment.css'

export const QRPayment = ({ account, onClose }) => {
  const [selectedService, setSelectedService] = useState(null)
  
  const services = [
    { name: 'Laundry', price: '10', icon: '👕' },
    { name: 'Printing', price: '5', icon: '🖨️' },
    { name: 'Food Court', price: '25', icon: '🍔' },
    { name: 'Library Access', price: '15', icon: '📚' },
    { name: 'Gym Day Pass', price: '20', icon: '💪' },
  ]

  const generatePaymentURL = (service) => {
    // This would be your dApp URL with payment parameters
    const baseURL = window.location.origin
    const paymentData = {
      to: account,
      service: service.name,
      amount: service.price,
      token: 'CPT'
    }
    
    return `${baseURL}?payment=${btoa(JSON.stringify(paymentData))}`
  }

  return (
    <div className="qr-payment-overlay">
      <div className="qr-payment-modal">
        <div className="qr-header">
          <h3>📱 Mobile Payment</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        {!selectedService ? (
          <div className="service-selector">
            <p>Select a service to generate QR code:</p>
            <div className="qr-services-grid">
              {services.map((service, index) => (
                <button
                  key={index}
                  className="qr-service-btn"
                  onClick={() => setSelectedService(service)}
                >
                  <span className="service-icon">{service.icon}</span>
                  <span className="service-name">{service.name}</span>
                  <span className="service-price">{service.price} CPT</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="qr-display">
            <div className="qr-info">
              <h4>{selectedService.icon} {selectedService.name}</h4>
              <p>Amount: {selectedService.price} CPT</p>
            </div>
            
            <div className="qr-code-container">
              <QRCode
                value={generatePaymentURL(selectedService)}
                size={200}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              />
            </div>
            
            <div className="qr-instructions">
              <p>📲 Scan this QR code with your mobile wallet</p>
              <p>🔗 Or share the payment link</p>
            </div>
            
            <div className="qr-actions">
              <button 
                className="back-btn" 
                onClick={() => setSelectedService(null)}
              >
                ← Back to Services
              </button>
              <button 
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(generatePaymentURL(selectedService))
                  // You could add a toast notification here
                }}
              >
                📋 Copy Link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
