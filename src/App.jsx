import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import TransactionHistory from "./components/TransactionHistory/TransactionHistory";
import Withdraw from "./components/Withdraw/Withdraw";
import Settings from "./components/Settings/Settings";
import Sidebar from "./components/Sidebar/Sidebar";
import ProfileSetup from "./components/ProfileSetup/ProfileSetup";
import UserProfile from "./components/UserProfile/UserProfile";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "./components/NotFound/NotFound";
import NetworkSwitchModal from "./components/Header/NetworkSwitchModal";
import { WalletProvider, useWallet } from "./contexts/WalletContext";

const AppContent = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [targetNetwork, setTargetNetwork] = React.useState("");
  const { error, detectNetwork, switchNetwork } = useWallet();

  React.useEffect(() => {
    const initializeNetwork = async () => {
      try {
        await detectNetwork();
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

    initializeNetwork();
  }, [detectNetwork]);

  const handleModalConfirm = async () => {
    try {
      await switchNetwork(targetNetwork);
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
          <Route path="/donations" element={<TransactionHistory />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
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
};

function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}

export default App;
