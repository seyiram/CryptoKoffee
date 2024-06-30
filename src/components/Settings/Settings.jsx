import "./Settings.css";
import React, { useEffect, useState } from "react";
import { GoCopy } from "react-icons/go";
import { toast } from "react-toastify";

import { getUserProfile, deleteUserProfile } from "../../utils/aws";
import { getWallet } from "../../utils/interact";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "./ConfirmationDialog";

const Settings = () => {
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [wallet, setWallet] = useState(null);
  const [userId, setUserId] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const user = `user-${wallet?.walletAddress}`;

  useEffect(() => {
    const getWalletData = async () => {
      const walletInfo = await getWallet();
      setWallet(walletInfo);
      setUserId(user);
      const profile = await getUserProfile(user);
      setUserProfile(profile);
    };
    getWalletData();
  }, [wallet?.walletAddress]);

  const handleAvatarChange = (e) => {
    if (e.target.files?.[0]) {
      setAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };

  const copyToClipboard = () => {
    if (wallet && wallet.walletAddress) {
      navigator.clipboard.writeText(wallet.walletAddress)
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

  const handleDeleteAccount = async () => {
    const userConfirmed = await confirmDeletion();

    if (userConfirmed) {
      setIsDeleting(true);
      const success = await deleteUserProfile(userId);
      if (success) {
        toast.info("Your account has been deleted.");
        navigate("/");
      } else {
        toast.error("Failed to delete your account. Please try again.");
      }
      setIsDeleting(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-card">
        <h2>Settings</h2>
        <div className="settings-item">
          <label htmlFor="avatar-upload">Avatar:</label>
          <div className="avatar-container">
            <img src={userProfile?.avatar} alt="Avatar" className="avatar" />
            <label htmlFor="avatar-upload" className="change-btn">
              Change
            </label>
            <input
              type="file"
              id="avatar-upload"
              className="hidden-input"
              onChange={handleAvatarChange}
            />
          </div>
          <p>You can use formats: PNG, JPG, JPEG, GIF</p>
        </div>
        <div className="settings-item">
          <label htmlFor="username-input">Username:</label>
          <div className="input-container">
            <input
              type="text"
              value={userProfile?.username}
              className="username-input"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
        <div className="settings-item">
          <label htmlFor="wallet-input">Wallet:</label>
          <div className="input-container">
            <input
              type="text"
              value={wallet?.walletAddress}
              readOnly
              className="wallet-input"
            />
            <GoCopy onClick={copyToClipboard} className="icon copy-icon" />
          </div>
        </div>
        <button className="delete-account-btn" onClick={handleDeleteAccount}>
          Delete account
        </button>
      </div>
    </div>
  );
};

export default Settings;
