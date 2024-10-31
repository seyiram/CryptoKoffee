import React from 'react';
import './NetworkSwitchModal.css';

const NetworkSwitchModal = ({ isOpen, onClose, onConfirm, targetNetwork }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Switch Network</h2>
        <p>You are on an unsupported network. Which network would you like to switch to?</p>
        <div className="modal-buttons">
          <button onClick={() => onConfirm('Polygon')}>Switch to Polygon</button>
          <button onClick={() => onConfirm('Arbitrum Sepolia')}>Switch to Arbitrum Sepolia</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default NetworkSwitchModal;