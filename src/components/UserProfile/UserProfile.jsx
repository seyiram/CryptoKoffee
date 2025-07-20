import "./UserProfile.css";
import React, { useEffect, useState } from "react";
import {
  FaTwitter,
  FaSpotify,
  FaYoutube,
  FaDribbble,
  FaInstagram,
  FaPatreon,
  FaGlobe,
  FaShare,
  FaQrcode,
  FaCopy,
  FaHeart,
  FaCoffee,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaFacebook,
  FaLinkedin,
  FaTimes,
} from "react-icons/fa";
import { HiOutlineSparkles, HiOutlineFire } from "react-icons/hi";
import { BsCup, BsLightning } from "react-icons/bs";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import {
  getWallet,
  donate,
} from "../../utils/interact";
import UserProfileSkeleton from "./UserProfileSkeleton";
import CryptoKoffeeCup from "../../assets/cryptokoffee_cup.png";
import { useNavigate, useParams } from "react-router-dom";
import { useCryptoPrices } from "../../hooks/useCryptoPrices";
import { useUserProfile, useUserProfileByCustomUrl } from "../../hooks/useUserProfile";
import { useDonationEventsForProfile } from "../../hooks/useDonationEvents";
import { useWallet } from "../../contexts/WalletContext";
import { useQueryClient } from "@tanstack/react-query";
import { getNetworkCurrency } from "../../utils/coinUtils";
import Avatar from "../../assets/icons/Avatar";

const provider = window.ethereum ? new ethers.BrowserProvider(window.ethereum) : null;

const UserProfile = () => {
  const [cups, setCups] = useState(1);
  const [donationAmount, setDonationAmount] = useState(5.00);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [showAllSupporters, setShowAllSupporters] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [donationStatus, setDonationStatus] = useState(null); // 'loading', 'success', 'error'
  const [supporterMessage, setSupporterMessage] = useState('');
  const [supporterName, setSupporterName] = useState('');
  const navigate = useNavigate();
  const { customUrl } = useParams();
  
  const presetAmounts = [1, 3, 5, 10, 25, 50];
  
  // WalletContext
  const { account, network, connectWallet } = useWallet();
  const queryClient = useQueryClient();
  
  // React Query hooks
  const {
    data: cryptoPrices,
    isLoading: isPricesLoading,
    error: pricesError,
  } = useCryptoPrices();

  
  // Fetch user profile - either by custom URL or by wallet address
  // Use checksummed address for consistency
  const checksummedAccount = account ? ethers.getAddress(account) : null;
  const userId = checksummedAccount ? `user-${checksummedAccount}` : null;
  const prefixedCustomUrl = customUrl ? `/${customUrl}` : null;
  
  
  const { 
    data: profileByCustomUrl, 
    isLoading: loadingByCustomUrl,
    error: errorByCustomUrl 
  } = useUserProfileByCustomUrl(prefixedCustomUrl, {
    enabled: !!customUrl,
  });
  
  const { 
    data: profileByUserId, 
    isLoading: loadingByUserId,
    error: errorByUserId 
  } = useUserProfile(userId, {
    enabled: !!userId && !customUrl,
  });
  
  // Determine which profile to use
  const profile = customUrl ? profileByCustomUrl : profileByUserId;
  const isLoadingProfile = customUrl ? loadingByCustomUrl : loadingByUserId;
  const profileError = customUrl ? errorByCustomUrl : errorByUserId;
  
  
  // Fetch donation events for the profile
  const { 
    data: donationEvents = [], 
    isLoading: isLoadingDonations 
  } = useDonationEventsForProfile(profile);
  
  const numOfDonations = donationEvents.length;

  const handleConnectWallet = async () => {
    await connectWallet();
  };

  const navigateToProfileCreation = () => {
    navigate("/profile-setup");
  };

  // Show error message if profile fails to load
  if (profileError) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Failed to load profile</h2>
          <p>{profileError.message || "Something went wrong while loading the profile."}</p>
          <button 
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoadingProfile) {
    return <UserProfileSkeleton />;
  }

  if (!account) {
    return (
      <div className="wallet-not-connected">
        <p>Your wallet is not connected.</p>
        <button onClick={handleConnectWallet}>Connect your wallet</button>
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

  const getExchangeRate = () => {
    if (!cryptoPrices || !network) return null;

    let coinCode;
    switch (Number(network.chainId)) {
      case 137: // Polygon Mainnet
      case 80001: // Polygon Mumbai Testnet
      case 80002: // Polygon Testnet
        coinCode = "POL";
        break;
      default:
        coinCode = "ETH";
    }

    return cryptoPrices.data[coinCode]?.quote.USDT.price;
  };

  const handleDonate = async () => {
    try {
      setDonationStatus('loading');
      
      const exchangeRate = getExchangeRate();
      if (!exchangeRate) {
        toast.error("Exchange rate not available. Please try again later.");
        setDonationStatus('error');
        return;
      }

      const totalDonationAmountUSD = cups * donationAmount;
      const ethAmount = totalDonationAmountUSD / exchangeRate;

      const ethAmountString = ethAmount.toFixed(18);

      const weiAmount = ethers.parseUnits(ethAmountString, 18);

      // Check if the profile's wallet address is valid
      if (!profile?.wallet_address) {
        toast.error("Recipient wallet address not found. Please try again.");
        setDonationStatus('error');
        return;
      }

      if (!account) {
        toast.error(
          "Sender wallet address not found. Please connect your wallet."
        );
        setDonationStatus('error');
        return;
      }

      // Send the donation
      const tx = await donate(profile?.wallet_address, weiAmount.toString(), {
        gasLimit: BigInt(60000),
      });

      const receipt = await provider.waitForTransaction(tx.hash, 1);

      if (receipt.status === 1) {
        setDonationStatus('success');
        toast.success("Thank you for your support! 🎉");

        // Reset form
        setSupporterMessage('');
        setSupporterName('');
        
        // Invalidate and refetch donation events
        queryClient.invalidateQueries({
          queryKey: ["donationEvents", "profile", profile.wallet_address]
        });
        
        // Reset status after 3 seconds
        setTimeout(() => setDonationStatus(null), 3000);
      } else {
        setDonationStatus('error');
        toast.error("Donation failed. Please try again.");
      }
    } catch (error) {
      setDonationStatus('error');
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
      setTimeout(() => setDonationStatus(null), 2000);
    }
  };

  if (isPricesLoading) {
    return <UserProfileSkeleton />;
  }

  if (pricesError) {
    toast.error("Error loading cryptocurrency prices. Please try again later.");
    console.error("Error loading prices:", pricesError);
  }

  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 11)}...${address.slice(-6)}`;
  };

  // Debug logging removed for production

  const handlePresetSelect = (amount) => {
    setDonationAmount(amount);
    setSelectedPreset(amount);
    setCups(1);
  };

  const handleShareProfile = () => {
    // Always share the public donation URL, not the private profile URL
    let publicUrl = window.location.href;
    
    if (profile?.custom_url) {
      // Handle both old format (full URL) and new format (path only)
      if (profile.custom_url.includes('cryptokoffee.com/donate/')) {
        // Old format: full URL like "cryptokoffee.com/donate/0xJahBless"
        const username = profile.custom_url.split('cryptokoffee.com/donate/')[1];
        publicUrl = `${window.location.origin}/donate/${username}`;
      } else if (profile.custom_url.startsWith('/')) {
        // New format: path like "/0xJahBless" -> convert to "/donate/0xJahBless"
        const username = profile.custom_url.substring(1);
        publicUrl = `${window.location.origin}/donate/${username}`;
      } else {
        // Just username: "0xJahBless"
        publicUrl = `${window.location.origin}/donate/${profile.custom_url}`;
      }
    }
      
    if (navigator.share) {
      navigator.share({
        title: `Support ${profile.username} with crypto coffee`,
        text: `Check out ${profile.username}'s profile and show your support!`,
        url: publicUrl,
      });
    } else {
      setShowShareMenu(true);
    }
  };

  const handleSocialShare = (platform) => {
    // Always share the public donation URL, not the private profile URL
    let publicUrl = window.location.href;
    
    if (profile?.custom_url) {
      // Handle both old format (full URL) and new format (path only)
      if (profile.custom_url.includes('cryptokoffee.com/donate/')) {
        // Old format: full URL like "cryptokoffee.com/donate/0xJahBless"
        const username = profile.custom_url.split('cryptokoffee.com/donate/')[1];
        publicUrl = `${window.location.origin}/donate/${username}`;
      } else if (profile.custom_url.startsWith('/')) {
        // New format: path like "/0xJahBless" -> convert to "/donate/0xJahBless"
        const username = profile.custom_url.substring(1);
        publicUrl = `${window.location.origin}/donate/${username}`;
      } else {
        // Just username: "0xJahBless"
        publicUrl = `${window.location.origin}/donate/${profile.custom_url}`;
      }
    }
    
    const url = encodeURIComponent(publicUrl);
    const text = encodeURIComponent(`Check out ${profile.username}'s profile and show your support! 🚀`);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(publicUrl);
        toast.success('Profile link copied to clipboard!');
        setShowShareMenu(false);
        return;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    setShowShareMenu(false);
  };

  // Filter to only show donations received by this profile (not sent by them)
  const receivedDonations = donationEvents.filter(event => 
    event.recipient.toLowerCase() === profile?.wallet_address?.toLowerCase()
  );

  const totalDonationAmount = receivedDonations.reduce((sum, event) => {
    return sum + parseFloat(event.amount);
  }, 0);

  const topSupporters = receivedDonations
    .reduce((acc, event) => {
      const existing = acc.find(s => s.donor === event.donor);
      if (existing) {
        existing.amount += parseFloat(event.amount);
        existing.count += 1;
      } else {
        acc.push({
          donor: event.donor,
          amount: parseFloat(event.amount),
          count: 1,
          message: event.message
        });
      }
      return acc;
    }, [])
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  // Get network currency using shared utility
  const networkCurrency = getNetworkCurrency(network?.chainId);

  return (
    <div className="user-profile-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-gradient"></div>
        <div className="hero-content">
          <div className="profile-avatar-container">
            <img
              src={profile.avatar}
              alt="Profile"
              className="profile-avatar"
            />
            <div className="profile-badge">
              <FaCheckCircle className="verified-icon" />
            </div>
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{profile.username}</h1>
            <p className="profile-bio">{profile.short_bio}</p>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">{receivedDonations.length}</span>
                <span className="stat-label">Supporters</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{totalDonationAmount.toFixed(6)}</span>
                <span className="stat-label">{networkCurrency} Raised</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{topSupporters.length}</span>
                <span className="stat-label">Top Donors</span>
              </div>
            </div>
          </div>
          <div className="profile-actions">
            <button className="action-btn share-btn" onClick={handleShareProfile}>
              <FaShare /> Share
            </button>
            <button className="action-btn qr-btn" onClick={() => setShowQRCode(!showQRCode)}>
              <FaQrcode /> QR Code
            </button>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="qr-modal">
          <div className="qr-modal-content">
            <h3>Scan to support {profile.username}</h3>
            <div className="qr-code-placeholder">
              <FaQrcode size={120} />
              <p>QR Code for: {window.location.href}</p>
            </div>
            <button className="close-qr" onClick={() => setShowQRCode(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Share Menu Modal */}
      {showShareMenu && (
        <div className="share-modal">
          <div className="share-modal-content">
            <div className="share-header">
              <h3>Share Profile</h3>
              <button className="close-share" onClick={() => setShowShareMenu(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="share-options">
              <button className="share-option twitter" onClick={() => handleSocialShare('twitter')}>
                <FaTwitter />
                <span>Twitter</span>
              </button>
              <button className="share-option facebook" onClick={() => handleSocialShare('facebook')}>
                <FaFacebook />
                <span>Facebook</span>
              </button>
              <button className="share-option linkedin" onClick={() => handleSocialShare('linkedin')}>
                <FaLinkedin />
                <span>LinkedIn</span>
              </button>
              <button className="share-option copy-link" onClick={() => handleSocialShare('copy')}>
                <FaCopy />
                <span>Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Message */}
      {profile.custom_message && (
        <div className="profile-message-card">
          <div className="message-icon">
            <HiOutlineSparkles size={24} />
          </div>
          <p className="profile-message">{profile.custom_message}</p>
        </div>
      )}

      {/* Social Links */}
      <div className="social-links-card">
        <h3>Connect with {profile.username}</h3>
        <div className="social-icons">
          {profile.twitter_link && (
            <a href={profile.twitter_link} target="_blank" rel="noopener noreferrer" className="social-link twitter">
              <FaTwitter size={20} />
              <span>Twitter</span>
            </a>
          )}
          {profile.instagram_link && (
            <a href={profile.instagram_link} target="_blank" rel="noopener noreferrer" className="social-link instagram">
              <FaInstagram size={20} />
              <span>Instagram</span>
            </a>
          )}
          {profile.youtube_link && (
            <a href={profile.youtube_link} target="_blank" rel="noopener noreferrer" className="social-link youtube">
              <FaYoutube size={20} />
              <span>YouTube</span>
            </a>
          )}
          {profile.website_link && (
            <a href={profile.website_link} target="_blank" rel="noopener noreferrer" className="social-link website">
              <FaGlobe size={20} />
              <span>Website</span>
            </a>
          )}
          {profile.patreon_link && (
            <a href={profile.patreon_link} target="_blank" rel="noopener noreferrer" className="social-link patreon">
              <FaPatreon size={20} />
              <span>Patreon</span>
            </a>
          )}
        </div>
      </div>

      <div className="main-container">
        {/* Support Section */}
        <div className="support-container">
          <div className="support-header">
            <div className="support-title">
              <BsCup className="coffee-icon" />
              <h2>Support {profile.username}</h2>
            </div>
            <div className="crypto-badges">
              <div className="crypto-badge">
                <img src="/src/assets/icons/arbitrum.svg" alt="ARB" className="crypto-icon" />
                <span>ARB (ETH)</span>
              </div>
              <div className="crypto-badge">
                <img src="/src/assets/icons/polygon.svg" alt="POL" className="crypto-icon" />
                <span>POL</span>
              </div>
            </div>
          </div>

          {/* Preset Amounts */}
          <div className="preset-amounts">
            <h3>Quick amounts</h3>
            <div className="preset-grid">
              {presetAmounts.map((amount) => (
                <button
                  key={amount}
                  className={`preset-btn ${selectedPreset === amount ? 'selected' : ''}`}
                  onClick={() => handlePresetSelect(amount)}
                >
                  <BsCup className="preset-icon" />
                  <span className="preset-amount">${amount}</span>
                  <span className="preset-label">{amount === 1 ? 'Coffee' : `${amount} Coffees`}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="custom-amount-section">
            <h3>Custom amount</h3>
            <div className="amount-input-container">
              <div className="amount-input">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  value={donationAmount}
                  min={0.01}
                  step={0.01}
                  onChange={(e) => {
                    setDonationAmount(parseFloat(e.target.value) || 0.01);
                    setSelectedPreset(null);
                  }}
                  placeholder="Enter amount"
                />
              </div>
              <div className="cups-selector">
                <label>Number of cups:</label>
                <div className="cups-controls">
                  <button 
                    type="button" 
                    onClick={() => setCups(Math.max(1, cups - 1))}
                    className="cup-btn"
                  >
                    -
                  </button>
                  <span className="cups-display">{cups}</span>
                  <button 
                    type="button" 
                    onClick={() => setCups(cups + 1)}
                    className="cup-btn"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Supporter Details */}
          <div className="supporter-details">
            <h3>Leave a message (optional)</h3>
            <div className="supporter-inputs">
              <input
                type="text"
                placeholder="Your name or @handle"
                value={supporterName}
                onChange={(e) => setSupporterName(e.target.value)}
                className="supporter-input"
              />
              <textarea
                placeholder="Write a message of support..."
                value={supporterMessage}
                onChange={(e) => setSupporterMessage(e.target.value)}
                className="supporter-message"
                rows="3"
              />
            </div>
          </div>

          {/* Donation Total */}
          <div className="donation-total">
            <div className="total-breakdown">
              <div className="total-line">
                <span>{cups} × ${donationAmount.toFixed(2)}</span>
                <span>${(cups * donationAmount).toFixed(2)}</span>
              </div>
              <div className="total-line final">
                <span>Total</span>
                <span>${(cups * donationAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Support Button */}
          <button 
            className={`support-button ${donationStatus === 'loading' ? 'loading' : ''}`}
            onClick={handleDonate}
            disabled={donationStatus === 'loading'}
          >
            {donationStatus === 'loading' ? (
              <>
                <BsLightning className="loading-icon" />
                Processing...
              </>
            ) : (
              <>
                <FaHeart className="heart-icon" />
                Support with ${(cups * donationAmount).toFixed(2)}
              </>
            )}
          </button>

          {/* Success Message */}
          {donationStatus === 'success' && (
            <div className="success-message">
              <FaCheckCircle className="success-icon" />
              <p>Thank you for your support! 🎉</p>
            </div>
          )}
        </div>
        {/* Top Supporters */}
        {topSupporters.length > 0 && (
          <div className="top-supporters-container">
            <div className="section-header">
              <HiOutlineFire className="fire-icon" />
              <h2>Top Supporters</h2>
            </div>
            <div className="top-supporters-grid">
              {topSupporters.map((supporter, index) => (
                <div key={supporter.donor} className={`top-supporter-card rank-${index + 1}`}>
                  <div className="supporter-rank">#{index + 1}</div>
                  <div className="supporter-avatar">
                    <Avatar />
                  </div>
                  <div className="supporter-details">
                    <span className="supporter-address">
                      {truncateAddress(supporter.donor)}
                    </span>
                    <span className="supporter-amount">
                      {supporter.amount.toFixed(4)} {networkCurrency}
                    </span>
                    <span className="supporter-count">
                      {supporter.count} donation{supporter.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Supporters */}
      <div className="recent-supporters-container">
        <div className="section-header">
          <FaCoffee className="coffee-icon" />
          <h2>Recent Supporters</h2>
          <span className="supporters-count">({receivedDonations.length} total)</span>
        </div>
        
        {receivedDonations.length === 0 ? (
          <div className="no-supporters">
            <BsCup className="empty-icon" />
            <p>No supporters yet. Be the first to show your support!</p>
          </div>
        ) : (
          <>
            <div className="supporters-list">
              {receivedDonations.slice(0, showAllSupporters ? receivedDonations.length : 5).map((supporter, index) => (
                <div
                  key={`${supporter.donor}-${supporter.amount}-${index}`}
                  className="supporter-card"
                >
                  <div className="supporter-avatar">
                    <Avatar />
                  </div>
                  <div className="supporter-info">
                    <div className="supporter-main">
                      <span className="supporter-name">
                        <span className="tooltip">
                          {truncateAddress(supporter.donor)}
                          <span className="tooltiptext">{supporter.donor}</span>
                        </span>
                      </span>
                      <span className="donation-amount">
                        <FaCoffee className="coffee-small" />
                        {supporter.amount} {networkCurrency}
                      </span>
                    </div>
                    {supporter.message && (
                      <p className="supporter-message">
                        "{supporter.message}"
                      </p>
                    )}
                    <div className="supporter-time">
                      {new Date(supporter.timeStamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {receivedDonations.length > 5 && (
              <button 
                className="show-more-btn"
                onClick={() => setShowAllSupporters(!showAllSupporters)}
              >
                {showAllSupporters ? (
                  <><FaChevronUp /> Show Less</>
                ) : (
                  <><FaChevronDown /> Show All {receivedDonations.length} Supporters</>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
