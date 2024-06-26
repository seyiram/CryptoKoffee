import React from "react";
import "./TopDonors.css";
import { getWallet, fetchDonationEventsForWallet } from "../../utils/interact";

const TopDonors = () => {
  const [donationHistory, setDonationHistory] = React.useState([]);
  const [wallet, setWallet] = React.useState({});
  const [noDonations, setNoDonations] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      const walletInfo = await getWallet();
      setWallet(walletInfo);
      if (walletInfo?.walletAddress) {
        fetchDonationEventsForWallet(walletInfo.walletAddress, (donations) => {
          setDonationHistory(donations);

          if (donations.length === 0) {
            setNoDonations(true);
          }
        });
      } else {
        setNoDonations(true);
      }
    };

    fetchData().catch(console.error);
  }, [wallet?.walletAddress]);

  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const generateAvatar = (address) => {
    const initials = address.slice(0, 2).toUpperCase();
    return `https://ui-avatars.com/api/?name=${initials}`;
  };

  const processDonations = (donations) => {
    const donorMap = {};
    donations.forEach((donation) => {
      const donorAddress = donation.donor;
      if (donorMap[donorAddress]) {
        donorMap[donorAddress].amount = (
          parseFloat(donorMap[donorAddress].amount) +
          parseFloat(donation.amount)
        ).toFixed(2);
      } else {
        donorMap[donorAddress] = {
          address: donorAddress,
          amount: parseFloat(donation.amount).toFixed(2),
          avatar: generateAvatar(donorAddress),
        };
      }
    });

    return Object.values(donorMap)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6);
  };

  const topDonors = processDonations(donationHistory);

  console.log("donationHistory:", donationHistory)

  return (
    <div className="top-donors">
      <h3>Top Donors</h3>
      {noDonations ? (
        <p className="no-data-message">No donors to display.</p>
      ) : (
        <ul className="donors-list">
          {topDonors.map((donor, index) => (
            <li key={`${donor.address}-${donor.amount}`} className="donor-item">
              <img
                src={donor.avatar}
                alt={donor.address}
                className="donor-avatar"
              />
              <div className="donor-info">
                <div className="donor-name">
                  {truncateAddress(donor.address)}
                </div>
                <div className="donor-amount">{donor.amount} ETH</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopDonors;
