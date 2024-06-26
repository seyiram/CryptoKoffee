import React from "react";
import "./Settings.css"

const ConfirmationDialog = ({ onConfirm, onCancel }) => {
  return (
    <div>
      Are you sure you want to delete your account?
      <div style={{ marginTop: "10px" }}>
        <button className="toast-button" onClick={onConfirm}>
          Delete
        </button>
        <button className="toast-button cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConfirmationDialog;