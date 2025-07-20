import React from 'react';
import './TransactionHistorySkeleton.css';

const TransactionHistorySkeleton = () => {
  return (
    <div className="donations">
      <div className="donations-container">
        {/* Header Skeleton */}
        <div className="donations-header">
          <div className="skeleton-title"></div>
          <div className="skeleton-balance-card">
            <div className="skeleton-balance-label"></div>
            <div className="skeleton-balance-amount"></div>
          </div>
        </div>

        {/* Filters Skeleton */}
        <div className="filters-section">
          <div className="filters-container">
            <div className="skeleton-search-container">
              <div className="skeleton-search-input"></div>
            </div>
            <div className="skeleton-filters-group">
              <div className="skeleton-filter-select"></div>
              <div className="skeleton-filter-select"></div>
            </div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="table-section">
          <div className="skeleton-table-header">
            <div className="skeleton-table-title"></div>
            <div className="skeleton-export-btn"></div>
          </div>
          
          <div className="skeleton-table">
            {/* Table Headers */}
            <div className="skeleton-table-row skeleton-header-row">
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
            </div>
            
            {/* Table Rows */}
            {[...Array(8)].map((_, index) => (
              <div key={index} className="skeleton-table-row">
                <div className="skeleton-cell skeleton-avatar"></div>
                <div className="skeleton-cell skeleton-address"></div>
                <div className="skeleton-cell skeleton-amount"></div>
                <div className="skeleton-cell skeleton-date"></div>
                <div className="skeleton-cell skeleton-status"></div>
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="skeleton-pagination">
            <div className="skeleton-pagination-info"></div>
            <div className="skeleton-pagination-controls">
              <div className="skeleton-pagination-btn"></div>
              <div className="skeleton-pagination-btn"></div>
              <div className="skeleton-pagination-btn"></div>
              <div className="skeleton-pagination-btn"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistorySkeleton;