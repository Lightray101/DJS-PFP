import React from "react";
import { Link } from "react-router-dom";

// Reuse the useFavourites hook from app.js
import { useFavourites } from "./app";

function FavouritesPage() {
  const { favourites } = useFavourites();

  return (
    <div style={{ padding: 24 }}>
      <h1>Favourites</h1>
      {favourites.length === 0 ? (
        <p>No favourited episodes yet.</p>
      ) : (
        <ul>
          {favourites.map((id) => (
            <li key={id}>
              Episode ID: {id}
              {/* Placeholder for episode/show/season details */}
            </li>
          ))}
        </ul>
      )}
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default FavouritesPage;
