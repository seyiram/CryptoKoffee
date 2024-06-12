import "./UserProfile.css";
import React from "react";
import { FaTwitter, FaSpotify, FaYoutube, FaDribbble } from "react-icons/fa";
import CryptoKoffeeCup from '../../assets/cryptokoffee_cup.png';
const UserProfile = () => {
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

  return (
    <div className="user-profile-page">
      <div className="main-container">
        <div className="profile-header-container">
          <div className="profile-header">
            {/* <img
              src="https://via.placeholder.com/1500x500"
              alt="Cover"
              className="cover-image"
            /> */}
            <div className="profile-info">
              <img
                src="https://via.placeholder.com/150"
                alt="Profile"
                className="profile-image"
              />
              <div className="profile-details">
                <h2>Henry Louis</h2>
                <p>Artist</p>
                <p className="profile-description">
                  Howdy fellow animator. If you're here looking for my tutorials
                  and Ae-files you're in luck. Got a whole lot of this going on
                  inside if you buy me a coffee.
                </p>
                <div className="social-icons">
                  <FaTwitter size={30} />
                  <FaSpotify size={30} />
                  <FaYoutube size={30} />
                  <FaDribbble size={30} />
                </div>
              </div>
              <div className="supporters">
                <span>143 supporters</span>
              </div>
            </div>
          </div>
        </div>
        <div className="support-container">
          <h2>Support Henry Louis with a cup of coffee</h2>
          <div className="support-options">
            <div className="coffee-selection">
              <img
                src={CryptoKoffeeCup} 
                alt="CryptoKoffeeIcon"
              />
              <span>$4</span>
              <input type="number" defaultValue={1} min={1} />
              <button>1</button>
              <button>3</button>
              <button>5</button>
            </div>
            {/* <div className="payment-frequency">
              <button className="active">One-time</button>
              <button>Monthly</button>
            </div> */}
            <div className="support-details">
              <input type="text" placeholder="Name or @yourtwitter" />
              <input type="text" placeholder="Message (optional)" />
              <label>
                <input type="checkbox" />
                Private message
              </label>
            </div>
            <button className="support-button">Tip Henry ($4)</button>
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
