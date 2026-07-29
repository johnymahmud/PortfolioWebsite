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

  const quill = new Quill(containerEl, {
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

  const toolbar = quill.getModule("toolbar");
  if (toolbar) {
    toolbar.addHandler("image", () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/jpeg,image/png,image/webp");
      input.click();

      input.onchange = async () => {
        const file = input.files?.[0];
        if (file) {
          try {
            const range = quill.getSelection(true) || { index: quill.getLength() };
            const publicUrl = await uploadJournalCoverImage(file);
            quill.insertEmbed(range.index, "image", publicUrl);
            quill.setSelection(range.index + 1);
          } catch (err) {
            console.error("Editor Image Upload Error:", err);
            alert("Image upload failed: " + (err.message || err));
          }
        }
      };
    });
  }

  return quill;
}

export function compressImage(file, maxDimension = 1920, quality = 0.85) {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith("image/") || file.size < 300 * 1024) {
      resolve(file);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let width = img.width;
      let height = img.height;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const compressedFile = new File([blob], file.name, {
            type: outputType,
            lastModified: Date.now()
          });
          resolve(compressedFile);
        },
        outputType,
        quality
      );
    };

    img.onerror = () => resolve(file);
    img.src = url;
  });
}

export async function uploadJournalCoverImage(file) {
  if (!file || !window.portfolioDb) return "";

  const compressedFile = await compressImage(file, 1920, 0.85);

  const fileExt = compressedFile.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `journal/${fileName}`;

  const { error: uploadError } = await window.portfolioDb.storage
    .from("portfolio-assets")
    .upload(filePath, compressedFile);

  if (uploadError) {
    console.error("Storage Upload Error:", uploadError);
    throw uploadError;
  }

  const { data } = window.portfolioDb.storage
    .from("portfolio-assets")
    .getPublicUrl(filePath);

  return data.publicUrl;
}


