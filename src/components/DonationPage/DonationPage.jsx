import React, { useState } from "react";
import { SlCloudUpload } from "react-icons/sl";
import { GoCopy } from "react-icons/go";
import {
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaGlobe,
  FaPatreon,
} from "react-icons/fa";
import "./DonationPage.css";

const DonationPage = () => {
  const [link, setLink] = useState("https://cryptokoffee.co/donate/");
  const [displayName, setDisplayName] = useState("OxHearts");
  const [bio, setBio] = useState("Best design agency in the world :)");
  const [text, setText] = useState(
    "Hello, viewer! I’m really glad you stopped by here. I will send part of the money raised through the cryptotip service to charity. Have a good day!"
  );
  const [profilePicture, setProfilePicture] = useState(null);
  const [twitterLink, setTwitterLink] = useState(
    "https://twitter.com/OxHearts"
  );
  const [instagramLink, setInstagramLink] = useState(
    "https://www.instagram.com/oxhearts/"
  );
  const [youtubeLink, setYoutubeLink] = useState(
    "https://www.youtube.com/channel/UC5yq6J2b7pCtG0yVp0fN5WQ"
  );
  const [websiteLink, setWebsiteLink] = useState("https://cryptokoffee.co");
  const [patreonLink, setPatreonLink] = useState(
    "https://www.patreon.com/oxhearts"
  );

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

  const handleProfilePictureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="donation-page">
      <div className="donation-link-container">
        <div className="donation-link">
          <h2>Donation Page</h2>
          <span className="donation-label">Donation link to the page</span>
          <div className="input-group">
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <GoCopy onClick={copyToClipboard} className="icon copy-icon" />
            <button className="visit-page-btn">Visit Page</button>
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
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Displayed name"
            />
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Short bio"
            />
            <input
              type="text"
              value={twitterLink}
              onChange={(e) => setTwitterLink(e.target.value)}
              placeholder="Twitter link"
            />
            <input
              type="text"
              value={instagramLink}
              onChange={(e) => setInstagramLink(e.target.value)}
              placeholder="Instagram link"
            />
            <input
              type="text"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              placeholder="YouTube link"
            />
            <input
              type="text"
              value={websiteLink}
              onChange={(e) => setWebsiteLink(e.target.value)}
              placeholder="Website link"
            />
            <input
              type="text"
              value={patreonLink}
              onChange={(e) => setPatreonLink(e.target.value)}
              placeholder="Patreon link"
            />
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Your custom message"
          />
          <div className="profile-picture-upload">
            {profilePicture && <img src={profilePicture} alt="Profile" />}
            <label htmlFor="profile-picture" className="upload-card">
              <SlCloudUpload className="icon profile-picture-icon" />
              <div className="upload-text">
                <span className="click-to-upload">Click to upload</span>{" "}
                <span className="or-drag-and-drop">or drag and drop</span>
              </div>
              <div className="upload-instructions">
                JPG, JPEG or PNG (1:1, max size 2MB)
              </div>
            </label>
            <input
              type="file"
              id="profile-picture"
              className="hidden-input"
              onChange={handleProfilePictureChange}
            />
            <button className="cancel-btn">Cancel</button>
            <button className="save-btn">Save changes</button>
          </div>
        </div>
        <div className="page-preview">
          <h2>Page Preview</h2>
          <div className="preview-card">
            {profilePicture && <img src={profilePicture} alt="Profile" />}
            <h3>{displayName}</h3>
            <p>{bio}</p>
            <p>{text}</p>
            <div className="social-icons-preview">
              {twitterLink && (
                <a href={twitterLink} target="_blank" rel="noopener noreferrer">
                  <FaTwitter />
                </a>
              )}
              {instagramLink && (
                <a
                  href={instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </a>
              )}
              {youtubeLink && (
                <a href={youtubeLink} target="_blank" rel="noopener noreferrer">
                  <FaYoutube />
                </a>
              )}
              {websiteLink && (
                <a href={websiteLink} target="_blank" rel="noopener noreferrer">
                  <FaGlobe />
                </a>
              )}
              {patreonLink && (
                <a href={patreonLink} target="_blank" rel="noopener noreferrer">
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
