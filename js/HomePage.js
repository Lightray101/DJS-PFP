import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

// RecommendedCarousel component
function RecommendedCarousel({ shows }) {
  const [start, setStart] = React.useState(0);
  const maxVisible = 3; // Number of shows visible at once
  const visibleShows = shows.slice(start, start + maxVisible);

  const canScrollLeft = start > 0;
  const canScrollRight = start + maxVisible < shows.length;

  return (
    <div style={{ margin: '2rem 0', position: 'relative' }}>
      <h2 style={{ marginBottom: 8 }}>Recommended Shows</h2>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          onClick={() => setStart(start - 1)}
          disabled={!canScrollLeft}
          style={{ fontSize: 24, marginRight: 8, opacity: canScrollLeft ? 1 : 0.3 }}
          aria-label="Scroll left"
        >
          ◀
        </button>
        <div style={{ display: 'flex', overflowX: 'auto', gap: 16, minWidth: 0 }}>
          {visibleShows.map((show) => (
            <Link
              key={show.id}
              to={`/show/${show.id}`}
              style={{
                minWidth: 180,
                maxWidth: 180,
                border: '1px solid #ccc',
                borderRadius: 8,
                padding: 8,
                background: '#fafafa',
                textDecoration: 'none',
                color: '#222',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <img src={show.image} alt={show.title} style={{ width: 140, height: 140, objectFit: 'cover', borderRadius: 6 }} />
              <div style={{ fontWeight: 600, margin: '8px 0 4px 0', textAlign: 'center' }}>{show.title}</div>
              {show.genres && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
                  {show.genres.map((genre, idx) => (
                    <span key={idx} style={{ fontSize: 12, background: '#eee', borderRadius: 4, padding: '2px 6px' }}>{genre}</span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
        <button
          onClick={() => setStart(start + 1)}
          disabled={!canScrollRight}
          style={{ fontSize: 24, marginLeft: 8, opacity: canScrollRight ? 1 : 0.3 }}
          aria-label="Scroll right"
        >
          ▶
        </button>
      </div>
    </div>
  );
}

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

  // Prepare recommended shows (first 5 podcasts, with genre tags if available)
  const recommended = podcasts.slice(0, 5).map(show => ({
    ...show,
    genres: show.genres ? show.genres.map(g => typeof g === 'string' ? g : (g.title || g)) : []
  }));

  return (
    <div>
      <RecommendedCarousel shows={recommended} />
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
