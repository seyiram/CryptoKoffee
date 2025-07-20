import React, { useState, useEffect } from "react";
import { 
  FaWallet, 
  FaArrowDown, 
  FaCopy, 
  FaCheck, 
  FaSpinner,
  FaExclamationTriangle,
  FaHistory,
  FaSearch,
  FaFilter,
  FaPlay
} from "react-icons/fa";
import PolygonIcon from "../../assets/icons/polygon.svg?url";
import ArbitrumIcon from "../../assets/icons/arbitrum.svg?url";
import "./Withdraw.css";
import { withdrawFunds } from "../../utils/interact";
import { toast } from "react-toastify";
import { useWallet } from "../../contexts/WalletContext";
import { usePaymentEvents } from "../../hooks/usePaymentEvents";
import { ethers } from "ethers";

const Withdraw = () => {
  const { network, account, provider } = useWallet();
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCoin, setSelectedCoin] = useState("ETH");
  const [balance, setBalance] = useState("0.00");
  const [isLoading, setIsLoading] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Use subgraph for payment history
  const { data: paymentHistory = [], isLoading: isLoadingPayments } = usePaymentEvents(account);

  const getNetworkName = () => {
    if (!network?.chainId) return "Arbitrum Sepolia";
    
    // Map by chainId for supported networks
    switch (Number(network.chainId)) {
      case 80002: // Polygon Amoy Testnet
        return "Polygon Amoy Testnet";
      case 421614: // Arbitrum Sepolia
        return "Arbitrum Sepolia Testnet";
      default:
        return "Unsupported Network";
    }
  };

  const getNetworkIcon = () => {
    if (!network?.chainId) return <img src={ArbitrumIcon} alt="Arbitrum" className="coin-icon-small-svg" />;
    
    // Map by chainId for supported networks
    switch (Number(network.chainId)) {
      case 80002: // Polygon Amoy Testnet
        return <img src={PolygonIcon} alt="Polygon" className="coin-icon-small-svg" />;
      case 421614: // Arbitrum Sepolia
        return <img src={ArbitrumIcon} alt="Arbitrum" className="coin-icon-small-svg" />;
      default:
        return <FaExclamationTriangle />;
    }
  };
  // Fetch wallet balance from provider
  useEffect(() => {
    const fetchBalance = async () => {
      if (!account || !provider) {
        setBalance("0.00");
        return;
      }

      try {
        const balanceWei = await provider.getBalance(account);
        const balanceEth = ethers.formatEther(balanceWei);
        setBalance(balanceEth);
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance("0.00");
      }
    };

    fetchBalance();
  }, [account, provider]);

  // Set coin based on network
  useEffect(() => {
    if (!network?.chainId) return;
    
    switch (Number(network.chainId)) {
      case 80002: // Polygon Amoy
        setSelectedCoin("POL");
        break;
      case 421614: // Arbitrum Sepolia
        setSelectedCoin("ETH");
        break;
      default:
        setSelectedCoin("ETH");
    }
  }, [network?.chainId]);

  const handleWithdraw = async () => {
    if (!withdrawAddress || !amount) {
      toast.error("Please fill in all fields.");
      return;
    }
    
    setIsLoading(true);
    try {
      await withdrawFunds(withdrawAddress, amount);
      toast.success("Withdrawal successful!");
      
      // Refresh balance after withdrawal
      if (provider && account) {
        const balanceWei = await provider.getBalance(account);
        const balanceEth = ethers.formatEther(balanceWei);
        setBalance(balanceEth);
      }
      
      // Clear form
      setWithdrawAddress("");
      setAmount("");
    } catch (error) {
      console.error("Withdrawal failed:", error);
      toast.error("Withdrawal failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const coinOptions = [
    {
      value: "ETH",
      label: "Arbitrum Sepolia",
      icon: <img src={ArbitrumIcon} alt="Arbitrum" className="coin-icon-svg" />,
      network: "Arbitrum Sepolia Testnet",
      color: "#28A0F0"
    },
    {
      value: "POL", 
      label: "Polygon Amoy",
      icon: <img src={PolygonIcon} alt="Polygon" className="coin-icon-svg" />,
      network: "Polygon Amoy Testnet",
      color: "#8247e5"
    }
    // Unsupported networks (commented out):
    // {
    //   value: "BTC",
    //   label: "Bitcoin", 
    //   icon: <FaBitcoin />,
    //   network: "Bitcoin Network",
    //   color: "#f7931a"
    // },
    // {
    //   value: "SOL",
    //   label: "Solana",
    //   icon: <FaCoins />, 
    //   network: "Solana Network",
    //   color: "#14f195"
    // }
  ];

  // Helper functions
  const validateAddress = (address) => {
    if (!address) return "Address is required";
    if (address.length < 10) return "Invalid address format";
    return null;
  };

  const validateAmount = (amount, balance) => {
    if (!amount) return "Amount is required";
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return "Amount must be greater than 0";
    if (numAmount > parseFloat(balance)) return "Insufficient balance";
    return null;
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.readText();
      const clipboardText = await navigator.clipboard.readText();
      setWithdrawAddress(clipboardText);
      setAddressCopied(true);
      setTimeout(() => setAddressCopied(false), 2000);
      toast.success("Address pasted from clipboard");
    } catch (error) {
      toast.error("Failed to access clipboard");
    }
  };

  const handleAmountPreset = (percentage) => {
    const balanceNum = parseFloat(balance);
    const presetAmount = (balanceNum * percentage / 100).toFixed(6);
    setAmount(presetAmount);
  };

  const selectedCoinData = coinOptions.find(coin => coin.value === selectedCoin);

  return (
    <div className="withdraw-page">
      <div className="withdraw-container">
        {/* Header */}
        <div className="withdraw-header">
          <div className="header-content">
            <FaWallet className="header-icon" />
            <div>
              <h1 className="withdraw-title">Withdraw Funds</h1>
              <p className="withdraw-subtitle">Transfer your crypto to an external wallet</p>
            </div>
          </div>
        </div>

        <div className="withdraw-content">
          {/* Network Warning */}
          {network?.chainId && ![80002, 421614].includes(Number(network.chainId)) && (
            <div className="network-warning">
              <FaExclamationTriangle />
              <div>
                <strong>Unsupported Network</strong>
                <p>Please switch to Polygon Amoy or Arbitrum Sepolia to use withdrawals.</p>
              </div>
            </div>
          )}

          {/* Balance Card */}
          <div className="balance-card">
            <div className="balance-header">
              <h3>Available Balance</h3>
              <div className="network-badge">
                <span className="coin-icon-small">{getNetworkIcon()}</span>
                <span>{getNetworkName()}</span>
              </div>
            </div>
            <div className="balance-amount">
              <span className="amount-large">{balance}</span>
              <span className="amount-currency">{selectedCoin}</span>
            </div>
            <div className="balance-usd">
              ≈ $0.00 USD
            </div>
          </div>

          {/* Coin Selection */}
          <div className="coin-selection-card">
            <h3>Select Network</h3>
            <div className="coin-grid">
              {coinOptions.map((coin) => (
                <div
                  key={coin.value}
                  className={`coin-option ${selectedCoin === coin.value ? 'selected' : ''}`}
                  onClick={() => setSelectedCoin(coin.value)}
                >
                  <span className="coin-icon">{coin.icon}</span>
                  <div className="coin-info">
                    <span className="coin-label">{coin.label}</span>
                    <span className="coin-network">{coin.network}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Withdrawal Form */}
          <div className="withdrawal-form-card">
            <h3>Withdrawal Details</h3>
            
            {/* Address Input */}
            <div className="form-group">
              <label>Recipient Address</label>
              <div className={`input-container ${validationErrors.address ? 'error' : ''}`}>
                <input
                  type="text"
                  placeholder={`Enter ${selectedCoin} address`}
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  className="address-input"
                />
                <button
                  type="button"
                  className="paste-btn"
                  onClick={handleCopyAddress}
                  title="Paste from clipboard"
                >
                  {addressCopied ? <FaCheck /> : <FaCopy />}
                </button>
              </div>
              {validationErrors.address && (
                <span className="error-message">{validationErrors.address}</span>
              )}
            </div>

            {/* Amount Input */}
            <div className="form-group">
              <label>Amount</label>
              <div className={`input-container ${validationErrors.amount ? 'error' : ''}`}>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="amount-input"
                  step="0.000001"
                  min="0"
                />
                <span className="currency-label">{selectedCoin}</span>
              </div>
              {validationErrors.amount && (
                <span className="error-message">{validationErrors.amount}</span>
              )}
              
              {/* Amount Presets */}
              <div className="amount-presets">
                <button type="button" onClick={() => handleAmountPreset(25)} className="preset-btn">25%</button>
                <button type="button" onClick={() => handleAmountPreset(50)} className="preset-btn">50%</button>
                <button type="button" onClick={() => handleAmountPreset(75)} className="preset-btn">75%</button>
                <button type="button" onClick={() => handleAmountPreset(100)} className="preset-btn">Max</button>
              </div>
            </div>

            {/* Transaction Summary */}
            <div className="transaction-summary">
              <div className="summary-row">
                <span>Amount</span>
                <span>{amount || '0.00'} {selectedCoin}</span>
              </div>
              <div className="summary-row">
                <span>Network Fee</span>
                <span>~0.001 {selectedCoin}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>{amount ? (parseFloat(amount) + 0.001).toFixed(6) : '0.001'} {selectedCoin}</span>
              </div>
            </div>

            {/* Withdraw Button */}
            <button
              className="withdraw-button"
              onClick={handleWithdraw}
              disabled={isLoading || !withdrawAddress || !amount}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="spinner" />
                  Processing...
                </>
              ) : (
                <>
                  <FaArrowDown />
                  Withdraw {selectedCoin}
                </>
              )}
            </button>
          </div>

          {/* Withdrawal History */}
          <div className="history-card">
            <div className="history-header">
              <div className="history-title">
                <FaHistory />
                <h3>Recent Withdrawals</h3>
              </div>
              <div className="history-actions">
                <button className="filter-btn">
                  <FaFilter />
                </button>
                <button className="search-btn">
                  <FaSearch />
                </button>
              </div>
            </div>
            
            <div className="history-content">
              {isLoadingPayments ? (
                <div className="loading-history">
                  <FaSpinner className="spinner" />
                  <p>Loading payment history...</p>
                </div>
              ) : paymentHistory.length > 0 ? (
                <div className="history-list">
                  {paymentHistory
                    .filter(tx => tx.description === "withdraw")
                    .map((tx, index) => (
                    <div key={tx.id || index} className="history-item">
                      <div className="tx-icon">
                        <FaArrowDown />
                      </div>
                      <div className="tx-details">
                        <div className="tx-amount">{tx.amount} {selectedCoin}</div>
                        <div className="tx-address">
                          To: {tx.recipient?.slice(0, 10)}...{tx.recipient?.slice(-8)}
                        </div>
                      </div>
                      <div className="tx-status">
                        <span className="status-badge confirmed">Confirmed</span>
                        <span className="tx-date">
                          {new Date(tx.timeStamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-history">
                  <FaHistory className="empty-icon" />
                  <p>No withdrawal history yet</p>
                  <span>Your recent transactions will appear here</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
