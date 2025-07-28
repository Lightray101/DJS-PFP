import React from "react";
import { useFavourites } from "../hooks/useFavourites";

export function FavouriteButton({
  episodeId,
  showId,
  showTitle,
  season,
  episodeTitle,
  description,
  style,
}) {
  const { isFavourite, addFavourite, removeFavourite } = useFavourites();
  const fav = isFavourite(episodeId);
  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // Prevent card navigation when clicking heart
        fav
          ? removeFavourite(episodeId)
          : addFavourite({
              episodeId,
              showId,
              showTitle,
              season,
              episodeTitle,
              description,
            });
      }}
      style={{
        background: "none",
        border: "none",
        color: fav ? "red" : "#d1d1d1",
        fontSize: 28,
        cursor: "pointer",
        marginRight: 0,
        outline: "none",
        ...style,
      }}
      aria-label={fav ? "Unfavourite" : "Favourite"}
      title={fav ? "Unfavourite" : "Favourite"}
    >
      {fav ? "♥" : "♡"}
    </button>
  );
}
