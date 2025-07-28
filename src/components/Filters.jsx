import React from "react";
import "./Filters.css";

/**
 * Filters component for genre and sorting options
 * @param {Object} props - Component props
 * @param {Array} props.genres - Array of genre objects
 * @param {string} props.selectedGenre - Currently selected genre
 * @param {string} props.sortBy - Current sort option
 * @param {Function} props.onGenreChange - Callback for genre change
 * @param {Function} props.onSortChange - Callback for sort change
 * @returns {JSX.Element} The filters component
 */
function Filters({
  genres,
  selectedGenre,
  sortBy,
  onGenreChange,
  onSortChange,
}) {
  return (
    <section className="filters">
      <div className="filters__row">
        <div className="filters__group">
          <span className="filters__label">Filter by:</span>
          <div className="filters__dropdown-container">
            <select
              value={selectedGenre}
              onChange={(e) => onGenreChange(e.target.value)}
              className="filters__dropdown"
              aria-label="Filter by genre"
            >
              <option value="all">All Genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={`genre-${genre.id}`}>
                  {genre.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filters__group">
          <span className="filters__label">Sort by:</span>
          <div className="filters__dropdown-container">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="filters__dropdown"
              aria-label="Sort podcasts"
            >
              <option value="updated-desc">Newest First</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
              <option value="popular-desc">Most Popular</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Filters;
