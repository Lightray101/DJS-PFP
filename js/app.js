import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import ShowDetailPage from "./ShowDetailPage";
import FavouritesPage from "./FavouritesPage";

/**
 * Main class to manage the Podcast Application using Web Components
 */
class PodcastApp {
  /**
   * @param {Array} podcasts - Array of podcast data.
   * @param {Array} genres - Array of genre data.
   * @param {Array} seasons - Array of season data for each podcast.
   */
  constructor(podcasts, genres, seasons) {
    this.podcasts = podcasts;
    this.genres = this.createGenreMap(genres);
    this.seasons = this.createSeasonMap(seasons);

    this.gridEl = document.getElementById("podcast-grid");
    this.modalEl = document.getElementById("modal");
    this.modalContentEl = document.getElementById("modal-content");
    this.genreFilterEl = document.getElementById("genre-filter");
    this.sortFilterEl = document.getElementById("sort-filter");

    this.addEventListeners();
  }

  /**
   * Initializes the application, populates filters and renders podcasts.
   */
  init() {
    this.handleFilterAndSort();
  }

  /**
   * Creates a map of genre IDs to genre titles for quick lookup.
   * @param {Array} genres - The array of genre objects.
   * @returns {Map<number, string>} A map of genre IDs to titles.
   */
  createGenreMap(genres) {
    return new Map(genres.map((genre) => [genre.id, genre.title]));
  }

  /**
   * Creates a map of podcast IDs to their season details.
   * @param {Array} seasonsData - The array of season objects.
   * @returns {Map<string, Array>} A map of podcast IDs to season details.
   */
  createSeasonMap(seasonsData) {
    return new Map(
      seasonsData.map((season) => [season.id, season.seasonDetails])
    );
  }

  /**
   * Adds all necessary event listeners for the application.
   */
  addEventListeners() {
    this.sortFilterEl.addEventListener(
      "change",
      this.handleFilterAndSort.bind(this)
    );

    this.modalEl.addEventListener("click", (event) => {
      if (
        event.target.classList.contains("modal__overlay") ||
        event.target.closest(".modal__close")
      ) {
        this.closeModal();
      }
    });

    // Listen for podcast-click events from the Web Components
    this.gridEl.addEventListener("podcast-click", (event) => {
      this.openModal(event.detail.podcastId);
    });
  }

  /**
   * Handles the filtering and sorting of podcasts and re-renders the grid.
   */
  handleFilterAndSort() {
    const sortBy = this.sortFilterEl.value;
    if (sortBy === "popular-desc" || sortBy === "newest-desc") {
      return; // Do nothing if a placeholder is selected
    }

    let filteredPodcasts = [...this.podcasts];

    // Sort
    switch (sortBy) {
      case "updated-desc":
        filteredPodcasts.sort(
          (a, b) => new Date(b.updated) - new Date(a.updated)
        );
        break;
    }

    this.renderPodcasts(filteredPodcasts);
  }

  /**
   * Renders the podcast previews using Web Components.
   * @param {Array} podcastsToRender - The array of podcasts to display.
   */
  renderPodcasts(podcastsToRender) {
    this.gridEl.innerHTML = "";

    if (podcastsToRender.length === 0) {
      this.gridEl.innerHTML = `<p>No podcasts found.</p>`;
      return;
    }

    podcastsToRender.forEach((podcast) => {
      // Create the podcast-preview Web Component
      const podcastPreview = document.createElement("podcast-preview");

      // Set attributes for the Web Component
      podcastPreview.setAttribute("id", podcast.id);
      podcastPreview.setAttribute("title", podcast.title);
      podcastPreview.setAttribute("image", podcast.image);
      podcastPreview.setAttribute("seasons", podcast.seasons.toString());
      podcastPreview.setAttribute(
        "genres",
        podcast.genres.map((id) => this.genres.get(id)).join(", ")
      );
      podcastPreview.setAttribute("updated", podcast.updated);

      // Append the component to the grid
      this.gridEl.appendChild(podcastPreview);
    });
  }

  /**
   * Opens and populates the modal with details of a selected podcast.
   * @param {string} podcastId - The ID of the podcast to display.
   */
  openModal(podcastId) {
    const podcast = this.podcasts.find((p) => p.id === podcastId);
    if (!podcast) return;

    const seasonDetails = this.seasons.get(podcastId) || [];

    this.modalContentEl.innerHTML = `
        <div class="modal-show">
            <img src="${podcast.image}" alt="${
      podcast.title
    }" class="modal-show__image">
            <div class="modal-show__details">
                <h2 id="modal-title" class="modal-show__title">${
                  podcast.title
                }</h2>
                <p class="modal-show__description">${podcast.description}</p>
                <div class="modal-show__genres">
                    ${podcast.genres
                      .map(
                        (id) =>
                          `<span class="modal-show__genre-tag">${this.genres.get(
                            id
                          )}</span>`
                      )
                      .join("")}
                </div>
                <p class="modal-show__updated">Last updated: ${this.formatDate(
                  podcast.updated
                )}</p>
            </div>
        </div>
        <div class="modal-seasons">
            <h3 class="modal-seasons__title">Seasons</h3>
            <ul class="modal-seasons__list">
                ${
                  seasonDetails
                    .map(
                      (season) => `
                    <li class="modal-seasons__item">
                        <span>${season.title}</span>
                        <span>${season.episodes} episodes</span>
                    </li>
                `
                    )
                    .join("") || "<li>No season information available.</li>"
                }
            </ul>
        </div>
      `;

    this.modalEl.classList.add("is-open");
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  }

  /**
   * Closes the modal.
   */
  closeModal() {
    this.modalEl.classList.remove("is-open");
    this.modalContentEl.innerHTML = "";
    document.body.style.overflow = "";
  }

  /**
   * Formats a date string into a human-readable format (e.g., "2 days ago").
   * @param {string} dateString - The ISO date string.
   * @returns {string} The formatted, human-readable date.
   */
  formatDate(dateString) {
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
}

/**
 * Main App component with routing
 */
// Custom hook for managing favourites in localStorage
function useFavourites() {
  const [favourites, setFavourites] = React.useState(() => {
    const favs = localStorage.getItem('favouriteEpisodes');
    return favs ? JSON.parse(favs) : [];
  });

  React.useEffect(() => {
    localStorage.setItem('favouriteEpisodes', JSON.stringify(favourites));
  }, [favourites]);

  const addFavourite = (episodeId) => {
    if (!favourites.includes(episodeId)) {
      setFavourites([...favourites, episodeId]);
    }
  };
  const removeFavourite = (episodeId) => {
    setFavourites(favourites.filter(id => id !== episodeId));
  };
  const isFavourite = (episodeId) => favourites.includes(episodeId);

  return { favourites, addFavourite, removeFavourite, isFavourite };
}

// Favourite button component
function FavouriteButton({ episodeId }) {
  const { isFavourite, addFavourite, removeFavourite } = useFavourites();
  const fav = isFavourite(episodeId);
  return (
    <button
      onClick={() => fav ? removeFavourite(episodeId) : addFavourite(episodeId)}
      style={{
        background: 'none',
        border: 'none',
        color: fav ? 'red' : '#fff',
        fontSize: 24,
        cursor: 'pointer',
        marginRight: 16
      }}
      aria-label={fav ? 'Unfavourite' : 'Favourite'}
      title={fav ? 'Unfavourite' : 'Favourite'}
    >
      {fav ? '♥' : '♡'}
    </button>
  );
}

// Simple global audio player component
function AudioPlayer() {
  const [playing, setPlaying] = React.useState(false);
  const audioRef = React.useRef(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  // Example placeholder audio and episode ID
  const audioSrc = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
  const episodeId = "example-episode-1";

  return (
    <div style={{
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0,
      background: '#222',
      color: '#fff',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <button onClick={togglePlay} style={{marginRight: 16}}>
        {playing ? 'Pause' : 'Play'}
      </button>
      <FavouriteButton episodeId={episodeId} />
      <audio ref={audioRef} src={audioSrc} onEnded={() => setPlaying(false)} style={{display: 'none'}} />
      <span>Now Playing: Example Audio</span>
    </div>
  );
}

// Theme context and provider
const ThemeContext = React.createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = React.useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  React.useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = React.useContext(ThemeContext);
  return (
    <button
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 2000,
        background: 'none',
        border: 'none',
        fontSize: 28,
        cursor: 'pointer',
        color: theme === 'dark' ? '#ffd700' : '#222',
        transition: 'color 0.2s'
      }}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ThemeToggle />
      <Router>
        <nav style={{ position: 'fixed', top: 16, left: 16, zIndex: 2000 }}>
          <a href="/" style={{ marginRight: 16, color: '#222', textDecoration: 'none', fontWeight: 600 }}>Home</a>
          <a href="/favourites" style={{ color: '#222', textDecoration: 'none', fontWeight: 600 }}>Favourites</a>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/show/:id" element={<ShowDetailPage />} />
          <Route path="/favourites" element={<FavouritesPage />} />
        </Routes>
      </Router>
      <AudioPlayer />
    </ThemeProvider>
  );
}

export default App;
