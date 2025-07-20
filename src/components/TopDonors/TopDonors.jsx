import React from "react";
import { FaTrophy, FaMedal, FaAward, FaSpinner, FaUsers, FaGift } from "react-icons/fa";
import "./TopDonors.css";
import { useWallet } from "../../contexts/WalletContext";
import { useDonorSummaries } from "../../hooks/useDonorSummaries";
import { getNetworkCurrency } from "../../utils/coinUtils";

const TopDonors = () => {
  const { account, network } = useWallet();
  const { data: donorSummaries = [], isLoading } = useDonorSummaries(account);
  
  const noDonations = !isLoading && donorSummaries.length === 0;

  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const generateAvatar = (address) => {
    const initials = address.slice(0, 2).toUpperCase();
    const colors = ['e74c3c', '3498db', '2ecc71', 'f39c12', '9b59b6', '1abc9c'];
    const colorIndex = parseInt(address.slice(-1), 16) % colors.length;
    return `https://ui-avatars.com/api/?name=${initials}&background=${colors[colorIndex]}&color=fff&size=128`;
  };

  // Get network currency using shared utility
  const networkCurrency = getNetworkCurrency(network?.chainId);

  // Format donation amounts with user-friendly precision
  const formatDonationAmount = (amount) => {
    const num = Number(amount);
    
    if (num === 0) return "0.000";
    if (num < 0.000001) return "< 0.000001";
    if (num < 0.001) {
      const formatted = num.toFixed(8);
      return formatted.replace(/\.?0+$/, '');
    }
    if (num < 1) return num.toFixed(6);
    if (num < 1000) return num.toFixed(3);
    
    return num.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 3 
    });
  };

  // Get ranking icon based on position
  const getRankingIcon = (index) => {
    switch (index) {
      case 0: return <FaTrophy className="rank-icon gold" />;
      case 1: return <FaMedal className="rank-icon silver" />;
      case 2: return <FaAward className="rank-icon bronze" />;
      default: return <span className="rank-number">#{index + 1}</span>;
    }
  };

  // Format donor summaries for display
  const topDonors = donorSummaries.slice(0, 6).map((donor, index) => ({
    address: donor.donor,
    amount: parseFloat(donor.totalAmount),
    formattedAmount: formatDonationAmount(donor.totalAmount),
    avatar: generateAvatar(donor.donor),
    donationCount: donor.donationCount,
    rank: index + 1,
    rankIcon: getRankingIcon(index)
  }));


  return (
    <div className="top-donors">
      <h3>Top Donors</h3>
      {isLoading ? (
        <div className="loading-spinner">
          <FaSpinner className="spinner" />
          <p>Loading top donors...</p>
        </div>
      ) : noDonations ? (
        <div className="no-data-message">
          <p>No donors to display.</p>
          <span>Be the first to receive donations!</span>
        </div>
      ) : (
        <ul className="donors-list">
          {topDonors.map((donor, index) => (
            <li key={`${donor.address}-${donor.amount}`} className="donor-item">
              <img
                src={donor.avatar}
                alt={donor.address}
                className="donor-avatar"
              />
              <div className="donor-rank">
                {donor.rankIcon}
              </div>
              <div className="donor-info">
                <div className="donor-name">
                  {truncateAddress(donor.address)}
                </div>
                <div className="donor-stats">
                  <span className="donor-count">{donor.donationCount} donation{donor.donationCount !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <div className="donor-amount">
                <span className="amount-value">{donor.formattedAmount}</span>
                <span className="amount-currency">{networkCurrency}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopDonors;
