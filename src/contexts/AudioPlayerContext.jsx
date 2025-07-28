import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";
import { useListeningProgress } from "../hooks/useListeningProgress";

const AudioPlayerContext = createContext();

export function AudioPlayerProvider({ children }) {
  const [audioSrc, setAudioSrc] = useState(null);
  const [audioTitle, setAudioTitle] = useState("");
  const [playing, setPlaying] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const audioRef = useRef(null);

  const { updateProgress, getProgress } = useListeningProgress();

  const playAudio = useCallback(
    (src, episodeData) => {
      const { title, episodeId, showId, showTitle, season } = episodeData;

      setAudioSrc(src);
      setAudioTitle(title);
      setCurrentEpisode({ episodeId, showId, showTitle, season, title });
      setPlaying(true);

      // Resume from saved position if available
      const savedProgress = getProgress(episodeId);
      if (savedProgress && audioRef.current) {
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.currentTime = savedProgress.currentTime;
          }
        }, 100);
      }
    },
    [getProgress]
  );

  const pauseAudio = useCallback(() => {
    setPlaying(false);
  }, []);

  const saveProgress = useCallback(
    (currentTime, duration) => {
      if (currentEpisode && currentTime > 0) {
        updateProgress(currentEpisode.episodeId, {
          currentTime,
          duration,
          showId: currentEpisode.showId,
          showTitle: currentEpisode.showTitle,
          episodeTitle: currentEpisode.title,
          season: currentEpisode.season,
        });
      }
    },
    [currentEpisode, updateProgress]
  );

  return (
    <AudioPlayerContext.Provider
      value={{
        audioSrc,
        audioTitle,
        playing,
        setPlaying,
        playAudio,
        pauseAudio,
        audioRef,
        currentEpisode,
        saveProgress,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  return useContext(AudioPlayerContext);
}
