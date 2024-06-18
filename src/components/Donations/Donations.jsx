import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./Donations.css";
import {
  getWallet,
  fetchDonationEventsForWallet,
  getNetworkType,
} from "../../utils/interact";
import debounce from "lodash/debounce";

const DonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [wallet, setWallet] = useState({});
  const [balance, setBalance] = useState("0.00");
  const [network, setNetwork] = useState("ETH"); // Default to ETH
  const [filter, setFilter] = useState("All time");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const walletInfo = await getWallet();
      setWallet(walletInfo);
      if (walletInfo?.walletAddress) {
        fetchDonationEventsForWallet(walletInfo.walletAddress, (donations) => {
          console.log("Donations here", donations);
          setDonations(donations);
          setFilteredDonations(donations);
        });

        // Set balance from walletInfo
        setBalance(walletInfo.currentBalance);

        const networkType = await getNetworkType(walletInfo.walletAddress);
        setNetwork(networkType);
      }
    };

    fetchData().catch(console.error);
  }, [wallet?.walletAddress]);

  useEffect(() => {
    filterDonations(filter, searchTerm);
  }, [filter, donations, searchTerm]);

  const filterDonations = (period, search) => {
    let filtered = [...donations];
    const now = new Date();
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

    if (search) {
      filtered = filtered.filter(
        (donation) =>
          donation.donor.toLowerCase().includes(search.toLowerCase()) ||
          donation.amount.toString().includes(search) ||
          donation.recipient.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredDonations(filtered);
  };

  const handleSearchChange = debounce((event) => {
    setSearchTerm(event.target.value);
  }, 300);

  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="donations">
      <div className="donations-container">
        <div className="donations-header">
          <h1>Donations</h1>
          <div className="balance">
            <span>Balance</span>
            <span>
              {balance} {network}
            </span>
          </div>
        </div>
        <div className="filters-container">
          <div className="search-bar-container">
            <input
              type="text"
              className="search-bar"
              placeholder="Search by sender or amount"
              onChange={handleSearchChange}
            />
            <FaSearch className="search-icon" />
          </div>
          <div className="filters">
            <select onChange={(e) => setFilter(e.target.value)}>
              <option>All time</option>
              <option>Today</option>
              <option>This week</option>
              <option>This month</option>
            </select>
            <select>
              <option>Recent</option>
              <option>Oldest</option>
            </select>
          </div>
        </div>
        <table className="donations-table">
          <thead>
            <tr>
              <th>Donor</th>
              <th>Amount</th>
              <th>Recipient</th>
              <th>Date and Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonations.map((donation, index) => (
              <tr key={index}>
                <td>{truncateAddress(donation.donor)}</td>
                <td>
                  {donation.amount} {network}
                </td>
                <td>{truncateAddress(donation.recipient)}</td>
                <td>{new Date(donation.timeStamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationsPage;