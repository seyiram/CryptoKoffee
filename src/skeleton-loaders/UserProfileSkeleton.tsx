// UserProfileSkeleton.js
import React from 'react';
import './UserProfileSkeleton.css';

const UserProfileSkeleton = () => {
  return (
    <div className="skeleton-user-profile-page">
      {/* Hero Section Skeleton */}
      <div className="skeleton-hero-section">
        <div className="skeleton-hero-content">
          <div className="skeleton-profile-avatar-container">
            <div className="skeleton-profile-avatar loading-skeleton"></div>
          </div>
          <div className="skeleton-profile-info">
            <div className="skeleton-profile-name loading-skeleton"></div>
            <div className="skeleton-profile-bio loading-skeleton"></div>
            <div className="skeleton-profile-stats">
              <div className="skeleton-stat-item">
                <div className="skeleton-stat-number loading-skeleton"></div>
                <div className="skeleton-stat-label loading-skeleton"></div>
              </div>
              <div className="skeleton-stat-item">
                <div className="skeleton-stat-number loading-skeleton"></div>
                <div className="skeleton-stat-label loading-skeleton"></div>
              </div>
              <div className="skeleton-stat-item">
                <div className="skeleton-stat-number loading-skeleton"></div>
                <div className="skeleton-stat-label loading-skeleton"></div>
              </div>
            </div>
          </div>
          <div className="skeleton-profile-actions">
            <div className="skeleton-action-btn loading-skeleton"></div>
            <div className="skeleton-action-btn loading-skeleton"></div>
          </div>
        </div>
      </div>

      {/* Social Links Skeleton */}
      <div className="skeleton-social-links-card">
        <div className="skeleton-social-title loading-skeleton"></div>
        <div className="skeleton-social-icons">
          <div className="skeleton-social-link loading-skeleton"></div>
          <div className="skeleton-social-link loading-skeleton"></div>
          <div className="skeleton-social-link loading-skeleton"></div>
        </div>
      </div>

      <div className="skeleton-main-container">
        {/* Support Container Skeleton */}
        <div className="skeleton-support-container">
          <div className="skeleton-support-header">
            <div className="skeleton-support-title loading-skeleton"></div>
          </div>
          
          {/* Preset Amounts */}
          <div className="skeleton-preset-amounts">
            <div className="skeleton-section-title loading-skeleton"></div>
            <div className="skeleton-preset-grid">
              <div className="skeleton-preset-btn loading-skeleton"></div>
              <div className="skeleton-preset-btn loading-skeleton"></div>
              <div className="skeleton-preset-btn loading-skeleton"></div>
              <div className="skeleton-preset-btn loading-skeleton"></div>
              <div className="skeleton-preset-btn loading-skeleton"></div>
              <div className="skeleton-preset-btn loading-skeleton"></div>
            </div>
          </div>

          {/* Custom Amount */}
          <div className="skeleton-custom-amount">
            <div className="skeleton-section-title loading-skeleton"></div>
            <div className="skeleton-amount-input loading-skeleton"></div>
          </div>

          {/* Support Button */}
          <div className="skeleton-support-button loading-skeleton"></div>
        </div>

        {/* Top Supporters Skeleton */}
        <div className="skeleton-top-supporters-container">
          <div className="skeleton-section-header">
            <div className="skeleton-section-title loading-skeleton"></div>
          </div>
          <div className="skeleton-top-supporters-grid">
            <div className="skeleton-top-supporter-card loading-skeleton"></div>
            <div className="skeleton-top-supporter-card loading-skeleton"></div>
            <div className="skeleton-top-supporter-card loading-skeleton"></div>
          </div>
        </div>
      </div>

      {/* Recent Supporters Skeleton */}
      <div className="skeleton-recent-supporters-container">
        <div className="skeleton-section-header">
          <div className="skeleton-section-title loading-skeleton"></div>
        </div>
        <div className="skeleton-supporters-list">
          <div className="skeleton-supporter-card">
            <div className="skeleton-supporter-avatar loading-skeleton"></div>
            <div className="skeleton-supporter-info">
              <div className="skeleton-supporter-name loading-skeleton"></div>
              <div className="skeleton-supporter-message loading-skeleton"></div>
              <div className="skeleton-supporter-time loading-skeleton"></div>
            </div>
          </div>
          <div className="skeleton-supporter-card">
            <div className="skeleton-supporter-avatar loading-skeleton"></div>
            <div className="skeleton-supporter-info">
              <div className="skeleton-supporter-name loading-skeleton"></div>
              <div className="skeleton-supporter-message loading-skeleton"></div>
              <div className="skeleton-supporter-time loading-skeleton"></div>
            </div>
          </div>
          <div className="skeleton-supporter-card">
            <div className="skeleton-supporter-avatar loading-skeleton"></div>
            <div className="skeleton-supporter-info">
              <div className="skeleton-supporter-name loading-skeleton"></div>
              <div className="skeleton-supporter-message loading-skeleton"></div>
              <div className="skeleton-supporter-time loading-skeleton"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSkeleton;
