import React, { useState } from 'react';
import { FaSearch, FaBell } from 'react-icons/fa';
import './Header.css';
import { ethers } from 'ethers';

const Header = () => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        // You can optionally use ethers.js to create a provider and signer
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        console.log('Signer:', signer);
      } catch (error) {
        console.error('Error connecting to MetaMask', error);
      }
    } else {
      alert('MetaMask is not installed. Please install it to use this feature.');
    }
  };

  return (
    <header className="header">
      <div className="header-search">
        <FaSearch className="header-icon" />
        <input type="text" placeholder="Type to search..." />
      </div>
      <div className="header-right">
        <FaBell className="header-icon" />
        <div className="header-button">
          <button className="connect-button" onClick={connectWallet}>
            {account ? `Connected: ${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'Connect your wallet'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
