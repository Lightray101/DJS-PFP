import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import ShowDetailPage from "./ShowDetailPage";
import FavouritesPage from "./FavouritesPage";
import { FavouriteButton } from "./components/FavouriteButton";
import Header from "./components/Header";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import {
  AudioPlayerProvider,
  useAudioPlayer,
} from "./contexts/AudioPlayerContext";

// (useFavourites and FavouriteButton moved to their own files)

// Enhanced global audio player component with progress tracking
function AudioPlayer() {
  const {
    audioSrc,
    audioTitle,
    playing,
    setPlaying,
    audioRef,
    currentEpisode,
    saveProgress,
  } = useAudioPlayer();
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  // Confirmation prompt on reload during playback
  React.useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (playing) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
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

  // Save progress every 5 seconds during playback
  React.useEffect(() => {
    let progressInterval;
    if (playing && currentTime > 0 && duration > 0) {
      progressInterval = setInterval(() => {
        saveProgress(currentTime, duration);
      }, 5000);
    }
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      // Save progress when stopping
      if (currentTime > 0 && duration > 0) {
        saveProgress(currentTime, duration);
      }
    };
  }, [playing, currentTime, duration, saveProgress]);

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
    const newTime = audioRef.current.currentTime;
    setCurrentTime(newTime);
  };

  const handleLoadedMetadata = () => {
    const newDuration = audioRef.current.duration;
    setDuration(newDuration);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
    // Save progress immediately when seeking
    if (duration > 0) {
      saveProgress(time, duration);
    }
  };

  const handleEnded = () => {
    setPlaying(false);
    // Mark as completed when audio ends
    if (duration > 0) {
      saveProgress(duration, duration);
    }
  };

  // Format time in mm:ss
  const formatTime = (t) => {
    if (!t || isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!audioSrc) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        background: "#222",
        color: "#fff",
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        zIndex: 1000,
        boxShadow: "0 -2px 10px rgba(0,0,0,0.3)",
      }}
    >
      <button
        onClick={togglePlay}
        style={{
          marginRight: 16,
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 40,
          height: 40,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? "⏸️" : "▶️"}
      </button>

      <audio
        ref={audioRef}
        src={audioSrc}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        style={{ display: "none" }}
      />

      <div style={{ flex: 1, marginRight: 16 }}>
        <div style={{ fontSize: "14px", marginBottom: "4px" }}>
          {audioTitle || "No audio selected"}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", minWidth: "40px" }}>
            {formatTime(currentTime)}
          </span>
          <div style={{ flex: 1, position: "relative" }}>
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              step="0.1"
              style={{
                width: "100%",
                height: "4px",
                background: "#444",
                outline: "none",
                borderRadius: "2px",
              }}
              aria-label="Seek"
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "4px",
                background: "#007bff",
                borderRadius: "2px",
                width: `${progressPercentage}%`,
                pointerEvents: "none",
              }}
            />
          </div>
          <span
            style={{ fontSize: "12px", minWidth: "40px", textAlign: "right" }}
          >
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {currentEpisode && (
        <div style={{ fontSize: "12px", color: "#ccc", marginLeft: "16px" }}>
          {Math.round(progressPercentage)}% complete
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AudioPlayerProvider>
        <ThemeProvider>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/show/:id" element={<ShowDetailPage />} />
              <Route path="/favourites" element={<FavouritesPage />} />
            </Routes>
          </ErrorBoundary>
          <AudioPlayer />
        </ThemeProvider>
      </AudioPlayerProvider>
    </ErrorBoundary>
  );
}

export default App;
