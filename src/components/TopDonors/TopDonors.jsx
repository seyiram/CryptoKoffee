import React from 'react';
import './TopDonors.css';

const donors = [
  { name: 'Don Hernandez', amount: '$3,350.00', avatar: 'https://ui-avatars.com/api/?name=Don+Hernandez' },
  { name: 'Martin Sherman', amount: '$2,010.00', avatar: 'https://ui-avatars.com/api/?name=Martin+Sherman' },
  { name: 'Bradley Lawson', amount: '$1,800.00', avatar: 'https://ui-avatars.com/api/?name=Bradley+Lawson' },
  { name: 'Jason Lawson', amount: '$1,210.00', avatar: 'https://ui-avatars.com/api/?name=Jason+Lawson' },
  { name: 'Minerva Sherman', amount: '$960.00', avatar: 'https://ui-avatars.com/api/?name=Minerva+Sherman' },
  { name: 'Henry Bennett', amount: '$800.00', avatar: 'https://ui-avatars.com/api/?name=Henry+Bennett' },
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
