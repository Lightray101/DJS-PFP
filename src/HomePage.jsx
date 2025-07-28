import React, { useState, useEffect } from "react";
import Header from "./components/Header.jsx";
import Search from "./components/Search.jsx";
import Filters from "./components/Filters.jsx";
import PodcastGrid from "./components/PodcastGrid.jsx";
import Pagination from "./components/Pagination.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import ErrorMessage from "./components/ErrorMessage.jsx";
import RecommendedCarousel from "./components/RecommendedCarousel.jsx";
import { genres } from "./data/genres.js";
const API_URL = "https://podcast-api.netlify.app/";
import "./App.css";

// HomePage is the main component for displaying and managing the podcast list UI
function HomePage() {
  // State variables for podcasts, UI, and filters
  const [podcasts, setPodcasts] = useState([]); // All podcasts fetched from API
  const [seasons, setSeasons] = useState([]); // Season info for each podcast
  const [loading, setLoading] = useState(true); // Loading state for API fetch
  const [error, setError] = useState(null); // Error state for API fetch
  const [searchTerm, setSearchTerm] = useState(""); // Search input value
  const [selectedGenre, setSelectedGenre] = useState("all"); // Selected genre filter
  const [sortBy, setSortBy] = useState("updated-desc"); // Sorting option
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [showSearch, setShowSearch] = useState(false); // Show/hide search overlay
  const ITEMS_PER_PAGE = 12; // Number of podcasts per page

  // Fetch podcasts from the API when the component mounts
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setPodcasts(data || []);

        // Prepare season data for each podcast (for demonstration)
        const seasonsData = data.map((podcast) => ({
          id: podcast.id,
          seasonDetails: podcast.seasons
            ? Array.from({ length: podcast.seasons }, (_, i) => ({
                title: `Season ${i + 1}`,
                episodes: Math.floor(Math.random() * 10) + 5,
              }))
            : [],
        }));

        setSeasons(seasonsData);
      } catch (err) {
        setError(
          "Failed to fetch podcasts from the API. Please check your internet connection and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  // Returns podcasts filtered by search and genre, and sorted by the selected option
  const getFilteredAndSortedPodcasts = () => {
    let filteredPodcasts = [...podcasts];

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filteredPodcasts = filteredPodcasts.filter((podcast) =>
        podcast.title.toLowerCase().includes(searchLower)
      );
    }

    // Filter by selected genre
    if (selectedGenre !== "all") {
      const genreId = parseInt(selectedGenre.replace("genre-", ""));
      filteredPodcasts = filteredPodcasts.filter((podcast) =>
        podcast.genres.includes(genreId)
      );
    }

    // Sort podcasts by the selected sort option
    filteredPodcasts.sort((a, b) => {
      switch (sortBy) {
        case "updated-desc":
          return new Date(b.updated) - new Date(a.updated);
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "popular-desc":
          return b.seasons - a.seasons;
        default:
          return 0;
      }
    });

    return filteredPodcasts;
  };

  // Get the filtered and sorted podcasts for display
  const filteredPodcasts = getFilteredAndSortedPodcasts();

  // Returns only the podcasts for the current page (pagination)
  const getPaginatedPodcasts = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredPodcasts.slice(startIndex, endIndex);
  };

  // Podcasts to display on the current page
  const paginatedPodcasts = getPaginatedPodcasts();
  // Total number of pages for pagination
  const totalPages = Math.ceil(filteredPodcasts.length / ITEMS_PER_PAGE);

  // Handles changing the current page and scrolls to top
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset to page 1 when filters or sort options change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedGenre, sortBy]);

  // Show loading spinner while fetching podcasts
  if (loading) {
    return (
      <div className="app">
        <Header />
        <LoadingSpinner />
      </div>
    );
  }

  // Show error message if API fetch fails
  if (error) {
    return (
      <div className="app">
        <Header />
        <ErrorMessage message={error} />
      </div>
    );
  }

  // Prepare recommended shows (first 8 podcasts, with genre tags if available)
  const recommended = podcasts.slice(0, 8).map(show => ({
    ...show,
    genres: show.genres
      ? show.genres.map(g => {
          if (typeof g === 'string') return g;
          if (typeof g === 'object' && g.title) return g.title;
          const genreObj = genres.find(gg => gg.id === g);
          return genreObj ? genreObj.title : g;
        })
      : []
  }));

  // Main render: search, filters, podcast grid, and pagination
  return (
    <div className="app">
      <Header onSearchClick={() => setShowSearch(true)} />
      <RecommendedCarousel shows={recommended} />
      {showSearch && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          background: 'rgba(255,255,255,0.98)',
          zIndex: 3000,
          padding: '16px 0 8px 0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            minWidth: 0,
          }}>
            <input
              type="text"
              autoFocus
              placeholder="Search podcasts..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ fontSize: 18, padding: '8px 16px', borderRadius: 8, border: '1px solid #ccc', width: 260, maxWidth: '70vw' }}
            />
            <button onClick={() => setShowSearch(false)} style={{ marginLeft: 10, fontSize: 24, background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Close search">✕</button>
          </div>
        </div>
      )}
      <main className="main-content" style={{ width: '100%', maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
        {/* Filters and sort in a row at the top */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 32 }}>
          <Filters
            genres={genres}
            selectedGenre={selectedGenre}
            sortBy={sortBy}
            onGenreChange={setSelectedGenre}
            onSortChange={setSortBy}
          />
        </div>
        {filteredPodcasts.length === 0 ? (
          <ErrorMessage message="No podcasts found with the selected filters." />
        ) : (
          <>
            <PodcastGrid podcasts={paginatedPodcasts} genres={genres} />
            <div style={{ marginBottom: 40 }}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default HomePage;
