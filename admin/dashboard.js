const dashboard = document.querySelector("#admin-dashboard");
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

const projectsCache = new Map();

const categoryOptions = {
  Professional: ["Press Ad", "Campaign", "Logo", "Event", "Digital"],

  "Fine Arts": ["Watercolor", "Sketch", "Drawing"],

  "Passion Works": ["Photography", "Performing Arts", "Literature"],
};

function showProjectFormMessage(message, state = "") {
  projectFormMessage.textContent = message;

  if (state) {
    projectFormMessage.dataset.state = state;
  } else {
    delete projectFormMessage.dataset.state;
  }
}

function openProjectPanel() {
  projectFormPanel.classList.add("is-open");
  projectFormPanel.setAttribute("aria-hidden", "false");
  projectFormBackdrop.hidden = false;
  document.body.classList.add("project-form-open");
}

function resetProjectForm() {
  projectForm.reset();
  projectWorkType.value = "";

  editingProjectId.value = "";
  projectFormTitle.textContent = "Add New Project";
  saveProjectButton.textContent = "Save Project";

  projectWorkType.value = "";
  projectCategory.disabled = true;
  projectCategory.innerHTML =
    '<option value="">Select creative territory first</option>';

  projectImagePreview.innerHTML = "<span>Image preview</span>";

  projectFeaturedInput.checked = true;
  projectPublishedInput.checked = true;
  projectOrderInput.value = "1";

  showProjectFormMessage("");
}

function openNewProjectForm() {
  resetProjectForm();
  openProjectPanel();
}

function closeProjectForm() {
  projectFormPanel.classList.remove("is-open");
  projectFormPanel.setAttribute("aria-hidden", "true");
  projectFormBackdrop.hidden = true;

  document.body.classList.remove("project-form-open");

  resetProjectForm();
}

function populateCategoryOptions(selectedWorkType, selectedCategory = "") {
  const options = categoryOptions[selectedWorkType] || [];

  projectCategory.innerHTML = "";

  if (options.length === 0) {
    projectCategory.disabled = true;
    projectCategory.innerHTML =
      '<option value="">Select creative territory first</option>';
    return;
  }

  projectCategory.disabled = false;

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select category";
  projectCategory.appendChild(placeholder);

  options.forEach((optionValue) => {
    const option = document.createElement("option");

    option.value = optionValue;
    option.textContent = optionValue;
    option.selected = optionValue === selectedCategory;

    projectCategory.appendChild(option);
  });
}

function updateCategoryOptions() {
  populateCategoryOptions(projectWorkType.value);
}

function findMainCategory(savedCategory) {
  for (const [mainCategory, subcategories] of Object.entries(
    subcategoryOptions,
  )) {
    if (subcategories.includes(savedCategory)) {
      return mainCategory;
    }
  }

  return "";
}

function previewProjectImage() {
  const file = projectImageInput.files[0];

  if (!file) {
    return;
  }

  projectImagePreview.innerHTML = "";

  const image = document.createElement("img");

  image.src = URL.createObjectURL(file);
  image.alt = "Selected project preview";

  projectImagePreview.appendChild(image);
}

function showExistingImage(imageUrl, title) {
  projectImagePreview.innerHTML = "";

  if (!imageUrl) {
    projectImagePreview.innerHTML = "<span>No current image</span>";
    return;
  }

  const image = document.createElement("img");

  image.src = imageUrl;
  image.alt = title || "Current project image";

  projectImagePreview.appendChild(image);
}

function createSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function createUniqueFileName(file) {
  const extension = file.name.split(".").pop().toLowerCase();

  return `professional/${Date.now()}-${crypto.randomUUID()}.${extension}`;
}

function getStoragePathFromPublicUrl(publicUrl) {
  if (!publicUrl) {
    return null;
  }

  const marker = "/storage/v1/object/public/portfolio-images/";
  const markerIndex = publicUrl.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  return decodeURIComponent(publicUrl.substring(markerIndex + marker.length));
}

function createDashboardProject(project) {
  const item = document.createElement("article");
  item.className = "dashboard-project-item";

  const imageWrapper = document.createElement("div");
  imageWrapper.className = "dashboard-project-image";

  if (project.cover_image_url) {
    const image = document.createElement("img");

    image.src = project.cover_image_url;
    image.alt = project.title || "Portfolio project";
    image.loading = "lazy";

    imageWrapper.appendChild(image);
  } else {
    imageWrapper.textContent = "No image";
  }

  const content = document.createElement("div");
  content.className = "dashboard-project-content";

  const category = document.createElement("p");
  category.className = "dashboard-project-category";
  category.textContent =
    [project.work_type, project.category].filter(Boolean).join(" · ") ||
    "Uncategorized";

  const title = document.createElement("h3");
  title.textContent = project.title || "Untitled Project";

  const details = document.createElement("p");
  details.className = "dashboard-project-details";
  details.textContent = [
    project.is_published ? "Published" : "Draft",
    project.is_featured ? "Featured" : "Not featured",
    `Order ${project.sort_order ?? 0}`,
  ].join(" · ");

  content.append(category, title, details);

  const actions = document.createElement("div");
  actions.className = "dashboard-project-actions";

  const editButton = document.createElement("button");

  editButton.type = "button";
  editButton.textContent = "Edit";
  editButton.dataset.projectId = project.id;

  editButton.addEventListener("click", () => {
    openEditProjectForm(project.id);
  });

  const deleteButton = document.createElement("button");

  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.className = "delete-project-button";
  deleteButton.dataset.projectId = project.id;

  deleteButton.addEventListener("click", () => {
    deleteProject(project.id);
  });
  actions.append(editButton, deleteButton);
  item.append(imageWrapper, content, actions);

  return item;
}

async function loadDashboardProjects() {
  dashboardStatus.hidden = false;
  dashboardStatus.textContent = "Loading projects…";

  const { data, error } = await window.portfolioDb
    .from("projects")
    .select(
      `
      id,
      title,
      slug,
      work_type,
      category,
      client_name,
      project_year,
      short_description,
      full_description,
      cover_image_url,
      behance_url,
      video_url,
      is_featured,
      is_published,
      sort_order
    `,
    )
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Could not load dashboard projects:", error);

    dashboardStatus.textContent =
      "Projects could not be loaded. Check database permissions.";

    return;
  }

  projectList.innerHTML = "";
  projectsCache.clear();

  if (!data || data.length === 0) {
    dashboardStatus.textContent = "No projects found. Add your first project.";

    return;
  }

  data.forEach((project) => {
    projectsCache.set(project.id, project);

    projectList.appendChild(createDashboardProject(project));
  });

  dashboardStatus.hidden = true;
}

function openEditProjectForm(projectId) {
  const project = projectsCache.get(projectId);

  if (!project) {
    alert("Project information could not be found.");
    return;
  }

  resetProjectForm();

  editingProjectId.value = project.id;
  projectFormTitle.textContent = "Edit Project";
  saveProjectButton.textContent = "Update Project";

  projectTitleInput.value = project.title || "";
  projectYearInput.value = project.project_year || "";
  projectClientInput.value = project.client_name || "";
  projectBehanceInput.value = project.behance_url || "";
  projectVideoInput.value = project.video_url || "";

  projectFullContentInput.value = project.full_description || "";
  projectOrderInput.value = project.sort_order ?? 1;
  projectDescriptionInput.value = project.short_description || "";

  projectFeaturedInput.checked = Boolean(project.is_featured);
  projectPublishedInput.checked = Boolean(project.is_published);

  const mainCategory = project.work_type || findMainCategory(project.category);

  projectWorkType.value = project.work_type || "";

  populateCategoryOptions(project.work_type || "", project.category || "");

  showExistingImage(project.cover_image_url, project.title);

  openProjectPanel();
}

async function uploadCoverImage(file) {
  const filePath = createUniqueFileName(file);

  const { error: uploadError } = await window.portfolioDb.storage
    .from("portfolio-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = window.portfolioDb.storage
    .from("portfolio-images")
    .getPublicUrl(filePath);

  return {
    publicUrl: data.publicUrl,
    filePath,
  };
}

function buildProjectData(formData, imageUrl) {
  const title = String(formData.get("title") || "").trim();

  const selectedMainCategory = String(formData.get("category") || "").trim();

  const selectedSubcategory = String(formData.get("subcategory") || "").trim();
  const selectedWorkType = String(formData.get("workType") || "").trim();

  const selectedCategory = String(formData.get("category") || "").trim();

  return {
    title,

    work_type: selectedWorkType || null,

    slug: `${createSlug(title)}-${Date.now()}`,

    category: selectedCategory || null,

    client_name: String(formData.get("clientName") || "").trim() || null,

    project_year: Number(formData.get("projectYear")) || null,

    short_description:
      String(formData.get("shortDescription") || "").trim() || null,

    cover_image_url: imageUrl,

    behance_url: String(formData.get("behanceUrl") || "").trim() || null,

    video_url: String(formData.get("videoUrl") || "").trim() || null,

    full_description:
      String(formData.get("fullDescription") || "").trim() || null,

    is_featured: formData.get("isFeatured") === "on",

    is_published: formData.get("isPublished") === "on",

    sort_order: Number(formData.get("sortOrder")) || 1,

    updated_at: new Date().toISOString(),
  };
}

async function createNewProject(formData, imageFile) {
  if (!imageFile) {
    throw new Error("Select a cover image.");
  }

  showProjectFormMessage("Uploading image…");

  const uploadResult = await uploadCoverImage(imageFile);

  try {
    showProjectFormMessage("Saving project information…");

    const projectData = buildProjectData(formData, uploadResult.publicUrl);

    const { error } = await window.portfolioDb
      .from("projects")
      .insert(projectData);

    if (error) {
      throw error;
    }
  } catch (error) {
    await window.portfolioDb.storage
      .from("portfolio-images")
      .remove([uploadResult.filePath]);

    throw error;
  }
}

async function updateExistingProject(projectId, formData, newImageFile) {
  const existingProject = projectsCache.get(projectId);

  if (!existingProject) {
    throw new Error("Existing project could not be found.");
  }

  let newUploadResult = null;

  if (newImageFile) {
    showProjectFormMessage("Uploading replacement image…");

    newUploadResult = await uploadCoverImage(newImageFile);
  }

  const imageUrl = newUploadResult
    ? newUploadResult.publicUrl
    : existingProject.cover_image_url;

  try {
    showProjectFormMessage("Updating project information…");

    const projectData = buildProjectData(formData, imageUrl);

    const { error } = await window.portfolioDb
      .from("projects")
      .update(projectData)
      .eq("id", projectId);

    if (error) {
      throw error;
    }

    if (newUploadResult && existingProject.cover_image_url) {
      const oldFilePath = getStoragePathFromPublicUrl(
        existingProject.cover_image_url,
      );

      if (oldFilePath) {
        const { error: deleteOldImageError } = await window.portfolioDb.storage
          .from("portfolio-images")
          .remove([oldFilePath]);

        if (deleteOldImageError) {
          console.warn(
            "Project updated, but old image was not removed:",
            deleteOldImageError,
          );
        }
      }
    }
  } catch (error) {
    if (newUploadResult) {
      await window.portfolioDb.storage
        .from("portfolio-images")
        .remove([newUploadResult.filePath]);
    }

    throw error;
  }
}

async function deleteProject(projectId) {
  const project = projectsCache.get(projectId);

  if (!project) {
    alert("Project information could not be found.");
    return;
  }

  const confirmed = window.confirm(
    `Are you sure you want to delete "${project.title}"?\n\n` +
      "This action is permanent. The project and its cover image will be deleted.",
  );

  if (confirmed !== true) {
    return;
  }

  const deleteButton = document.querySelector(
    `.delete-project-button[data-project-id="${projectId}"]`,
  );

  if (deleteButton) {
    deleteButton.disabled = true;
    deleteButton.textContent = "Deleting…";
  }

  try {
    const { error: deleteError } = await window.portfolioDb
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (deleteError) {
      throw deleteError;
    }

    if (project.cover_image_url) {
      const filePath = getStoragePathFromPublicUrl(project.cover_image_url);

      if (filePath) {
        const { error: storageError } = await window.portfolioDb.storage
          .from("portfolio-images")
          .remove([filePath]);

        if (storageError) {
          console.warn(
            "Project deleted, but its image could not be removed:",
            storageError,
          );
        }
      }
    }

    projectsCache.delete(projectId);
    await loadDashboardProjects();
  } catch (error) {
    console.error("Project deletion failed:", error);

    alert(
      error.message || "The project could not be deleted. Please try again.",
    );

    if (deleteButton) {
      deleteButton.disabled = false;
      deleteButton.textContent = "Delete";
    }
  }
}

async function saveProject(event) {
  event.preventDefault();

  const formData = new FormData(projectForm);
  const imageFile = projectImageInput.files[0];
  const projectId = editingProjectId.value;

  if (imageFile && imageFile.size > 5 * 1024 * 1024) {
    showProjectFormMessage("The image must be smaller than 5 MB.", "error");

    return;
  }

  saveProjectButton.disabled = true;

  saveProjectButton.textContent = projectId ? "Updating…" : "Saving…";

  showProjectFormMessage("");

  try {
    if (projectId) {
      await updateExistingProject(projectId, formData, imageFile);

      showProjectFormMessage("Project updated successfully.", "success");
    } else {
      await createNewProject(formData, imageFile);

      showProjectFormMessage("Project saved successfully.", "success");
    }

    await loadDashboardProjects();

    setTimeout(() => {
      closeProjectForm();
    }, 700);
  } catch (error) {
    console.error("Project save failed:", error);

    showProjectFormMessage(
      error.message || "Project could not be saved.",
      "error",
    );
  } finally {
    saveProjectButton.disabled = false;

    saveProjectButton.textContent = projectId
      ? "Update Project"
      : "Save Project";
  }
}

async function protectDashboard() {
  const {
    data: { session },
    error,
  } = await window.portfolioDb.auth.getSession();

  if (error || !session) {
    window.location.replace("./index.html");
    return;
  }

  userEmail.textContent = session.user.email || "Authenticated admin";

  dashboard.hidden = false;

  await loadDashboardProjects();
}

async function logoutAdmin() {
  logoutButton.disabled = true;
  logoutButton.textContent = "Logging out…";

  await window.portfolioDb.auth.signOut();

  window.location.replace("./index.html");
}

logoutButton.addEventListener("click", logoutAdmin);
newProjectButton.addEventListener("click", openNewProjectForm);

closeProjectFormButton.addEventListener("click", closeProjectForm);

cancelProjectFormButton.addEventListener("click", closeProjectForm);

projectFormBackdrop.addEventListener("click", closeProjectForm);

projectWorkType.addEventListener("change", updateCategoryOptions);

projectImageInput.addEventListener("change", previewProjectImage);

projectForm.addEventListener("submit", saveProject);

protectDashboard();
