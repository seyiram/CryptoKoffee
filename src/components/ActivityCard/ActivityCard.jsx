import React from 'react';
import './ActivityCard.css';

const activitiesToday = [
  {
    avatar: '/path-to-avatar1.jpg', // Replace with actual image paths or URLs
    description: 'Donated by $540.00',
    time: '5 minutes ago',
    type: 'donation', // Add type to differentiate activity types
  },
  {
    avatar: '/path-to-avatar2.jpg',
    description: 'Another activity on an Important Item',
    time: '10 minutes ago',
    type: 'activity',
  },
  {
    avatar: '/path-to-avatar3.jpg',
    description: 'Donated by $5000.00',
    time: '18 minutes ago',
    type: 'donation',
  },
  // Add more activities as needed
];

const activitiesYesterday = [
  {
    avatar: '/path-to-avatar4.jpg',
    description: 'Donated by $540.00',
    time: '5 minutes ago',
    type: 'donation',
  },
  {
    avatar: '/path-to-avatar5.jpg',
    description: 'Another activity on an Important Item',
    time: '10 minutes ago',
    type: 'activity',
  },
  {
    avatar: '/path-to-avatar6.jpg',
    description: 'Donated by $5000.00',
    time: '18 minutes ago',
    type: 'donation',
  },
  // Add more activities as needed
];

const ActivityItem = ({ avatar, description, time, type }) => {
  return (
    <div className="activity-item">
      <img src={avatar} alt="avatar" className="activity-avatar" />
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
