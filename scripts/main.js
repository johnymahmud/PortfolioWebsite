/**
 * Main Entry Point
 * Orchestrates navigation and featured projects loader.
 */
import { initNavigation } from "./modules/navigation.js";
import { loadFeaturedProjects } from "./modules/featured-projects.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  loadFeaturedProjects();
});

// Global fallback if loaded directly
window.initPortfolioMain = function() {
  initNavigation();
  loadFeaturedProjects();
};
