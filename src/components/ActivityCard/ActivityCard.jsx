import React from 'react';
import './ActivityCard.css';
import Avatar from '../../assets/icons/Avatar';

const activitiesToday = [
  {
    avatar: <Avatar />, 
    description: 'Donated by $540.00',
    time: '5 minutes ago',
    type: 'donation', 
  },
  {
    avatar: <Avatar />,
    description: 'Another activity on an Important Item',
    time: '10 minutes ago',
    type: 'activity',
  },
  {
    avatar: <Avatar />,
    description: 'Donated by $5000.00',
    time: '18 minutes ago',
    type: 'donation',
  },
  // Add more activities as needed
];

const activitiesYesterday = [
  {
    avatar: <Avatar />,
    description: 'Donated by $540.00',
    time: '5 minutes ago',
    type: 'donation',
  },
  {
    avatar: <Avatar />,
    description: 'Another activity on an Important Item',
    time: '10 minutes ago',
    type: 'activity',
  },
  {
    avatar: <Avatar />,
    description: 'Donated by $5000.00',
    time: '18 minutes ago',
    type: 'donation',
  },
  // Add more activities as needed
];

const ActivityItem = ({ avatar, description, time, type }) => {
  return (
    <div className="activity-item">
      {typeof avatar === 'string' ? (
        <img src={avatar} alt="avatar" className="activity-avatar" />
      ) : (
        <div className="activity-avatar">{avatar}</div>
      )}
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

const ActivityCard = () => {
  return (
    <div className="activity-card">
      <h3>Recent Activities</h3>
      <ActivitySection title="Today" activities={activitiesToday} />
      <ActivitySection title="Yesterday" activities={activitiesYesterday} />
    </div>
  );
};

export default ActivityCard;
