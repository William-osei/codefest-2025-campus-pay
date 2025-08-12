import { useState } from 'react'
import Logo from './Logo'
import './LandingPage.css'

const LandingPage = ({ onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    studentId: '',
    name: '',
    hall: ''
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock user data
    const userData = {
      name: formData.name || 'John Doe',
      email: formData.email,
      studentId: formData.studentId || '20210001',
      hall: formData.hall || 'Unity Hall',
      balance: '0',
      isFirstTime: !isLoginMode
    }

    setLoading(false)
    onLogin(userData)
  }

  const features = [
    {
      icon: '🏫',
      title: 'Campus Services',
      description: 'Pay for dining, laundry, printing, and more with digital tokens'
    },
    {
      icon: '⚡',
      title: 'Instant Payments',
      description: 'Fast, secure blockchain-based transactions'
    },
    {
      icon: '📱',
      title: 'Mobile Friendly',
      description: 'QR codes and mobile payments for convenience'
    },
    {
      icon: '💰',
      title: 'Token System',
      description: 'Buy, spend, and redeem CPT tokens seamlessly'
    }
  ]

  const campusServices = [
    { name: 'Great Hall Dining', price: '15 CPT', icon: '🍛' },
    { name: 'KNUST Laundromat', price: '20 CPT', icon: '👕' },
    { name: 'Sports Complex', price: '10 CPT', icon: '🏃‍♂️' },
    { name: 'University Library', price: '3 CPT', icon: '📚' },
    { name: 'KNUST Printshop', price: '5 CPT', icon: '🖨️' },
    { name: 'Internet Bundle', price: '18 CPT', icon: '📶' }
  ]

  return (
    <div className="landing-page">
      <div className="landing-background"></div>
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-logo">
              <Logo size="large" />
            </div>
            <p>The Future of Campus Payments at KNUST</p>
            <div className="hero-description">
              <p>Experience seamless Web3 payments for all your campus needs. 
              From dining at Great Hall to printing at the library, pay instantly with digital tokens.</p>
            </div>
          </div>

          <div className="auth-container">
            <div className="auth-tabs">
              <button 
                className={`auth-tab ${isLoginMode ? 'active' : ''}`}
                onClick={() => setIsLoginMode(true)}
              >
                Login
              </button>
              <button 
                className={`auth-tab ${!isLoginMode ? 'active' : ''}`}
                onClick={() => setIsLoginMode(false)}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLoginMode && (
                <>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Student ID</label>
                    <input
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      placeholder="e.g., 20210001"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Hall of Residence</label>
                    <select
                      name="hall"
                      value={formData.hall}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select your hall</option>
                      <option value="Unity Hall">Unity Hall</option>
                      <option value="University Hall">University Hall</option>
                      <option value="Africa Hall">Africa Hall</option>
                      <option value="Queen Elizabeth Hall">Queen Elizabeth Hall</option>
                      <option value="Independence Hall">Independence Hall</option>
                      <option value="Katanga Hall">Katanga Hall</option>
                    </select>
                  </div>
                </>
              )}
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@knust.edu.gh"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? (
                  <>⏳ Processing...</>
                ) : (
                  <>🚀 {isLoginMode ? 'Login' : 'Create Account'}</>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose Campus Pay?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="services-preview">
        <div className="container">
          <h2>Campus Services Available</h2>
          <div className="services-preview-grid">
            {campusServices.map((service, index) => (
              <div key={index} className="service-preview-card">
                <div className="service-preview-icon">{service.icon}</div>
                <div className="service-preview-info">
                  <h4>{service.name}</h4>
                  <span className="service-preview-price">{service.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <p>© 2024 Campus Pay - KNUST Digital Payment Platform</p>
          <p>Powered by Web3 Technology</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
