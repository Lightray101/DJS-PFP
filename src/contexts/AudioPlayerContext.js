import React, { createContext, useContext, useState, useRef } from "react";

const AudioPlayerContext = createContext();

export function AudioPlayerProvider({ children }) {
  const [audioSrc, setAudioSrc] = useState(null);
  const [audioTitle, setAudioTitle] = useState("");
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const playAudio = (src, title = "") => {
    setAudioSrc(src);
    setAudioTitle(title);
    setPlaying(true);
    // The actual play will be triggered by the AudioPlayer component
  };

  const pauseAudio = () => setPlaying(false);

  return (
    <AudioPlayerContext.Provider value={{ audioSrc, audioTitle, playing, setPlaying, playAudio, pauseAudio, audioRef }}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  return useContext(AudioPlayerContext);
}
