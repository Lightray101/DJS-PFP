import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useAudioPlayer } from "./contexts/AudioPlayerContext";
import { FavouriteButton } from "./components/FavouriteButton";
import ProgressIndicator from "./components/ProgressIndicator";

/**
 * Maps genre IDs to their titles.
 */
const GENRE_MAP = {
  1: "Personal Growth",
  2: "Investigative Journalism",
  3: "History",
  4: "Comedy",
  5: "Entertainment",
  6: "Business",
  7: "Fiction",
  8: "News",
  9: "Kids and Family",
};

/**
 * Formats a date string into a human-readable format (e.g., "2 days ago").
 * @param {string} dateString - The ISO date string.
 * @returns {string} The formatted, human-readable date.
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

/**
 * Show detail page component.
 * Fetches and displays details for a single show.
 * @returns {JSX.Element}
 */
function ShowDetailPage() {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSeason, setSelectedSeason] = useState(0);
  const location = useLocation();
  const backUrl = location.search ? `/${location.search}` : "/";
  const { playAudio, currentEpisode, playing } = useAudioPlayer();

  useEffect(() => {
    fetch(`https://podcast-api.netlify.app/id/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Show not found");
        return res.json();
      })
      .then((data) => {
        setShow(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading show details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!show) return <div>Show not found.</div>;

  // Helper to shorten episode descriptions
  function shorten(text, max = 120) {
    if (!text) return "";
    return text.length > max ? text.slice(0, max) + "..." : text;
  }

  // Handle playing an episode
  const handlePlayEpisode = (episode, episodeIndex) => {
    const episodeId = `${show.id}-s${selectedSeason}-e${episodeIndex}`;
    const seasonTitle =
      show.seasons[selectedSeason]?.title || `Season ${selectedSeason + 1}`;

    // Use placeholder audio URL for demonstration
    const audioSrc =
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

    playAudio(audioSrc, {
      title: episode.title,
      episodeId: episodeId,
      showId: show.id,
      showTitle: show.title,
      season: seasonTitle,
    });
  };

  // Check if an episode is currently playing
  const isEpisodePlaying = (episodeIndex) => {
    const episodeId = `${show.id}-s${selectedSeason}-e${episodeIndex}`;
    return currentEpisode?.episodeId === episodeId && playing;
  };

  return (
    <div>
      <div style={{ margin: "24px 0 16px 0" }}>
        <Link to={backUrl} style={{ textDecoration: "none" }}>
          <button
            style={{
              background: "linear-gradient(90deg, #232323 60%, #444 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 26px",
              fontSize: 18,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
              marginBottom: 8,
              fontWeight: 600,
              letterSpacing: 0.5,
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#333")}
            onMouseOut={(e) =>
              (e.currentTarget.style.background =
                "linear-gradient(90deg, #232323 60%, #444 100%)")
            }
          >
            ← Back to Homepage
          </button>
        </Link>
      </div>
      <h1>{show.title}</h1>
      <div
        className="show-flex-row"
        style={{
          display: "flex",
          gap: "2rem",
          alignItems: "flex-start",
          margin: "2rem 0",
        }}
      >
        <img
          src={show.image}
          alt={show.title}
          style={{ width: "300px", borderRadius: "8px", flexShrink: 0 }}
        />
        <div className="show-details">
          <p>{show.description}</p>
          <div>
            {show.genres &&
              show.genres.map((id) => (
                <span
                  key={id}
                  style={{
                    display: "inline-block",
                    background: "#eee",
                    borderRadius: "4px",
                    padding: "0.2rem 0.6rem",
                    marginRight: "0.5rem",
                    fontSize: "0.9rem",
                  }}
                >
                  {GENRE_MAP[id] || "Unknown"}
                </span>
              ))}
          </div>
          <p>
            <strong>Last updated:</strong> {formatDate(show.updated)}
          </p>
        </div>
      </div>

      {/* Season Navigation */}
      <div style={{ marginTop: "2rem" }}>
        <h2>Seasons</h2>
        {show.seasons && show.seasons.length > 0 ? (
          <div style={{ marginBottom: 24 }}>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(Number(e.target.value))}
              style={{
                fontSize: 18,
                padding: "8px 16px",
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            >
              {show.seasons.map((season, idx) => (
                <option key={`${season.id}-${idx}`} value={idx}>
                  {season.title} ({season.episodes.length} episodes)
                </option>
              ))}
            </select>
            <ul style={{ listStyle: "none", padding: 0, marginTop: 24 }}>
              {show.seasons[selectedSeason].episodes.map((ep, idx) => {
                const episodeId = `${show.id}-s${selectedSeason}-e${idx}`;
                const seasonTitle =
                  show.seasons[selectedSeason]?.title ||
                  `Season ${selectedSeason + 1}`;
                const isPlaying = isEpisodePlaying(idx);

                return (
                  <li
                    key={ep.id}
                    style={{
                      marginBottom: "1.5rem",
                      borderBottom: "1px solid #eee",
                      paddingBottom: "1.5rem",
                      background: isPlaying ? "#f8f9fa" : "transparent",
                      borderRadius: "8px",
                      padding: isPlaying ? "16px" : "0 0 1.5rem 0",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "flex-start",
                      }}
                    >
                      <img
                        src={show.image}
                        alt={ep.title}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            marginBottom: "8px",
                          }}
                        >
                          <strong
                            style={{ fontSize: "16px", lineHeight: "1.4" }}
                          >
                            Episode {idx + 1}: {ep.title}
                          </strong>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              flexShrink: 0,
                              marginLeft: "16px",
                            }}
                          >
                            <FavouriteButton
                              episodeId={episodeId}
                              showId={show.id}
                              showTitle={show.title}
                              season={seasonTitle}
                              style={{ fontSize: 20 }}
                            />
                            <button
                              onClick={() => handlePlayEpisode(ep, idx)}
                              style={{
                                background: isPlaying ? "#dc3545" : "#007bff",
                                color: "#fff",
                                border: "none",
                                borderRadius: "50%",
                                width: "40px",
                                height: "40px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "14px",
                                transition: "all 0.2s ease",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.transform = "scale(1.05)";
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                              }}
                              aria-label={
                                isPlaying ? "Stop episode" : "Play episode"
                              }
                              title={
                                isPlaying ? "Stop episode" : "Play episode"
                              }
                            >
                              {isPlaying ? "⏹️" : "▶️"}
                            </button>
                          </div>
                        </div>

                        <p
                          style={{
                            margin: "0 0 12px 0",
                            color: "#666",
                            lineHeight: "1.5",
                          }}
                        >
                          {shorten(ep.description)}
                        </p>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <ProgressIndicator
                            episodeId={episodeId}
                            size="medium"
                            showText={true}
                          />
                          {isPlaying && (
                            <span
                              style={{
                                color: "#007bff",
                                fontSize: "12px",
                                fontWeight: "600",
                                background: "#e3f2fd",
                                padding: "4px 8px",
                                borderRadius: "12px",
                              }}
                            >
                              Now Playing
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <p>No season information available.</p>
        )}
      </div>
    </div>
  );
}

export default ShowDetailPage;
