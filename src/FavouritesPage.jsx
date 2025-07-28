import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFavourites } from "./hooks/useFavourites";
import { useTheme } from "./contexts/ThemeContext";
import { useAudioPlayer } from "./contexts/AudioPlayerContext";
import { FavouriteButton } from "./components/FavouriteButton";
import ProgressIndicator from "./components/ProgressIndicator";

function groupByShow(favourites) {
  const grouped = {};
  favourites.forEach((fav) => {
    if (!grouped[fav.showTitle]) grouped[fav.showTitle] = [];
    grouped[fav.showTitle].push(fav);
  });
  return grouped;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const SORTS = [
  { label: "A–Z (Title)", value: "az" },
  { label: "Z–A (Title)", value: "za" },
  { label: "Newest Added", value: "newest" },
  { label: "Oldest Added", value: "oldest" },
];

function sortFavourites(favs, sort) {
  switch (sort) {
    case "az":
      return [...favs].sort((a, b) => a.showTitle.localeCompare(b.showTitle));
    case "za":
      return [...favs].sort((a, b) => b.showTitle.localeCompare(a.showTitle));
    case "newest":
      return [...favs].sort(
        (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
      );
    case "oldest":
      return [...favs].sort(
        (a, b) => new Date(a.dateAdded) - new Date(b.dateAdded)
      );
    default:
      return favs;
  }
}

function FavouritesPage() {
  const { favourites } = useFavourites();
  const [sort, setSort] = useState("newest");
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { playAudio, currentEpisode, playing } = useAudioPlayer();

  const sortedFavs = sortFavourites(favourites, sort);
  const grouped = groupByShow(sortedFavs);

  // Theme-aware colors
  const colors = {
    background: theme === "dark" ? "#181818" : "#fff",
    cardBackground: theme === "dark" ? "#232323" : "#fff",
    border: theme === "dark" ? "#333" : "#e0e0e0",
    text: theme === "dark" ? "#f5f5f5" : "#212529",
    textSecondary: theme === "dark" ? "#adb5bd" : "#6c757d",
    textMuted: theme === "dark" ? "#868e96" : "#868e96",
    emptyBackground: theme === "dark" ? "#2a2a2a" : "#f8f9fa",
    emptyBorder: theme === "dark" ? "#444" : "#dee2e6",
    sortBackground: theme === "dark" ? "#2a2a2a" : "#f8f9fa",
    sortBorder: theme === "dark" ? "#444" : "#e9ecef",
    inputBackground: theme === "dark" ? "#232323" : "#fff",
    inputBorder: theme === "dark" ? "#444" : "#ced4da",
  };

  // Handle playing an episode from favorites
  const handlePlayEpisode = (fav) => {
    // Use placeholder audio URL for demonstration
    const audioSrc =
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

    playAudio(audioSrc, {
      title: fav.episodeTitle || `Episode ${fav.episodeId.split("-e")[1]}`,
      episodeId: fav.episodeId,
      showId: fav.showId,
      showTitle: fav.showTitle,
      season: fav.season,
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "inherit",
        paddingBottom: "100px", // Space for audio player
      }}
    >
      {/* Header Section */}
      <div
        style={{
          background: "inherit",
          borderBottom: `1px solid ${colors.border}`,
          padding: "24px 0",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <button
              onClick={() => navigate("/")}
              style={{
                background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 12px rgba(0, 123, 255, 0.3)",
                transition: "all 0.3s ease",
                textDecoration: "none",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(0, 123, 255, 0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0, 123, 255, 0.3)";
              }}
            >
              <span style={{ fontSize: "18px" }}>←</span>
              Back to Homepage
            </button>

            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "2.5rem",
                  fontWeight: "700",
                  background: "linear-gradient(135deg, #007bff, #6f42c1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ♥ My Favourites
              </h1>
              <p
                style={{
                  margin: "4px 0 0 0",
                  color: colors.textSecondary,
                  fontSize: "16px",
                }}
              >
                {favourites.length} episode{favourites.length !== 1 ? "s" : ""}{" "}
                saved
              </p>
            </div>
          </div>

          {/* Sort Controls */}
          {favourites.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: colors.sortBackground,
                padding: "12px 16px",
                borderRadius: "12px",
                border: `1px solid ${colors.sortBorder}`,
              }}
            >
              <label
                htmlFor="sort-favs"
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: colors.text,
                }}
              >
                Sort by:
              </label>
              <select
                id="sort-favs"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: `1px solid ${colors.inputBorder}`,
                  background: colors.inputBackground,
                  color: colors.text,
                  fontSize: "14px",
                  cursor: "pointer",
                  minWidth: "140px",
                }}
              >
                {SORTS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {favourites.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              background: colors.emptyBackground,
              borderRadius: "16px",
              border: `2px dashed ${colors.emptyBorder}`,
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "24px" }}>♡</div>
            <h2
              style={{
                fontSize: "1.5rem",
                color: colors.textSecondary,
                marginBottom: "12px",
              }}
            >
              No favourites yet
            </h2>
            <p
              style={{
                color: colors.textMuted,
                fontSize: "16px",
                marginBottom: "32px",
              }}
            >
              Start exploring podcasts and click the heart icon to save your
              favorite episodes!
            </p>
            <button
              onClick={() => navigate("/")}
              style={{
                background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                padding: "14px 28px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(40, 167, 69, 0.3)",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(40, 167, 69, 0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(40, 167, 69, 0.3)";
              }}
            >
              Discover Podcasts
            </button>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "32px" }}
          >
            {Object.entries(grouped).map(([showTitle, favs]) => (
              <div
                key={showTitle}
                style={{
                  background: colors.cardBackground,
                  borderRadius: "16px",
                  padding: "24px",
                  boxShadow:
                    theme === "dark"
                      ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                      : "0 4px 12px rgba(0, 0, 0, 0.1)",
                  border: `1px solid ${colors.border}`,
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "20px",
                    paddingBottom: "16px",
                    borderBottom: `2px solid ${
                      theme === "dark" ? "#333" : "#f8f9fa"
                    }`,
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "1.5rem",
                      fontWeight: "700",
                      color: colors.text,
                      flex: 1,
                    }}
                  >
                    {showTitle}
                  </h2>
                  <span
                    style={{
                      background: "linear-gradient(135deg, #007bff, #6f42c1)",
                      color: "#fff",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {favs.length} episode{favs.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: "16px",
                  }}
                >
                  {favs.map((fav) => {
                    const isPlaying =
                      currentEpisode?.episodeId === fav.episodeId && playing;

                    return (
                      <div
                        key={fav.episodeId}
                        style={{
                          background: isPlaying
                            ? theme === "dark"
                              ? "#2a2a2a"
                              : "#f8f9fa"
                            : theme === "dark"
                            ? "#1e1e1e"
                            : "#fff",
                          borderRadius: "12px",
                          padding: "20px",
                          border: `1px solid ${
                            isPlaying
                              ? theme === "dark"
                                ? "#444"
                                : "#007bff"
                              : colors.border
                          }`,
                          transition: "all 0.3s ease",
                          boxShadow: isPlaying
                            ? "0 4px 12px rgba(0, 123, 255, 0.15)"
                            : "0 2px 8px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "16px",
                          }}
                        >
                          {/* Episode thumbnail placeholder */}
                          <div
                            style={{
                              width: "80px",
                              height: "80px",
                              background:
                                "linear-gradient(135deg, #007bff, #6f42c1)",
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontSize: "24px",
                              flexShrink: 0,
                            }}
                          >
                            🎧
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "space-between",
                                marginBottom: "12px",
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <h4
                                  style={{
                                    margin: "0 0 8px 0",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: colors.text,
                                    lineHeight: "1.4",
                                  }}
                                >
                                  {fav.episodeTitle ||
                                    `Episode ${fav.episodeId.split("-e")[1]}`}
                                </h4>
                                {fav.season && (
                                  <div
                                    style={{
                                      fontSize: "14px",
                                      color: colors.textSecondary,
                                      marginBottom: "8px",
                                    }}
                                  >
                                    <strong>Season:</strong> {fav.season}
                                  </div>
                                )}
                                {fav.description && (
                                  <p
                                    style={{
                                      margin: "0 0 12px 0",
                                      fontSize: "14px",
                                      color: colors.textSecondary,
                                      lineHeight: "1.5",
                                    }}
                                  >
                                    {fav.description.length > 120
                                      ? fav.description.slice(0, 120) + "..."
                                      : fav.description}
                                  </p>
                                )}
                              </div>

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
                                  episodeId={fav.episodeId}
                                  showId={fav.showId}
                                  showTitle={fav.showTitle}
                                  season={fav.season}
                                  style={{ fontSize: 20 }}
                                />
                                <button
                                  onClick={() => handlePlayEpisode(fav)}
                                  style={{
                                    background: isPlaying
                                      ? "#dc3545"
                                      : "#007bff",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "50%",
                                    width: "44px",
                                    height: "44px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "16px",
                                    transition: "all 0.2s ease",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                  }}
                                  onMouseOver={(e) => {
                                    e.currentTarget.style.transform =
                                      "scale(1.05)";
                                    e.currentTarget.style.boxShadow =
                                      "0 4px 12px rgba(0,0,0,0.25)";
                                  }}
                                  onMouseOut={(e) => {
                                    e.currentTarget.style.transform =
                                      "scale(1)";
                                    e.currentTarget.style.boxShadow =
                                      "0 2px 8px rgba(0,0,0,0.15)";
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

                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "16px",
                              }}
                            >
                              <ProgressIndicator
                                episodeId={fav.episodeId}
                                size="small"
                                showText={true}
                              />
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "12px",
                                }}
                              >
                                {isPlaying && (
                                  <span
                                    style={{
                                      color: "#007bff",
                                      fontSize: "12px",
                                      fontWeight: "600",
                                      background:
                                        theme === "dark"
                                          ? "rgba(0, 123, 255, 0.2)"
                                          : "#e3f2fd",
                                      padding: "4px 8px",
                                      borderRadius: "12px",
                                    }}
                                  >
                                    Now Playing
                                  </span>
                                )}
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: colors.textMuted,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                  }}
                                >
                                  <span>📅</span>
                                  Added {formatDate(fav.dateAdded)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavouritesPage;
