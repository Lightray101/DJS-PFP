import React from "react";
import "./LoadingSpinner.css";

/**
 * LoadingSpinner component for displaying loading states
 * @returns {JSX.Element} The loading spinner component
 */
function LoadingSpinner({ loadingText = "Loading podcasts..." }) {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p className="loading-text">{loadingText}</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
