import React, { useState, useEffect } from "react";
import { FaSearch, FaBell } from "react-icons/fa";
import "./Header.css";
import { initializeProvider, getWallet, createWallet, data } from "../../utils/interact";
import { toast } from "react-toastify";

const Header = () => {
  const [account, setAccount] = useState(null);
  const [walletExists, setWalletExists] = useState(false);

  useEffect(() => {
    const storedAccount = localStorage.getItem("account");
    if (storedAccount) {
      setAccount(storedAccount);
      initializeProvider().then(() => checkWalletExists(storedAccount));
    }
  }, []);

  const checkWalletExists = async (account) => {
    try {
      const walletInfo = await getWallet();
      if (walletInfo && walletInfo.walletAddress !== "0x0000000000000000000000000000000000000000") {
        setWalletExists(true);
      } else {
        setWalletExists(false);
      }
    } catch (error) {
      console.error("Error checking wallet existence", error);
    }
  };


  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        setAccount(account);
        localStorage.setItem("account", account);

        // Initialize provider and signer
        await initializeProvider();
        await checkWalletExists(account);

        // Refresh the page
        window.location.reload();
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      toast.error("Please install MetaMask");
    }
  };

  const handleCreateWallet = async () => {
    try {
      const walletInfo = await getWallet();
      if (!walletInfo || walletInfo.walletAddress === "0x0000000000000000000000000000000000000000") {
        await createWallet();
        toast.success("Wallet created successfully!");
        setWalletExists(true);
      } else {
        toast.info("Wallet already exists.");
      }
    } catch (error) {
      console.error("Error creating wallet", error);
      toast.error("Error creating wallet: " + error.message);
    }
  };

  console.log("Wallet exists:", walletExists);

  return (
    <header className="header">
      <div className="header-search">
        <FaSearch className="header-icon" />
        <input type="text" placeholder="Type to search..." />
      </div>
      <div className="create-wallet-container">
        {account && !walletExists && (
          <button className="create-wallet-button" onClick={handleCreateWallet}>
            Create Wallet
          </button>
        )}
      </div>
      <div className="header-right">
        <FaBell className="header-icon" />
        <div className="header-button">
          <button className="connect-button" onClick={connectWallet}>
            {account
              ? `Connected: ${account.substring(0, 6)}...${account.substring(
                  account.length - 4
                )}`
              : "Connect your wallet"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
