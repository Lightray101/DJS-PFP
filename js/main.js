// Import the Web Component
import "../components/PodcastPreview.js";

// Import the main app
import PodcastApp from "./app.js";

// Import data
import { podcasts, genres, seasons } from "../../DJS02/scripts.js";

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  // Create an instance of the app and initialize it
  const app = new PodcastApp(podcasts, genres, seasons);
  app.init();
});
