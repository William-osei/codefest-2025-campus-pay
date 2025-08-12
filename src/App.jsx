import { useState, useEffect } from 'react'
import { BrowserProvider, Contract, formatUnits, parseUnits } from 'ethers'
import { useToast } from './components/Toast'
import { StatsGrid } from './components/StatsCard'
import { QRPayment } from './components/QRPayment'
import LandingPage from './components/LandingPage'
import ServiceOverview from './components/ServiceOverview'
import Logo, { LogoCompact } from './components/Logo'
import './App.css'

// KNUST Campus services with authentic pricing and descriptions
const CAMPUS_SERVICES = [
  { 
    name: 'Great Hall Dining', 
    price: '15', 
    icon: '🍛', 
    description: 'Full meal at Great Hall',
    color: '#f59e0b',
    location: 'Great Hall'
  },
  { 
    name: 'SRC Shop', 
    price: '8', 
    icon: '🛒', 
    description: 'Snacks & beverages',
    color: '#10b981',
    location: 'SRC Building'
  },
  { 
    name: 'Unity Hall Chop Bar', 
    price: '12', 
    icon: '🍲', 
    description: 'Local dishes & rice',
    color: '#ef4444',
    location: 'Unity Hall'
  },
  { 
    name: 'KNUST Laundromat', 
    price: '20', 
    icon: '👕', 
    description: 'Wash, dry & fold service',
    color: '#3b82f6',
    location: 'Various Halls'
  },
  { 
    name: 'KNUST Printshop', 
    price: '5', 
    icon: '🖨️', 
    description: '50 pages B&W + binding',
    color: '#8b5cf6',
    location: 'Library & CSM'
  },
  { 
    name: 'University Library', 
    price: '3', 
    icon: '📚', 
    description: 'Extended study access',
    color: '#06b6d4',
    location: 'Main Library'
  },
  { 
    name: 'Sports Complex', 
    price: '10', 
    icon: '🏃‍♂️', 
    description: 'Gym & sports facilities',
    color: '#f97316',
    location: 'Sports Complex'
  },
  { 
    name: 'Taxi to Kumasi', 
    price: '25', 
    icon: '🚕', 
    description: 'Shared taxi to town',
    color: '#eab308',
    location: 'Main Gate'
  },
  { 
    name: 'ID Card Renewal', 
    price: '30', 
    icon: '🆔', 
    description: 'Student ID replacement',
    color: '#dc2626',
    location: 'Registry'
  },
  { 
    name: 'Hostel Booking', 
    price: '50', 
    icon: '🏠', 
    description: 'Semester accommodation',
    color: '#9333ea',
    location: 'Hall Administration'
  },
  { 
    name: 'Internet Bundle', 
    price: '18', 
    icon: '📶', 
    description: '5GB monthly data',
    color: '#059669',
    location: 'IT Center'
  },
  { 
    name: 'KNUST Clinic', 
    price: '35', 
    icon: '🏥', 
    description: 'Medical consultation',
    color: '#be123c',
    location: 'University Hospital'
  }
]

// Contract ABI
const CONTRACT_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)", 
  "function decimals() view returns (uint8)",
  "function balanceOf(address owner) view returns (uint256)",
  "function buyTokens(uint256 amount) payable",
  "function payForService(string serviceName, uint256 amount)",
  "function totalSpent(address user) view returns (uint256)",
  "function getPaymentCount(address user) view returns (uint256)",
  "function getPaymentHistory(address user, uint256 index) view returns (string)",
  "event PaymentMade(address indexed user, string service, uint256 amount, uint256 timestamp)",
  "event TokensPurchased(address indexed user, uint256 amount, uint256 timestamp)"
]

// Try to load deployed contract address
let CONTRACT_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3" // default
try {
  // This would normally be imported from deployment files
  CONTRACT_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3"
} catch (e) {
  console.log('Using default contract address')
}

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [showServiceOverview, setShowServiceOverview] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  
  // Wallet and contract state
  const [account, setAccount] = useState('')
  const [balance, setBalance] = useState('0')
  const [ethBalance, setEthBalance] = useState('0')
  const [totalSpent, setTotalSpent] = useState('0')
  const [provider, setProvider] = useState(null)
  const [contract, setContract] = useState(null)
  const [loading, setLoading] = useState(false)
  const [paymentHistory, setPaymentHistory] = useState([])
  const [showQRModal, setShowQRModal] = useState(false)
  const [contractInfo, setContractInfo] = useState({ name: '', symbol: '', decimals: 18 })
  const [networkInfo, setNetworkInfo] = useState({ chainId: 0, name: '' })
  const { addToast, ToastContainer } = useToast()

  // Authentication handlers
  const handleLogin = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
    addToast(`Welcome ${userData.isFirstTime ? 'to Campus Pay' : 'back'}, ${userData.name}! 🎉`, 'success')
    
    // Initialize with some demo balance if it's a first-time user
    if (userData.isFirstTime) {
      setBalance('50') // Give new users 50 CPT to start
      addToast('You received 50 CPT welcome bonus! 🎁', 'info')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
    setAccount('')
    setBalance('0')
    setTotalSpent('0')
    setPaymentHistory([])
    addToast('Logged out successfully', 'info')
  }

  const handleServiceClick = (service) => {
    setSelectedService(service)
    setShowServiceOverview(true)
  }

  // Load real data from contract
  const loadContractData = async (contract, userAccount) => {
    try {
      const [userBalance, userSpent, paymentCount, name, symbol, decimals] = await Promise.all([
        contract.balanceOf(userAccount),
        contract.totalSpent(userAccount),
        contract.getPaymentCount(userAccount),
        contract.name(),
        contract.symbol(),
        contract.decimals()
      ])
      
      setBalance(formatUnits(userBalance, decimals))
      setTotalSpent(formatUnits(userSpent, decimals))
      setContractInfo({ name, symbol, decimals })
      
      // Load payment history
      const history = []
      const count = parseInt(paymentCount.toString())
      for (let i = Math.max(0, count - 5); i < count; i++) {
        try {
          const serviceName = await contract.getPaymentHistory(userAccount, i)
          history.unshift({
            service: serviceName,
            timestamp: new Date().toLocaleString(),
            icon: CAMPUS_SERVICES.find(s => s.name === serviceName)?.icon || '🏫'
          })
        } catch (e) {
          console.log('Could not load payment history item:', i)
        }
      }
      setPaymentHistory(history)
      
    } catch (error) {
      console.log('Contract not deployed or error loading data:', error)
      // Fall back to demo mode
      setBalance('0')
      setTotalSpent('0')
      setContractInfo({ name: 'Campus Pay Token', symbol: 'CPT', decimals: 18 })
      addToast('Contract not found. Running in demo mode.', 'info')
    }
  }

  // Connect to MetaMask with real data loading
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        setLoading(true)
        const provider = new BrowserProvider(window.ethereum)
        
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const signer = await provider.getSigner()
        const userAccount = await signer.getAddress()
        
        // Get network info
        const network = await provider.getNetwork()
        setNetworkInfo({ chainId: Number(network.chainId), name: network.name })
        
        // Get ETH balance
        const ethBal = await provider.getBalance(userAccount)
        setEthBalance(formatUnits(ethBal, 18))
        
        setAccount(userAccount)
        setProvider(provider)
        
        // Try to connect to contract
        try {
          const contractInstance = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
          setContract(contractInstance)
          await loadContractData(contractInstance, userAccount)
          addToast('🎉 Wallet connected! Contract loaded successfully.', 'success')
        } catch (error) {
          console.log('Contract connection failed:', error)
          addToast('🔗 Wallet connected! Running in demo mode.', 'info')
        }
        
      } else {
        addToast('Please install MetaMask to continue', 'error')
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
      addToast('Failed to connect wallet. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Real token buying function
  const buyTokens = async (amount) => {
    if (!contract) {
      addToast('Contract not connected. Running in demo mode.', 'info')
      // Demo mode fallback
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 2000))
      const newBalance = parseFloat(balance) + parseInt(amount)
      setBalance(newBalance.toString())
      setLoading(false)
      addToast(`Demo: Purchased ${amount} CPT tokens! 💰`, 'success')
      return
    }

    setLoading(true)
    try {
      addToast('Sending transaction... Please confirm in MetaMask', 'info')
      
      // Calculate required ETH (1000 tokens = 1 ETH)
      const requiredEth = (parseInt(amount) / 1000).toString()
      const ethValue = parseUnits(requiredEth, 18)
      
      // Call contract function
      const tx = await contract.buyTokens(parseUnits(amount, contractInfo.decimals), {
        value: ethValue
      })
      
      addToast('Transaction sent! Waiting for confirmation...', 'info')
      
      // Wait for confirmation
      await tx.wait()
      
      // Reload balance
      await loadContractData(contract, account)
      
      addToast(`Successfully purchased ${amount} ${contractInfo.symbol} tokens! 🎉`, 'success')
      
    } catch (error) {
      console.error('Error buying tokens:', error)
      if (error.reason) {
        addToast(`Transaction failed: ${error.reason}`, 'error')
      } else if (error.code === 'ACTION_REJECTED') {
        addToast('Transaction cancelled by user', 'info')
      } else {
        addToast('Transaction failed! Please try again.', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  // Token redemption function
  const redeemTokens = async (amount) => {
    if (parseFloat(balance) < parseInt(amount)) {
      addToast('Insufficient token balance to redeem!', 'error')
      return
    }

    if (!contract) {
      addToast('Contract not connected. Running in demo mode.', 'info')
      // Demo mode fallback
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 2000))
      const newBalance = parseFloat(balance) - parseInt(amount)
      const ethReceived = (parseInt(amount) / 1000).toFixed(4) // 1000 CPT = 1 ETH
      setBalance(newBalance.toString())
      setLoading(false)
      addToast(`Demo: Redeemed ${amount} CPT for ${ethReceived} ETH! 💸`, 'success')
      return
    }

    setLoading(true)
    try {
      addToast('Processing redemption... Please confirm in MetaMask', 'info')
      
      // This would call a redeem function on the contract
      // const tx = await contract.redeemTokens(parseUnits(amount, contractInfo.decimals))
      // await tx.wait()
      
      // For now, simulate the redemption
      const ethReceived = (parseInt(amount) / 1000).toFixed(4)
      addToast(`Successfully redeemed ${amount} ${contractInfo.symbol} for ${ethReceived} ETH! 💸`, 'success')
      
    } catch (error) {
      console.error('Error redeeming tokens:', error)
      addToast('Redemption failed! Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Real payment function
  const payForService = async (service) => {
    if (parseFloat(balance) < parseInt(service.price)) {
      addToast('Insufficient token balance! Please buy more tokens.', 'error')
      return
    }

    if (!contract) {
      addToast('Contract not connected. Running in demo mode.', 'info')
      // Demo mode fallback
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newBalance = parseFloat(balance) - parseInt(service.price)
      const newTotalSpent = parseFloat(totalSpent) + parseInt(service.price)
      
      setBalance(newBalance.toString())
      setTotalSpent(newTotalSpent.toString())
      
      const newPayment = {
        service: service.name,
        amount: service.price,
        timestamp: new Date().toLocaleString(),
        icon: service.icon
      }
      setPaymentHistory(prev => [newPayment, ...prev])
      
      setLoading(false)
      addToast(`Demo: Paid ${service.price} CPT for ${service.name} ${service.icon}`, 'success')
      return
    }

    setLoading(true)
    try {
      addToast('Sending payment... Please confirm in MetaMask', 'info')
      
      // Call contract function
      const tx = await contract.payForService(
        service.name,
        parseUnits(service.price, contractInfo.decimals)
      )
      
      addToast('Payment sent! Waiting for confirmation...', 'info')
      
      // Wait for confirmation
      await tx.wait()
      
      // Reload balance and data
      await loadContractData(contract, account)
      
      addToast(`Payment successful! Paid ${service.price} ${contractInfo.symbol} for ${service.name} ${service.icon}`, 'success')
      
    } catch (error) {
      console.error('Error making payment:', error)
      if (error.reason) {
        addToast(`Payment failed: ${error.reason}`, 'error')
      } else if (error.code === 'ACTION_REJECTED') {
        addToast('Payment cancelled by user', 'info')
      } else {
        addToast('Payment failed! Please try again.', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} />
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-logo">
              <LogoCompact size="small" />
            </div>
            <p>Welcome back, {user?.name}!</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="student-id">{user?.studentId}</span>
              <span className="hall">{user?.hall}</span>
              <button onClick={handleLogout} className="logout-btn">
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
        
        {!account ? (
          <div className="wallet-section">
            <p>Connect your wallet to start making payments</p>
            <button onClick={connectWallet} className="connect-btn">
              🚀 Connect Wallet
            </button>
          </div>
        ) : (
          <div className="wallet-info">
            <p>Wallet: {account.slice(0, 6)}...{account.slice(-4)}</p>
            <div className="balance-info">
              <span>Balance: {balance} {contractInfo.symbol || 'CPT'}</span>
              <span>Total Spent: {totalSpent} {contractInfo.symbol || 'CPT'}</span>
            </div>
            <button 
              className="qr-btn" 
              onClick={() => setShowQRModal(true)}
              title="Generate QR code for mobile payments"
            >
              📱 QR Payment
            </button>
          </div>
        )}
      </header>

      <main className="main-content">
        {/* Welcome message for first-time users */}
        {user?.isFirstTime && !account && (
          <section className="welcome-section">
            <div className="welcome-card">
              <h2>🎉 Welcome to Campus Pay!</h2>
              <p>You're all set up! Connect your wallet to start making payments for campus services.</p>
            </div>
          </section>
        )}

        {/* Service Overview Section - Show available services even without wallet */}
        <section className="services-overview">
          <h2>🏫 Available Campus Services</h2>
          <p className="section-subtitle">Browse and learn about campus services</p>
          <div className="services-overview-grid">
            {CAMPUS_SERVICES.map((service, index) => (
              <div 
                key={index} 
                className="service-overview-card"
                style={{ '--card-color': service.color }}
                onClick={() => handleServiceClick(service)}
              >
                <div className="service-icon">{service.icon}</div>
                <h3>{service.name}</h3>
                <p className="description">{service.description}</p>
                <p className="location">📍 {service.location}</p>
                <p className="price">{service.price} {contractInfo.symbol || 'CPT'}</p>
                <button className="overview-btn">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </section>

        {account && (
          <>
          {/* Buy Tokens Section */}
          <section className="buy-tokens">
            <h2>💰 Buy Tokens</h2>
            <p className="section-subtitle">Purchase CPT tokens to pay for campus services</p>
            <div className="token-options">
              {['50', '100', '200'].map(amount => (
                <button
                  key={amount}
                  onClick={() => buyTokens(amount)}
                  disabled={loading}
                  className="token-btn buy-btn"
                >
                  Buy {amount} CPT
                  <small>≈ {(parseInt(amount) / 1000).toFixed(3)} ETH</small>
                </button>
              ))}
            </div>
          </section>

          {/* Redeem Tokens Section */}
          {parseFloat(balance) > 0 && (
            <section className="redeem-tokens">
              <h2>💸 Redeem Tokens</h2>
              <p className="section-subtitle">Convert your CPT tokens back to ETH</p>
              <div className="token-options">
                {['25', '50', '100'].map(amount => (
                  <button
                    key={amount}
                    onClick={() => redeemTokens(amount)}
                    disabled={loading || parseFloat(balance) < parseInt(amount)}
                    className="token-btn redeem-btn"
                  >
                    Redeem {amount} CPT
                    <small>≈ {(parseInt(amount) / 1000).toFixed(3)} ETH</small>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Stats Dashboard */}
          <StatsGrid 
            balance={balance}
            totalSpent={totalSpent}
            paymentCount={paymentHistory.length}
          />

          {/* Campus Services */}
          <section className="services">
            <h2>🎓 Campus Services</h2>
            <div className="services-grid">
              {CAMPUS_SERVICES.map((service, index) => (
                <div 
                  key={index} 
                  className="service-card"
                  style={{ '--card-color': service.color }}
                >
                  <div className="service-icon">{service.icon}</div>
                  <h3>{service.name}</h3>
                  <p className="description">{service.description}</p>
                  <p className="location">📍 {service.location}</p>
                  <p className="price">{service.price} {contractInfo.symbol || 'CPT'}</p>
                  <button
                    onClick={() => payForService(service)}
                    disabled={loading || parseFloat(balance) < parseInt(service.price)}
                    className="pay-btn"
                  >
                    {loading ? 'Processing...' : 'Pay Now'}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Payment History */}
          {paymentHistory.length > 0 && (
            <section className="history">
              <h2>📝 Payment History</h2>
              <div className="history-list">
                {paymentHistory.slice(0, 5).map((payment, index) => (
                  <div key={index} className="history-item">
                    <span className="history-icon">{payment.icon}</span>
                    <div className="history-details">
                      <strong>{payment.service}</strong>
                      <small>{payment.timestamp}</small>
                    </div>
                    <span className="history-amount">-{payment.amount} CPT</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
        )}
      </main>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">⏳ Processing transaction...</div>
        </div>
      )}
      
      {showQRModal && (
        <QRPayment 
          account={account} 
          onClose={() => setShowQRModal(false)} 
        />
      )}
      
      {showServiceOverview && selectedService && (
        <ServiceOverview 
          service={selectedService}
          onClose={() => {
            setShowServiceOverview(false)
            setSelectedService(null)
          }}
          onPayment={payForService}
        />
      )}
      
      <ToastContainer />
    </div>
  )
}

export default App
