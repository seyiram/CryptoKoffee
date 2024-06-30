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
  initializeProvider,
  getContract,
  getWallet,
  fetchDonationEventsForWallet,
} from "../../utils/interact";

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
  const [donationHistory, setDonationHistory] = useState([]);
  const [donationsThisWeek, setDonationsThisWeek] = useState(0);
  const [donationsLastWeek, setDonationsLastWeek] = useState(0);
  const [donationsThisMonth, setDonationsThisMonth] = useState(0);
  const [donationsLastMonth, setDonationsLastMonth] = useState(0);
  const [contract, setContract] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [previousBalance, setPreviousBalance] = useState(0);
  const [noDonations, setNoDonations] = useState(false);

  useEffect(() => {
    async function fetchData() {
      await initializeProvider(); // Initialize provider and signer

      const contractInstance = await getContract();
      setContract(contractInstance);

      const walletInfo = await getWallet();
      setWallet(walletInfo);

      // store previous balance
      setPreviousBalance(walletInfo?.currentBalance || 0);
    }

    fetchData().catch(console.error);
  }, []);

  useEffect(() => {
    const getData = async () => {
      if (wallet?.walletAddress) {
        fetchDonationEventsForWallet(wallet.walletAddress, (donations) => {
          setDonationHistory(donations);
          if (donations) {
            processDonations(donations);
            setNoDonations(false);
          } else {
            setNoDonations(true);
          }
        });
      } else {
        setNoDonations(true);
      }
    };

    getData().catch(console.error);
  }, [wallet?.walletAddress]);

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

    const filterDonations = (start, end) =>
      donations.filter((donation) => {
        const donationDate = new Date(donation.timeStamp);
        return donationDate >= start && donationDate < end;
      });

    const sumDonations = (donations) =>
      donations.reduce((sum, donation) => sum + parseFloat(donation.amount), 0);

    setDonationsThisWeek(sumDonations(filterDonations(oneWeekAgo, now)));
    setDonationsLastWeek(
      sumDonations(filterDonations(twoWeeksAgo, oneWeekAgo))
    );
    setDonationsThisMonth(sumDonations(filterDonations(oneMonthAgo, now)));
    setDonationsLastMonth(
      sumDonations(filterDonations(twoMonthsAgo, oneMonthAgo))
    );
  };

  const calculatePercentageChange = (current, previous) => {
    if (previous === 0 || isNaN(previous)) return current === 0 ? "0%" : "+100%";
    if (isNaN(current)) return "0%"; // Ensure current is not NaN
    const change = ((current - previous) / previous) * 100;
    return `${change.toFixed(2)}%`;
  };


  const currentBalanceChange = calculatePercentageChange(
    Number(wallet?.currentBalance || 0),
    Number(previousBalance)
  );

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
          <div className="amount">
            ${wallet ? Number(wallet?.currentBalance).toFixed(6) : "0.00"}
          </div>
          <div className="label">Current Balance</div>
          <div className="percentage">{currentBalanceChange}</div>
        </div>
        <div className="donation-week">
          <div className="amount">{Number(donationsThisWeek)?.toFixed(3)}</div>
          <div className="label">Donated this week</div>
          <div className="percentage">
            {calculatePercentageChange(donationsThisWeek, donationsLastWeek)}
          </div>
        </div>
        <div className="donation-month">
          <div className="amount">{Number(donationsThisMonth)?.toFixed(3)}</div>
          <div className="label">Donated this month</div>
          <div className="percentage">
            {calculatePercentageChange(donationsThisMonth, donationsLastMonth)}
          </div>
        </div>
      </div>

      {noDonations ? (
        <p className="no-data-message">No donations data to display.</p>
      ) : (
        <div className="donation-chart">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={donationHistory.map((event) => ({
                name: new Date(event.timeStamp).toLocaleDateString(),
                donation: parseFloat(event.amount),
              }))}
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
                stroke="#32CD32"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default OverviewCard;
