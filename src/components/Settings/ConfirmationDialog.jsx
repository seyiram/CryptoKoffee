import React from "react";
import { FaExclamationTriangle, FaTrashAlt, FaTimes } from "react-icons/fa";
import "./Settings.css"

const ConfirmationDialog = ({ onConfirm, onCancel }) => {
  return (
    <div style={{ 
      padding: '1rem',
      background: 'white',
      borderRadius: '0.75rem',
      minWidth: '300px',
      maxWidth: '400px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1rem',
        color: '#dc3545'
      }}>
        <FaExclamationTriangle style={{ fontSize: '1.5rem' }} />
        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>
          Confirm Account Deletion
        </h3>
      </div>
      
      <p style={{ 
        margin: '0 0 1.5rem 0', 
        color: '#666', 
        lineHeight: 1.5 
      }}>
        This action cannot be undone. Your profile, settings, and all associated data will be permanently deleted.
      </p>
      
      <div style={{ 
        display: 'flex', 
        gap: '0.75rem',
        justifyContent: 'flex-end'
      }}>
        <button 
          className="toast-button cancel" 
          onClick={onCancel}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FaTimes />
          Cancel
        </button>
        <button 
          className="toast-button" 
          onClick={onConfirm}
          style={{
            background: '#dc3545',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FaTrashAlt />
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default ConfirmationDialog;