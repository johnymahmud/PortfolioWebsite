/**
 * Admin Journal Manager Module
 * Handles Quill rich text editor, slug generation, post filtering, rendering, and CRUD operations.
 */

export function createSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .normalize("NFC")
    .replace(/['’]/g, "")
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatJournalDate(value) {
  if (!value) return "Not published";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

export function initQuillEditor(containerEl) {
  if (!containerEl || typeof Quill === "undefined") {
    console.error("Quill editor could not be initialized.");
    return null;
  }

  return new Quill(containerEl, {
    theme: "snow",
    placeholder: "Write your article, essay, poem or story here…",
    modules: {
      toolbar: [
        [{ font: [] }, { header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "super" }, { script: "sub" }],
        [{ header: 1 }, { header: 2 }, "blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["link", "image", "video"],
        ["clean"]
      ]
    }
  });
}
