import './StatsCard.css'

export const StatsCard = ({ title, value, icon, color, subtitle }) => {
  return (
    <div className={`stats-card stats-card-${color}`}>
      <div className="stats-icon">{icon}</div>
      <div className="stats-content">
        <h3 className="stats-value">{value}</h3>
        <p className="stats-title">{title}</p>
        {subtitle && <p className="stats-subtitle">{subtitle}</p>}
      </div>
    </div>
  )
}

export const StatsGrid = ({ balance, totalSpent, paymentCount, savings }) => {
  return (
    <div className="stats-grid">
      <StatsCard
        title="Current Balance"
        value={`${balance} CPT`}
        icon="💰"
        color="green"
        subtitle="Available to spend"
      />
      <StatsCard
        title="Total Spent"
        value={`${totalSpent} CPT`}
        icon="💸"
        color="blue"
        subtitle="All-time spending"
      />
      <StatsCard
        title="Transactions"
        value={paymentCount}
        icon="📊"
        color="purple"
        subtitle="Payment count"
      />
      <StatsCard
        title="Estimated Savings"
        value={`$${((totalSpent * 0.001 * 0.15) || 0).toFixed(2)}`}
        icon="💎"
        color="orange"
        subtitle="vs traditional fees"
      />
    </div>
  )
}
