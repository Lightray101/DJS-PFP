import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import ShowDetailPage from "./ShowDetailPage";
import FavouritesPage from "./FavouritesPage";
import { FavouriteButton } from "./components/FavouriteButton";
import Header from "./components/Header";
import { AudioPlayerProvider, useAudioPlayer } from "./contexts/AudioPlayerContext";

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
        background: 'none',
        border: 'none',
        fontSize: 28,
        cursor: 'pointer',
        color: theme === 'dark' ? '#ffd700' : '#222',
        transition: 'color 0.2s',
        marginRight: 8
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
  const { audioSrc, audioTitle, playing, setPlaying, audioRef } = useAudioPlayer();
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

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

  React.useEffect(() => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [playing, audioRef, audioSrc]);

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
      <audio
        ref={audioRef}
        src={audioSrc || undefined}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        style={{display: 'none'}}
      />
      <span style={{marginRight: 16}}>Now Playing: {audioTitle || 'No audio selected'}</span>
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
    <AudioPlayerProvider>
      <ThemeProvider>
        <Header onSearchClick={() => {}} ThemeToggle={ThemeToggle} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/show/:id" element={<ShowDetailPage />} />
          <Route path="/favourites" element={<FavouritesPage />} />
        </Routes>
        <AudioPlayer />
      </ThemeProvider>
    </AudioPlayerProvider>
  );
}

export default App;
