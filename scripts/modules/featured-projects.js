/**
 * Featured Projects Loader Module
 */
export async function loadFeaturedProjects() {
  const container = document.querySelector("#featured-projects");
  if (!container) return;

  container.innerHTML = "<p>Loading projects...</p>";

  if (!window.portfolioDb) {
    container.innerHTML = "<p>Database connection unavailable.</p>";
    return;
  }

  const { data, error } = await window.portfolioDb
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    container.innerHTML = `<p>${error.message}</p>`;
    return;
  }

  if (!data || !data.length) {
    container.innerHTML = "<p>No published projects yet.</p>";
    return;
  }

  container.innerHTML = data
    .map(
      (project) => `
      <article class="project-card">
        <img src="${project.cover_image_url || ''}" alt="${project.title || 'Project'}">
        <h3>${project.title || ''}</h3>
        <p>${project.category || ''}</p>
      </article>
    `
    )
    .join("");
}
