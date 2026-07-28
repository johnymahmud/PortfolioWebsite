/**
 * Project Viewer (Lightbox Modal) Module
 * Handles media viewing (image, video, literature), keyboard navigation, and modal state.
 */

let projectViewerState = {
  visibleProjects: [],
  currentProjectIndex: -1
};

export function isLiteratureProject(project) {
  return (
    project.work_type === "Passion Works" && project.category === "Literature"
  );
}

export function isVideoProject(project) {
  return (
    !isLiteratureProject(project) &&
    Boolean(String(project.video_url || "").trim())
  );
}

export function getProjectMode(project) {
  if (isLiteratureProject(project)) return "literature";
  if (isVideoProject(project)) return "video";
  return "image";
}

export function getYouTubeEmbedUrl(url) {
  const rawUrl = String(url || "").trim();
  if (!rawUrl) return "";

  try {
    const parsedUrl = new URL(rawUrl);
    const hostname = parsedUrl.hostname.replace(/^www\./, "").toLowerCase();
    let videoId = "";

    if (hostname === "youtu.be") {
      videoId = parsedUrl.pathname.split("/").filter(Boolean)[0];
    } else if (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "youtube-nocookie.com"
    ) {
      if (parsedUrl.pathname === "/watch") {
        videoId = parsedUrl.searchParams.get("v") || "";
      } else if (parsedUrl.pathname.startsWith("/embed/")) {
        videoId = parsedUrl.pathname.split("/embed/")[1]?.split("/")[0] || "";
      } else if (parsedUrl.pathname.startsWith("/shorts/")) {
        videoId = parsedUrl.pathname.split("/shorts/")[1]?.split("/")[0] || "";
      } else if (parsedUrl.pathname.startsWith("/live/")) {
        videoId = parsedUrl.pathname.split("/live/")[1]?.split("/")[0] || "";
      }
    }

    if (!videoId) return "";
    const cleanVideoId = videoId.split("?")[0].split("&")[0];
    return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(cleanVideoId)}?rel=0`;
  } catch (error) {
    console.error("Invalid YouTube URL:", error);
    return "";
  }
}

export function getProjectDescription(project) {
  return (
    String(project.full_description || "").trim() ||
    String(project.short_description || "").trim()
  );
}

export function getLiteratureExcerpt(project) {
  const source =
    String(project.short_description || "").trim() ||
    String(project.full_description || "").trim();

  if (!source) return "Open to read this literature work.";
  if (source.length <= 240) return source;
  return `${source.slice(0, 237).trim()}…`;
}

export function getExploreUrl(project) {
  const behanceUrl = String(project.behance_url || "").trim();
  if (behanceUrl) return behanceUrl;
  if (isVideoProject(project)) return String(project.video_url || "").trim();
  return "";
}

export function getExploreText(project) {
  if (isVideoProject(project)) return "Watch on YouTube →";
  return "Explore More →";
}

export function openProjectViewer(project, visibleProjectsList = [], updateIndex = true) {
  const projectViewer = document.querySelector("#project-viewer");
  const viewerCategory = document.querySelector("#viewer-category");
  const viewerTitle = document.querySelector("#viewer-title");
  const viewerDescription = document.querySelector("#viewer-description");
  const viewerMeta = document.querySelector("#viewer-meta");
  const viewerExplore = document.querySelector("#viewer-explore");

  if (!projectViewer) return;

  if (visibleProjectsList.length) {
    projectViewerState.visibleProjects = visibleProjectsList;
  }

  if (updateIndex && projectViewerState.visibleProjects.length) {
    projectViewerState.currentProjectIndex = projectViewerState.visibleProjects.findIndex(
      (item) => item.id === project.id
    );
  }

  resetProjectViewer();

  const mode = getProjectMode(project);

  if (mode === "image") prepareImageViewer(project);
  if (mode === "video") prepareVideoViewer(project);
  if (mode === "literature") prepareLiteratureViewer();

  if (viewerCategory) viewerCategory.textContent = project.category || "Selected Work";
  if (viewerTitle) viewerTitle.textContent = project.title || "Untitled Project";

  const description = getProjectDescription(project);
  if (viewerDescription) {
    viewerDescription.textContent = description;
    viewerDescription.hidden = !description;
  }

  if (viewerMeta) {
    viewerMeta.innerHTML = "";
    if (mode !== "literature") {
      addViewerMetaItem(viewerMeta, "Creative Territory", project.work_type);
      addViewerMetaItem(viewerMeta, "Category", project.category);
      addViewerMetaItem(viewerMeta, "Client", project.client_name);
      addViewerMetaItem(viewerMeta, "Year", project.project_year);
      addViewerMetaItem(viewerMeta, "Tools / Medium", project.tools);
      addViewerMetaItem(viewerMeta, "Tags", project.tags);
    } else {
      addViewerMetaItem(viewerMeta, "Type", project.category);
      addViewerMetaItem(viewerMeta, "Year", project.project_year);
    }
    viewerMeta.hidden = viewerMeta.children.length === 0;
  }

  const exploreUrl = getExploreUrl(project);
  if (viewerExplore && exploreUrl && mode !== "literature") {
    viewerExplore.href = exploreUrl;
    viewerExplore.textContent = getExploreText(project);
    viewerExplore.hidden = false;
  }

  updateViewerNavigation();

  projectViewer.hidden = false;
  projectViewer.setAttribute("aria-hidden", "false");
  document.body.classList.add("project-viewer-open");

  document.querySelector("#project-viewer-close")?.focus();
}

export function closeProjectViewer() {
  const projectViewer = document.querySelector("#project-viewer");
  if (!projectViewer) return;

  projectViewer.hidden = true;
  projectViewer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("project-viewer-open");
  projectViewerState.currentProjectIndex = -1;
  resetProjectViewer();
}

function resetProjectViewer() {
  const projectViewer = document.querySelector("#project-viewer");
  const projectViewerImageContainer = document.querySelector(".project-viewer-image");
  const viewerImage = document.querySelector("#viewer-image");
  const projectViewerVideo = document.querySelector("#project-viewer-video");
  const viewerVideoFrame = document.querySelector("#viewer-video-frame");
  const viewerCategory = document.querySelector("#viewer-category");
  const viewerTitle = document.querySelector("#viewer-title");
  const viewerDescription = document.querySelector("#viewer-description");
  const viewerMeta = document.querySelector("#viewer-meta");
  const viewerExplore = document.querySelector("#viewer-explore");

  if (!projectViewer) return;

  projectViewer.classList.remove("is-image", "is-video", "is-literature");
  if (projectViewerImageContainer) projectViewerImageContainer.hidden = true;
  if (viewerImage) { viewerImage.src = ""; viewerImage.alt = ""; }
  if (projectViewerVideo) projectViewerVideo.hidden = true;
  if (viewerVideoFrame) viewerVideoFrame.src = "";
  if (viewerCategory) viewerCategory.textContent = "";
  if (viewerTitle) viewerTitle.textContent = "";
  if (viewerDescription) { viewerDescription.textContent = ""; viewerDescription.hidden = true; }
  if (viewerMeta) { viewerMeta.innerHTML = ""; viewerMeta.hidden = true; }
  if (viewerExplore) { viewerExplore.removeAttribute("href"); viewerExplore.textContent = "Explore More →"; viewerExplore.hidden = true; }
}

function prepareImageViewer(project) {
  const projectViewer = document.querySelector("#project-viewer");
  const projectViewerImageContainer = document.querySelector(".project-viewer-image");
  const viewerImage = document.querySelector("#viewer-image");

  projectViewer?.classList.add("is-image");
  if (projectViewerImageContainer) projectViewerImageContainer.hidden = false;
  if (viewerImage) {
    viewerImage.src = project.cover_image_url || "";
    viewerImage.alt = project.title || `${project.category} project`;
  }
}

function prepareVideoViewer(project) {
  const projectViewer = document.querySelector("#project-viewer");
  const projectViewerVideo = document.querySelector("#project-viewer-video");
  const viewerVideoFrame = document.querySelector("#viewer-video-frame");

  projectViewer?.classList.add("is-video");
  const embedUrl = getYouTubeEmbedUrl(project.video_url);

  if (!embedUrl) {
    prepareImageViewer(project);
    return;
  }

  if (projectViewerVideo) projectViewerVideo.hidden = false;
  if (viewerVideoFrame) viewerVideoFrame.src = embedUrl;
}

function prepareLiteratureViewer() {
  document.querySelector("#project-viewer")?.classList.add("is-literature");
}

function addViewerMetaItem(container, label, value) {
  if (!container) return;
  let cleanValue = value;
  if (Array.isArray(value)) cleanValue = value.filter(Boolean).join(", ");
  cleanValue = String(cleanValue || "").trim();
  if (!cleanValue) return;

  const item = document.createElement("div");
  item.className = "viewer-meta-item";
  const itemLabel = document.createElement("span");
  itemLabel.className = "viewer-meta-label";
  itemLabel.textContent = label;
  const itemValue = document.createElement("span");
  itemValue.className = "viewer-meta-value";
  itemValue.textContent = cleanValue;

  item.append(itemLabel, itemValue);
  container.appendChild(item);
}

function updateViewerNavigation() {
  const previousBtn = document.querySelector("#project-viewer-previous");
  const nextBtn = document.querySelector("#project-viewer-next");
  const hasMultiple = projectViewerState.visibleProjects.length > 1;

  if (previousBtn) previousBtn.disabled = !hasMultiple;
  if (nextBtn) nextBtn.disabled = !hasMultiple;
}

function showAdjacentProject(direction) {
  const list = projectViewerState.visibleProjects;
  if (list.length <= 1) return;

  projectViewerState.currentProjectIndex =
    (projectViewerState.currentProjectIndex + direction + list.length) % list.length;

  openProjectViewer(list[projectViewerState.currentProjectIndex], list, false);
}

export function initProjectViewerEvents() {
  document.querySelector("#project-viewer-close")?.addEventListener("click", closeProjectViewer);
  document.querySelector(".project-viewer-backdrop")?.addEventListener("click", closeProjectViewer);
  document.querySelector("#project-viewer-previous")?.addEventListener("click", () => showAdjacentProject(-1));
  document.querySelector("#project-viewer-next")?.addEventListener("click", () => showAdjacentProject(1));

  document.addEventListener("keydown", (event) => {
    const viewer = document.querySelector("#project-viewer");
    if (!viewer || viewer.hidden) return;

    if (event.key === "Escape") closeProjectViewer();
    if (event.key === "ArrowLeft") { event.preventDefault(); showAdjacentProject(-1); }
    if (event.key === "ArrowRight") { event.preventDefault(); showAdjacentProject(1); }
  });
}
