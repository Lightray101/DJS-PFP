import React, { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { getPlaceholderImageUrl } from "../utils/imageProxy.js";
import "./Modal.css";

/**
 * Modal component for displaying podcast details
 * @param {Object} props - Component props
 * @param {Object} props.podcast - Podcast object
 * @param {Array} props.genres - Array of genre objects
 * @param {Array} props.seasons - Array of season objects
 * @param {Function} props.onClose - Close handler
 * @returns {JSX.Element} The modal component
 */
function Modal({ podcast, genres, seasons, onClose }) {
  /**
   * Handle escape key press to close modal
   */
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  /**
   * Get genre names for the podcast
   * @returns {Array} Array of genre names
   */
  const getGenreNames = () => {
    return podcast.genres
      .map((id) => genres.find((genre) => genre.id === id)?.title)
      .filter(Boolean);
  };

  /**
   * Get season details for the podcast
   * @returns {Array} Array of season details
   */
  const getSeasonDetails = () => {
    const seasonData = seasons.find((s) => s.id === podcast.id);
    return seasonData?.seasonDetails || [];
  };

  /**
   * Format the updated date
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Unknown";
    }
  };

  // Get the placeholder image URL with podcast title
  const isArt19 =
    podcast.image && podcast.image.includes("content.production.cdn.art19.com");
  const imageUrl = getPlaceholderImageUrl(
    podcast.title,
    podcast.image,
    isArt19
  );

  return (
    <div className="modal-overlay" aria-hidden="false">
      <div className="modal-content" onClick={onClose}>
        <button className="modal-close" aria-label="Close modal" onClick={onClose}>
          &#x2715;
        </button>
        <div className="modal-flex-row">
          <div className="modal__image-container">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={podcast.title}
                className="modal__image"
              />
            ) : (
              <div className="modal__image-placeholder">
                No Image Available
              </div>
            )}
          </div>

          <div className="modal-details">
            <h2 id="modal-title" className="modal__title">
              {podcast.title}
            </h2>

            <div className="modal__meta">
              <span className="modal__seasons">
                {podcast.seasons}{" "}
                {podcast.seasons === 1 ? "season" : "seasons"}
              </span>

              <div className="modal__genres">
                {getGenreNames().map((genre, index) => (
                  <span key={index} className="modal__genre-tag">
                    {genre}
                  </span>
                ))}
              </div>

              <div className="modal__updated">
                <svg
                  className="modal__calendar-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
                </svg>
                <span>Updated {formatDate(podcast.updated)}</span>
              </div>
            </div>

            <div className="modal__description">
              <h3>Description</h3>
              <p>{podcast.description}</p>
            </div>

            {getSeasonDetails().length > 0 && (
              <div className="modal__seasons-detail">
                <h3>Seasons</h3>
                <div className="modal__seasons-list">
                  {getSeasonDetails().map((season, index) => (
                    <div key={index} className="modal__season-item">
                      <span className="modal__season-title">
                        {season.title}
                      </span>
                      <span className="modal__season-episodes">
                        {season.episodes}{" "}
                        {season.episodes === 1 ? "episode" : "episodes"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
