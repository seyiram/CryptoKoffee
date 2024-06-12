import React from 'react';
import { FaSearch } from 'react-icons/fa';
import './Donations.css';

const donations = [
  {
    sender: 'joshawes0me221',
    amount: '0.1 BTC',
    message: 'Hey, what do you think about 0xHearts? I want to order new design for my business, do you have any reviews about these guys?',
    date: '20.08.2023, 18:31:31',
  },
  {
    sender: '0xe52041f096b7913274...',
    amount: '0.001 ETH',
    message: 'No text.',
    date: '20.08.2023, 18:23:31',
  },
  {
    sender: '0xfa0e88b4b2496f6f671...',
    amount: '0.05200671 ETH',
    message: 'No text.',
    date: '17.08.2023, 00:39:24',
  },
  {
    sender: 'Megaanon',
    amount: '8.88 LTC',
    message: 'AAAAAAA!!!!!!!!',
    date: '10.08.2023, 17:01:33',
  },
  {
    sender: '0x3fC91A3adf70395C4...',
    amount: '0.001 ETH',
    message: 'No text.',
    date: '10.08.2023, 16:55:10',
  },
  {
    sender: 'MrUltimaGamer78',
    amount: '1.21 ETH',
    message: 'bro i donated all my cash xDDDD',
    date: '10.08.2023, 16:54:22',
  },
  {
    sender: '0xe72c1941be3ec57673...',
    amount: '0.00001 ETH',
    message: 'pls take my fund(s)',
    date: '09.08.2023, 21:33:10',
  },
  {
    sender: 'MafiaKing',
    amount: '0.1 BTC',
    message: 'brooooo your streams helped me! just take my crypto and use it for all your goals!',
    date: '06.08.2023, 15:08:13',
  },
  {
    sender: '1F3Ui6S4oi6pDGK79p9...',
    amount: '0.001398 BTC',
    message: 'No text.',
    date: '04.08.2023, 07:30:24',
  },
  {
    sender: 'Launch Site',
    amount: '0.00031 ETH',
    message: 'omg did we launch?..',
    date: '03.08.2023, 11:31:29',
  },
  {
    sender: '0x3fC91A3adf70395C4...',
    amount: '1.2 ETH',
    message: 'No text.',
    date: '02.08.2023, 10:25:49',
  },
];

const DonationsPage = () => {
  return (
    <div className="donations">
      <div className="donations-container">
        <div className="donations-header">
          <h1>Donations</h1>
          <div className="balance">
            <span>Balance</span>
            <span>3.014072 ETH</span>
          </div>
        </div>
        <div className="filters-container">
          <div className="search-bar-container">
            <input type="text" className="search-bar" placeholder="Search by sender or amount" />
            <FaSearch className="search-icon" />
          </div>
          <div className="filters">
            <select>
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
              <th>Sender</th>
              <th>Amount</th>
              <th>Message</th>
              <th>Date and Time</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation, index) => (
              <tr key={index}>
                <td>{donation.sender}</td>
                <td>{donation.amount}</td>
                <td>{donation.message}</td>
                <td>{donation.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationsPage;
