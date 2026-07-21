/**
 * Shared interaction entry point.
 * Keep feature-specific code in separate files inside this folder as the site grows.
 */
const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".site-nav");

function closeMenu() {
  nav?.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
  const icon = menuButton?.querySelector("span");
  if (icon) icon.textContent = "+";
}

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  const icon = menuButton.querySelector("span");
  if (icon) icon.textContent = isOpen ? "+" : "−";
  nav?.classList.toggle("open", !isOpen);
});

nav
  ?.querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));

const currentYear = document.querySelector("#year");
if (currentYear) currentYear.textContent = new Date().getFullYear();
async function loadFeaturedProjects() {
  const container = document.querySelector("#featured-projects");

  if (!container) return;

  container.innerHTML = "<p>Loading projects...</p>";

  const { data, error } = await window.portfolioDb
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    container.innerHTML = `<p>${error.message}</p>`;
    return;
  }

  if (!data.length) {
    container.innerHTML = "<p>No published projects yet.</p>";
    return;
  }

  container.innerHTML = data
    .map(
      (project) => `
      <article class="project-card">
        <img src="${project.cover_image_url}" alt="${project.title}">
        <h3>${project.title}</h3>
        <p>${project.category}</p>
      </article>
    `,
    )
    .join("");
}

loadFeaturedProjects();
