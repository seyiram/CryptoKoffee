import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Donations from "./components/Donations/Donations";
import Withdraw from "./components/Withdraw/Withdraw";
import Settings from "./components/Settings/Settings";
import Sidebar from "./components/Sidebar/Sidebar";
import DonationPage from "./components/DonationPage/DonationPage";
import UserProfile from "./components/UserProfile/UserProfile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/donation-page" element={<DonationPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/donate/:customUrl" element={<UserProfile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>

      <ToastContainer />
    </div>
  );
}

export default App;
