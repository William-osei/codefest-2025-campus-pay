import React from 'react';
import './Logo.css';

const Logo = ({ size = 'medium', variant = 'default' }) => {
  const sizeClass = `logo-${size}`;
  const variantClass = `logo-${variant}`;
  
  return (
    <div className={`campus-pay-logo ${sizeClass} ${variantClass}`}>
      <div className="logo-container">
        <div className="logo-icon">
          <div className="coin-stack">
            <div className="coin coin-1"></div>
            <div className="coin coin-2"></div>
            <div className="coin coin-3"></div>
          </div>
          <div className="campus-building">
            <div className="building-base"></div>
            <div className="building-tower"></div>
            <div className="building-flag"></div>
          </div>
        </div>
        <div className="logo-text">
          <span className="campus-text">Campus</span>
          <span className="pay-text">Pay</span>
        </div>
        <div className="logo-tagline">Web3 Campus Payments</div>
      </div>
    </div>
  );
};

// Export different logo variants for different use cases
export const LogoFull = (props) => <Logo variant="full" {...props} />;
export const LogoCompact = (props) => <Logo variant="compact" {...props} />;
export const LogoIcon = (props) => <Logo variant="icon" {...props} />;

export default Logo;
