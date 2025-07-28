import React from "react";
import { useFavourites } from "../hooks/useFavourites";

export function FavouriteButton({ episodeId, showId, showTitle, season }) {
  const { isFavourite, addFavourite, removeFavourite } = useFavourites();
  const fav = isFavourite(episodeId);
  return (
    <button
      onClick={() => fav
        ? removeFavourite(episodeId)
        : addFavourite({ episodeId, showId, showTitle, season })}
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
