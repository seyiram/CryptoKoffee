import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FaSearch, FaBell } from "react-icons/fa";
import "./Header.css";
import {
  getWallet,
  createWallet,
  data,
} from "../../utils/interact";
import { toast } from "react-toastify";
import { useWallet } from "../../contexts/WalletContext";

const Header = () => {
  const { account, isConnected, connectWallet, isConnecting } = useWallet();
  const [walletExists, setWalletExists] = useState(false);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);

  const checkWalletExists = useCallback(async (account) => {
    try {
      const walletInfo = await getWallet();
      if (
        walletInfo &&
        walletInfo.walletAddress !==
          "0x0000000000000000000000000000000000000000"
      ) {
        setWalletExists(true);
      } else {
        setWalletExists(false);
      }
    } catch (error) {
      console.error("Error checking wallet existence", error);
    }
  }, []);

  useEffect(() => {
    if (account) {
      checkWalletExists(account);
    }
  }, [account, checkWalletExists]);

  const handleConnectWallet = useCallback(async () => {
    await connectWallet();
  }, [connectWallet]);

  const handleCreateWallet = useCallback(async () => {
    try {
      setIsCreatingWallet(true);
      const walletInfo = await getWallet();
      if (
        !walletInfo ||
        walletInfo.walletAddress ===
          "0x0000000000000000000000000000000000000000"
      ) {
        const result = await createWallet();
        if (result?.hash) {
          toast.success("Wallet created successfully!");
          setWalletExists(true);
        } else {
          toast.error("Error creating wallet. Please try again.");
        }
      } else {
        toast.info("Wallet already exists.");
      }
    } catch (error) {
      console.error("Error creating wallet", error);
      if (error.code === 4001 || error.message.includes("user rejected")) {
        toast.error("Transaction rejected. Wallet creation canceled.");
      } else {
        console.error("Error creating wallet:", error);
        toast.error("Error creating wallet. Please try again.");
      }
    } finally {
      setIsCreatingWallet(false);
    }
  }, []);

  const buttonText = useMemo(() => {
    if (isConnecting) return "Connecting...";
    if (account) return `Connected: ${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
    return "Connect your wallet";
  }, [isConnecting, account]);

  return (
    <header className="header">
      <div className="header-search">
        <FaSearch className="header-icon" />
        <input type="text" placeholder="Type to search..." />
      </div>
      <div className="create-wallet-container">
        {account && !walletExists && (
          <button
            className="create-wallet-button"
            onClick={handleCreateWallet}
            disabled={isCreatingWallet}
          >
            {isCreatingWallet ? (
              <>
                <span className="loader"></span>
                Creating Wallet...
              </>
            ) : (
              "Create Wallet"
            )}
          </button>
        )}
      </div>
      <div className="header-right">
        <FaBell className="header-icon" />
        <div className="header-button">
          <button 
            className="connect-button" 
            onClick={handleConnectWallet}
            disabled={isConnecting}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);
