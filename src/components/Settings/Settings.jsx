import "./Settings.css";
import React, { useEffect, useState } from "react";
import { GoCopy } from "react-icons/go";
import { FaUser, FaWallet, FaTrashAlt, FaSave, FaExclamationTriangle, FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";

import { getUserProfile, deleteUserProfile, updateUserProfile } from "../../utils/aws";
import { getWallet } from "../../utils/interact";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "./ConfirmationDialog";
import { useWallet } from "../../contexts/WalletContext";
import { ethers } from "ethers";

const Settings = () => {
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [wallet, setWallet] = useState(null);
  const [userId, setUserId] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [usernameError, setUsernameError] = useState("");
  
  const navigate = useNavigate();
  
  // Use WalletContext for connected account
  const { account } = useWallet();

  useEffect(() => {
    const getWalletData = async () => {
      setIsLoading(true);
      if (account) {
        try {
          const checksummedAccount = ethers.getAddress(account);
          const user = `user-${checksummedAccount}`;
          setUserId(user);
          
          // Get wallet info from contract for display
          const walletInfo = await getWallet();
          setWallet(walletInfo);
          
          // Get user profile using connected account
          const profile = await getUserProfile(user);
          setUserProfile(profile);
          
          // Set initial form values
          if (profile) {
            setUsername(profile.username || "");
            setAvatar(profile.avatar || "");
          }
          
          console.log("Settings Debug:", {
            account,
            user,
            walletInfo,
            profile,
            accountFromStorage: localStorage.getItem("account")
          });
          
          // Check if old profile exists with different case variations
          if (!profile && walletInfo?.walletAddress) {
            // Try with the checksummed address from the contract
            const mixedCaseUserId = `user-${walletInfo.walletAddress}`;
            const oldProfile = await getUserProfile(mixedCaseUserId);
            console.log("Mixed case profile check:", {
              mixedCaseUserId,
              oldProfile
            });
            
            // If we found it, use it
            if (oldProfile) {
              setUserProfile(oldProfile);
              setUsername(oldProfile.username || "");
              setAvatar(oldProfile.avatar || "");
            }
          }
        } catch (error) {
          console.error("Error loading settings:", error);
          toast.error("Failed to load settings");
        }
      }
      setIsLoading(false);
    };
    getWalletData();
  }, [account]);

  // Track changes for save button
  useEffect(() => {
    const originalUsername = userProfile?.username || "";
    const originalAvatar = userProfile?.avatar || "";
    
    const hasUsernameChanged = username !== originalUsername;
    const hasAvatarChanged = selectedFile !== null;
    
    setHasChanges(hasUsernameChanged || hasAvatarChanged);
  }, [username, selectedFile, userProfile]);

  const validateUsername = (value) => {
    if (!value.trim()) {
      return "Username is required";
    }
    if (value.length < 2) {
      return "Username must be at least 2 characters";
    }
    if (value.length > 50) {
      return "Username must be less than 50 characters";
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      return "Username can only contain letters, numbers, hyphens, and underscores";
    }
    return "";
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    setUsernameError(validateUsername(value));
  };

  const handleAvatarChange = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      
      setSelectedFile(file);
      setAvatar(URL.createObjectURL(file));
    }
  };

  const copyToClipboard = () => {
    if (account) {
      navigator.clipboard.writeText(account)
        .then(() => {
          toast.success("Wallet address copied to clipboard!");
        })
        .catch(err => {
          toast.error("Failed to copy wallet address: " + err);
        });
    } else {
      toast.error("No wallet address found to copy.");
    }
  };

  
  const confirmDeletion = () => {
    return new Promise((resolve) => {
      const toastId = toast.info(
        ({ closeToast }) => (
          <ConfirmationDialog
            onConfirm={() => {
              resolve(true);
              toast.dismiss(toastId);
            }}
            onCancel={() => {
              resolve(false);
              closeToast();
            }}
          />
        ),
        {
          autoClose: false,
          closeOnClick: false,
          draggable: false,
          pauseOnHover: false,
          closeButton: false,
          position: "top-center",
        }
      );
    });
  };

  const handleSaveChanges = async () => {
    // Validate username
    const usernameValidationError = validateUsername(username);
    if (usernameValidationError) {
      setUsernameError(usernameValidationError);
      toast.error(usernameValidationError);
      return;
    }

    setIsSaving(true);
    try {
      const updatedProfile = {
        ...userProfile,
        username: username.trim(),
      };

      // Handle avatar upload if file is selected
      if (selectedFile) {
        // Here you would typically upload the file to your storage service
        // For now, we'll use the blob URL
        updatedProfile.avatar = avatar;
      }

      const success = await updateUserProfile(userId, updatedProfile);
      
      if (success) {
        setUserProfile(updatedProfile);
        setSelectedFile(null);
        setHasChanges(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
    setIsSaving(false);
  };

  const handleDeleteAccount = async () => {
    const userConfirmed = await confirmDeletion();

    if (userConfirmed) {
      setIsDeleting(true);
      try {
        const success = await deleteUserProfile(userId);
        if (success) {
          toast.success("Your account has been deleted.");
          navigate("/");
        } else {
          toast.error("Failed to delete your account. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        toast.error("Failed to delete your account. Please try again.");
      }
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="settings-page">
        <div className="settings-container">
          <div className="settings-header">
            <h1 className="settings-title">Settings</h1>
          </div>
          <div className="settings-card">
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="loading-spinner" style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚙️</div>
              <p>Loading settings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1 className="settings-title">Settings</h1>
        </div>
        
        {/* Profile Settings Card */}
        <div className="settings-card">
          <h3>
            <FaUser className="settings-icon" />
            Profile Settings
          </h3>
          
          <div className="settings-item">
            <label htmlFor="avatar-upload">Avatar</label>
            <div className="avatar-container">
              <img 
                src={avatar || userProfile?.avatar || '/default-avatar.png'} 
                alt="Avatar" 
                className="avatar" 
              />
              <div className="avatar-upload-section">
                <label htmlFor="avatar-upload" className="change-btn">
                  <FaCamera /> Change Avatar
                </label>
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden-input"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
                <p className="avatar-info">
                  Supported formats: PNG, JPG, JPEG, GIF (max 5MB)
                </p>
              </div>
            </div>
          </div>
          
          <div className="settings-item">
            <label htmlFor="username-input">Username</label>
            <div className="settings-input-container">
              <input
                type="text"
                id="username-input"
                value={username}
                className={`username-input ${usernameError ? 'error' : ''}`}
                onChange={handleUsernameChange}
                placeholder="Enter your username"
              />
            </div>
            {usernameError && (
              <p style={{ color: '#dc3545', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {usernameError}
              </p>
            )}
          </div>
          
          {hasChanges && (
            <button 
              className="save-changes-btn" 
              onClick={handleSaveChanges}
              disabled={isSaving || !!usernameError}
            >
              {isSaving ? (
                <>
                  <div className="loading-spinner">⏳</div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave /> Save Changes
                </>
              )}
            </button>
          )}
        </div>
        
        {/* Wallet Settings Card */}
        <div className="settings-card">
          <h3>
            <FaWallet className="settings-icon" />
            Wallet Information
          </h3>
          
          <div className="settings-item">
            <label htmlFor="wallet-input">Connected Wallet Address</label>
            <div className="settings-input-container">
              <input
                type="text"
                id="wallet-input"
                value={account || ""}
                readOnly
                className="wallet-input"
                placeholder="No wallet connected"
              />
              <button 
                onClick={copyToClipboard} 
                className="copy-icon"
                title="Copy wallet address"
              >
                <GoCopy />
              </button>
            </div>
          </div>
        </div>
        
        {/* Danger Zone Card */}
        <div className="settings-card">
          <h3>
            <FaTrashAlt className="settings-icon" />
            Danger Zone
          </h3>
          
          <div className="delete-section">
            <div className="delete-warning">
              <h4>
                <FaExclamationTriangle className="warning-icon" />
                Delete Account
              </h4>
              <p>
                This action cannot be undone. This will permanently delete your profile, 
                settings, and remove all associated data from our servers.
              </p>
            </div>
            
            <button 
              className="delete-account-btn" 
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="loading-spinner">⏳</div>
                  Deleting Account...
                </>
              ) : (
                <>
                  <FaTrashAlt /> Delete Account
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
