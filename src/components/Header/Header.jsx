import React from 'react';
import { FaSearch, FaBell } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-search">
        <FaSearch className="header-icon" />
        <input type="text" placeholder="Type to search..." />
      </div>
      <div className="header-right">
        <FaBell className="header-icon" />
        <div className="header-profile">
          <img src="/path-to-profile-picture.jpg" alt="Profile" className="profile-pic" />
        </div>
      </div>
    </header>
  );
};

export default Header;
