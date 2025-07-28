import React from "react";
import "./Search.css";

/**
 * Search component for filtering podcasts by title
 * @param {Object} props - Component props
 * @param {string} props.searchTerm - Current search term
 * @param {Function} props.onSearchChange - Callback for search term changes
 * @returns {JSX.Element} The search component
 */
function Search({ searchTerm, onSearchChange }) {
  /**
   * Handle search input change
   * @param {Event} e - The input change event
   */
  const handleSearchChange = (e) => {
    onSearchChange(e.target.value);
  };

  return (
    <section className="search">
      <div className="search__container">
        <input
          type="text"
          placeholder="Search podcasts..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search__input"
          aria-label="Search podcasts"
        />
        <div className="search__icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
      </div>
    </section>
  );
}

export default Search;
