import "./UserProfile.css";
import React, { useEffect, useState } from "react";
import { FaTwitter, FaSpotify, FaYoutube, FaDribbble } from "react-icons/fa";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { getUserProfile, getUserProfileByCustomUrl } from "../../utils/aws";
import { getWallet, donate } from "../../utils/interact";
import UserProfileSkeleton from "../../skeleton-loaders/UserProfileSkeleton";
import CryptoKoffeeCup from "../../assets/cryptokoffee_cup.png";
import { useNavigate, useParams } from "react-router-dom";
import useExchangeRate from "../../hooks/useExchangeRate";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [walletInfo, setWalletInfo] = useState(null);
  const [cups, setCups] = useState(1);
  const [donationAmount, setDonationAmount] = useState(0.00002);
  // const [exchangeRate, setExchangeRate] = useState(null);
  const [currentNetwork, setCurrentNetwork] = useState(null);
  const navigate = useNavigate();
  const { customUrl } = useParams();

  const {
    data: exchangeRate,
    isLoading,
    isError,
  } = useExchangeRate(currentNetwork?.chainId);

  useEffect(() => {
    const fetchWalletInfo = async () => {
      const wallet = await getWallet();
      setWalletInfo(wallet);
    };

    fetchWalletInfo();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (customUrl) {
        const prefixedCustomUrl = `https://cryptokoffee.co/donate/${customUrl}`;

        const userProfile = await getUserProfileByCustomUrl(prefixedCustomUrl);

        if (userProfile) {
          setProfile(userProfile);
        } else {
          toast.error("User profile not found");
        }
      } else if (walletInfo?.walletAddress) {
        const userId = `user-${walletInfo.walletAddress}`;
        const userProfile = await getUserProfile(userId);
        if (userProfile) {
          setProfile(userProfile);
        } else {
          toast.error("User profile not found");
        }
      } else {
        toast.error("Wallet address not found");
      }
    };

    if (walletInfo) fetchProfile();
  }, [customUrl, walletInfo]);

  useEffect(() => {
    const detectNetwork = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        setCurrentNetwork(network);
      } catch (error) {
        console.error("Error detecting network:", error);
      }
    };

    detectNetwork();
  }, []);

  const connectWallet = async () => {
    try {
      // Trigger the wallet connection process
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();
      setWalletInfo({ walletAddress });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet. Please try again.");
    }
  };

  const navigateToProfileCreation = () => {
    navigate("/donation-page");
  };

  if (!walletInfo?.walletAddress) {
    return (
      <div className="wallet-not-connected">
        <p>Your wallet is not connected.</p>
        <button onClick={connectWallet}>Connect your wallet</button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-not-found">
        <p>You don't have a profile saved.</p>
        <button onClick={navigateToProfileCreation}>Create Profile</button>
      </div>
    );
  }

  const recentSupporters = [
    {
      name: "Aron",
      message:
        "Hey, Julie your videos are such a big help for an up and coming cabinet maker/kitchen fitter like myself. Thanks for doing what you do.",
      type: "member",
      avatar: "https://via.placeholder.com/50",
    },
    {
      name: "James",
      message:
        "Hey, your videos are such a big help for an up and coming cabinet maker/kitchen fitter like myself. Thanks for doing what you do.",
      type: "donut",
      count: 2,
      avatar: "https://via.placeholder.com/50",
    },
    {
      name: "Anie",
      message: "",
      type: "member",
      avatar: "https://via.placeholder.com/50",
    },
    {
      name: "Charlie",
      message: "",
      type: "member",
      avatar: "https://via.placeholder.com/50",
    },
  ];

  const handleCupsChange = (event) => {
    setCups(parseInt(event.target.value, 10));
  };

  const handleCupButtonClick = (numCups) => {
    setCups(numCups);
  };

  const handleDonate = async () => {
    try {
      if (!exchangeRate) {
        toast.error("Exchange rate not available. Please try again later.");
        return;
      }

      const totalDonationAmountUSD = cups * donationAmount;
      const ethAmount = totalDonationAmountUSD / exchangeRate;

      const ethAmountString = ethAmount.toFixed(18);

      const weiAmount = ethers.parseUnits(ethAmountString, 18);

      // Check if the profile's wallet address is valid
      if (!profile?.wallet_address) {
        toast.error("Recipient wallet address not found. Please try again.");
        return;
      }

      console.log("Donating:", {
        from: walletInfo?.walletAddress,
        to: profile?.wallet_address,
        amount: weiAmount.toString(),
        ethAmount,
        exchangeRate,
      });

      if (!walletInfo?.walletAddress) {
        toast.error(
          "Sender wallet address not found. Please connect your wallet."
        );
        return;
      }

      // Send the donation
      const tx = await donate(profile?.wallet_address, weiAmount.toString());

      console.log("Transaction:", tx);

      const receipt = await tx.wait();

      if (receipt.status === 1) {
        toast.success("Donation successful!");
      } else {
        toast.error("Donation failed. Please try again.");
      }
    } catch (error) {
      if (error.code === -32603 && error.data && error.data.code === -32000) {
        if (error.data.message.includes("insufficient funds")) {
          toast.error(
            "Insufficient funds. Please check your balance and try again."
          );
        } else {
          toast.error("An internal error occurred. Please try again later.");
        }
      } else {
        toast.error("Failed to donate. Please try again.");
      }
      console.error(error);
    }
  };

  return (
    <div className="user-profile-page">
      <div className="main-container">
        <div className="profile-header-container">
          <div className="profile-header">
            <div className="profile-info">
              <img
                src={profile.avatar}
                alt="Profile"
                className="profile-image"
              />
              <div className="profile-details">
                <h2>{profile.username}</h2>
                <p>{profile.short_bio}</p>
                <p className="profile-description">{profile.custom_message}</p>
                <div className="social-icons">
                  {profile.twitter_link && (
                    <a
                      href={`https://${profile.twitter_link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaTwitter size={30} />
                    </a>
                  )}
                  {profile.spotify_link && (
                    <a
                      href={`https://${profile.spotify_link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaSpotify size={30} />
                    </a>
                  )}
                  {profile.youtube_link && (
                    <a
                      href={`https://${profile.youtube_link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaYoutube size={30} />
                    </a>
                  )}
                  {profile.dribble_link && (
                    <a
                      href={`https://${profile.dribble_link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaDribbble size={30} />
                    </a>
                  )}
                </div>
              </div>
              <div className="supporters">
                <span>{walletInfo?.numOfDonations} supporters</span>
              </div>
            </div>
          </div>
        </div>
        <div className="support-container">
          <h2>Support {profile.username} with a cup of coffee</h2>
          <div className="support-options">
            <div className="coffee-selection">
              <img src={CryptoKoffeeCup} alt="CryptoKoffeeIcon" />
              <span>$5</span>
              <input
                type="number"
                value={cups}
                min={1}
                onChange={handleCupsChange}
              />
              <button onClick={() => handleCupButtonClick(1)}>1</button>
              <button onClick={() => handleCupButtonClick(3)}>3</button>
              <button onClick={() => handleCupButtonClick(5)}>5</button>
              <span className="total-amount">
                Total: ${cups * donationAmount}
              </span>
            </div>
            <div className="support-details">
              <input type="text" placeholder="Name or @yourtwitter" />
              <input type="text" placeholder="Message (optional)" />
            </div>
            <button className="support-button" onClick={handleDonate}>
              Support {profile.username} (${cups * 5})
            </button>
          </div>
        </div>
      </div>
      <div className="recent-supporters-container">
        <h2>Recent Supporters</h2>
        {recentSupporters.map((supporter, index) => (
          <div key={index} className="supporter-card">
            <img
              src={supporter.avatar}
              alt={supporter.name}
              className="supporter-avatar"
            />
            <div className="supporter-info">
              <p>
                <strong>{supporter.name}</strong>{" "}
                {supporter.type === "member"
                  ? "is now a member."
                  : `bought ${supporter.count} donuts.`}
              </p>
              {supporter.message && (
                <p className="supporter-message">{supporter.message}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
