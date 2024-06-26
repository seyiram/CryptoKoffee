import React, { useState, useEffect } from "react";
import { FaBitcoin, FaEthereum } from "react-icons/fa";
import "./Withdraw.css";
import {
  withdrawFunds,
  getNetworkType,
  getWallet,
  fetchPaymentEventsForWallet,
} from "../../utils/interact";
import { toast } from "react-toastify";
import { getCoinCodeByChainId } from "../../utils/coinUtils";

const Withdraw = () => {
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCoin, setSelectedCoin] = useState("ETH");
  const [balance, setBalance] = useState("0.00");
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [wallet, setWallet] = useState(null);
  useEffect(() => {
    let isMounted = true; // flag to track if the component is mounted

    const fetchData = async () => {
      const walletInfo = await getWallet();
      if (isMounted) {
        // Check if the component is still mounted
        setWallet(walletInfo);
        if (walletInfo?.walletAddress) {
          fetchPaymentEventsForWallet(walletInfo.walletAddress, (events) => {
            console.log("Payment events here", events);
            setWithdrawalHistory(
              events.filter((event) => event.description === "withdraw")
            );
          });

          // Set balance from walletInfo
          setBalance(walletInfo.currentBalance);

          const networkType = await getNetworkType(walletInfo.walletAddress);
          const coinCode = getCoinCodeByChainId(networkType);
          setSelectedCoin(coinCode);
        }
      }
    };

    fetchData().catch(console.error);

    return () => {
      isMounted = false; // Cleanup
    };
  }, [wallet?.walletAddress]);

  const handleWithdraw = async () => {
    if (!withdrawAddress || !amount) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      await withdrawFunds(withdrawAddress, amount);
      toast.success("Withdrawal successful!");
      const walletInfo = await getWallet();
      setBalance(walletInfo.currentBalance);
      fetchPaymentEventsForWallet(walletInfo.walletAddress, (events) => {
        setWithdrawalHistory(
          events.filter((event) => event.description === "withdraw")
        );
      });
    } catch (error) {
      console.error("Withdrawal failed:", error);
      toast.error("Withdrawal failed. Please try again.");
    }
  };

  const coinOptions = [
    {
      value: "ETH",
      label: "Ethereum",
      icon: <FaEthereum size={20} color="#3c3c3d" />,
    },
    {
      value: "OP",
      label: "Optimism",
      icon: <FaBitcoin size={20} color="#f7931a" />,
    },
    {
      value: "BNB",
      label: "BNB",
      icon: <FaBitcoin size={20} color="#f7931a" />,
    },
    { value: "BTC", label: "Bitcoin", icon: <FaBitcoin size={20} /> },
    { value: "SOL", label: "Solana", icon: <FaBitcoin size={20} /> },
    { value: "MATIC", label: "Polygon", icon: <FaBitcoin size={20} /> },
  ];

  return (
    <div className="withdraw-page">
      <div className="withdraw-container">
        <h2 className="withdraw-title">Withdraw</h2>
        <div className="withdraw-coin">
          <label htmlFor="coin-selector">Coin:</label>
          <div className="coin-selector">
            <select
              value={selectedCoin}
              onChange={(e) => setSelectedCoin(e.target.value)}
            >
              {coinOptions.map((coin) => (
                <option key={coin.value} value={coin.value}>
                  {coin.icon} {coin.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="withdraw-balance">
          <label htmlFor="withdraw-balance">Total Balance:</label>
          <span>
            {balance} {selectedCoin}
          </span>
        </div>
        <div className="withdraw-input">
          <label htmlFor="withdraw-input">Withdraw Address</label>
          <div className="input-with-icon">
            <input
              type="text"
              placeholder="Withdraw Address"
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value)}
              required
            />
            <button
              className="icon"
              onClick={() =>
                navigator.clipboard
                  .readText()
                  .then((text) => setWithdrawAddress(text))
              }
            >
              Paste
            </button>
          </div>
        </div>
        <div className="withdraw-input">
          <label htmlFor="amount">Amount</label>
          <div className="input-with-icon">
            <input
              id="amount"
              type="text"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
        </div>
        <button className="withdraw-button" onClick={handleWithdraw}>
          Proceed with withdrawal
        </button>

        <div className="withdrawal-history">
          <h2>Withdrawal History</h2>
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Time</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {withdrawalHistory.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.id}</td>
                  <td>{tx.date}</td>
                  <td>{tx.time}</td>
                  <td>{tx.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
