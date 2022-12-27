import React from "react";
import {Routes, Route} from 'react-router-dom';

import Sidebar
 from "components/Sidebar/Sidebar";
 import Overview from "components/Overview/Overview";
 import UserProfilePage from "pages/UserProfilePage/UserProfilePage";
 import UserAccountPage from "pages/UserAccountPage/UserAccountPage";



const Dashboard = ({ connectToWallet }) => {

  return (
    <div className="border flex w-full md:flex-row flex-col">
            <Sidebar />
            <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="mypage" element={<UserProfilePage />} />
                <Route exact path="account" element={<UserAccountPage />} />
            </Routes>
        </div>
  );
};

export default Dashboard;
