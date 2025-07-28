import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { getPlaceholderImageUrl } from "../utils/imageProxy.js";
import "./PodcastCard.css";

/**
 * PodcastCard component for displaying individual podcast information
 * @param {Object} props - Component props
 * @param {Object} props.podcast - Podcast object
 * @param {Array} props.genreNames - Array of genre names
 * @param {Function} props.onClick - Click handler
 * @returns {JSX.Element} The podcast card component
 */
function PodcastCard({ podcast, genreNames, onClick }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Get the placeholder image URL with podcast title
  const isArt19 =
    podcast.image && podcast.image.includes("content.production.cdn.art19.com");
  const imageUrl = getPlaceholderImageUrl(
    podcast.title,
    podcast.image,
    isArt19
  );

  // Debug logging
  console.log(`PodcastCard for "${podcast.title}":`, {
    originalImage: podcast.image,
    placeholderUrl: imageUrl,
    hasImage: !!imageUrl,
  });

  /**
   * Format the updated date to a human-readable format
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

  /**
   * Handle image load success
   */
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
    console.log(`✅ Image loaded successfully for: ${podcast.title}`);
  };

  /**
   * Handle image load error
   */
  const handleImageError = (event) => {
    setImageLoading(false);
    setImageError(true);

    // Get more detailed error information
    const target = event.target;
    console.error(`❌ Failed to load image for podcast: ${podcast.title}`, {
      src: target.src,
      naturalWidth: target.naturalWidth,
      naturalHeight: target.naturalHeight,
      complete: target.complete,
      error: target.error,
    });
  };

  return (
    <article className="podcast-card" onClick={onClick}>
      <div className="podcast-card__image-container">
        {imageUrl && !imageError ? (
          <>
            {imageLoading && (
              <div className="podcast-card__image-loading">Loading...</div>
            )}
            <img
              src={imageUrl}
              alt={podcast.title}
              className="podcast-card__image"
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </>
        ) : (
          <div className="podcast-card__image-placeholder">
            {imageError ? "Image Failed to Load" : "No Image Available"}
          </div>
        )}
      </div>

      <div className="podcast-card__content">
        <h3 className="podcast-card__title" title={podcast.title}>
          {podcast.title}
        </h3>

        <div className="podcast-card__meta">
          <span className="podcast-card__seasons">
            {podcast.seasons} {podcast.seasons === 1 ? "season" : "seasons"}
          </span>

          <div className="podcast-card__genres">
            {genreNames.map((genre, index) => (
              <span key={index} className="podcast-card__genre-tag">
                {genre}
              </span>
            ))}
          </div>

          <div className="podcast-card__updated">
            <svg
              className="podcast-card__calendar-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
            </svg>
            <span>{formatDate(podcast.updated)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default PodcastCard;
