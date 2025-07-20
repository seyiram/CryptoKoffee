import React, { useReducer, useEffect } from "react";
import "./ProfileSetup.css";
import { SlCloudUpload } from "react-icons/sl";
import { GoCopy } from "react-icons/go";
import {
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaGlobe,
  FaPatreon,
  FaCopy,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { ethers } from "ethers";

import { initialState, reducer } from "../../../state/profileSetupState";
import { toast } from "react-toastify";

import { S3, HeadObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { dynamodb } from "../../utils/aws";
import { useWallet } from "../../contexts/WalletContext";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useQueryClient } from "@tanstack/react-query";

const s3 = new S3({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_S3_SECRET_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_S3_SECRET_ACCESS_KEY,
  },
});

const ProfileSetup = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isProfileSaved, setIsProfileSaved] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState(null); // 'success', 'error', null
  const [errors, setErrors] = React.useState({});
  const [isUploading, setIsUploading] = React.useState(false);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = React.useState(false);
  const [usernameStatus, setUsernameStatus] = React.useState(null); // 'available', 'taken', 'checking'
  const navigate = useNavigate();
  
  // Use WalletContext
  const { account, connectWallet } = useWallet();
  const queryClient = useQueryClient();
  
  // React Query for user profile
  const userId = account ? `user-${ethers.getAddress(account)}` : null;
  const { 
    data: profile, 
    isLoading: isProfileLoading,
    error: profileError 
  } = useUserProfile(userId, {
    enabled: !!account,
  });

  // Update form state when profile data is loaded
  useEffect(() => {
    if (profile) {
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
  }, [profile]);

  // Dirty state detection
  const isFormDirty = React.useMemo(() => {
    if (!profile) return false;
    // Compare each field in state to profile
    return (
      (state.displayName !== (profile.username || "")) ||
      (state.bio !== (profile.short_bio || "")) ||
      (state.text !== (profile.custom_message || "")) ||
      (state.profilePicture !== (profile.avatar || null)) ||
      (state.twitterLink !== (profile.twitter_link || "")) ||
      (state.instagramLink !== (profile.instagram_link || "")) ||
      (state.youtubeLink !== (profile.youtube_link || "")) ||
      (state.websiteLink !== (profile.website_link || "")) ||
      (state.patreonLink !== (profile.patreon_link || ""))
    );
  }, [state, profile]);

  // Form validation
  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };
    
    switch (fieldName) {
      case 'displayName':
        if (!value.trim()) {
          newErrors.displayName = 'Display name is required';
          setUsernameStatus(null);
        } else if (value.length < 2) {
          newErrors.displayName = 'Display name must be at least 2 characters';
          setUsernameStatus(null);
        } else if (value.length > 50) {
          newErrors.displayName = 'Display name must be less than 50 characters';
          setUsernameStatus(null);
        } else if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
          newErrors.displayName = 'Display name can only contain letters, numbers, hyphens, and underscores';
          setUsernameStatus(null);
        } else {
          delete newErrors.displayName;
          // Check username availability with debouncing
          checkUsernameAvailability(value);
        }
        break;
      
      case 'bio':
        if (value.length > 160) {
          newErrors.bio = 'Bio must be less than 160 characters';
        } else {
          delete newErrors.bio;
        }
        break;
      
      case 'text':
        if (value.length > 500) {
          newErrors.text = 'Message must be less than 500 characters';
        } else {
          delete newErrors.text;
        }
        break;
      
      case 'twitterLink':
      case 'instagramLink':
      case 'youtubeLink':
      case 'websiteLink':
      case 'patreonLink':
        if (value && !isValidUrl(value)) {
          newErrors[fieldName] = 'Please enter a valid URL';
        } else {
          delete newErrors[fieldName];
        }
        break;
      
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (type, value) => {
    dispatch({ type, payload: value });
    
    // Get field name from action type
    const fieldName = type.replace('SET_', '').toLowerCase().replace('_link', 'Link').replace('_', '');
    const mappedFieldName = fieldName === 'displayname' ? 'displayName' : fieldName;
    
    // Validate field on change
    setTimeout(() => validateField(mappedFieldName, value), 100);
  };

  // Debounced username availability check
  const checkUsernameAvailability = React.useCallback(
    (() => {
      let timeoutId;
      return (username) => {
        clearTimeout(timeoutId);
        setUsernameStatus('checking');
        setIsCheckingUsername(true);
        
        timeoutId = setTimeout(async () => {
          try {
            // Query DynamoDB for username using GSI
            const params = {
              TableName: "UserProfiles",
              IndexName: "username-index", 
              KeyConditionExpression: "username = :u",
              ExpressionAttributeValues: {
                ":u": { S: username }
              }
            };
            const result = await dynamodb.send(new QueryCommand(params));
            setUsernameStatus(result.Count === 0 ? 'available' : 'taken');
          } catch (error) {
            console.error('Error checking username:', error);
            setUsernameStatus('unknown');
          } finally {
            setIsCheckingUsername(false);
          }
        }, 500); // 500ms debounce
      };
    })()
  , []);

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // Synthetic event to match the file input onChange handler
      const syntheticEvent = {
        target: {
          files: [files[0]]
        }
      };
      handleProfilePictureChange(syntheticEvent);
    }
  };

  const processFile = async (file) => {
    const maxSize = 1 * 1024 * 1024; // 1MB

    // Clear previous errors
    const newErrors = { ...errors };
    delete newErrors.profilePicture;
    setErrors(newErrors);

    // Check file size
    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, profilePicture: "File size should be 1MB or less." }));
      return false;
    }

    // Check file type
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      setErrors(prev => ({ ...prev, profilePicture: "Please select a JPG, JPEG, or PNG image." }));
      return false;
    }

    setIsUploading(true);
    
    return new Promise((resolve) => {
      // Temporary URL for the file
      const imageUrl = URL.createObjectURL(file);
      dispatch({ type: "SET_PROFILE_PICTURE", payload: imageUrl });

      // Check aspect ratio
      const img = new Image();
      img.src = imageUrl;
      img.onload = async () => {
        if (img.width !== img.height) {
          setErrors(prev => ({ ...prev, profilePicture: "Image must be 1:1 aspect ratio." }));
          dispatch({ type: "SET_PROFILE_PICTURE", payload: null });
          setIsUploading(false);
          resolve(false);
          return;
        }

        try {
          const s3Url = await uploadToS3(file);
          if (s3Url) {
            dispatch({ type: "SET_PROFILE_PICTURE", payload: s3Url });
            toast.success("Profile picture uploaded successfully!");
            resolve(true);
          } else {
            setErrors(prev => ({ ...prev, profilePicture: "Failed to upload image. Please try again." }));
            dispatch({ type: "SET_PROFILE_PICTURE", payload: null });
            resolve(false);
          }
        } catch (error) {
          setErrors(prev => ({ ...prev, profilePicture: "Upload failed. Please try again." }));
          dispatch({ type: "SET_PROFILE_PICTURE", payload: null });
          resolve(false);
        } finally {
          setIsUploading(false);
        }
      };
    });
  };

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
      await processFile(file);
    }
  };

  const saveUserProfile = async () => {
    if (!account) {
      toast.error("Wallet not connected.");
      return;
    }

    // Validate all fields before saving
    const fieldsToValidate = ['displayName', 'bio', 'text', 'twitterLink', 'instagramLink', 'youtubeLink', 'websiteLink', 'patreonLink'];
    let hasErrors = false;
    
    fieldsToValidate.forEach(field => {
      const value = state[field] || '';
      const isValid = validateField(field, value);
      if (!isValid) hasErrors = true;
    });

    if (hasErrors) {
      toast.error("Please fix the form errors before saving.");
      return;
    }

    if (!state.displayName.trim()) {
      toast.error("Display name is required.");
      return;
    }

    // Define user_id based on account
    const user_id = `user-${ethers.getAddress(account)}`;

    // construct custom url path for database storage
    const customUrlPath = `/${state.displayName}`;

    const userProfile = {
      user_id: user_id, // Unique identifier
      wallet_address: account,
      custom_url: customUrlPath,
      username: state.displayName,
      avatar: state.profilePicture, // S3 URL
      short_bio: state.bio,
      twitter_link: state.twitterLink,
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
      
      // Invalidate user profile query to refresh data
      queryClient.invalidateQueries({
        queryKey: ["userProfile", user_id]
      });
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
        
        // Invalidate user profile query to refresh data
        queryClient.invalidateQueries({
          queryKey: ["userProfile", user_id]
        });
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

  // Show wallet connection prompt if not connected
  if (!account) {
    return (
      <div className="profile-setup-page">
        <div className="wallet-not-connected">
          <h2>Connect Your Wallet</h2>
          <p>Please connect your wallet to create or edit your donation page.</p>
          <button onClick={connectWallet}>Connect Wallet</button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-setup-page">
      <div className="profile-setup-header-container">
        <div className="profile-setup-header">
          <h2>Profile Setup</h2>
          <span className="profile-setup-label">Donation link (your page)</span>
          <div className="input-group">
            <div className="input-container">
              <span className="profile-setup-link-prefix">
                cryptokoffee.com/donate/
              </span>
              <input
                type="text"
                value={state.displayName}
                onChange={(e) => handleInputChange("SET_DISPLAY_NAME", e.target.value)}
                placeholder="Enter your username e.g. 0xAnonymous"
                className={usernameStatus === 'taken' ? 'error' : ''}
              />
              <div className="link-status">
                {isCheckingUsername && <span className="checking-small">...</span>}
                {usernameStatus === 'available' && <span className="available-small">✓</span>}
                {usernameStatus === 'taken' && <span className="taken-small">✗</span>}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(`cryptokoffee.com/donate/${state.displayName}`)}
                className="icon copy-icon"
                type="button"
                title="Copy link"
              >
                <FaCopy />
              </button>
            </div>
            {/* Update Visit Page button logic */}
            {(isProfileSaved || profile) && !isFormDirty ? (
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
          
          {/* Basic Information Section */}
          <div className="form-section">
            <h3 className="section-title">Basic Information</h3>
            <div className="input-group">
              <div className="input-field">
                <label htmlFor="displayName">Display Name *</label>
                <div className="username-input-container">
                  <input
                    id="displayName"
                    type="text"
                    value={state.displayName}
                    onChange={(e) => handleInputChange("SET_DISPLAY_NAME", e.target.value)}
                    placeholder="Enter your display name"
                    required
                    className={errors.displayName ? 'error' : ''}
                  />
                  <div className="username-status">
                    {isCheckingUsername && <span className="checking">Checking...</span>}
                    {usernameStatus === 'available' && (
                      <span className="available">✓ Available</span>
                    )}
                    {usernameStatus === 'taken' && (
                      <span className="taken">✗ Taken</span>
                    )}
                  </div>
                </div>
                {errors.displayName && <span className="error-message">{errors.displayName}</span>}
                {usernameStatus === 'taken' && !errors.displayName && (
                  <span className="error-message">This username is already taken</span>
                )}
                <div className="url-preview">
                  <small>Your page will be: cryptokoffee.com/donate/{state.displayName || 'username'}</small>
                </div>
              </div>
              <div className="input-field">
                <label htmlFor="bio">Short Bio</label>
                <input
                  id="bio"
                  type="text"
                  value={state.bio}
                  onChange={(e) => handleInputChange("SET_BIO", e.target.value)}
                  placeholder="Tell visitors about yourself (max 160 characters)"
                  className={errors.bio ? 'error' : ''}
                />
                <small className="char-count">{state.bio.length}/160</small>
                {errors.bio && <span className="error-message">{errors.bio}</span>}
              </div>
            </div>
          </div>

          {/* Social Media Links Section */}
          <div className="form-section">
            <h3 className="section-title">Social Media Links</h3>
            <div className="social-inputs">
              <div className="input-field">
                <label htmlFor="twitterLink">
                  <FaTwitter className="social-icon" /> Twitter/X
                </label>
                <input
                  id="twitterLink"
                  type="url"
                  value={state.twitterLink}
                  onChange={(e) => handleInputChange("SET_TWITTER_LINK", e.target.value)}
                  placeholder="https://twitter.com/username"
                  className={errors.twitterLink ? 'error' : ''}
                />
                {errors.twitterLink && <span className="error-message">{errors.twitterLink}</span>}
              </div>
              <div className="input-field">
                <label htmlFor="instagramLink">
                  <FaInstagram className="social-icon" /> Instagram
                </label>
                <input
                  id="instagramLink"
                  type="url"
                  value={state.instagramLink}
                  onChange={(e) => handleInputChange("SET_INSTAGRAM_LINK", e.target.value)}
                  placeholder="https://instagram.com/username"
                  className={errors.instagramLink ? 'error' : ''}
                />
                {errors.instagramLink && <span className="error-message">{errors.instagramLink}</span>}
              </div>
              <div className="input-field">
                <label htmlFor="youtubeLink">
                  <FaYoutube className="social-icon" /> YouTube
                </label>
                <input
                  id="youtubeLink"
                  type="url"
                  value={state.youtubeLink}
                  onChange={(e) => handleInputChange("SET_YOUTUBE_LINK", e.target.value)}
                  placeholder="https://youtube.com/channel/..."
                  className={errors.youtubeLink ? 'error' : ''}
                />
                {errors.youtubeLink && <span className="error-message">{errors.youtubeLink}</span>}
              </div>
              <div className="input-field">
                <label htmlFor="websiteLink">
                  <FaGlobe className="social-icon" /> Website
                </label>
                <input
                  id="websiteLink"
                  type="url"
                  value={state.websiteLink}
                  onChange={(e) => handleInputChange("SET_WEBSITE_LINK", e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className={errors.websiteLink ? 'error' : ''}
                />
                {errors.websiteLink && <span className="error-message">{errors.websiteLink}</span>}
              </div>
              <div className="input-field">
                <label htmlFor="patreonLink">
                  <FaPatreon className="social-icon" /> Patreon
                </label>
                <input
                  id="patreonLink"
                  type="url"
                  value={state.patreonLink}
                  onChange={(e) => handleInputChange("SET_PATREON_LINK", e.target.value)}
                  placeholder="https://patreon.com/username"
                  className={errors.patreonLink ? 'error' : ''}
                />
                {errors.patreonLink && <span className="error-message">{errors.patreonLink}</span>}
              </div>
            </div>
          </div>

          {/* Custom Message Section */}
          <div className="form-section">
            <h3 className="section-title">Custom Message</h3>
            <div className="input-field">
              <label htmlFor="customMessage">Message to supporters</label>
              <textarea
                id="customMessage"
                value={state.text}
                onChange={(e) => handleInputChange("SET_TEXT", e.target.value)}
                placeholder="Write a message to your supporters..."
                rows="4"
                className={errors.text ? 'error' : ''}
              />
              <small className="char-count">{state.text.length}/500</small>
              {errors.text && <span className="error-message">{errors.text}</span>}
            </div>
          </div>
          {/* Profile Picture Section */}
          <div className="form-section">
            <h3 className="section-title">Profile Picture</h3>
            <div className="profile-picture-upload">
              {state.profilePicture && (
                <div className="current-picture">
                  <img
                    className="profile-picture"
                    src={state.profilePicture}
                    alt="Profile"
                  />
                  <span className="picture-status">✓ Picture uploaded</span>
                </div>
              )}
              <label 
                htmlFor="profile-picture" 
                className={`upload-card ${isDragOver ? 'drag-over' : ''} ${isUploading ? 'uploading' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <SlCloudUpload className="icon profile-picture-icon" />
                <div className="upload-text">
                  <span className="click-to-upload">
                    {isUploading ? 'Uploading...' : 'Click to upload'}
                  </span>{" "}
                  <span className="or-drag-and-drop">
                    {isUploading ? '' : 'or drag and drop'}
                  </span>
                </div>
                <div className="upload-instructions">
                  JPG, JPEG or PNG (1:1 aspect ratio, max 1MB)
                </div>
                {isDragOver && (
                  <div className="drag-overlay">
                    <span>Drop image here</span>
                  </div>
                )}
              </label>
              <input
                type="file"
                id="profile-picture"
                className="hidden-input"
                onChange={handleProfilePictureChange}
                accept="image/jpeg,image/jpg,image/png"
                disabled={isUploading}
              />
              {isUploading && <div className="upload-progress">Uploading...</div>}
              {errors.profilePicture && <span className="error-message">{errors.profilePicture}</span>}
            </div>
          </div>

          {/* Save Status Message */}
          {saveStatus === 'success' && (
            <div className="save-status success">
              ✓ Profile saved successfully!
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="save-status error">
              ✗ Error saving profile. Please try again.
            </div>
          )}
          <div className="form-actions">
            <button className="cancel-btn" onClick={() => navigate("/")}>
              Cancel
            </button>
            <button className="save-btn" onClick={saveUserProfile}>
              Save changes
            </button>
          </div>
        </div>
        <div className="page-preview">
          <h2>Live Preview</h2>
          <div className="preview-card">
            <div className="preview-header">
              <div className="preview-avatar">
                {state.profilePicture ? (
                  <img src={state.profilePicture} alt="Profile" />
                ) : (
                  <div className="placeholder-avatar">
                    <span>No image</span>
                  </div>
                )}
              </div>
              <div className="preview-info">
                <h3>{state.displayName || "Your Display Name"}</h3>
                <p className="preview-bio">{state.bio || "Your short bio will appear here"}</p>
              </div>
            </div>
            
            {state.text && (
              <div className="preview-message">
                <p>{state.text}</p>
              </div>
            )}
            
            <div className="social-icons-preview">
              {state.twitterLink && (
                <a
                  href={state.twitterLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <FaTwitter />
                </a>
              )}
              {state.instagramLink && (
                <a
                  href={state.instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <FaInstagram />
                </a>
              )}
              {state.youtubeLink && (
                <a
                  href={state.youtubeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <FaYoutube />
                </a>
              )}
              {state.websiteLink && (
                <a
                  href={state.websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <FaGlobe />
                </a>
              )}
              {state.patreonLink && (
                <a
                  href={state.patreonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <FaPatreon />
                </a>
              )}
            </div>
            
            <div className="preview-url">
              <small>cryptokoffee.com/donate/{state.displayName || "username"}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
