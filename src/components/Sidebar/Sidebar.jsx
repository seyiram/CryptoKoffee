import React from "react";
import {
  FaHome,
  FaHeart,
  FaChartBar,
  FaTags,
  FaHandsHelping,
  FaCalendarAlt,
  FaCog,
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        {/* You can place your logo here */}
        <img src="/path-to-your-logo.png" alt="Logo" />
      </div>
      <div className="sidebar-menu">
        <a href="#" className="sidebar-item">
          <FaHome className="sidebar-icon" />
          <span>Dashboard</span>
        </a>
        <a href="#" className="sidebar-item">
          <FaHeart className="sidebar-icon" />
          <span>Donors</span>
        </a>
        <a href="#" className="sidebar-item">
          <FaChartBar className="sidebar-icon" />
          <span>Reports</span>
        </a>
        <a href="#" className="sidebar-item">
          <FaTags className="sidebar-icon" />
          <span>Fund Type</span>
        </a>
        <a href="#" className="sidebar-item">
          <FaHandsHelping className="sidebar-icon" />
          <span>Volunteer Match</span>
        </a>
        <a href="#" className="sidebar-item">
          <FaCalendarAlt className="sidebar-icon" />
          <span>Events</span>
        </a>
        <a href="#" className="sidebar-item">
          <FaCog className="sidebar-icon" />
          <span>Settings</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
