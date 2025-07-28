import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

/**
 * Homepage component for podcast listing.
 * Fetches and displays podcast previews.
 * @returns {JSX.Element}
 */
function HomePage() {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://podcast-api.netlify.app/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch podcasts");
        return res.json();
      })
      .then((data) => {
        setPodcasts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filter podcasts by search term
  const filteredPodcasts = podcasts.filter((podcast) =>
    podcast.title.toLowerCase().includes(search.toLowerCase())
  );

  function handleSearchChange(e) {
    setSearch(e.target.value);
    setSearchParams({ search: e.target.value });
  }

  if (loading) return <div>Loading podcasts...</div>;
  if (error) return <div>Error: {error}</div>;
  if (filteredPodcasts.length === 0) return <div>No podcasts found.</div>;

  return (
    <div>
      <h1>Podcast Shows</h1>
      <input
        type="text"
        placeholder="Search podcasts..."
        value={search}
        onChange={handleSearchChange}
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "300px" }}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {filteredPodcasts.map((podcast) => (
          <Link
            key={podcast.id}
            to={`/show/${podcast.id}${
              search ? `?search=${encodeURIComponent(search)}` : ""
            }`}
            style={{
              textDecoration: "none",
              color: "inherit",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              width: "200px",
              display: "block",
            }}
          >
            <img
              src={podcast.image}
              alt={podcast.title}
              style={{ width: "100%", borderRadius: "4px" }}
            />
            <h2 style={{ fontSize: "1.1rem", margin: "0.5rem 0" }}>
              {podcast.title}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
