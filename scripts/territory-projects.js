/**
 * Territory Projects Main Entry Point
 * Delegates functionality to project-viewer and territory-gallery modules.
 */
import { initProjectViewerEvents } from "./modules/project-viewer.js";
import { loadTerritoryProjects } from "./modules/territory-gallery.js";

document.addEventListener("DOMContentLoaded", () => {
  initProjectViewerEvents();
  loadTerritoryProjects();
});

// Fallback auto-run if DOM is already ready
if (document.readyState !== "loading") {
  initProjectViewerEvents();
  loadTerritoryProjects();
}
