import "./UserProfile.css";
import React, { useEffect, useState } from "react";
import { FaTwitter, FaSpotify, FaYoutube, FaDribbble } from "react-icons/fa";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { getUserProfile, getUserProfileByCustomUrl } from "../../utils/aws";
import {
  getWallet,
  donate,
  fetchDonationEventsForWallet,
} from "../../utils/interact";
import UserProfileSkeleton from "../../skeleton-loaders/UserProfileSkeleton";
import CryptoKoffeeCup from "../../assets/cryptokoffee_cup.png";
import { useNavigate, useParams } from "react-router-dom";
import useExchangeRate from "../../hooks/useExchangeRate";
import Avatar from "../../assets/icons/Avatar";

const provider = new ethers.BrowserProvider(window.ethereum);

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [walletInfo, setWalletInfo] = useState(null);
  const [cups, setCups] = useState(1);
  const [donationAmount, setDonationAmount] = useState(0.00002);
  const [currentNetwork, setCurrentNetwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donationEvents, setDonationEvents] = useState([]);
  const [numOfDonations, setNumOfDonations] = useState();
  const navigate = useNavigate();
  const { customUrl } = useParams();

  const {
    data: exchangeRate,
    isLoading,
    isError,
  } = useExchangeRate(Number(currentNetwork?.chainId));

  useEffect(() => {
    const fetchWalletInfo = async () => {
      const wallet = await getWallet();
      setWalletInfo(wallet);
    };

    fetchWalletInfo();
  }, []);


  useEffect(() => {
    const initializeProfile = async () => {
      try {
        const wallet = await getWallet();
        setWalletInfo(wallet);

        console.log("Wallet Info:", wallet);

        if (customUrl) {
          console.log("Fetching profile using customUrl:", customUrl);
          const prefixedCustomUrl = `cryptokoffee.com/donate/${customUrl}`;
          console.log("prefixedcustomurl:", prefixedCustomUrl);
          const userProfile = await getUserProfileByCustomUrl(
            prefixedCustomUrl
          );
          console.log("Fetched profile by customUrl:", userProfile);
          if (userProfile) {
            setProfile(userProfile);
            fetchDonationEventsForWallet(
              userProfile.wallet_address,
              (donations) => {
                setDonationEvents(donations);
                setNumOfDonations(donations.length);
              }
            );
          } else {
            setProfile(null);
          }
        } else if (wallet?.walletAddress) {
          console.log(
            "Fetching profile using wallet address:",
            wallet.walletAddress
          );
          const userId = `user-${wallet.walletAddress}`;
          const userProfile = await getUserProfile(userId);
          console.log("Fetched profile by wallet address:", userProfile);
          setProfile(userProfile || null);

          fetchDonationEventsForWallet(wallet?.walletAddress, (donations) => {
            setDonationEvents(donations);
            setNumOfDonations(donations.length);
          });

        }
      } catch (error) {
        toast.error("Error loading profile");
        console.error("Error initializing profile:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeProfile();
  }, [customUrl]);

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

  if (loading) {
    return <UserProfileSkeleton />;
  }

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
      const tx = await donate(profile?.wallet_address, weiAmount.toString(), {
        gasLimit: BigInt(60000)
      });

      console.log("Transaction:", tx);

      const receipt = await provider.waitForTransaction(tx.hash, 1);

      if (receipt.status === 1) {
        toast.success("Donation successful!");

        // Fetch and update the donation events
        fetchDonationEventsForWallet(profile.wallet_address, (donations) => {
          setDonationEvents(donations);
          setNumOfDonations(donations.length);
        });
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

  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 11)}...${address.slice(-6)}`;
  };

  console.log("Number of donations", numOfDonations);

  console.log("profile here", profile);

  console.log("Current Network", Number(currentNetwork.chainId));

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
                <span>{numOfDonations} supporters</span>
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
        {donationEvents.map((supporter, index) => (
          <div
            key={`${supporter.donor}-${supporter.amount}`}
            className="supporter-card"
          >
            <div className="supporter-avatar">
              <Avatar />
            </div>
            <div className="supporter-info">
              <p>
                <span className="tooltip">
                  {truncateAddress(supporter.donor)}
                  <span className="tooltiptext">{supporter.donor}</span>
                </span>{" "}
                donated{" "}
                <span className="donation-amount">{supporter.amount}</span>
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
