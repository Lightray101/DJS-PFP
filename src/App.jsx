import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import ShowDetailPage from "./ShowDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/show/:id" element={<ShowDetailPage />} />
    </Routes>
  );
}

export default App;
