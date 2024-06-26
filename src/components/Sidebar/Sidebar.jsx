import React, { useState } from "react";
import { FaHome, FaHeart, FaCog, FaBars, FaUser, FaSignOutAlt } from "react-icons/fa";
import { FaSackDollar } from "react-icons/fa6";
import { BiSolidDonateHeart } from "react-icons/bi";
import { Link } from "react-router-dom";
import Logo from "../../assets/cryptokoffee.png";
import "./Sidebar.css";

const Sidebar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("account");
    window.location.reload();
  };

  return (
    <>
      <div className="sidebar">
        <div className="sidebar-logo">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="sidebar-menu">
          <Link to="/" className="sidebar-item">
            <FaHome className="sidebar-icon" />
            <span>Dashboard</span>
          </Link>
          <Link to="/donations" className="sidebar-item">
            <FaHeart className="sidebar-icon" />
            <span>Donations</span>
          </Link>
          <Link to="/withdraw" className="sidebar-item">
            <FaSackDollar className="sidebar-icon" />
            <span>Withdraw</span>
          </Link>
          <Link to="/donation-page" className="sidebar-item">
            <BiSolidDonateHeart className="sidebar-icon" />
            <span>Donation Page</span>
          </Link>
          <Link to="/profile" className="sidebar-item">
            <FaUser className="sidebar-icon" />
            <span>Profile</span>
          </Link>
          <Link to="/settings" className="sidebar-item">
            <FaCog className="sidebar-icon" />
            <span>Account Settings</span>
          </Link>
          <span className="sidebar-item" onClick={handleLogout} tabIndex={0}>
            <FaSignOutAlt className="sidebar-icon" />
            <span>Logout</span>
          </span>
        </div>
      </div>

      <div className="mobile-header">
        <div className="mobile-header-logo">
          <img src={Logo} alt="Logo" />
        </div>
        <button className="mobile-menu-icon" onClick={toggleMobileMenu}>
          <FaBars className="icon-bars" />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-menu-item" onClick={toggleMobileMenu}>
            <FaHome className="mobile-menu-icon" />
            <span>Dashboard</span>
          </Link>
          <Link to="/donations" className="mobile-menu-item" onClick={toggleMobileMenu}>
            <FaHeart className="mobile-menu-icon" />
            <span>Donations</span>
          </Link>
          <Link to="/withdraw" className="mobile-menu-item" onClick={toggleMobileMenu}>
            <FaSackDollar className="mobile-menu-icon" />
            <span>Withdraw</span>
          </Link>
          <Link to="/donation-page" className="mobile-menu-item" onClick={toggleMobileMenu}>
            <BiSolidDonateHeart className="mobile-menu-icon" />
            <span>Donation Page</span>
          </Link>
          <Link to="/profile" className="mobile-menu-item" onClick={toggleMobileMenu}>
            <FaUser className="mobile-menu-icon" />
            <span>Profile</span>
          </Link>
          <Link to="/settings" className="mobile-menu-item" onClick={toggleMobileMenu}>
            <FaCog className="mobile-menu-icon" />
            <span>Account Settings</span>
          </Link>
          <div className="mobile-menu-item" onClick={handleLogout}>
            <FaSignOutAlt className="mobile-menu-icon" />
            <span>Logout</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;