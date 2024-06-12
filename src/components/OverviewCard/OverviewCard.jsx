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
import { FaCalendarAlt } from "react-icons/fa";
import "./OverviewCard.css";
import {
  getBalance,
  getDonationsThisWeek,
  getDonationsThisMonth,
  getDonationHistory,
} from "../../utils/interact";

const CustomTooltip = ({ active, payload, label }) => {
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
  const [balance, setBalance] = useState("0.00");
  const [donationsThisWeek, setDonationsThisWeek] = useState("0.00");
  const [donationsThisMonth, setDonationsThisMonth] = useState("0.00");
  const [donationHistory, setDonationHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const balance = await getBalance();
      const donationsThisWeek = await getDonationsThisWeek();
      const donationsThisMonth = await getDonationsThisMonth();
      const donationHistory = await getDonationHistory();

      setBalance(balance);
      setDonationsThisWeek(donationsThisWeek);
      setDonationsThisMonth(donationsThisMonth);
      setDonationHistory(donationHistory);
    };
    fetchData();
  }, []);

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
            {/* Add more months as needed */}
          </select>
        </div>
      </div>
      <div className="donation-stats">
        <div className="donation-today">
          <div className="amount">${parseFloat(balance).toLocaleString()}</div>
          <div className="label">Current Balance</div>
          <div className="percentage">+31%</div>
        </div>
        <div className="donation-week">
          <div className="amount">
            ${parseFloat(donationsThisWeek).toLocaleString()}
          </div>
          <div className="label">Donated this week</div>
          <div className="percentage">+20%</div>
        </div>
        <div className="donation-month">
          <div className="amount">
            ${parseFloat(donationsThisMonth).toLocaleString()}
          </div>
          <div className="label">Donated this month</div>
          <div className="percentage">-16%</div>
        </div>
      </div>
      <div className="donation-chart">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={donationHistory}>
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
              stroke="#32CD32"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OverviewCard;
