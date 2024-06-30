import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";
import LostIcon from "../../assets/icons/LostIcon";

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="icon-container">
        <LostIcon />
      </div>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/">Go to Dashboard</Link>
    </div>
  );
};

export default NotFound;
