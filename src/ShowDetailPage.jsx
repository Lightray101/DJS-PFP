import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner.jsx";

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

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ShowDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSeasonIdx, setSelectedSeasonIdx] = useState(0);

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

  // Defensive fallback for show
  if (loading) return <LoadingSpinner loadingText="Loading show details..." />;
  if (error) return <div>Error: {error}</div>;
  if (!show) return <div>Show not found.</div>;

  // Defensive fallback for seasons and genres
  const seasons = Array.isArray(show.seasons) ? show.seasons : [];
  const selectedSeason = seasons[selectedSeasonIdx] || {};
  const genres = Array.isArray(show.genres) ? show.genres : [];

  const backUrl = location.search ? `/${location.search}` : "/";

  return (
    <div className="show-detail-container">
      <Link to={backUrl} className="back-link">
        <button className="back-button">← Back to Homepage</button>
      </Link>
      <div className="show-header-row">
        <img src={show.image} alt={show.title} className="show-cover" />
        <div className="show-info">
          <h1>{show.title}</h1>
          <p>{show.description}</p>
          <div className="show-meta">
            <div>
              <strong>Genres:</strong>{" "}
              {genres.length > 0 ? (
                genres.map((id) => (
                  <span className="genre-tag" key={id}>
                    {GENRE_MAP[id] || "Unknown"}
                  </span>
                ))
              ) : (
                <span>No genres listed</span>
              )}
            </div>
            <div>
              <strong>Last Updated:</strong> {formatDate(show.updated)}
            </div>
            <div>
              <strong>Total Seasons:</strong> {seasons.length}
            </div>
            <div>
              <strong>Total Episodes:</strong>{" "}
              {seasons.reduce((sum, s) => sum + (s.episodes?.length || 0), 0)}
            </div>
          </div>
        </div>
      </div>

      <div className="season-selector-row">
        <h2>Current Season</h2>
        <select
          className="season-dropdown"
          value={selectedSeasonIdx}
          onChange={(e) => setSelectedSeasonIdx(Number(e.target.value))}
        >
          {seasons.length > 0 ? (
            seasons.map((season, idx) => (
              <option key={season.id || idx} value={idx}>
                {season.title || `Season ${idx + 1}`}
              </option>
            ))
          ) : (
            <option>No seasons available</option>
          )}
        </select>
      </div>

      <div className="episode-list">
        {selectedSeason.episodes && selectedSeason.episodes.length > 0 ? (
          selectedSeason.episodes.map((ep, idx) => (
            <div className="episode-card" key={ep.id || idx}>
              <div className="episode-thumb">
                <img src={ep.image ? ep.image : show.image} alt={ep.title} />
              </div>
              <div className="episode-info">
                <strong>
                  Episode {idx + 1}: {ep.title}
                </strong>
                <div className="episode-meta">
                  <span>{ep.duration || ""}</span>
                  <span>
                    {ep.releaseDate ? formatDate(ep.releaseDate) : ""}
                  </span>
                </div>
                <p>{ep.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No episodes available for this season.</p>
        )}
      </div>
    </div>
  );
}

export default ShowDetailPage;
