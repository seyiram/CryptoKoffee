import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaCalendarAlt, FaWallet, FaChartLine, FaChartBar, FaChartArea } from "react-icons/fa";
import "./OverviewCard.css";
import { ethers } from "ethers";
import { useWallet } from "../../contexts/WalletContext";
import { useDonationEvents } from "../../hooks/useDonationEvents";
import { useRecipientProfile } from "../../hooks/useRecipientProfile";

const CustomTooltip = ({ active = false, payload = [], label = "" }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label} : $${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

const OverviewCard = () => {
  // Use WalletContext and React Query
  const { account, provider } = useWallet();
  const { data: donationHistory = [], isLoading } = useDonationEvents(account);
  const { data: recipientProfile } = useRecipientProfile(account);
  const [balance, setBalance] = useState("0.00");
  
  // Fetch wallet balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (provider && account) {
        try {
          const balanceWei = await provider.getBalance(account);
          const balanceEth = ethers.formatEther(balanceWei);
          setBalance(balanceEth);
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };

    fetchBalance();
  }, [provider, account]);
  
  const noDonations = !isLoading && donationHistory.length === 0;

  // Format donation amounts with user-friendly precision
  const formatDonationAmount = (amount) => {
    const num = Number(amount);
    
    if (num === 0) return "0.000";
    
    // For very small amounts, show meaningful context
    if (num < 0.000001) {
      return "< 0.000001"; // Less than 1 microETH
    }
    
    if (num < 0.001) {
      // Show up to 8 decimals for small amounts, but trim trailing zeros
      const formatted = num.toFixed(8);
      return formatted.replace(/\.?0+$/, ''); // Remove trailing zeros
    }
    
    if (num < 1) {
      return num.toFixed(6); // 6 decimals for small amounts
    }
    
    if (num < 1000) {
      return num.toFixed(3); // 3 decimals for normal amounts
    }
    
    // For large amounts, use comma separators
    return num.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 3 
    });
  };

  // Add context for very small amounts with helpful explanations
  const formatAmountWithContext = (amount) => {
    const num = Number(amount);
    const formatted = formatDonationAmount(amount);
    
    if (num === 0) {
      return {
        display: "0.000",
        context: null,
        isVerySmall: false
      };
    }
    
    if (num > 0 && num < 0.000001) {
      return {
        display: "< 0.000001",
        context: "Very small testnet amount",
        isVerySmall: true,
        tooltip: "Gas fees consumed most of the donation"
      };
    }
    
    if (num > 0 && num < 0.001) {
      return {
        display: formatted,
        context: "Small testnet amount",
        isVerySmall: true,
        tooltip: `Exact amount: ${num.toFixed(12)} ETH`
      };
    }
    
    return {
      display: formatted,
      context: null,
      isVerySmall: false
    };
  };

  const processDonations = (donations) => {
    const now = new Date();
    const oneWeekAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 7
    );
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const twoWeeksAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 14
    );
    const twoMonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 2,
      now.getDate()
    );

    // Separate received vs sent donations
    const receivedDonations = donations.filter(donation => 
      donation.recipient.toLowerCase() === account.toLowerCase()
    );

    const filterDonations = (start, end) =>
      receivedDonations.filter((donation) => {
        const donationDate = new Date(donation.timeStamp);
        return donationDate >= start && donationDate < end;
      });

    const sumDonations = (donations) =>
      donations.reduce((sum, donation) => sum + parseFloat(donation.amount), 0);

    const donationsThisWeek = sumDonations(filterDonations(oneWeekAgo, now));
    const donationsLastWeek = sumDonations(filterDonations(twoWeeksAgo, oneWeekAgo));
    const donationsThisMonth = sumDonations(filterDonations(oneMonthAgo, now));
    const donationsLastMonth = sumDonations(filterDonations(twoMonthsAgo, oneMonthAgo));

    // Generate chart data (simplified for now)
    const chartData = [
      { name: "Week 1", amount: donationsLastWeek },
      { name: "Week 2", amount: donationsThisWeek },
    ];

    return {
      donationsThisWeek,
      donationsLastWeek,
      donationsThisMonth,
      donationsLastMonth,
      chartData
    };
  };

  // Calculate donation stats from the data
  const stats = React.useMemo(() => {
    // Use subgraph profile data if available, otherwise fall back to processing events
    if (recipientProfile) {
      // use total received for both week and month (subgraph doesn't have time-based aggregation yet)
      return {
        donationsThisWeek: recipientProfile.totalReceived || 0,
        donationsLastWeek: 0, // Not available from subgraph yet
        donationsThisMonth: recipientProfile.totalReceived || 0,
        donationsLastMonth: 0, // Not available from subgraph yet
        totalReceived: recipientProfile.totalReceived || 0,
        donationCount: recipientProfile.donationCount || 0,
        uniqueDonorCount: recipientProfile.uniqueDonorCount || 0,
        chartData: []
      };
    }

    if (!donationHistory.length) {
      return {
        donationsThisWeek: 0,
        donationsLastWeek: 0,
        donationsThisMonth: 0,
        donationsLastMonth: 0,
        totalReceived: 0,
        donationCount: 0,
        uniqueDonorCount: 0,
        chartData: []
      };
    }

    return {
      ...processDonations(donationHistory),
      totalReceived: donationHistory
        .filter(d => d.recipient.toLowerCase() === account.toLowerCase())
        .reduce((sum, d) => sum + parseFloat(d.amount), 0),
      donationCount: donationHistory.filter(d => d.recipient.toLowerCase() === account.toLowerCase()).length,
      uniqueDonorCount: new Set(
        donationHistory
          .filter(d => d.recipient.toLowerCase() === account.toLowerCase())
          .map(d => d.donor.toLowerCase())
      ).size
    };
  }, [donationHistory, recipientProfile, account]);

  const calculatePercentageChange = (current, previous) => {
    if (previous === 0 || isNaN(previous)) return { value: current === 0 ? "0%" : "+100%", type: current === 0 ? "neutral" : "positive" };
    if (isNaN(current)) return { value: "0%", type: "neutral" };
    const change = ((current - previous) / previous) * 100;
    const value = `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
    const type = change > 0 ? "positive" : change < 0 ? "negative" : "neutral";
    return { value, type };
  };


  return (
    <div className="donation-card">
      <div className="donation-header">
        <h3>Overview</h3>
        <div className="month-dropdown">
          <FaCalendarAlt className="calendar-icon" />
          <select>
            <option>Last Month</option>
            
            <option>January</option>
            <option>February</option>
            <option>March</option>
          </select>
        </div>
      </div>
      <div className="donation-stats">
        <div className="donation-today">
          <FaWallet className="stat-icon" />
          <div className="amount">{Number(balance).toFixed(6)} ETH</div>
          <div className="label">Current Balance</div>
          <div className="percentage neutral">0%</div>
        </div>
        <div className="donation-week">
          <FaChartLine className="stat-icon" />
          <div className="amount-container">
            <div 
              className="amount"
              title={formatAmountWithContext(stats.totalReceived).tooltip}
            >
              {formatAmountWithContext(stats.totalReceived).display} ETH
            </div>
            {formatAmountWithContext(stats.totalReceived).context && (
              <div className="amount-context">{formatAmountWithContext(stats.totalReceived).context}</div>
            )}
          </div>
          <div className="label">Total Received ({stats.donationCount} donation{stats.donationCount !== 1 ? 's' : ''})</div>
          <div className="donation-info">
            {stats.uniqueDonorCount} unique donor{stats.uniqueDonorCount !== 1 ? 's' : ''}
          </div>
        </div>
        <div className="donation-month">
          <FaChartBar className="stat-icon" />
          <div className="amount-container">
            <div 
              className="amount"
              title={formatAmountWithContext(stats.totalReceived).tooltip}
            >
              {formatAmountWithContext(stats.totalReceived).display} ETH
            </div>
            {formatAmountWithContext(stats.totalReceived).context && (
              <div className="amount-context">{formatAmountWithContext(stats.totalReceived).context}</div>
            )}
          </div>
          <div className="label">Donation Earnings</div>
          <div className="donation-info">
            {recipientProfile ? 
              `Since ${new Date(recipientProfile.firstDonationTimestamp).toLocaleDateString()}` : 
              'All time'
            }
          </div>
        </div>
      </div>

      {noDonations ? (
        <div className="no-data-message">
          <FaChartArea className="no-data-icon" />
          No donations data to display.
        </div>
      ) : (
        <div className="donation-chart">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={donationHistory
                .filter(event => event.recipient.toLowerCase() === account.toLowerCase())
                .map((event) => ({
                  name: new Date(event.timeStamp).toLocaleDateString(),
                  donation: parseFloat(event.amount),
                }))
              }
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#f79e61", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="donation"
                stroke="#f79e61"
                strokeWidth={3}
                activeDot={{ r: 8, fill: "#e67e22" }}
                dot={{ fill: "#f79e61", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default OverviewCard;
