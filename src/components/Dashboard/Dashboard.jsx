import React from "react";
import Header from "../Header/Header";
import OverviewCard from "../OverviewCard/OverviewCard";
import ActivityCard from "../ActivityCard/ActivityCard";

import TopDonors from "../TopDonors/TopDonors";

import "./Dashboard.css";
import PriceTracker from "../PriceTracker/PriceTracker";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="main-area">
        <Header />
        <div className="content">
          <div className="cards-container">
            <OverviewCard />
            <ActivityCard />
          </div>
          <div className="additional-cards">
            <TopDonors />
            <PriceTracker />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
