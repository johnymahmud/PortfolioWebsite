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

const viewerImage = document.querySelector("#viewer-image");
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
   PROJECT HELPERS
======================================== */

function getProjectUrl(project) {
  return project.behance_url || "";
}

function isImageProject(project) {
  const isLiterature =
    project.work_type === "Passion Works" && project.category === "Literature";

  const hasVideo = Boolean(project.video_url);

  return !isLiterature && !hasVideo;
}

function addViewerMetaItem(label, value) {
  if (!viewerMeta || !value) {
    return;
  }

  const item = document.createElement("div");
  item.className = "viewer-meta-item";

  const itemLabel = document.createElement("span");
  itemLabel.className = "viewer-meta-label";
  itemLabel.textContent = label;

  const itemValue = document.createElement("span");
  itemValue.className = "viewer-meta-value";
  itemValue.textContent = value;

  item.append(itemLabel, itemValue);
  viewerMeta.appendChild(item);
}

/* ========================================
   OPEN / CLOSE IMAGE VIEWER
======================================== */

function openProjectViewer(project) {
  if (
    !projectViewer ||
    !viewerImage ||
    !viewerCategory ||
    !viewerTitle ||
    !viewerDescription ||
    !viewerMeta ||
    !viewerExplore
  ) {
    return;
  }

  viewerImage.src = project.cover_image_url || "";
  viewerImage.alt = project.title || `${project.category} project`;

  viewerCategory.textContent = project.category || "Selected Work";

  viewerTitle.textContent = project.title || "Untitled Project";

  viewerDescription.textContent =
    project.full_description || project.short_description || "";

  viewerDescription.hidden = !viewerDescription.textContent.trim();

  viewerMeta.innerHTML = "";

  addViewerMetaItem("Creative Territory", project.work_type);

  addViewerMetaItem("Category", project.category);

  addViewerMetaItem("Client", project.client_name);

  addViewerMetaItem("Year", project.project_year);

  addViewerMetaItem("Tools / Medium", project.tools);

  addViewerMetaItem(
    "Tags",
    Array.isArray(project.tags) ? project.tags.join(", ") : project.tags,
  );

  viewerMeta.hidden = viewerMeta.children.length === 0;

  const projectUrl = getProjectUrl(project);

  if (projectUrl) {
    viewerExplore.href = projectUrl;
    viewerExplore.hidden = false;
  } else {
    viewerExplore.removeAttribute("href");
    viewerExplore.hidden = true;
  }

  projectViewer.hidden = false;
  projectViewer.setAttribute("aria-hidden", "false");

  document.body.classList.add("project-viewer-open");

  projectViewerClose?.focus();
}

function closeProjectViewer() {
  if (!projectViewer) {
    return;
  }

  projectViewer.hidden = true;
  projectViewer.setAttribute("aria-hidden", "true");

  document.body.classList.remove("project-viewer-open");

  if (viewerImage) {
    viewerImage.src = "";
    viewerImage.alt = "";
  }
}

projectViewerClose?.addEventListener("click", closeProjectViewer);

projectViewerBackdrop?.addEventListener("click", closeProjectViewer);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && projectViewer && !projectViewer.hidden) {
    closeProjectViewer();
  }
});

/* ========================================
   PROJECT CARD
======================================== */

function createProjectCard(project) {
  const card = document.createElement("article");

  card.className = "professional-project-card";

  const image = document.createElement("img");
  image.src = project.cover_image_url;
  image.alt = project.title || `${project.category} project`;
  image.loading = "lazy";

  const overlay = document.createElement("div");
  overlay.className = "professional-project-overlay";

  const category = document.createElement("span");
  category.className = "professional-project-category";
  category.textContent = project.category || "Selected Work";

  const title = document.createElement("h3");
  title.className = "professional-project-title";
  title.textContent = project.title || "Untitled Project";

  overlay.append(category, title);

  if (isImageProject(project)) {
    card.classList.add("project-card-viewable");
    card.tabIndex = 0;
    card.setAttribute("role", "button");

    card.setAttribute("aria-label", `View ${project.title || "project"}`);

    const arrow = document.createElement("span");
    arrow.className = "professional-project-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "＋";

    overlay.appendChild(arrow);

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

  card.append(image, overlay);

  return card;
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
  grid.className = "professional-project-grid";

  projects.forEach((project) => {
    grid.appendChild(createProjectCard(project));
  });

  section.append(heading, grid);

  return section;
}

/* ========================================
   LOAD PROJECTS
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
    .not("cover_image_url", "is", null)
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
