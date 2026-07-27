const professionalGrid = document.querySelector("#professional-project-grid");
const professionalStatus = document.querySelector(
  "#professional-project-status",
);

function createProjectCard(project) {
  const card = document.createElement("a");

  card.className = "professional-project-card";
  card.href = project.behance_url || "#";
  card.target = project.behance_url ? "_blank" : "_self";
  card.rel = project.behance_url ? "noopener noreferrer" : "";

  if (!project.behance_url) {
    card.setAttribute("aria-disabled", "true");
    card.addEventListener("click", (event) => event.preventDefault());
  }

  const image = document.createElement("img");
  image.src = project.cover_image_url;
  image.alt = project.title || "Professional project";
  image.loading = "lazy";

  const overlay = document.createElement("div");
  overlay.className = "professional-project-overlay";

  const category = document.createElement("span");
  category.className = "professional-project-category";
  category.textContent = project.category || "Professional Work";

  const title = document.createElement("h2");
  title.className = "professional-project-title";
  title.textContent = project.title || "Untitled Project";

  const arrow = document.createElement("span");
  arrow.className = "professional-project-arrow";
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "↗";

  overlay.append(category, title, arrow);
  card.append(image, overlay);

  return card;
}

async function loadProfessionalProjects() {
  if (!professionalGrid || !window.portfolioDb) {
    return;
  }

  professionalStatus.textContent = "Loading selected works…";

  const { data, error } = await window.portfolioDb
    .from("projects")
    .select("id, title, category, cover_image_url, behance_url, sort_order")
    .eq("work_type", "Passion Works")
    .eq("is_featured", true)
    .eq("is_published", true)
    .not("cover_image_url", "is", null)
    .order("sort_order", { ascending: true })
    .limit(10);

  if (error) {
    console.error("Could not load professional projects:", error);
    professionalStatus.textContent =
      "Selected works could not be loaded right now.";
    return;
  }

  if (!data || data.length === 0) {
    professionalStatus.textContent =
      "Selected professional works will be published here soon.";
    return;
  }

  professionalGrid.innerHTML = "";

  data.forEach((project) => {
    professionalGrid.appendChild(createProjectCard(project));
  });

  professionalStatus.hidden = true;
}

loadProfessionalProjects();
