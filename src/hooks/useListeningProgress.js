import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for managing listening progress across episodes and sessions
 * Tracks current time, duration, completion status, and last played timestamp
 */
export function useListeningProgress() {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem("listeningProgress");
    return saved ? JSON.parse(saved) : {};
  });

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("listeningProgress", JSON.stringify(progress));
  }, [progress]);

  /**
   * Update progress for a specific episode
   * @param {string} episodeId - Unique episode identifier
   * @param {Object} progressData - Progress data object
   * @param {number} progressData.currentTime - Current playback time in seconds
   * @param {number} progressData.duration - Total episode duration in seconds
   * @param {string} progressData.showId - Show identifier
   * @param {string} progressData.showTitle - Show title
   * @param {string} progressData.episodeTitle - Episode title
   * @param {string} progressData.season - Season information
   */
  const updateProgress = useCallback((episodeId, progressData) => {
    const { currentTime, duration, showId, showTitle, episodeTitle, season } =
      progressData;

    // Calculate completion percentage
    const completionPercentage =
      duration > 0 ? (currentTime / duration) * 100 : 0;

    // Mark as completed if 90% or more has been played
    const completed = completionPercentage >= 90;

    setProgress((prev) => ({
      ...prev,
      [episodeId]: {
        episodeId,
        showId,
        showTitle,
        episodeTitle,
        season,
        currentTime,
        duration,
        completionPercentage,
        completed,
        lastPlayed: new Date().toISOString(),
        // Keep track of total listening time
        totalListeningTime: (prev[episodeId]?.totalListeningTime || 0) + 1,
      },
    }));
  }, []);

  /**
   * Get progress for a specific episode
   * @param {string} episodeId - Episode identifier
   * @returns {Object|null} Progress data or null if not found
   */
  const getProgress = useCallback(
    (episodeId) => {
      return progress[episodeId] || null;
    },
    [progress]
  );

  /**
   * Mark an episode as completed
   * @param {string} episodeId - Episode identifier
   */
  const markAsCompleted = useCallback((episodeId) => {
    setProgress((prev) => ({
      ...prev,
      [episodeId]: {
        ...prev[episodeId],
        completed: true,
        completionPercentage: 100,
        lastPlayed: new Date().toISOString(),
      },
    }));
  }, []);

  /**
   * Reset progress for a specific episode
   * @param {string} episodeId - Episode identifier
   */
  const resetProgress = useCallback((episodeId) => {
    setProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[episodeId];
      return newProgress;
    });
  }, []);

  /**
   * Reset all listening history
   */
  const resetAllProgress = useCallback(() => {
    setProgress({});
    localStorage.removeItem("listeningProgress");
  }, []);

  /**
   * Get all episodes in progress (not completed, has some progress)
   * @returns {Array} Array of episodes in progress
   */
  const getInProgressEpisodes = useCallback(() => {
    return Object.values(progress).filter(
      (ep) => !ep.completed && ep.currentTime > 0
    );
  }, [progress]);

  /**
   * Get all completed episodes
   * @returns {Array} Array of completed episodes
   */
  const getCompletedEpisodes = useCallback(() => {
    return Object.values(progress).filter((ep) => ep.completed);
  }, [progress]);

  /**
   * Get listening statistics
   * @returns {Object} Statistics object
   */
  const getListeningStats = useCallback(() => {
    const allProgress = Object.values(progress);
    const totalEpisodes = allProgress.length;
    const completedCount = allProgress.filter((ep) => ep.completed).length;
    const inProgressCount = allProgress.filter(
      (ep) => !ep.completed && ep.currentTime > 0
    ).length;
    const totalListeningTime = allProgress.reduce(
      (sum, ep) => sum + (ep.totalListeningTime || 0),
      0
    );

    return {
      totalEpisodes,
      completedCount,
      inProgressCount,
      totalListeningTime,
      completionRate:
        totalEpisodes > 0 ? (completedCount / totalEpisodes) * 100 : 0,
    };
  }, [progress]);

  /**
   * Check if an episode has any progress
   * @param {string} episodeId - Episode identifier
   * @returns {boolean} True if episode has progress
   */
  const hasProgress = useCallback(
    (episodeId) => {
      const episodeProgress = progress[episodeId];
      return episodeProgress && episodeProgress.currentTime > 0;
    },
    [progress]
  );

  /**
   * Check if an episode is completed
   * @param {string} episodeId - Episode identifier
   * @returns {boolean} True if episode is completed
   */
  const isCompleted = useCallback(
    (episodeId) => {
      return progress[episodeId]?.completed || false;
    },
    [progress]
  );

  return {
    progress,
    updateProgress,
    getProgress,
    markAsCompleted,
    resetProgress,
    resetAllProgress,
    getInProgressEpisodes,
    getCompletedEpisodes,
    getListeningStats,
    hasProgress,
    isCompleted,
  };
}
