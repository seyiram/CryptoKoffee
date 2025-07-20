import React, { useState } from 'react';
import { FaTimes, FaExclamationTriangle, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import './NetworkSwitchModal.css';

const NetworkSwitchModal = ({ isOpen, onClose, onConfirm, targetNetwork }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const networks = [
    {
      id: 'polygon',
      name: 'Polygon Amoy',
      description: 'Fast and low-cost transactions',
      currency: 'POL',
      chainId: '80002',
      icon: '/src/assets/icons/polygon.svg',
      color: '#8247E5'
    },
    {
      id: 'arbitrumSepolia',
      name: 'Arbitrum Sepolia',
      description: 'Ethereum Layer 2 testnet',
      currency: 'ETH',
      chainId: '421614',
      icon: '/src/assets/icons/ethereum.svg',
      color: '#2D374B'
    }
  ];

  const handleNetworkSwitch = async (networkId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await onConfirm(networkId);
      setIsLoading(false);
    } catch (err) {
      setError(`Failed to switch to ${networks.find(n => n.id === networkId)?.name}`);
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="network-modal-overlay" onClick={handleOverlayClick}>
      <div className="network-modal-content">
        <div className="network-modal-header">
          <div className="network-modal-title-section">
            <FaExclamationTriangle className="warning-icon" />
            <div>
              <h2>Switch Network Required</h2>
              <p className="subtitle">You're connected to an unsupported network</p>
            </div>
          </div>
          <button className="close-button" onClick={onClose} disabled={isLoading}>
            <FaTimes />
          </button>
        </div>

        <div className="network-modal-body">
          <p className="description">
            Choose a supported network to continue using CryptoKoffee:
          </p>

          {error && (
            <div className="error-message">
              <FaExclamationTriangle />
              {error}
            </div>
          )}

          <div className="networks-list">
            {networks.map((network) => (
              <button
                key={network.id}
                className={`network-option ${targetNetwork === network.id ? 'recommended' : ''}`}
                onClick={() => handleNetworkSwitch(network.id)}
                disabled={isLoading}
              >
                <div className="network-icon">
                  <img src={network.icon} alt={network.name} />
                </div>
                <div className="network-info">
                  <div className="network-name">
                    {network.name}
                    {targetNetwork === network.id && (
                      <span className="recommended-badge">Recommended</span>
                    )}
                  </div>
                  <div className="network-description">{network.description}</div>
                  <div className="network-details">
                    <span className="currency">{network.currency}</span>
                    <span className="chain-id">Chain ID: {network.chainId}</span>
                  </div>
                </div>
                <div className="network-action">
                  {isLoading ? (
                    <FaSpinner className="loading-spinner" />
                  ) : (
                    <FaCheckCircle className="switch-icon" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="network-modal-footer">
          <button 
            className="cancel-button" 
            onClick={onClose}
            disabled={isLoading}
          >
            Continue Without Switching
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetworkSwitchModal;