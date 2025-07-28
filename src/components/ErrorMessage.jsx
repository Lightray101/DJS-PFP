import React from "react";
import "./ErrorMessage.css";

/**
 * ErrorMessage component for displaying error and empty states
 * @param {Object} props - Component props
 * @param {string} props.message - Error message to display
 * @returns {JSX.Element} The error message component
 */
function ErrorMessage({ message }) {
  return (
    <div className="error-container">
      <div className="error-message">
        <svg
          className="error-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        <h3 className="error-title">Oops!</h3>
        <p className="error-text">{message}</p>
      </div>
    </div>
  );
}

export default ErrorMessage;
