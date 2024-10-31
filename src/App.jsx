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
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "./components/NotFound/NotFound";
import NetworkSwitchModal from "./components/Header/NetworkSwitchModal";
import { checkAndSwitchNetwork } from "./utils/interact";

function App() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [targetNetwork, setTargetNetwork] = React.useState("");

  const initializeNetwork = async () => {
    try {
      await checkAndSwitchNetwork();
    } catch (error) {
      if (error.message.includes("Unsupported network")) {
        // If unsupported network, show modal and allow user to select
        setIsModalOpen(true);
        setTargetNetwork(
          error.message.includes("Polygon") ? "polygon" : "arbitrumSepolia"
        );
      } else {
        console.error("Network check failed", error);
      }
    }
  };

  React.useEffect(() => {
    initializeNetwork();

    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  const handleModalConfirm = async () => {
    try {
      // Set the network as per the user's choice
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          { chainId: targetNetwork === "polygon" ? "0x13881" : "0x66eec" },
        ], // Chain ID in hexadecimal
      });
      // Reinitialize the provider after switching networks
      await checkAndSwitchNetwork();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to switch network", error);
      setIsModalOpen(false);
    }
  };

  const handleModalClose = () => {
    // Close the modal without making any network changes
    setIsModalOpen(false);
  };

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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <ToastContainer transition={Slide} />
      <NetworkSwitchModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        targetNetwork={targetNetwork}
      />
    </div>
  );
}

export default App;
