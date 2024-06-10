import React from 'react';
import './TopDonors.css';

const donors = [
  { name: 'Don Hernandez', amount: '$3,350.00', avatar: '/path-to-avatar1.jpg' },
  { name: 'Martin Sherman', amount: '$2,010.00', avatar: '/path-to-avatar2.jpg' },
  { name: 'Bradley Lawson', amount: '$1,800.00', avatar: '/path-to-avatar3.jpg' },
  { name: 'Jason Lawson', amount: '$1,210.00', avatar: '/path-to-avatar4.jpg' },
  { name: 'Minerva Sherman', amount: '$960.00', avatar: '/path-to-avatar5.jpg' },
  { name: 'Henry Bennett', amount: '$800.00', avatar: '/path-to-avatar6.jpg' },
];

const TopDonors = () => {
  return (
    <div className="top-donors">
      <h3>Top Donors</h3>
      <ul className="donors-list">
        {donors.map((donor, index) => (
          <li key={index} className="donor-item">
            <img src={donor.avatar} alt={donor.name} className="donor-avatar" />
            <div className="donor-info">
              <div className="donor-name">{donor.name}</div>
              <div className="donor-amount">{donor.amount}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopDonors;
