import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaCalendarAlt } from 'react-icons/fa';
import './DonationCard.css';

const data = [
  { name: '01/03', donation: 4000 },
  { name: '01/10', donation: 3000 },
  { name: '01/17', donation: 2000 },
  { name: '01/24', donation: 2780 },
  { name: '01/31', donation: 1890 },
  { name: '02/07', donation: 2390 },
  { name: '02/14', donation: 3490 },
  { name: '02/21', donation: 3000 },
  { name: '02/28', donation: 2000 },
  { name: '03/06', donation: 2780 },
  { name: '03/13', donation: 1890 },
  { name: '03/20', donation: 2390 },
];

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

const DonationCard = () => {
  return (
    <div className="donation-card">
      <div className="donation-header">
        <h3>Donations</h3>
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
          <div className="amount">$6,25.50</div>
          <div className="label">Donated today</div>
          <div className="percentage">+31%</div>
        </div>
        <div className="donation-week">
          <div className="amount">$40,094.22</div>
          <div className="label">Donated this week</div>
        </div>
        <div className="donation-month">
          <div className="amount">$17,204.00</div>
          <div className="label">Donated this month</div>
        </div>
      </div>
      <div className="donation-chart">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip  />} cursor={{ stroke: 'red', strokeWidth: 2 }} />
            <Line type="monotone" dataKey="donation" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DonationCard;
