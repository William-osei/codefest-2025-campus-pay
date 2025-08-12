import './ServiceOverview.css'

const ServiceOverview = ({ service, onClose, onPayment }) => {
  if (!service) return null

  const handlePayment = () => {
    onPayment(service)
    onClose()
  }

  return (
    <div className="service-overview-modal" onClick={onClose}>
      <div className="service-overview-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="service-overview-header" style={{ '--service-color': service.color }}>
          <div className="service-overview-icon">{service.icon}</div>
          <h2>{service.name}</h2>
        </div>

        <div className="service-overview-details">
          <div className="service-detail-section">
            <h3>📋 Description</h3>
            <p>{service.description}</p>
          </div>

          <div className="service-detail-section">
            <h3>📍 Location</h3>
            <p>{service.location}</p>
          </div>

          <div className="service-detail-section">
            <h3>💰 Pricing</h3>
            <div className="pricing-info">
              <span className="price-amount">{service.price} CPT</span>
              <span className="price-usd">≈ ${(parseInt(service.price) * 2.5).toFixed(2)} USD</span>
            </div>
          </div>

          <div className="service-detail-section">
            <h3>⏰ Availability</h3>
            <p>Available during regular operating hours</p>
            <ul>
              <li>Monday - Friday: 8:00 AM - 8:00 PM</li>
              <li>Saturday: 10:00 AM - 6:00 PM</li>
              <li>Sunday: Closed (except emergency services)</li>
            </ul>
          </div>

          <div className="service-detail-section">
            <h3>ℹ️ Additional Information</h3>
            {service.name === 'Great Hall Dining' && (
              <ul>
                <li>Includes main course, side dish, and drink</li>
                <li>Vegetarian options available</li>
                <li>Halal certified meals</li>
              </ul>
            )}
            {service.name === 'KNUST Laundromat' && (
              <ul>
                <li>Washing, drying, and folding included</li>
                <li>Express service available (+5 CPT)</li>
                <li>Detergent provided</li>
              </ul>
            )}
            {service.name === 'University Library' && (
              <ul>
                <li>24/7 access during exam periods</li>
                <li>Quiet study areas</li>
                <li>Computer and internet access</li>
              </ul>
            )}
            {service.name === 'KNUST Printshop' && (
              <ul>
                <li>Black & white printing (50 pages)</li>
                <li>Basic binding included</li>
                <li>Color printing available (+10 CPT)</li>
              </ul>
            )}
            {service.name === 'Sports Complex' && (
              <ul>
                <li>Gym equipment access</li>
                <li>Basketball and football courts</li>
                <li>Locker rental available</li>
              </ul>
            )}
            {service.name === 'KNUST Clinic' && (
              <ul>
                <li>General medical consultation</li>
                <li>Basic medications included</li>
                <li>Referral to specialists when needed</li>
              </ul>
            )}
            {!['Great Hall Dining', 'KNUST Laundromat', 'University Library', 'KNUST Printshop', 'Sports Complex', 'KNUST Clinic'].includes(service.name) && (
              <ul>
                <li>Quality service guaranteed</li>
                <li>Student discounts applied</li>
                <li>No hidden fees</li>
              </ul>
            )}
          </div>
        </div>

        <div className="service-overview-actions">
          <button className="cancel-btn" onClick={onClose}>
            Close
          </button>
          <button 
            className="pay-now-btn" 
            style={{ '--service-color': service.color }}
            onClick={handlePayment}
          >
            Pay {service.price} CPT Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default ServiceOverview
