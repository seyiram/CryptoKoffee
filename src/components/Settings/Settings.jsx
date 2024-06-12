import React, { useState } from 'react';
import { GoCopy } from 'react-icons/go';
import './Settings.css';

const Settings = () => {
  const [avatar, setAvatar] = useState('https://example.com/avatar.png');
  const [username, setUsername] = useState('@nickmazurtron');
  const [wallet, setWallet] = useState('TWtfq5...Uu7FouKowvxWQZQKAI');

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(wallet);
    alert('Wallet address copied to clipboard!');
  };

  return (
    <div className="settings-page">
      <div className="settings-card">
        <h2>Settings</h2>
        <div className="settings-item">
          <label>Avatar:</label>
          <div className="avatar-container">
            <img src={avatar} alt="Avatar" className="avatar" />
            <label htmlFor="avatar-upload" className="change-btn">Change</label>
            <input
              type="file"
              id="avatar-upload"
              className="hidden-input"
              onChange={handleAvatarChange}
            />
          </div>
          <p>You can use formats: PNG, JPG, JPEG, GIF</p>
        </div>
        <div className="settings-item">
          <label>Username:</label>
          <div className="input-container">
            <input type="text" value={username} className="username-input" onChange={(e) => setUsername(e.target.value)} />
          </div>
        </div>
        <div className="settings-item">
          <label>Wallet:</label>
          <div className="input-container">
            <input type="text" value={wallet} readOnly className="wallet-input" />
            <GoCopy onClick={copyToClipboard} className="icon copy-icon" />
          </div>
        </div>
        <button className="delete-account-btn">Delete account</button>
      </div>
    </div>
  );
};

export default Settings;
