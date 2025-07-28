import React from "react";
import "./Header.css";

/**
 * Header component displaying the app logo and title
 * @returns {JSX.Element} The header component
 */
function Header() {
  return (
    <header className="header">
      <div className="header__logo">
        <svg
          className="header__logo-img"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12V20C2 21.1 2.9 22 4 22H8C9.1 22 10 21.1 10 20V12C10 8.13 13.13 5 17 5C20.87 5 24 8.13 24 12V20C24 21.1 23.1 22 22 22H18C16.9 22 16 21.1 16 20V12C16 6.48 13.55 2.8 12 2Z"
            fill="#333"
          />
        </svg>
        <h1 className="header__title">Podcast-App</h1>
      </div>
      <div className="header__actions">
        <button className="header__search-btn" aria-label="Search">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
        <img
          src="https://img.icons8.com/ios-glyphs/30/000000/user-male-circle.png"
          alt="User Profile"
          className="header__profile-img"
        />
      </div>
    </header>
  );
}

export default Header;
