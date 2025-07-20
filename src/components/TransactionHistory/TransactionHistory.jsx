import React, { useEffect, useState } from "react";
import { FaSearch, FaCopy, FaCoins, FaInbox, FaSpinner, FaWallet } from "react-icons/fa";
import { toast } from "react-toastify";
import "./TransactionHistory.css";
import { useWallet } from "../../contexts/WalletContext";
import { useDonationEvents } from "../../hooks/useDonationEvents";
import { getNetworkCurrency } from "../../utils/coinUtils";
import { ethers } from "ethers";
import debounce from "lodash/debounce";
import TransactionHistorySkeleton from "../../skeleton-loaders/TransactionHistorySkeleton";

const TransactionHistory = () => {
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [balance, setBalance] = useState("0.00");
  const [filter, setFilter] = useState("All time");
  const [sortOrder, setSortOrder] = useState("Recent");
  const [searchTerm, setSearchTerm] = useState("");

  // Use WalletContext and React Query for wallet information and donation data
  const { account, network, provider, isConnected } = useWallet();
  const { data: donations = [], isLoading } = useDonationEvents(account);

  // Fetch wallet balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (!account || !isConnected || !provider) {
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
  }, [account, isConnected, provider]);

  useEffect(() => {
    filterAndSortDonations(filter, searchTerm, sortOrder);
  }, [filter, donations, searchTerm, sortOrder]);

  const filterAndSortDonations = (period, search, sort) => {
    let filtered = [...donations];
    const now = new Date();
    
    // Apply time filter
    switch (period) {
      case "Today":
        filtered = filtered.filter(
          (donation) =>
            new Date(donation.timeStamp) >
            new Date(now.getFullYear(), now.getMonth(), now.getDate())
        );
        break;
      case "This week":
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        filtered = filtered.filter(
          (donation) => new Date(donation.timeStamp) > startOfWeek
        );
        break;
      case "This month":
        filtered = filtered.filter(
          (donation) =>
            new Date(donation.timeStamp) >
            new Date(now.getFullYear(), now.getMonth(), 1)
        );
        break;
      default:
        break;
    }

    // Apply search filter
    if (search) {
      filtered = filtered.filter(
        (donation) =>
          donation.donor.toLowerCase().includes(search.toLowerCase()) ||
          donation.amount.toString().includes(search) ||
          donation.recipient.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.timeStamp);
      const dateB = new Date(b.timeStamp);
      return sort === "Recent" ? dateB - dateA : dateA - dateB;
    });

    setFilteredDonations(filtered);
  };

  const handleSearchChange = debounce((event) => {
    setSearchTerm(event.target.value);
  }, 300);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success("Address copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy address");
      });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get network currency using shared utility
  const networkCurrency = getNetworkCurrency(network?.chainId);

  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <div className="donations">
        <div className="donations-container">
          <div className="empty-state">
            <FaWallet className="empty-icon" />
            <h3 className="empty-title">Wallet Not Connected</h3>
            <p className="empty-description">
              Please connect your wallet to view your donation history.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <TransactionHistorySkeleton />;
  }

  return (
    <div className="donations">
      <div className="donations-container">
        {/* Header Section */}
        <div className="donations-header">
          <h1 className="donations-title">Donations</h1>
          <div className="donations-balance-card">
            <span className="donations-balance-label">Current Balance</span>
            <div className="donations-balance-amount">
              <FaWallet className="donations-balance-icon" />
              {Number(balance).toFixed(6)}
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filters-container">
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search by address or amount..."
                onChange={handleSearchChange}
              />
              <FaSearch className="search-icon" />
            </div>
            <div className="filters-group">
              <select 
                className="filter-select" 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All time">All time</option>
                <option value="Today">Today</option>
                <option value="This week">This week</option>
                <option value="This month">This month</option>
              </select>
              <select 
                className="filter-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="Recent">Most Recent</option>
                <option value="Oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="table-section">
          <div className="table-header">
            <h2 className="table-title">
              <FaCoins style={{ marginRight: '0.5rem', color: '#f79e61' }} />
              Transaction History
            </h2>
            <span className="donations-count">
              {filteredDonations.length} transaction{filteredDonations.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="table-container">
            {filteredDonations.length === 0 ? (
              <div className="empty-state">
                <FaInbox className="empty-icon" />
                <h3 className="empty-title">No donations found</h3>
                <p className="empty-description">
                  {searchTerm || filter !== "All time" 
                    ? "Try adjusting your search or filter criteria to see more results."
                    : "You haven't received any donations yet. Share your profile to start receiving support!"}
                </p>
              </div>
            ) : (
              <table className="donations-table">
                <thead>
                  <tr>
                    <th>Donor</th>
                    <th>Amount</th>
                    <th>Recipient</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonations.map((donation, index) => (
                    <tr key={index}>
                      <td>
                        <div className="address-cell">
                          <span className="address-text">
                            {truncateAddress(donation.donor)}
                          </span>
                          <button 
                            className="copy-btn"
                            onClick={() => copyToClipboard(donation.donor)}
                            title="Copy address"
                          >
                            <FaCopy />
                          </button>
                        </div>
                      </td>
                      <td>
                        <span className="amount-cell">
                          {Number(donation.amount).toFixed(6)}
                          <span className="amount-currency">{networkCurrency}</span>
                        </span>
                      </td>
                      <td>
                        <div className="address-cell">
                          <span className="address-text">
                            {truncateAddress(donation.recipient)}
                          </span>
                          <button 
                            className="copy-btn"
                            onClick={() => copyToClipboard(donation.recipient)}
                            title="Copy address"
                          >
                            <FaCopy />
                          </button>
                        </div>
                      </td>
                      <td>
                        <span className="date-cell">
                          {formatDate(donation.timeStamp)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;