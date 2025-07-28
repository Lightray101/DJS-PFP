import React from "react";
import { useListeningProgress } from "../hooks/useListeningProgress";

/**
 * Progress indicator component for episodes
 * Shows listening progress, completion status, and visual indicators
 */
function ProgressIndicator({ episodeId, size = "small", showText = false }) {
  const { getProgress, isCompleted, hasProgress } = useListeningProgress();

  const progress = getProgress(episodeId);
  const completed = isCompleted(episodeId);
  const inProgress = hasProgress(episodeId);

  if (!progress && !completed && !inProgress) {
    return null;
  }

  const progressPercentage = progress?.completionPercentage || 0;

  const sizeStyles = {
    small: { width: 60, height: 4, fontSize: 10 },
    medium: { width: 100, height: 6, fontSize: 12 },
    large: { width: 150, height: 8, fontSize: 14 },
  };

  const style = sizeStyles[size] || sizeStyles.small;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {/* Progress bar */}
      <div
        style={{
          width: style.width,
          height: style.height,
          background: "#e0e0e0",
          borderRadius: style.height / 2,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            width: `${progressPercentage}%`,
            height: "100%",
            background: completed ? "#28a745" : "#007bff",
            borderRadius: style.height / 2,
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {/* Status indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {completed && (
          <span
            style={{
              color: "#28a745",
              fontSize: style.fontSize + 2,
              fontWeight: "bold",
            }}
            title="Completed"
          >
            ✓
          </span>
        )}

        {inProgress && !completed && (
          <span
            style={{
              color: "#007bff",
              fontSize: style.fontSize,
              fontWeight: "bold",
            }}
            title="In Progress"
          >
            ▶
          </span>
        )}

        {showText && (
          <span style={{ fontSize: style.fontSize, color: "#666" }}>
            {completed ? "Complete" : `${Math.round(progressPercentage)}%`}
          </span>
        )}
      </div>
    </div>
  );
}

export default ProgressIndicator;
