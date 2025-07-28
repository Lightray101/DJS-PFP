import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FavouriteButton } from "./FavouriteButton";
import "./PodcastGrid.css";

/**
 * PodcastGrid component that displays a responsive grid of podcast cards
 * @param {Object} props - Component props
 * @param {Array} props.podcasts - Array of podcast objects
 * @param {Array} props.genres - Array of genre objects
 * @returns {JSX.Element} The podcast grid component
 */
function PodcastGrid({ podcasts, genres }) {
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString()
    ? `?${searchParams.toString()}`
    : "";

  /**
   * Get genre names for a podcast
   * @param {Array} genreIds - Array of genre IDs
   * @returns {Array} Array of genre names
   */
  const getGenreNames = (genreIds) => {
    return genreIds
      .map((id) => genres.find((genre) => genre.id === id)?.title)
      .filter(Boolean);
  };

  return (
    <div className="podcast-grid">
      {podcasts.map((podcast) => (
        <div key={podcast.id} className="podcast-card" style={{ position: 'relative' }}>
          <FavouriteButton
            episodeId={podcast.id}
            showId={podcast.id}
            showTitle={podcast.title}
            // No season info at this level
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 2,
              background: 'rgba(255,255,255,0.85)',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
            }}
          />
          <Link
            to={`/show/${podcast.id}${queryString}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <img src={podcast.image} alt={podcast.title} />
            <h2>{podcast.title}</h2>
            <div className="podcast-genres">
              {podcast.genres &&
                podcast.genres.map((id) => {
                  const genre = genres.find((g) => g.id === id);
                  return (
                    <span className="genre-tag" key={id}>
                      {genre ? genre.title : "Unknown"}
                    </span>
                  );
                })}
            </div>
            <div className="podcast-meta">
              <span>
                <strong>Last updated:</strong>{" "}
                {podcast.updated
                  ? new Date(podcast.updated).toLocaleDateString()
                  : "Unknown"}
              </span>
              <span>
                <strong>Seasons:</strong> {podcast.seasons || 0}
              </span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default PodcastGrid;
