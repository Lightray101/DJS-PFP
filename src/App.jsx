import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import ShowDetailPage from "./ShowDetailPage";
import FavouritesPage from "./FavouritesPage";
import { FavouriteButton } from "./components/FavouriteButton";

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

// (useFavourites and FavouriteButton moved to their own files)

// Simple global audio player component
function AudioPlayer() {
  const [playing, setPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const audioRef = React.useRef(null);

  // Confirmation prompt on reload during playback
  React.useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (playing) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [playing]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };
  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };
  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // Example placeholder audio and episode ID
  const audioSrc = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
  const episodeId = "example-episode-1";

  // Format time in mm:ss
  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

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
      <audio
        ref={audioRef}
        src={audioSrc}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        style={{display: 'none'}}
      />
      <span style={{marginRight: 16}}>Now Playing: Example Audio</span>
      <span style={{marginRight: 8}}>{formatTime(currentTime)}</span>
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={currentTime}
        onChange={handleSeek}
        step="0.1"
        style={{ flex: 1, marginRight: 8 }}
        aria-label="Seek"
      />
      <span style={{width: 48, textAlign: 'right'}}>{formatTime(duration)}</span>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ThemeToggle />
      <nav style={{ position: 'fixed', top: 16, left: 16, zIndex: 2000 }}>
        <a href="/" style={{ marginRight: 16, color: '#222', textDecoration: 'none', fontWeight: 600 }}>Home</a>
        <a href="/favourites" style={{ color: '#222', textDecoration: 'none', fontWeight: 600 }}>Favourites</a>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/show/:id" element={<ShowDetailPage />} />
        <Route path="/favourites" element={<FavouritesPage />} />
      </Routes>
      <AudioPlayer />
    </ThemeProvider>
  );
}

export default App;
