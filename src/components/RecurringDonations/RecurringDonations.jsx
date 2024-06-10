import React from 'react';
import './RecurringDonations.css';

const recurringDonations = [
  { date: '07/19/2017', count: 3, amount: '$3,350.00' },
  { date: '06/22/2017', count: 20, amount: '$2,010.00' },
  { date: '10/20/2017', count: 13, amount: '$1,800.00' },
  { date: '11/16/2017', count: 9, amount: '$1,210.00' },
  { date: '12/22/2017', count: 11, amount: '$960.00' },
  { date: '01/29/2017', count: 30, amount: '$800.00' },
];

const RecurringDonations = () => {
  return (
    <div className="recurring-donations">
      <h3>Recurring Donations</h3>
      <table className="recurring-donations-table">
        <thead>
          <tr>
            <th>Scheduled</th>
            <th>Count</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {recurringDonations.map((donation, index) => (
            <tr key={index}>
              <td>{donation.date}</td>
              <td>{donation.count}</td>
              <td>{donation.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecurringDonations;
