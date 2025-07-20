import React from 'react';
import './ActivityCard.css';
import { FaHandHoldingHeart, FaInbox, FaWallet } from 'react-icons/fa';
import { useWallet } from '../../contexts/WalletContext';
import { useDonationEvents } from '../../hooks/useDonationEvents';





const ActivityCard = () => {
  // Use WalletContext and React Query
  const { account, isConnected } = useWallet();
  const { data: donationHistory = [], isLoading } = useDonationEvents(account);

  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Process donation data into activities by day
  const activities = React.useMemo(() => {
    if (!donationHistory.length) {
      return { today: [], yesterday: [], lastWeek: [] };
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const todayActivities = [];
    const yesterdayActivities = [];
    const lastWeekActivities = [];

    donationHistory.forEach((donation) => {
      const donationDate = new Date(donation.timeStamp);
      const isReceived = donation.recipient.toLowerCase() === account.toLowerCase();
      const isSent = donation.donor.toLowerCase() === account.toLowerCase();
      
      let activity;
      if (isReceived) {
        activity = {
          avatar: <FaHandHoldingHeart className="donation-icon received" />,
          description: `Received ${donation.amount} ETH from ${truncateAddress(donation.donor)}`,
          time: donationDate.toLocaleTimeString(),
          type: 'donation-received',
        };
      } else if (isSent) {
        activity = {
          avatar: <FaHandHoldingHeart className="donation-icon sent" />,
          description: `Sent ${donation.amount} ETH to ${truncateAddress(donation.recipient)}`,
          time: donationDate.toLocaleTimeString(),
          type: 'donation-sent',
        };
      } else {
        // Skip donations that don't involve this account (shouldn't happen)
        return;
      }

      if (donationDate.toDateString() === today.toDateString() && todayActivities.length < 3) {
        todayActivities.push(activity);
      } else if (donationDate.toDateString() === yesterday.toDateString() && yesterdayActivities.length < 3) {
        yesterdayActivities.push(activity);
      } else if (donationDate >= lastWeek && lastWeekActivities.length < 3) {
        lastWeekActivities.push(activity);
      }
    });

    return { today: todayActivities, yesterday: yesterdayActivities, lastWeek: lastWeekActivities };
  }, [donationHistory]);

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

  const ActivitySection = ({ title, activities }) => {
    const getMarkerClass = (title) => {
      switch (title.toLowerCase()) {
        case 'today': return 'today';
        case 'yesterday': return 'yesterday';
        case 'last week': return 'last-week';
        default: return '';
      }
    };

    return (
      <div className="activity-section">
        <div className={`activity-marker ${getMarkerClass(title)}`}>{title}</div>
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <ActivityItem key={index} {...activity} />
          ))
        ) : (
          <div className="activity-empty">
            <FaInbox className="empty-icon" />
            No activities for {title.toLowerCase()}
          </div>
        )}
      </div>
    );
  };

  if (!isConnected) {
    return (
      <div className="activity-card">
        <h3>Recent Activities</h3>
        <div className="activity-error">
          <FaWallet className="empty-icon" />
          <p>Please connect your wallet to view recent activities</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="activity-card">
        <h3>Recent Activities</h3>
        <div className="activity-loading">Loading activities...</div>
      </div>
    );
  }

  const hasAnyActivities = activities.today.length > 0 || activities.yesterday.length > 0 || activities.lastWeek.length > 0;

  return (
    <div className="activity-card">
      <h3>Recent Activities</h3>
      {hasAnyActivities ? (
        <>
          <ActivitySection title="Today" activities={activities.today} />
          <ActivitySection title="Yesterday" activities={activities.yesterday} />
          <ActivitySection title="Last Week" activities={activities.lastWeek} />
        </>
      ) : (
        <div className="activity-empty">
          <FaInbox className="empty-icon" />
          No recent activities found. Start donating to see your activity history!
        </div>
      )}
    </div>
  );
};

export default ActivityCard;