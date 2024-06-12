import React, { useState, useEffect } from 'react';
import { FaBitcoin, FaEthereum } from 'react-icons/fa';
import { GoPaste } from 'react-icons/go';
import './Withdraw.css';

const Withdraw = () => {
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCoin, setSelectedCoin] = useState('BTC');

  const handleWithdraw = () => {
    // Handle the withdrawal logic here
    console.log(`Withdrawing ${amount} to ${withdrawAddress}`);
  };

  // Sample withdrawal history data
  const withdrawalHistory = [
    { id: '0x234...231', date: 'June 6, 2022', time: '11:23 am EST', amount: '0.5 ETH' },
    { id: '0x324...023', date: 'June 2, 2022', time: '4:45 pm EST', amount: '12.5 ETH' },
    { id: '0x546...322', date: 'June 2, 2022', time: '12:25 pm EST', amount: '3.5 ETH' },
    { id: '0x416...231', date: 'May 28, 2022', time: '3:22 pm EST', amount: '1.5 ETH' },
    { id: '0x232...653', date: 'May 28, 2022', time: '6:42 pm EST', amount: '21 ETH' },
  ];

  useEffect(() => {
    // Logic to detect network and set as selectedCoin
    // This is a placeholder, replace it with actual network detection logic
    const detectedNetwork = 'BTC'; // Replace this with actual network detection logic
    setSelectedCoin(detectedNetwork);
  }, []);

  const coinOptions = [
    { value: 'ETH', label: 'Ethereum', icon: <FaEthereum size={20} color="#3c3c3d" /> },
    { value: 'OP', label: 'Optimism', icon: <FaBitcoin size={20} color="#f7931a" /> },
    // Add more coins as needed
  ];

  return (
    <div className="withdraw-page">
      <div className="withdraw-container">
        <h2 className="withdraw-title">Withdraw</h2>
        <div className="withdraw-coin">
          <label>Coin:</label>
          <div className="coin-selector">
            <select value={selectedCoin} onChange={(e) => setSelectedCoin(e.target.value)}>
              {coinOptions.map((coin) => (
                <option key={coin.value} value={coin.value}>
                  {coin.icon} {coin.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="withdraw-balance">
          <label>Total Balance:</label>
          <span>0.0121285425 {selectedCoin}</span>
        </div>
        <div className="withdraw-input">
          <label>Withdraw Address</label>
          <div className="input-with-icon">
            <input
              type="text"
              placeholder="Withdraw Address"
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value)}
            />
            <p className="icon" onClick={() => navigator.clipboard.readText().then(text => setWithdrawAddress(text))}>paste</p>
          </div>
        </div>
        <div className="withdraw-input">
          <label>Amount</label>
          <div className="input-with-icon">
            <input
              type="text"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <button className="withdraw-button" onClick={handleWithdraw}>Proceed with withdrawal</button>
        
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
