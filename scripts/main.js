/**
 * Main Entry Point
 * Orchestrates navigation and featured projects loader.
 */
import { initNavigation } from "./modules/navigation.js";
import { loadFeaturedProjects } from "./modules/featured-projects.js";
import { initPublicJournal } from "./modules/journal-public.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  loadFeaturedProjects();
  initPublicJournal();
});

// Global fallback if loaded directly
window.initPortfolioMain = function() {
  initNavigation();
  loadFeaturedProjects();
  initPublicJournal();
};

