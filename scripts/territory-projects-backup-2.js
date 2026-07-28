const territoryPage = document.querySelector("[data-work-type]");

const territoryGroups = document.querySelector("#territory-project-groups");

const territoryStatus = document.querySelector("#territory-project-status");

/* ========================================
   PROJECT VIEWER ELEMENTS
======================================== */

const projectViewer = document.querySelector("#project-viewer");

const projectViewerBackdrop = document.querySelector(
  ".project-viewer-backdrop",
);

const projectViewerClose = document.querySelector("#project-viewer-close");

const projectViewerImageContainer = document.querySelector(
  ".project-viewer-image",
);

const viewerImage = document.querySelector("#viewer-image");

const projectViewerVideo = document.querySelector("#project-viewer-video");

const viewerVideoFrame = document.querySelector("#viewer-video-frame");

const viewerCategory = document.querySelector("#viewer-category");

const viewerTitle = document.querySelector("#viewer-title");

const viewerDescription = document.querySelector("#viewer-description");

const viewerMeta = document.querySelector("#viewer-meta");

const viewerExplore = document.querySelector("#viewer-explore");

/* ========================================
   TERRITORY SETTINGS
======================================== */

const territorySettings = {
  Professional: {
    categories: ["Press Ad", "Campaign", "Logo", "Event", "Digital"],

    emptyText: "Professional projects will be published here soon.",
  },

  "Fine Arts": {
    categories: ["Watercolor", "Sketch", "Drawing"],

    emptyText: "Selected fine art works will be published here soon.",
  },

  "Passion Works": {
    categories: ["Photography", "Performing Arts", "Literature"],

    emptyText: "Passion works will be published here soon.",
  },
};

/* ========================================
   PROJECT TYPE
======================================== */

function isLiteratureProject(project) {
  return (
    project.work_type === "Passion Works" && project.category === "Literature"
  );
}

function isVideoProject(project) {
  return (
    !isLiteratureProject(project) &&
    Boolean(String(project.video_url || "").trim())
  );
}

function getProjectMode(project) {
  if (isLiteratureProject(project)) {
    return "literature";
  }

  if (isVideoProject(project)) {
    return "video";
  }

  return "image";
}

/* ========================================
   YOUTUBE URL CONVERSION
======================================== */

function getYouTubeEmbedUrl(url) {
  const rawUrl = String(url || "").trim();

  if (!rawUrl) {
    return "";
  }

  try {
    const parsedUrl = new URL(rawUrl);
    const hostname = parsedUrl.hostname.replace(/^www\./, "").toLowerCase();

    let videoId = "";

    if (hostname === "youtu.be") {
      videoId = parsedUrl.pathname.split("/").filter(Boolean)[0];
    }

    if (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "youtube-nocookie.com"
    ) {
      if (parsedUrl.pathname === "/watch") {
        videoId = parsedUrl.searchParams.get("v") || "";
      }

      if (parsedUrl.pathname.startsWith("/embed/")) {
        videoId = parsedUrl.pathname.split("/embed/")[1]?.split("/")[0] || "";
      }

      if (parsedUrl.pathname.startsWith("/shorts/")) {
        videoId = parsedUrl.pathname.split("/shorts/")[1]?.split("/")[0] || "";
      }

      if (parsedUrl.pathname.startsWith("/live/")) {
        videoId = parsedUrl.pathname.split("/live/")[1]?.split("/")[0] || "";
      }
    }

    if (!videoId) {
      return "";
    }

    const cleanVideoId = videoId.split("?")[0].split("&")[0];

    return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(
      cleanVideoId,
    )}?rel=0`;
  } catch (error) {
    console.error("Invalid YouTube URL:", error);
    return "";
  }
}

/* ========================================
   GENERAL HELPERS
======================================== */

function getProjectDescription(project) {
  return (
    String(project.full_description || "").trim() ||
    String(project.short_description || "").trim()
  );
}

function getLiteratureExcerpt(project) {
  const source =
    String(project.short_description || "").trim() ||
    String(project.full_description || "").trim();

  if (!source) {
    return "Open to read this literature work.";
  }

  if (source.length <= 240) {
    return source;
  }

  return `${source.slice(0, 237).trim()}…`;
}

function getExploreUrl(project) {
  const behanceUrl = String(project.behance_url || "").trim();

  if (behanceUrl) {
    return behanceUrl;
  }

  if (isVideoProject(project)) {
    return String(project.video_url || "").trim();
  }

  return "";
}

function getExploreText(project) {
  if (isVideoProject(project)) {
    return "Watch on YouTube →";
  }

  return "Explore More →";
}

function addViewerMetaItem(label, value) {
  if (!viewerMeta) {
    return;
  }

  let cleanValue = value;

  if (Array.isArray(value)) {
    cleanValue = value.filter(Boolean).join(", ");
  }

  cleanValue = String(cleanValue || "").trim();

  if (!cleanValue) {
    return;
  }

  const item = document.createElement("div");
  item.className = "viewer-meta-item";

  const itemLabel = document.createElement("span");
  itemLabel.className = "viewer-meta-label";
  itemLabel.textContent = label;

  const itemValue = document.createElement("span");
  itemValue.className = "viewer-meta-value";
  itemValue.textContent = cleanValue;

  item.append(itemLabel, itemValue);
  viewerMeta.appendChild(item);
}

/* ========================================
   VIEWER RESET
======================================== */

function resetProjectViewer() {
  if (!projectViewer) {
    return;
  }

  projectViewer.classList.remove("is-image", "is-video", "is-literature");

  if (projectViewerImageContainer) {
    projectViewerImageContainer.hidden = true;
  }

  if (viewerImage) {
    viewerImage.src = "";
    viewerImage.alt = "";
  }

  if (projectViewerVideo) {
    projectViewerVideo.hidden = true;
  }

  if (viewerVideoFrame) {
    viewerVideoFrame.src = "";
  }

  if (viewerCategory) {
    viewerCategory.textContent = "";
  }

  if (viewerTitle) {
    viewerTitle.textContent = "";
  }

  if (viewerDescription) {
    viewerDescription.textContent = "";
    viewerDescription.hidden = true;
  }

  if (viewerMeta) {
    viewerMeta.innerHTML = "";
    viewerMeta.hidden = true;
  }

  if (viewerExplore) {
    viewerExplore.removeAttribute("href");
    viewerExplore.textContent = "Explore More →";
    viewerExplore.hidden = true;
  }
}

/* ========================================
   IMAGE VIEWER MODE
======================================== */

function prepareImageViewer(project) {
  projectViewer?.classList.add("is-image");

  if (projectViewerImageContainer) {
    projectViewerImageContainer.hidden = false;
  }

  if (viewerImage) {
    viewerImage.src = project.cover_image_url || "";

    viewerImage.alt = project.title || `${project.category} project`;
  }
}

/* ========================================
   VIDEO VIEWER MODE
======================================== */

function prepareVideoViewer(project) {
  projectViewer?.classList.add("is-video");

  const embedUrl = getYouTubeEmbedUrl(project.video_url);

  if (!embedUrl) {
    console.error("A valid YouTube URL was not found for:", project.title);

    prepareImageViewer(project);
    return;
  }

  if (projectViewerVideo) {
    projectViewerVideo.hidden = false;
  }

  if (viewerVideoFrame) {
    viewerVideoFrame.src = embedUrl;
  }
}

/* ========================================
   LITERATURE VIEWER MODE
======================================== */

function prepareLiteratureViewer() {
  projectViewer?.classList.add("is-literature");
}

/* ========================================
   OPEN PROJECT VIEWER
======================================== */

function openProjectViewer(project) {
  if (
    !projectViewer ||
    !viewerCategory ||
    !viewerTitle ||
    !viewerDescription ||
    !viewerMeta ||
    !viewerExplore
  ) {
    return;
  }

  resetProjectViewer();

  const mode = getProjectMode(project);

  if (mode === "image") {
    prepareImageViewer(project);
  }

  if (mode === "video") {
    prepareVideoViewer(project);
  }

  if (mode === "literature") {
    prepareLiteratureViewer();
  }

  viewerCategory.textContent = project.category || "Selected Work";

  viewerTitle.textContent = project.title || "Untitled Project";

  const description = getProjectDescription(project);

  viewerDescription.textContent = description;
  viewerDescription.hidden = !description;

  if (mode !== "literature") {
    addViewerMetaItem("Creative Territory", project.work_type);

    addViewerMetaItem("Category", project.category);

    addViewerMetaItem("Client", project.client_name);

    addViewerMetaItem("Year", project.project_year);

    addViewerMetaItem("Tools / Medium", project.tools);

    addViewerMetaItem("Tags", project.tags);
  } else {
    addViewerMetaItem("Type", project.category);

    addViewerMetaItem("Year", project.project_year);
  }

  viewerMeta.hidden = viewerMeta.children.length === 0;

  const exploreUrl = getExploreUrl(project);

  if (exploreUrl && mode !== "literature") {
    viewerExplore.href = exploreUrl;
    viewerExplore.textContent = getExploreText(project);
    viewerExplore.hidden = false;
  }

  projectViewer.hidden = false;

  projectViewer.setAttribute("aria-hidden", "false");

  document.body.classList.add("project-viewer-open");

  projectViewerClose?.focus();
}

/* ========================================
   CLOSE PROJECT VIEWER
======================================== */

function closeProjectViewer() {
  if (!projectViewer) {
    return;
  }

  projectViewer.hidden = true;

  projectViewer.setAttribute("aria-hidden", "true");

  document.body.classList.remove("project-viewer-open");

  resetProjectViewer();
}

projectViewerClose?.addEventListener("click", closeProjectViewer);

projectViewerBackdrop?.addEventListener("click", closeProjectViewer);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && projectViewer && !projectViewer.hidden) {
    closeProjectViewer();
  }
});

/* ========================================
   ACCESSIBLE CARD ACTION
======================================== */

function makeCardInteractive(card, project) {
  card.tabIndex = 0;
  card.setAttribute("role", "button");

  card.setAttribute("aria-label", `Open ${project.title || "project"}`);

  card.addEventListener("click", () => {
    openProjectViewer(project);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProjectViewer(project);
    }
  });
}

/* ========================================
   IMAGE / VIDEO CARD
======================================== */

function createMediaProjectCard(project) {
  const card = document.createElement("article");

  card.className = "professional-project-card project-card-viewable";

  const mode = getProjectMode(project);

  if (project.cover_image_url) {
    const image = document.createElement("img");

    image.src = project.cover_image_url;

    image.alt = project.title || `${project.category} project`;

    image.loading = "lazy";

    card.appendChild(image);
  } else {
    const placeholder = document.createElement("div");

    placeholder.className = "professional-project-image-placeholder";

    placeholder.textContent = mode === "video" ? "Play Video" : "View Project";

    card.appendChild(placeholder);
  }

  const overlay = document.createElement("div");

  overlay.className = "professional-project-overlay";

  const category = document.createElement("span");

  category.className = "professional-project-category";

  category.textContent = project.category || "Selected Work";

  const title = document.createElement("h3");

  title.className = "professional-project-title";

  title.textContent = project.title || "Untitled Project";

  const action = document.createElement("span");

  action.className = "professional-project-arrow";

  action.setAttribute("aria-hidden", "true");

  action.textContent = mode === "video" ? "▶" : "＋";

  overlay.append(category, title, action);

  card.appendChild(overlay);

  makeCardInteractive(card, project);

  return card;
}

/* ========================================
   LITERATURE CARD
======================================== */

function createLiteratureCard(project) {
  const card = document.createElement("article");

  card.className = "literature-project-card project-card-viewable";

  const type = document.createElement("p");

  type.className = "literature-project-type";
  type.textContent = "Literature";

  const title = document.createElement("h3");

  title.className = "literature-project-title";

  title.textContent = project.title || "Untitled Literature";

  const excerpt = document.createElement("p");

  excerpt.className = "literature-project-excerpt";

  excerpt.textContent = getLiteratureExcerpt(project);

  const readMore = document.createElement("span");

  readMore.className = "literature-project-read";

  readMore.textContent = "Read More →";

  card.append(type, title, excerpt, readMore);

  makeCardInteractive(card, project);

  return card;
}

/* ========================================
   PROJECT CARD ROUTER
======================================== */

function createProjectCard(project) {
  if (isLiteratureProject(project)) {
    return createLiteratureCard(project);
  }

  return createMediaProjectCard(project);
}

/* ========================================
   CATEGORY SECTION
======================================== */

function createCategorySection(categoryName, projects) {
  const section = document.createElement("section");

  section.className = "territory-category-section";

  const heading = document.createElement("div");

  heading.className = "territory-category-heading";

  const title = document.createElement("h2");
  title.textContent = categoryName;

  const count = document.createElement("p");

  count.textContent = `${projects.length} selected ${
    projects.length === 1 ? "work" : "works"
  }`;

  heading.append(title, count);

  const grid = document.createElement("div");

  grid.className =
    categoryName === "Literature"
      ? "literature-project-grid professional-project-grid"
      : "professional-project-grid";

  projects.forEach((project) => {
    grid.appendChild(createProjectCard(project));
  });

  section.append(heading, grid);

  return section;
}

/* ========================================
   LOAD TERRITORY PROJECTS
======================================== */

async function loadTerritoryProjects() {
  if (
    !territoryPage ||
    !territoryGroups ||
    !territoryStatus ||
    !window.portfolioDb
  ) {
    return;
  }

  const workType = territoryPage.dataset.workType;

  const settings = territorySettings[workType];

  if (!settings) {
    territoryStatus.textContent = "Invalid creative territory.";

    return;
  }

  territoryStatus.hidden = false;

  territoryStatus.textContent = "Loading selected works…";

  const { data, error } = await window.portfolioDb
    .from("projects")
    .select(
      `
        id,
        title,
        work_type,
        category,
        client_name,
        project_year,
        short_description,
        full_description,
        tools,
        tags,
        cover_image_url,
        behance_url,
        video_url,
        sort_order
        `,
    )
    .eq("work_type", workType)
    .eq("is_featured", true)
    .eq("is_published", true)
    .order("sort_order", {
      ascending: true,
    });

  if (error) {
    console.error("Could not load territory projects:", error);

    territoryStatus.textContent =
      "Selected works could not be loaded right now.";

    return;
  }

  territoryGroups.innerHTML = "";

  if (!data || data.length === 0) {
    territoryStatus.textContent = settings.emptyText;

    return;
  }

  let visibleCategoryCount = 0;

  settings.categories.forEach((categoryName) => {
    const categoryProjects = data.filter(
      (project) => project.category === categoryName,
    );

    if (categoryProjects.length === 0) {
      return;
    }

    territoryGroups.appendChild(
      createCategorySection(categoryName, categoryProjects),
    );

    visibleCategoryCount += 1;
  });

  if (visibleCategoryCount === 0) {
    territoryStatus.textContent = settings.emptyText;

    return;
  }

  territoryStatus.hidden = true;
}

loadTerritoryProjects();
