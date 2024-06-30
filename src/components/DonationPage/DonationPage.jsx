import React, { useReducer, useEffect } from "react";
import "./DonationPage.css";
import { SlCloudUpload } from "react-icons/sl";
import { GoCopy } from "react-icons/go";
import {
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaGlobe,
  FaPatreon,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import { initialState, reducer } from "../../../state/donationPageState";
import { toast } from "react-toastify";

import { getWallet } from "../../utils/interact";
import { S3, HeadObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { getUserProfile, dynamodb } from "../../utils/aws";

const s3 = new S3({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_S3_SECRET_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_S3_SECRET_ACCESS_KEY,
  },
});

const DonationPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [walletAddress, setWalletAddress] = React.useState(null);
  const [isProfileSaved, setIsProfileSaved] = React.useState(false);
  const [isProfileFetched, setIsProfileFetched] = React.useState(false);
  const navigate = useNavigate();
  // const { customUrl } = useParams();

  const fetchUserProfile = async () => {
    const wallet = await getWallet();
    setWalletAddress(wallet?.walletAddress);
    if (walletAddress) {
      const userId = `user-${walletAddress}`;
      const profile = await getUserProfile(userId);
      if (profile) {
        setIsProfileFetched(true);
        dispatch({
          type: "SET_LINK",
          payload: profile.custom_url || "",
        });
        dispatch({
          type: "SET_DISPLAY_NAME",
          payload: profile.username || "",
        });
        dispatch({ type: "SET_BIO", payload: profile.short_bio || "" });
        dispatch({ type: "SET_TEXT", payload: profile.custom_message || "" });
        dispatch({
          type: "SET_PROFILE_PICTURE",
          payload: profile.avatar || null,
        });
        dispatch({
          type: "SET_TWITTER_LINK",
          payload: profile.twitter_link || "",
        });
        dispatch({
          type: "SET_INSTAGRAM_LINK",
          payload: profile.instagram_link || "",
        });
        dispatch({
          type: "SET_YOUTUBE_LINK",
          payload: profile.youtube_link || "",
        });
        dispatch({
          type: "SET_WEBSITE_LINK",
          payload: profile.website_link || "",
        });
        dispatch({
          type: "SET_PATREON_LINK",
          payload: profile.patreon_link || "",
        });
      }
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [walletAddress]);

  const checkIfFileExists = async (Key) => {
    const params = {
      Bucket: "cryptokoffee-avatars2",
      Key,
    };

    try {
      await s3.send(new HeadObjectCommand(params));
      return true;
    } catch (error) {
      if (error.name === "NotFound") {
        return false;
      }
      console.error("Error checking if file exists:", error);
      return false;
    }
  };

  const uploadToS3 = async (file) => {
    const Key = `profile-pictures/${Date.now()}-${file.name}`; // Unique file name

    // Check if the file already exists
    const fileExists = await checkIfFileExists(Key);
    if (fileExists) {
      toast.info("File already saved!");
      return null;
    }

    const params = {
      Bucket: "cryptokoffee-avatars2",
      Key,
      Body: file,
      ContentType: file.type,
    };

    try {
      const upload = new Upload({
        client: s3,
        params,
      });

      const { Location } = await upload.done();
      return Location; // S3 URL
    } catch (error) {
      console.error("Error uploading to S3:", error);
      return null;
    }
  };

  const handleProfilePictureChange = async (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const maxSize = 1 * 1024 * 1024; // 1MB

      // Check file size
      if (file.size > maxSize) {
        toast.error("File size should be 1MB or less.");
        return;
      }

      // Create a temporary URL for the file
      const imageUrl = URL.createObjectURL(file);

      // Set the profile picture to the temporary URL
      dispatch({ type: "SET_PROFILE_PICTURE", payload: imageUrl });

      // Check aspect ratio
      const img = new Image();
      img.src = imageUrl;
      img.onload = async () => {
        if (img.width !== img.height) {
          toast.error("Image must be 1:1 aspect ratio.");
          // Reset the profile picture if the aspect ratio is invalid
          dispatch({ type: "SET_PROFILE_PICTURE", payload: null });
          return;
        }

        const s3Url = await uploadToS3(file);
        if (s3Url) {
          // Update the profile picture to the S3 URL after successful upload
          dispatch({ type: "SET_PROFILE_PICTURE", payload: s3Url });
        } else {
          toast.error("Failed to upload image.");
          // Reset the profile picture if the upload fails
          dispatch({ type: "SET_PROFILE_PICTURE", payload: null });
        }
      };
    }
  };

  const saveUserProfile = async () => {
    if (!walletAddress) {
      toast.error("Wallet not connected.");
      return;
    }

    // Define user_id based on walletAddress
    const user_id = `user-${walletAddress}`;

    // contruct full url
    const fullUrl = `https://cryptokoffee.com/donate/${state.displayName}`;

    const userProfile = {
      user_id: user_id, // Unique identifier
      wallet_address: walletAddress,
      custom_url: fullUrl,
      username: state.displayName,
      avatar: state.profilePicture, // S3 URL
      short_bio: state.bio,
      twitter_link: state.twittrLink,
      instagram_link: state.instagramLink,
      youtube_link: state.youtubeLink,
      website_link: state.websiteLink,
      patreon_link: state.patreonLink,
      custom_message: state.text,
    };

    const params = {
      TableName: "UserProfiles",
      Item: marshall(userProfile, { removeUndefinedValues: true }),
      ConditionExpression: "attribute_exists(wallet_address)",
    };

    try {
      await dynamodb.send(new PutItemCommand(params));
      toast.success("User profile updated successfully!");
      setIsProfileSaved(true);
    } catch (error) {
      if (error.name === "ConditionalCheckFailedException") {
        // If the condition fails, the user profile does not exist, so create it
        const createParams = {
          TableName: "UserProfiles",
          Item: marshall(userProfile, { removeUndefinedValues: true }),
        };
        await dynamodb.send(new PutItemCommand(createParams));
        toast.success("User profile created successfully!");
        setIsProfileSaved(true);
      } else {
        console.error("Error saving user profile:", error);
        toast.error("Failed to save user profile.");
      }
    }
  };

  const handleVisitPage = () => {
    const customUrl = state.displayName;
    navigate(`/donate/${customUrl}`);
  };

  return (
    <div className="donation-page">
      <div className="donation-link-container">
        <div className="donation-link">
          <h2>Donation Page</h2>
          <span className="donation-label">Donation link (your page)</span>
          <div className="input-group">
            <div className="input-container">
              <span className="donation-link-prefix">
                cryptokoffee.com/donate/
              </span>
              <input
                type="text"
                value={state.displayName}
                onChange={(e) =>
                  dispatch({
                    type: "SET_DISPLAY_NAME",
                    payload: e.target.value,
                  })
                }
                placeholder="Enter your username e.g. 0xAnonymous"
              />
              <GoCopy
                onClick={() => navigator.clipboard.writeText(state.link)}
                className="icon copy-icon"
              />
            </div>
            {isProfileSaved || isProfileFetched ? (
              <button
                className="visit-page-btn"
                value={state.link}
                onClick={handleVisitPage}
              >
                Visit Page
              </button>
            ) : null}
          </div>
          <hr className="divider" />
        </div>
      </div>
      <div className="lower-section">
        <div className="customization-section">
          <h2>Customize your page</h2>
          <p className="subtitle">
            Customize your page with your name, bio, and profile picture.
          </p>
          <div className="input-group">
            <input
              type="text"
              value={state.displayName}
              onChange={(e) =>
                dispatch({ type: "SET_DISPLAY_NAME", payload: e.target.value })
              }
              placeholder="Displayed name"
            />
            <input
              type="text"
              value={state.bio}
              onChange={(e) =>
                dispatch({ type: "SET_BIO", payload: e.target.value })
              }
              placeholder="Short bio"
            />
            <input
              type="text"
              value={state.twitterLink}
              onChange={(e) =>
                dispatch({ type: "SET_TWITTER_LINK", payload: e.target.value })
              }
              placeholder="X link"
            />
            <input
              type="text"
              value={state.instagramLink}
              onChange={(e) =>
                dispatch({
                  type: "SET_INSTAGRAM_LINK",
                  payload: e.target.value,
                })
              }
              placeholder="Instagram link"
            />
            <input
              type="text"
              value={state.youtubeLink}
              onChange={(e) =>
                dispatch({ type: "SET_YOUTUBE_LINK", payload: e.target.value })
              }
              placeholder="YouTube link"
            />
            <input
              type="text"
              value={state.websiteLink}
              onChange={(e) =>
                dispatch({ type: "SET_WEBSITE_LINK", payload: e.target.value })
              }
              placeholder="Website link"
            />
            <input
              type="text"
              value={state.patreonLink}
              onChange={(e) =>
                dispatch({ type: "SET_PATREON_LINK", payload: e.target.value })
              }
              placeholder="Patreon link"
            />
          </div>
          <textarea
            value={state.text}
            onChange={(e) =>
              dispatch({ type: "SET_TEXT", payload: e.target.value })
            }
            placeholder="Your custom message"
          />
          <div className="profile-picture-upload">
            {state.profilePicture && (
              <img
                className="profile-picture"
                src={state.profilePicture}
                alt="Profile"
              />
            )}
            <label htmlFor="profile-picture" className="upload-card">
              <SlCloudUpload className="icon profile-picture-icon" />
              <div className="upload-text">
                <span className="click-to-upload">Click to upload</span>{" "}
                <span className="or-drag-and-drop">or drag and drop</span>
              </div>
              <div className="upload-instructions">
                JPG, JPEG or PNG (1:1, max size 1MB)
              </div>
            </label>
            <input
              type="file"
              id="profile-picture"
              className="hidden-input"
              onChange={handleProfilePictureChange}
            />
            <div className="donation-btn-group">
              <button className="cancel-btn" onClick={() => navigate("/")}>
                Cancel
              </button>
              <button className="save-btn" onClick={saveUserProfile}>
                Save changes
              </button>
            </div>
          </div>
        </div>
        <div className="page-preview">
          <h2>Page Preview</h2>
          <div className="preview-card">
            {state.profilePicture && (
              <img src={state.profilePicture} alt="Profile" />
            )}
            <h3>{state.displayName}</h3>
            <p>{state.bio}</p>
            <p>{state.text}</p>
            <div className="social-icons-preview">
              {state.twitterLink && (
                <a
                  href={state.twitterLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter />
                </a>
              )}
              {state.instagramLink && (
                <a
                  href={state.instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </a>
              )}
              {state.youtubeLink && (
                <a
                  href={state.youtubeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaYoutube />
                </a>
              )}
              {state.websiteLink && (
                <a
                  href={state.websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGlobe />
                </a>
              )}
              {state.patreonLink && (
                <a
                  href={state.patreonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaPatreon />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;
