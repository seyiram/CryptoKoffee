import React, { useEffect, useState } from 'react';
import './ActivityCard.css';
import { getWallet, fetchDonationEventsForWallet } from '../../utils/interact';
import Avatar from '../../assets/icons/Avatar';





const ActivityCard = () => {
  const [activities, setActivities] = useState({ today: [], yesterday: [], lastWeek: [] });
  const [walletAddress, setWalletAddress] = useState(null);


  useEffect(() => {
    const storedAccount = localStorage.getItem("account");
    if (storedAccount) {
      fetchWalletData(storedAccount);
    }
  }, []);

  const fetchWalletData = async (account) => {
    try {
      const walletInfo = await getWallet();
      setWalletAddress(walletInfo.walletAddress);
    } catch (error) {
      console.error("Error fetching wallet data", error);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchDonationEventsForWallet(walletAddress, (donations) => {
        const processedActivities = processDonations(donations);
        setActivities(processedActivities);
      });
    }
  }, [walletAddress]);

  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const processDonations = (donations) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const todayActivities = [];
    const yesterdayActivities = [];
    const lastWeekActivities = [];

    donations.forEach((donation) => {
      const donationDate = new Date(donation.timeStamp);
      const activity = {
        avatar: <Avatar />,
        description: `Donated by ${truncateAddress(donation.donor)}: ${donation.amount} ETH`,
        time: donationDate.toLocaleTimeString(),
        type: 'donation',
      };

      if (donationDate.toDateString() === today.toDateString() && todayActivities.length < 3) {
        todayActivities.push(activity);
      } else if (donationDate.toDateString() === yesterday.toDateString() && yesterdayActivities.length < 3) {
        yesterdayActivities.push(activity);
      } else if (donationDate >= lastWeek && lastWeekActivities.length < 3) {
        lastWeekActivities.push(activity);
      }
    });

    return { today: todayActivities, yesterday: yesterdayActivities, lastWeek: lastWeekActivities };
  };

  const ActivityItem = ({ avatar, description, time, type }) => {
    return (
      <div className="activity-item">
        <div className="activity-avatar">{avatar}</div>
        <div className="activity-details">
          <div className="activity-description">
            {description.includes('Important Item') ? (
              <span className="important-item">{description}</span>
            ) : (
              description
            )}
          </div>
          <div className="activity-time">{time}</div>
        </div>
      </div>
    );
  };

  const ActivitySection = ({ title, activities }) => (
    <div className="activity-section">
      <div className="activity-marker">{title}</div>
      {activities.map((activity, index) => (
        <ActivityItem key={index} {...activity} />
      ))}
    </div>
  );

  return (
    <div className="activity-card">
      <h3>Recent Activities</h3>
      <ActivitySection title="Today" activities={activities.today} />
      <ActivitySection title="Yesterday" activities={activities.yesterday} />
      <ActivitySection title="Last Week" activities={activities.lastWeek} />
    </div>
  );
};

export default ActivityCard;