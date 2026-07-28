/**
 * Admin Project Management Module
 * Handles loading projects, form state, Supabase storage image upload, and project CRUD.
 */

export const categoryOptions = {
  Professional: ["Press Ad", "Campaign", "Logo", "Event", "Digital"],
  "Fine Arts": ["Watercolor", "Sketch", "Drawing"],
  "Passion Works": ["Photography", "Performing Arts", "Literature"]
};

export function populateCategoryOptions(selectElement, selectedWorkType, selectedCategory = "") {
  if (!selectElement) return;

  const categories = categoryOptions[selectedWorkType] || [];
  if (!selectedWorkType || categories.length === 0) {
    selectElement.disabled = true;
    selectElement.innerHTML = '<option value="">Select creative territory first</option>';
    return;
  }

  selectElement.disabled = false;
  selectElement.innerHTML = [
    '<option value="">Select category</option>',
    ...categories.map(
      (cat) => `<option value="${cat}" ${cat === selectedCategory ? "selected" : ""}>${cat}</option>`
    )
  ].join("");
}

export async function uploadProjectImage(file) {
  if (!file || !window.portfolioDb) return "";

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `projects/${fileName}`;

  const { error: uploadError } = await window.portfolioDb.storage
    .from("portfolio-assets")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Storage Upload Error:", uploadError);
    throw uploadError;
  }

  const { data } = window.portfolioDb.storage
    .from("portfolio-assets")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function fetchAllProjects() {
  if (!window.portfolioDb) return [];
  const { data, error } = await window.portfolioDb
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Fetch Projects Error:", error);
    throw error;
  }

  return data || [];
}

export async function deleteProjectById(id) {
  if (!window.portfolioDb) return;
  const { error } = await window.portfolioDb
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete Project Error:", error);
    throw error;
  }
}
