/**
 * Territory Gallery Module
 * Handles loading, filtering, dynamic card creation and rendering for territory work pages.
 */
import {
  isLiteratureProject,
  getProjectMode,
  getLiteratureExcerpt,
  openProjectViewer
} from "./project-viewer.js";

const territorySettings = {
  Professional: {
    categories: ["Press Ad", "Campaign", "Logo", "Event", "Digital"],
    emptyText: "Professional projects will be published here soon."
  },
  "Fine Arts": {
    categories: ["Watercolor", "Sketch", "Drawing"],
    emptyText: "Selected fine art works will be published here soon."
  },
  "Passion Works": {
    categories: ["Photography", "Performing Arts", "Literature"],
    emptyText: "Passion works will be published here soon."
  }
};

let allTerritoryProjects = [];
let visibleProjects = [];
let activeCategory = "All";

function makeCardInteractive(card, project) {
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Open ${project.title || "project"}`);

  card.addEventListener("click", () => {
    openProjectViewer(project, visibleProjects);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProjectViewer(project, visibleProjects);
    }
  });
}

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
  action.textContent = mode === "video" ? "▶" : "＋";

  overlay.append(category, title, action);
  card.appendChild(overlay);

  makeCardInteractive(card, project);
  return card;
}

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

function createProjectCard(project) {
  if (isLiteratureProject(project)) {
    return createLiteratureCard(project);
  }
  return createMediaProjectCard(project);
}

function createCategorySection(categoryName, projects) {
  const section = document.createElement("section");
  section.className = "territory-category-section";

  const heading = document.createElement("div");
  heading.className = "territory-category-heading";

  const title = document.createElement("h2");
  title.textContent = categoryName;

  const count = document.createElement("p");
  count.textContent = `${projects.length} selected ${projects.length === 1 ? "work" : "works"}`;

  heading.append(title, count);

  const grid = document.createElement("div");
  grid.className = categoryName === "Literature"
    ? "literature-project-grid professional-project-grid"
    : "professional-project-grid";

  projects.forEach((project) => {
    grid.appendChild(createProjectCard(project));
  });

  section.append(heading, grid);
  return section;
}

function createTerritoryFilter(settings) {
  const territoryGroups = document.querySelector("#territory-project-groups");
  if (!territoryGroups) return;

  document.querySelector(".territory-filter")?.remove();

  const availableCategories = settings.categories.filter((category) =>
    allTerritoryProjects.some((project) => project.category === category)
  );

  if (availableCategories.length <= 1) return;

  const filter = document.createElement("div");
  filter.className = "territory-filter";

  ["All", ...availableCategories].forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "territory-filter-button";
    button.dataset.category = category;
    button.textContent = category;

    if (category === activeCategory) button.classList.add("is-active");

    button.addEventListener("click", () => {
      activeCategory = category;
      filter.querySelectorAll(".territory-filter-button").forEach((item) => {
        item.classList.toggle("is-active", item.dataset.category === category);
      });
      renderTerritoryProjects(settings);
    });

    filter.appendChild(button);
  });

  territoryGroups.before(filter);
}

function renderTerritoryProjects(settings) {
  const territoryGroups = document.querySelector("#territory-project-groups");
  const territoryStatus = document.querySelector("#territory-project-status");
  if (!territoryGroups) return;

  territoryGroups.innerHTML = "";

  visibleProjects = activeCategory === "All"
    ? [...allTerritoryProjects]
    : allTerritoryProjects.filter((project) => project.category === activeCategory);

  const categoriesToRender = activeCategory === "All" ? settings.categories : [activeCategory];
  let visibleCategoryCount = 0;

  categoriesToRender.forEach((categoryName) => {
    const categoryProjects = visibleProjects.filter((project) => project.category === categoryName);
    if (categoryProjects.length === 0) return;

    territoryGroups.appendChild(createCategorySection(categoryName, categoryProjects));
    visibleCategoryCount += 1;
  });

  if (territoryStatus) {
    if (visibleCategoryCount === 0) {
      territoryStatus.hidden = false;
      territoryStatus.textContent = settings.emptyText;
    } else {
      territoryStatus.hidden = true;
    }
  }
}

export async function loadTerritoryProjects() {
  const territoryPage = document.querySelector("[data-work-type]");
  const territoryGroups = document.querySelector("#territory-project-groups");
  const territoryStatus = document.querySelector("#territory-project-status");

  if (!territoryPage || !territoryGroups || !window.portfolioDb) return;

  const workType = territoryPage.dataset.workType;
  const settings = territorySettings[workType];

  if (!settings) {
    if (territoryStatus) territoryStatus.textContent = "Invalid creative territory.";
    return;
  }

  if (territoryStatus) {
    territoryStatus.hidden = false;
    territoryStatus.textContent = "Loading selected works…";
  }

  const { data, error } = await window.portfolioDb
    .from("projects")
    .select(`
      id, title, work_type, category, client_name, project_year,
      short_description, full_description, tools, tags,
      cover_image_url, behance_url, video_url, sort_order
    `)
    .eq("work_type", workType)
    .eq("is_featured", true)
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Could not load territory projects:", error);
    if (territoryStatus) territoryStatus.textContent = "Selected works could not be loaded right now.";
    return;
  }

  if (!data || data.length === 0) {
    if (territoryStatus) territoryStatus.textContent = settings.emptyText;
    return;
  }

  allTerritoryProjects = data;
  visibleProjects = [...data];
  activeCategory = "All";

  createTerritoryFilter(settings);
  renderTerritoryProjects(settings);
}
