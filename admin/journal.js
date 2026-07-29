/**
 * Admin Journal Page Entry Point
 */
import { checkAdminSession, handleAdminLogout } from "./scripts/auth.js";
import {
  createSlug,
  formatJournalDate,
  initQuillEditor,
  uploadJournalCoverImage
} from "./scripts/journal-manager.js";

document.addEventListener("DOMContentLoaded", async () => {
  const session = await checkAdminSession(true, false);
  if (!session) return;

  const logoutButton = document.querySelector("#admin-logout-button");
  logoutButton?.addEventListener("click", handleAdminLogout);

  const journalEditor = document.querySelector("#journal-editor");
  const journalEditorBackdrop = document.querySelector("#journal-editor-backdrop");
  const closeJournalEditorButton = document.querySelector("#close-journal-editor");
  const cancelJournalPostButton = document.querySelector("#cancel-journal-post");
  const newJournalPostButton = document.querySelector("#new-journal-post-button");
  const journalForm = document.querySelector("#journal-form");
  const journalPostId = document.querySelector("#journal-post-id");
  const journalTitle = document.querySelector("#journal-title");
  const journalSlug = document.querySelector("#journal-slug");
  const journalCategory = document.querySelector("#journal-category");
  const journalStatusField = document.querySelector("#journal-status-field");
  const journalExcerpt = document.querySelector("#journal-excerpt");
  const journalContent = document.querySelector("#journal-content");
  const journalEditorArea = document.querySelector("#journal-editor-area");
  const journalFeatured = document.querySelector("#journal-featured");
  const journalEditorTitle = document.querySelector("#journal-editor-title");
  const journalStatus = document.querySelector("#journal-status");
  const journalPostList = document.querySelector("#journal-post-list");
  const journalPostCount = document.querySelector("#journal-post-count");
  const journalFilterButtons = document.querySelectorAll(".journal-filter-button");
  const saveJournalPostButton = document.querySelector("#save-journal-post");

  const journalCoverImageInput = document.querySelector("#journal-cover-image");
  const journalCoverImageUrlInput = document.querySelector("#journal-cover-image-url");
  const journalCoverPreview = document.querySelector("#journal-cover-preview");
  const journalCoverPreviewImage = document.querySelector("#journal-cover-preview-image");
  const removeJournalCoverButton = document.querySelector("#remove-journal-cover");

  let journalQuill = initQuillEditor(journalEditorArea);
  let allJournalPosts = [];
  let activeJournalFilter = "all";

  function showJournalStatus(message, type = "info") {
    if (!journalStatus) return;
    journalStatus.hidden = false;
    journalStatus.textContent = message;
    journalStatus.dataset.type = type;
  }

  function hideJournalStatus() {
    if (!journalStatus) return;
    journalStatus.hidden = true;
    journalStatus.textContent = "";
    journalStatus.removeAttribute("data-type");
  }

  function resetJournalForm() {
    if (!journalForm) return;
    journalForm.reset();
    if (journalPostId) journalPostId.value = "";
    if (journalEditorTitle) journalEditorTitle.textContent = "Create New Post";
    if (journalStatusField) journalStatusField.value = "draft";
    if (journalQuill) journalQuill.setContents([]);
    if (journalContent) journalContent.value = "";
    if (journalCoverImageInput) journalCoverImageInput.value = "";
    if (journalCoverImageUrlInput) journalCoverImageUrlInput.value = "";
    if (journalCoverPreviewImage) journalCoverPreviewImage.src = "";
    if (journalCoverPreview) journalCoverPreview.hidden = true;
  }

  function openJournalEditor() {
    if (!journalEditor) return;
    journalEditor.hidden = false;
    journalEditor.setAttribute("aria-hidden", "false");
    document.body.classList.add("journal-editor-open");
    journalTitle?.focus();
  }

  function closeJournalEditor() {
    if (!journalEditor) return;
    journalEditor.hidden = true;
    journalEditor.setAttribute("aria-hidden", "true");
    document.body.classList.remove("journal-editor-open");
    resetJournalForm();
  }

  function startNewJournalPost() {
    resetJournalForm();
    hideJournalStatus();
    openJournalEditor();
  }

  function getVisibleJournalPosts() {
    if (activeJournalFilter === "draft") return allJournalPosts.filter((post) => post.status === "draft");
    if (activeJournalFilter === "published") return allJournalPosts.filter((post) => post.status === "published");
    if (activeJournalFilter === "featured") return allJournalPosts.filter((post) => post.is_featured);
    return allJournalPosts;
  }

  function createJournalPostCard(post) {
    const article = document.createElement("article");
    article.className = "journal-admin-card";

    const main = document.createElement("div");
    main.className = "journal-admin-card-main";

    const meta = document.createElement("p");
    meta.className = "journal-admin-card-meta";
    meta.textContent = `${post.category || 'General'} · ${post.status || 'draft'} · ${formatJournalDate(post.published_at || post.created_at)}`;

    const title = document.createElement("h3");
    title.textContent = post.title || "Untitled Post";

    const excerpt = document.createElement("p");
    excerpt.className = "journal-admin-card-excerpt";
    excerpt.textContent = post.excerpt || "No excerpt added.";

    main.append(meta, title, excerpt);

    const actions = document.createElement("div");
    actions.className = "journal-admin-card-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "admin-secondary-button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => editJournalPost(post));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "admin-danger-button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteJournalPost(post));

    actions.append(editButton, deleteButton);
    article.append(main, actions);
    return article;
  }

  async function fetchJournalPosts() {
    if (!window.portfolioDb) return;
    showJournalStatus("Loading journal posts…", "info");

    const { data, error } = await window.portfolioDb
      .from("journal_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Could not fetch journal posts:", error);
      showJournalStatus("Failed to load journal posts. Check database permissions.", "error");
      return;
    }

    allJournalPosts = data || [];
    hideJournalStatus();
    renderJournalPosts();
  }

  function renderJournalPosts() {
    if (!journalPostList || !journalPostCount) return;
    journalPostList.innerHTML = "";

    const visiblePosts = getVisibleJournalPosts();
    journalPostCount.textContent = `${visiblePosts.length} ${visiblePosts.length === 1 ? "post" : "posts"}`;

    if (visiblePosts.length === 0) {
      const empty = document.createElement("p");
      empty.className = "admin-empty-message";
      empty.textContent = "No journal posts found.";
      journalPostList.appendChild(empty);
      return;
    }

    visiblePosts.forEach((post) => {
      journalPostList.appendChild(createJournalPostCard(post));
    });
  }

  function editJournalPost(post) {
    resetJournalForm();
    if (journalPostId) journalPostId.value = post.id;
    if (journalTitle) journalTitle.value = post.title || "";
    if (journalSlug) journalSlug.value = post.slug || "";
    if (journalCategory) journalCategory.value = post.category || "";
    if (journalStatusField) journalStatusField.value = post.status || "draft";
    if (journalExcerpt) journalExcerpt.value = post.excerpt || "";
    if (journalContent) journalContent.value = post.content || "";
    if (journalFeatured) journalFeatured.checked = Boolean(post.is_featured);
    if (journalEditorTitle) journalEditorTitle.textContent = "Edit Journal Post";

    if (post.cover_image) {
      if (journalCoverImageUrlInput) journalCoverImageUrlInput.value = post.cover_image;
      if (journalCoverPreviewImage) journalCoverPreviewImage.src = post.cover_image;
      if (journalCoverPreview) journalCoverPreview.hidden = false;
    }

    if (journalQuill && post.content) {
      journalQuill.root.innerHTML = post.content;
    }

    openJournalEditor();
  }

  async function deleteJournalPost(post) {
    if (!confirm(`Are you sure you want to delete "${post.title}"?`)) return;
    showJournalStatus("Deleting post…", "info");

    const { error } = await window.portfolioDb
      .from("journal_posts")
      .delete()
      .eq("id", post.id);

    if (error) {
      console.error("Failed to delete post:", error);
      showJournalStatus("Could not delete journal post: " + error.message, "error");
      alert("Delete Error: " + (error.message || "Permission denied"));
      return;
    }

    fetchJournalPosts();
  }

  journalCoverImageInput?.addEventListener("change", () => {
    const file = journalCoverImageInput.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      if (journalCoverPreviewImage) journalCoverPreviewImage.src = objectUrl;
      if (journalCoverPreview) journalCoverPreview.hidden = false;
    }
  });

  removeJournalCoverButton?.addEventListener("click", () => {
    if (journalCoverImageInput) journalCoverImageInput.value = "";
    if (journalCoverImageUrlInput) journalCoverImageUrlInput.value = "";
    if (journalCoverPreviewImage) journalCoverPreviewImage.src = "";
    if (journalCoverPreview) journalCoverPreview.hidden = true;
  });

  journalForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = journalTitle?.value.trim();
    const slug = journalSlug?.value.trim();
    const category = journalCategory?.value;
    const status = journalStatusField?.value;
    const htmlContent = journalQuill ? journalQuill.root.innerHTML : "";

    if (!title || !slug || !category || !status) {
      alert("Please fill in all required fields.");
      return;
    }

    if (saveJournalPostButton) saveJournalPostButton.disabled = true;

    try {
      let coverImageUrl = journalCoverImageUrlInput?.value || null;
      const coverFile = journalCoverImageInput?.files?.[0];
      if (coverFile) {
        showJournalStatus("Uploading cover image...", "info");
        coverImageUrl = await uploadJournalCoverImage(coverFile);
      }

      const payload = {
        title,
        slug,
        category,
        status,
        excerpt: journalExcerpt?.value.trim() || null,
        content: htmlContent,
        cover_image: coverImageUrl,
        is_featured: journalFeatured?.checked ?? false,
        published_at: status === "published" ? new Date().toISOString() : null
      };

      const postId = journalPostId?.value;
      if (postId) {
        const { error } = await window.portfolioDb
          .from("journal_posts")
          .update(payload)
          .eq("id", postId);
        if (error) throw error;
      } else {
        const { error } = await window.portfolioDb
          .from("journal_posts")
          .insert([payload]);
        if (error) throw error;
      }

      closeJournalEditor();
      fetchJournalPosts();
    } catch (err) {
      console.error("Save Journal Post Error:", err);
      const errMsg = err.message || "Failed to save journal post.";
      if (errMsg.includes("permission denied") || errMsg.includes("journal_posts")) {
        alert("Database Permission Error: " + errMsg + "\n\nPlease run the SQL script in Supabase SQL Editor to grant table access.");
      } else {
        alert(errMsg);
      }
    } finally {
      if (saveJournalPostButton) saveJournalPostButton.disabled = false;
    }
  });

  newJournalPostButton?.addEventListener("click", startNewJournalPost);
  closeJournalEditorButton?.addEventListener("click", closeJournalEditor);
  journalEditorBackdrop?.addEventListener("click", closeJournalEditor);
  cancelJournalPostButton?.addEventListener("click", closeJournalEditor);

  journalTitle?.addEventListener("input", () => {
    if (!journalSlug || journalPostId?.value) return;
    journalSlug.value = createSlug(journalTitle.value);
  });

  journalFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeJournalFilter = button.dataset.status || "all";
      journalFilterButtons.forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });
      renderJournalPosts();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && journalEditor && !journalEditor.hidden) {
      closeJournalEditor();
    }
  });

  fetchJournalPosts();
});

