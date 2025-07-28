import { useState, useEffect } from "react";

export function useFavourites() {
  const [favourites, setFavourites] = useState(() => {
    const favs = localStorage.getItem('favouriteEpisodes');
    return favs ? JSON.parse(favs) : [];
  });

  useEffect(() => {
    localStorage.setItem('favouriteEpisodes', JSON.stringify(favourites));
  }, [favourites]);

  // Add favourite with metadata: episodeId, showId, showTitle, season, dateAdded
  const addFavourite = (favObj) => {
    if (!favourites.some(f => f.episodeId === favObj.episodeId)) {
      setFavourites([...favourites, { ...favObj, dateAdded: new Date().toISOString() }]);
    }
  };
  const removeFavourite = (episodeId) => {
    setFavourites(favourites.filter(f => f.episodeId !== episodeId));
  };
  const isFavourite = (episodeId) => favourites.some(f => f.episodeId === episodeId);

  return { favourites, addFavourite, removeFavourite, isFavourite };
}
