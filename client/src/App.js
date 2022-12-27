import { Routes, Route } from 'react-router-dom';
import "./App.css";
import Navbar from 'components/Navbar/Navbar';
import Homepage from 'pages/Homepage/Homepage';
import Dashboard from "./pages/Dashboard/Dashboard";
import About from 'pages/About/About';

import { connectToWallet } from "./hooks/Wallet";

function App() {

  return (
    <div className="bg-gray-100 w-full h-full">
      <Navbar connectToWallet={connectToWallet} />
      <Routes>
        <Route exact path="/" element={<Homepage />} />
        <Route exact path="/about-us" element={<About />} />
        <Route exact path="dashboard/*" element={<Dashboard />} />
      </Routes>

    </div>
  );
}

export default App;
