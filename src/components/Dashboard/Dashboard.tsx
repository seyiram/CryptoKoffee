import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import DonationCard from "../DonationCard/DonationCard";
import ActivityCard from "../ActivityCard/ActivityCard";
import DonationsByType from "../DonationsByType/DonationsByType";
import TopDonors from "../TopDonors/TopDonors";
import RecurringDonations from "../RecurringDonations/RecurringDonations";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-area">
        <Header />
        <div className="content">
          <div className="cards-container">
            <DonationCard />
            <ActivityCard />
          </div>
          <div className="additional-cards">
            <DonationsByType />
            <TopDonors />
            <RecurringDonations />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
