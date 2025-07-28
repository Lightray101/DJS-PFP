import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFavourites } from "./hooks/useFavourites";

function groupByShow(favourites) {
  const grouped = {};
  favourites.forEach(fav => {
    if (!grouped[fav.showTitle]) grouped[fav.showTitle] = [];
    grouped[fav.showTitle].push(fav);
  });
  return grouped;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

const SORTS = [
  { label: "A–Z (Title)", value: "az" },
  { label: "Z–A (Title)", value: "za" },
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
];

function sortFavourites(favs, sort) {
  switch (sort) {
    case "az":
      return [...favs].sort((a, b) => a.showTitle.localeCompare(b.showTitle));
    case "za":
      return [...favs].sort((a, b) => b.showTitle.localeCompare(a.showTitle));
    case "newest":
      return [...favs].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    case "oldest":
      return [...favs].sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
    default:
      return favs;
  }
}

function FavouritesPage() {
  const { favourites } = useFavourites();
  const [sort, setSort] = useState("newest");

  const sortedFavs = sortFavourites(favourites, sort);
  const grouped = groupByShow(sortedFavs);

  return (
    <div style={{ padding: 24 }}>
      <h1>Favourites</h1>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="sort-favs">Sort by: </label>
        <select id="sort-favs" value={sort} onChange={e => setSort(e.target.value)}>
          {SORTS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      {favourites.length === 0 ? (
        <p>No favourited episodes yet.</p>
      ) : (
        <div>
          {Object.entries(grouped).map(([showTitle, favs]) => (
            <div key={showTitle} style={{ marginBottom: 32 }}>
              <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: 4 }}>{showTitle}</h2>
              <ul>
                {favs.map(fav => (
                  <li key={fav.episodeId} style={{ marginBottom: 8 }}>
                    <div><strong>Episode ID:</strong> {fav.episodeId}</div>
                    {fav.season && <div><strong>Season:</strong> {fav.season}</div>}
                    <div><strong>Date Added:</strong> {formatDate(fav.dateAdded)}</div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default FavouritesPage;
