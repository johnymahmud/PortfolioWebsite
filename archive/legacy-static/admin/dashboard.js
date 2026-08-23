/**
 * Admin Dashboard Main Entry Point
 * Manages "See My Work" Projects CRUD and Territory Filters.
 */
import { checkAdminSession, handleAdminLogout } from "./scripts/auth.js";
import { openPanel, closePanel, showMessage } from "./scripts/admin-modal.js";
import {
  populateCategoryOptions,
  uploadProjectImage,
  fetchAllProjects,
  deleteProjectById
} from "./scripts/project-manager.js";

document.addEventListener("DOMContentLoaded", async () => {
  const session = await checkAdminSession(true, false);
  if (!session) return;

  const logoutButton = document.querySelector("#admin-logout-button");
  const userEmail = document.querySelector("#admin-user-email");
  const dashboardStatus = document.querySelector("#dashboard-status");
  const projectList = document.querySelector("#dashboard-project-list");
  const newProjectButton = document.querySelector("#new-project-button");

  const projectFormPanel = document.querySelector("#project-form-panel");
  const projectFormBackdrop = document.querySelector("#project-form-backdrop");
  const projectForm = document.querySelector("#project-form");
  const projectFormTitle = document.querySelector("#project-form-title");
  const editingProjectId = document.querySelector("#editing-project-id");

  const closeProjectFormButton = document.querySelector("#close-project-form");
  const cancelProjectFormButton = document.querySelector("#cancel-project-form");
  const saveProjectButton = document.querySelector("#save-project-button");
  const projectFormMessage = document.querySelector("#project-form-message");

  const projectImageInput = document.querySelector("#project-image");
  const projectImagePreview = document.querySelector("#project-image-preview");
  const projectWorkType = document.querySelector("#project-work-type");
  const projectCategory = document.querySelector("#project-category");

  const projectTitleInput = document.querySelector("#project-title");
  const projectYearInput = document.querySelector("#project-year");
  const projectClientInput = document.querySelector("#project-client");
  const projectBehanceInput = document.querySelector("#project-behance");
  const projectVideoInput = document.querySelector("#project-video");

  const projectFullContentInput = document.querySelector("#project-full-content");
  const projectOrderInput = document.querySelector("#project-order");
  const projectDescriptionInput = document.querySelector("#project-description");
  const projectFeaturedInput = document.querySelector("#project-featured");
  const projectPublishedInput = document.querySelector("#project-published");

  const filterButtons = document.querySelectorAll("[data-territory]");

  const projectsCache = new Map();
  let allProjectsList = [];
  let activeTerritory = "all";

  if (userEmail && session.user?.email) {
    userEmail.textContent = session.user.email;
  }

  logoutButton?.addEventListener("click", handleAdminLogout);

  function resetForm() {
    if (!projectForm) return;
    projectForm.reset();
    if (editingProjectId) editingProjectId.value = "";
    if (projectFormTitle) projectFormTitle.textContent = "Add New Project";
    if (saveProjectButton) saveProjectButton.textContent = "Save Project";

    if (projectWorkType) projectWorkType.value = "";
    populateCategoryOptions(projectCategory, "");

    if (projectImagePreview) projectImagePreview.innerHTML = "<span>Image preview drop zone</span>";
    if (projectFeaturedInput) projectFeaturedInput.checked = true;
    if (projectPublishedInput) projectPublishedInput.checked = true;
    if (projectOrderInput) projectOrderInput.value = "1";

    showMessage(projectFormMessage, "");
  }

  function openNewForm() {
    resetForm();
    openPanel(projectFormPanel, projectFormBackdrop, "project-form-open");
  }

  function closeForm() {
    closePanel(projectFormPanel, projectFormBackdrop, "project-form-open");
    resetForm();
  }

  newProjectButton?.addEventListener("click", openNewForm);
  closeProjectFormButton?.addEventListener("click", closeForm);
  cancelProjectFormButton?.addEventListener("click", closeForm);
  projectFormBackdrop?.addEventListener("click", closeForm);

  projectWorkType?.addEventListener("change", (e) => {
    populateCategoryOptions(projectCategory, e.target.value);
  });

  projectImageInput?.addEventListener("change", () => {
    const file = projectImageInput.files[0];
    if (file && projectImagePreview) {
      const reader = new FileReader();
      reader.onload = (e) => {
        projectImagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-height:220px; object-fit:contain;">`;
      };
      reader.readAsDataURL(file);
    }
  });

  function getVisibleProjects() {
    if (activeTerritory === "all") return allProjectsList;
    return allProjectsList.filter(p => p.work_type === activeTerritory);
  }

  function renderProjectsGrid() {
    if (!projectList || !dashboardStatus) return;
    projectList.innerHTML = "";

    const list = getVisibleProjects();
    if (!list.length) {
      dashboardStatus.hidden = false;
      dashboardStatus.textContent = activeTerritory === "all"
        ? "No projects found. Click '+ Add New Project' to publish your first work."
        : `No projects found for ${activeTerritory}.`;
      return;
    }

    dashboardStatus.hidden = true;
    list.forEach((project) => {
      projectsCache.set(project.id, project);

      const item = document.createElement("div");
      item.className = "dashboard-project-item";
      item.innerHTML = `
        <div class="dashboard-project-image">
          ${project.cover_image_url ? `<img src="${project.cover_image_url}" alt="${project.title}">` : "<span>No Image</span>"}
        </div>
        <div class="dashboard-project-content">
          <span class="dashboard-project-category">${project.work_type || 'Territory'} · ${project.category || 'General'}</span>
          <h3>${project.title}</h3>
          <p class="dashboard-project-details">${project.project_year || "N/A"} · ${project.client_name || "Self"} · Order: ${project.sort_order || 1}</p>
        </div>
        <div class="dashboard-project-actions">
          <button type="button" class="admin-secondary-button" data-action="edit" data-id="${project.id}">Edit</button>
          <button type="button" class="admin-danger-button" data-action="delete" data-id="${project.id}">Delete</button>
        </div>
      `;

      projectList.appendChild(item);
    });
  }

  async function loadProjects() {
    if (!dashboardStatus) return;
    dashboardStatus.hidden = false;
    dashboardStatus.textContent = "Loading projects…";

    try {
      allProjectsList = await fetchAllProjects();
      renderProjectsGrid();
    } catch (err) {
      console.error(err);
      dashboardStatus.hidden = false;
      dashboardStatus.textContent = "Could not load projects from database.";
    }
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeTerritory = btn.dataset.territory || "all";
      filterButtons.forEach(b => b.classList.toggle("is-active", b === btn));
      renderProjectsGrid();
    });
  });

  projectList?.addEventListener("click", async (e) => {
    const button = e.target.closest("button[data-action]");
    if (!button) return;

    const action = button.dataset.action;
    const id = button.dataset.id;
    const project = projectsCache.get(id);

    if (action === "edit" && project) {
      resetForm();
      if (editingProjectId) editingProjectId.value = project.id;
      if (projectFormTitle) projectFormTitle.textContent = "Edit Project";
      if (saveProjectButton) saveProjectButton.textContent = "Update Project";

      if (projectWorkType) projectWorkType.value = project.work_type || "";
      populateCategoryOptions(projectCategory, project.work_type || "", project.category || "");

      if (projectTitleInput) projectTitleInput.value = project.title || "";
      if (projectYearInput) projectYearInput.value = project.project_year || "";
      if (projectClientInput) projectClientInput.value = project.client_name || "";
      if (projectBehanceInput) projectBehanceInput.value = project.behance_url || "";
      if (projectVideoInput) projectVideoInput.value = project.video_url || "";
      if (projectFullContentInput) projectFullContentInput.value = project.full_description || "";
      if (projectOrderInput) projectOrderInput.value = project.sort_order || 1;
      if (projectDescriptionInput) projectDescriptionInput.value = project.short_description || "";
      if (projectFeaturedInput) projectFeaturedInput.checked = Boolean(project.is_featured);
      if (projectPublishedInput) projectPublishedInput.checked = Boolean(project.is_published);

      if (projectImagePreview && project.cover_image_url) {
        projectImagePreview.innerHTML = `<img src="${project.cover_image_url}" alt="${project.title}" style="max-height:220px; object-fit:contain;">`;
      }

      openPanel(projectFormPanel, projectFormBackdrop, "project-form-open");
    }

    if (action === "delete" && id) {
      if (confirm(`Are you sure you want to delete "${project?.title || 'this project'}"?`)) {
        button.disabled = true;
        try {
          await deleteProjectById(id);
          await loadProjects();
        } catch (err) {
          alert("Failed to delete project.");
          button.disabled = false;
        }
      }
    }
  });

  projectForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = projectTitleInput?.value.trim();
    const workType = projectWorkType?.value;
    const category = projectCategory?.value;

    if (!title || !workType || !category) {
      showMessage(projectFormMessage, "Title, Creative Territory, and Category are required.", "error");
      return;
    }

    saveProjectButton.disabled = true;
    saveProjectButton.textContent = "Saving…";
    showMessage(projectFormMessage, "");

    try {
      let imageUrl = "";
      const existingId = editingProjectId?.value;
      const existingProject = existingId ? projectsCache.get(existingId) : null;

      if (projectImageInput?.files[0]) {
        imageUrl = await uploadProjectImage(projectImageInput.files[0]);
      } else if (existingProject) {
        imageUrl = existingProject.cover_image_url || "";
      }

      const payload = {
        title,
        work_type: workType,
        category,
        project_year: projectYearInput?.value.trim() || null,
        client_name: projectClientInput?.value.trim() || null,
        behance_url: projectBehanceInput?.value.trim() || null,
        video_url: projectVideoInput?.value.trim() || null,
        full_description: projectFullContentInput?.value.trim() || null,
        short_description: projectDescriptionInput?.value.trim() || null,
        sort_order: parseInt(projectOrderInput?.value || "1", 10),
        is_featured: projectFeaturedInput?.checked ?? true,
        is_published: projectPublishedInput?.checked ?? true,
        cover_image_url: imageUrl || null
      };

      if (existingId) {
        const { error } = await window.portfolioDb
          .from("projects")
          .update(payload)
          .eq("id", existingId);
        if (error) throw error;
      } else {
        const { error } = await window.portfolioDb
          .from("projects")
          .insert([payload]);
        if (error) throw error;
      }

      closeForm();
      await loadProjects();
    } catch (err) {
      console.error("Save Project Error:", err);
      showMessage(projectFormMessage, err.message || "Failed to save project.", "error");
    } finally {
      saveProjectButton.disabled = false;
      saveProjectButton.textContent = editingProjectId?.value ? "Update Project" : "Save Project";
    }
  });

  loadProjects();
});
