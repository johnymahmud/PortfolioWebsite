const territoryPage = document.querySelector("[data-work-type]");
const territoryGroups = document.querySelector("#territory-project-groups");
const territoryStatus = document.querySelector("#territory-project-status");

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

function getProjectUrl(project) {
  if (
    project.work_type === "Passion Works" &&
    project.category === "Performing Arts"
  ) {
    return project.video_url || "";
  }

  if (
    project.work_type === "Passion Works" &&
    project.category === "Literature"
  ) {
    return "";
  }

  return project.behance_url || "";
}

function createProjectCard(project) {
  const projectUrl = getProjectUrl(project);

  const card = document.createElement(projectUrl ? "a" : "article");
  card.className = "professional-project-card";

  if (projectUrl) {
    card.href = projectUrl;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
  }

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

  if (projectUrl) {
    const arrow = document.createElement("span");
    arrow.className = "professional-project-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";

    overlay.appendChild(arrow);
  }

  card.append(image, overlay);

  return card;
}

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
      cover_image_url,
      behance_url,
      video_url,
      full_description,
      sort_order
    `,
    )
    .eq("work_type", workType)
    .eq("is_featured", true)
    .eq("is_published", true)
    .not("cover_image_url", "is", null)
    .order("sort_order", { ascending: true });

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
