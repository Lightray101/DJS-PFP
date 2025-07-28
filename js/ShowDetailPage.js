import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";

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
  const [expandedSeason, setExpandedSeason] = useState(null);
  const location = useLocation();
  const backUrl = location.search ? `/${location.search}` : "/";

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

  return (
    <div>
      <Link to={backUrl}>← Back to Homepage</Link>
      <h1>{show.title}</h1>
      <div className="show-flex-row">
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
          <ul style={{ listStyle: "none", padding: 0 }}>
            {show.seasons.map((season) => (
              <li key={season.id} style={{ marginBottom: "1rem" }}>
                <button
                  style={{
                    background: "#f5f5f5",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                  }}
                  onClick={() =>
                    setExpandedSeason(
                      expandedSeason === season.id ? null : season.id
                    )
                  }
                >
                  <strong>{season.title}</strong> &mdash;{" "}
                  {season.episodes.length} episodes
                  <span style={{ float: "right" }}>
                    {expandedSeason === season.id ? "▲" : "▼"}
                  </span>
                </button>
                {expandedSeason === season.id && (
                  <ul style={{ marginTop: "0.5rem", paddingLeft: "1rem" }}>
                    {season.episodes.map((ep, idx) => (
                      <li
                        key={ep.id}
                        style={{
                          marginBottom: "1rem",
                          borderBottom: "1px solid #eee",
                          paddingBottom: "1rem",
                        }}
                      >
                        <div style={{ display: "flex", gap: "1rem" }}>
                          <img
                            src={ep.image}
                            alt={ep.title}
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                          />
                          <div>
                            <strong>
                              Episode {idx + 1}: {ep.title}
                            </strong>
                            <p style={{ margin: "0.5rem 0" }}>
                              {shorten(ep.description)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No season information available.</p>
        )}
      </div>
    </div>
  );
}

export default ShowDetailPage;
