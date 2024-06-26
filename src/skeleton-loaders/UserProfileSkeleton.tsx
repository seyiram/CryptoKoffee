// UserProfileSkeleton.js
import React from 'react';
import './UserProfileSkeleton.css';

const UserProfileSkeleton = () => {
  return (
    <div className="skeleton-container">
      <div className="skeleton-header">
        <div className="skeleton-avatar"></div>
        <div className="skeleton-text skeleton-name"></div>
        <div className="skeleton-text skeleton-title"></div>
      </div>
      <div className="skeleton-support">
        <div className="skeleton-support-header"></div>
        <div className="skeleton-support-details">
          <div className="skeleton-text"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-button"></div>
        </div>
      </div>
      <div className="skeleton-recent-supporters">
        <div className="skeleton-recent-supporters-item">
          <div className="skeleton-avatar-small"></div>
          <div className="skeleton-text skeleton-long-text"></div>
        </div>
        <div className="skeleton-recent-supporters-item">
          <div className="skeleton-avatar-small"></div>
          <div className="skeleton-text skeleton-long-text"></div>
        </div>
        <div className="skeleton-recent-supporters-item">
          <div className="skeleton-avatar-small"></div>
          <div className="skeleton-text skeleton-long-text"></div>
        </div>
        <div className="skeleton-recent-supporters-item">
          <div className="skeleton-avatar-small"></div>
          <div className="skeleton-text skeleton-long-text"></div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSkeleton;
