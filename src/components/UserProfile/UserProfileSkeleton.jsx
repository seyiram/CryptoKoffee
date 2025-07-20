import React from 'react';
import './UserProfileSkeleton.css';

const UserProfileSkeleton = () => {
  return (
    <div className="user-profile-skeleton">
      {/* Hero Section Skeleton */}
      <div className="hero-skeleton">
        <div className="hero-content-skeleton">
          <div className="profile-avatar-skeleton"></div>
          <div className="profile-info-skeleton">
            <div className="profile-name-skeleton"></div>
            <div className="profile-bio-skeleton"></div>
            <div className="profile-stats-skeleton">
              <div className="stat-skeleton"></div>
              <div className="stat-skeleton"></div>
              <div className="stat-skeleton"></div>
            </div>
          </div>
          <div className="profile-actions-skeleton">
            <div className="action-btn-skeleton"></div>
            <div className="action-btn-skeleton"></div>
          </div>
        </div>
      </div>

      {/* Profile Message Card Skeleton */}
      <div className="profile-message-skeleton">
        <div className="message-icon-skeleton"></div>
        <div className="message-content-skeleton">
          <div className="message-line-skeleton"></div>
          <div className="message-line-skeleton short"></div>
        </div>
      </div>

      {/* Social Links Card Skeleton */}
      <div className="social-links-skeleton">
        <div className="social-title-skeleton"></div>
        <div className="social-icons-skeleton">
          <div className="social-link-skeleton"></div>
          <div className="social-link-skeleton"></div>
          <div className="social-link-skeleton"></div>
          <div className="social-link-skeleton"></div>
        </div>
      </div>

      {/* Main Container Skeleton */}
      <div className="main-container-skeleton">
        {/* Top Supporters Skeleton */}
        <div className="top-supporters-skeleton">
          <div className="section-header-skeleton">
            <div className="section-icon-skeleton"></div>
            <div className="section-title-skeleton"></div>
          </div>
          <div className="top-supporters-grid-skeleton">
            <div className="top-supporter-skeleton">
              <div className="supporter-avatar-skeleton"></div>
              <div className="supporter-details-skeleton">
                <div className="supporter-address-skeleton"></div>
                <div className="supporter-amount-skeleton"></div>
                <div className="supporter-count-skeleton"></div>
              </div>
            </div>
            <div className="top-supporter-skeleton">
              <div className="supporter-avatar-skeleton"></div>
              <div className="supporter-details-skeleton">
                <div className="supporter-address-skeleton"></div>
                <div className="supporter-amount-skeleton"></div>
                <div className="supporter-count-skeleton"></div>
              </div>
            </div>
            <div className="top-supporter-skeleton">
              <div className="supporter-avatar-skeleton"></div>
              <div className="supporter-details-skeleton">
                <div className="supporter-address-skeleton"></div>
                <div className="supporter-amount-skeleton"></div>
                <div className="supporter-count-skeleton"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Container Skeleton */}
        <div className="support-container-skeleton">
          <div className="support-header-skeleton">
            <div className="support-title-skeleton">
              <div className="coffee-icon-skeleton"></div>
              <div className="support-h2-skeleton"></div>
            </div>
            <div className="crypto-badges-skeleton">
              <div className="crypto-badge-skeleton"></div>
              <div className="crypto-badge-skeleton"></div>
            </div>
          </div>

          {/* Preset Amounts Skeleton */}
          <div className="preset-amounts-skeleton">
            <div className="preset-title-skeleton"></div>
            <div className="preset-grid-skeleton">
              <div className="preset-btn-skeleton"></div>
              <div className="preset-btn-skeleton"></div>
              <div className="preset-btn-skeleton"></div>
              <div className="preset-btn-skeleton"></div>
              <div className="preset-btn-skeleton"></div>
              <div className="preset-btn-skeleton"></div>
            </div>
          </div>

          {/* Custom Amount Skeleton */}
          <div className="custom-amount-skeleton">
            <div className="custom-title-skeleton"></div>
            <div className="amount-input-skeleton"></div>
            <div className="cups-selector-skeleton">
              <div className="cups-label-skeleton"></div>
              <div className="cups-controls-skeleton">
                <div className="cup-btn-skeleton"></div>
                <div className="cups-display-skeleton"></div>
                <div className="cup-btn-skeleton"></div>
              </div>
            </div>
          </div>

          {/* Supporter Details Skeleton */}
          <div className="supporter-details-skeleton">
            <div className="supporter-title-skeleton"></div>
            <div className="supporter-input-skeleton"></div>
            <div className="supporter-textarea-skeleton"></div>
          </div>

          {/* Donation Total Skeleton */}
          <div className="donation-total-skeleton">
            <div className="total-line-skeleton"></div>
            <div className="total-line-skeleton final"></div>
          </div>

          {/* Support Button Skeleton */}
          <div className="support-button-skeleton"></div>
        </div>
      </div>

      {/* Recent Supporters Skeleton */}
      <div className="recent-supporters-skeleton">
        <div className="section-header-skeleton">
          <div className="section-icon-skeleton"></div>
          <div className="section-title-skeleton"></div>
          <div className="supporters-count-skeleton"></div>
        </div>
        <div className="supporters-list-skeleton">
          <div className="supporter-card-skeleton">
            <div className="supporter-avatar-skeleton"></div>
            <div className="supporter-info-skeleton">
              <div className="supporter-main-skeleton">
                <div className="supporter-name-skeleton"></div>
                <div className="donation-amount-skeleton"></div>
              </div>
              <div className="supporter-message-skeleton"></div>
              <div className="supporter-time-skeleton"></div>
            </div>
          </div>
          <div className="supporter-card-skeleton">
            <div className="supporter-avatar-skeleton"></div>
            <div className="supporter-info-skeleton">
              <div className="supporter-main-skeleton">
                <div className="supporter-name-skeleton"></div>
                <div className="donation-amount-skeleton"></div>
              </div>
              <div className="supporter-time-skeleton"></div>
            </div>
          </div>
          <div className="supporter-card-skeleton">
            <div className="supporter-avatar-skeleton"></div>
            <div className="supporter-info-skeleton">
              <div className="supporter-main-skeleton">
                <div className="supporter-name-skeleton"></div>
                <div className="donation-amount-skeleton"></div>
              </div>
              <div className="supporter-message-skeleton"></div>
              <div className="supporter-time-skeleton"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSkeleton;