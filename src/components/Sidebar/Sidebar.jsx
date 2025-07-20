import React, { useState, useCallback, useMemo } from "react";
import { FaHome, FaHeart, FaCog, FaBars, FaUser, FaSignOutAlt } from "react-icons/fa";
import { FaSackDollar } from "react-icons/fa6";
import { BiSolidDonateHeart } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import Logo from "../../assets/cryptokoffee.png";
import "./Sidebar.css";

const Sidebar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("account");
    window.location.reload();
  }, []);

  const menuItems = useMemo(() => [
    { to: "/", icon: FaHome, text: "Dashboard" },
    { to: "/donations", icon: FaHeart, text: "Transaction History" },
    { to: "/withdraw", icon: FaSackDollar, text: "Withdraw" },
    { to: "/profile-setup", icon: BiSolidDonateHeart, text: "Profile Setup" },
    { to: "/profile", icon: FaUser, text: "Profile" },
    { to: "/settings", icon: FaCog, text: "Account Settings" },
  ], []);

  return (
    <>
      <div className="sidebar">
        <div className="sidebar-logo">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="sidebar-menu">
          {menuItems.map(({ to, icon: Icon, text }) => (
            <NavLink 
              key={to} 
              to={to} 
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="sidebar-icon" />
              <span>{text}</span>
            </NavLink>
          ))}
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
          {menuItems.map(({ to, icon: Icon, text }) => (
            <NavLink 
              key={to} 
              to={to} 
              className={({ isActive }) => `mobile-menu-item ${isActive ? 'active' : ''}`}
              onClick={toggleMobileMenu}
            >
              <Icon className="mobile-menu-icon" />
              <span>{text}</span>
            </NavLink>
          ))}
          <div className="mobile-menu-item" onClick={handleLogout}>
            <FaSignOutAlt className="mobile-menu-icon" />
            <span>Logout</span>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(Sidebar);