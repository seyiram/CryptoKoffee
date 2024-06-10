import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import './DonationsByType.css';

const data = [
  { name: 'General', value: 23, color: '#0088FE' },
  { name: 'Medical', value: 19, color: '#00C49F' },
  { name: 'Mission Trips', value: 14, color: '#FFBB28' },
  { name: 'Food', value: 9, color: '#FF8042' },
  { name: 'Home', value: 6, color: '#8884d8' },
];

const DonationsByType = () => {
  return (
    <div className="donations-by-type">
      <h3>Donations By Type</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie dataKey="value" data={data} innerRadius={50} outerRadius={70} fill="#8884d8" paddingAngle={5}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <ul className="donation-types-list">
        {data.map((entry, index) => (
          <li key={index}>
            <span className="dot" style={{ backgroundColor: entry.color }}></span>
            {entry.name} <span className="percentage">{entry.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonationsByType;
