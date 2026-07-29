/**
 * Public Journal Loader & Modal Manager
 */

export async function initPublicJournal() {
  const journalGrid = document.querySelector("#journal-grid");
  if (!journalGrid) return; // Not on journal page

  const filterButtons = document.querySelectorAll(".journal-cat-btn");
  const articleModal = document.querySelector("#journal-article-modal");
  const articleModalBackdrop = document.querySelector("#journal-modal-backdrop");
  const articleModalClose = document.querySelector("#journal-modal-close");

  const modalMeta = document.querySelector("#modal-post-meta");
  const modalTitle = document.querySelector("#modal-post-title");
  const modalCover = document.querySelector("#modal-post-cover");
  const modalBody = document.querySelector("#modal-post-body");

  let allPosts = [];
  let activeCategory = "all";

  function formatDate(isoStr) {
    if (!isoStr) return "";
    const date = new Date(isoStr);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(date);
  }

  function openArticleModal(post) {
    if (!articleModal) return;
    if (modalMeta) modalMeta.textContent = `${post.category || 'General'} · ${formatDate(post.published_at || post.created_at)}`;
    if (modalTitle) modalTitle.textContent = post.title || "Untitled";

    const hasCover = post.cover_image && typeof post.cover_image === "string" && post.cover_image.trim().length > 0;
    if (hasCover && modalCover) {
      modalCover.src = post.cover_image;
      modalCover.hidden = false;
      modalCover.onerror = () => { modalCover.hidden = true; };
    } else if (modalCover) {
      modalCover.hidden = true;
      modalCover.src = "";
    }

    if (modalBody) {
      modalBody.innerHTML = post.content || "<p>No content available.</p>";
    }

    articleModal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeArticleModal() {
    if (!articleModal) return;
    articleModal.hidden = true;
    document.body.style.overflow = "";
  }

  articleModalBackdrop?.addEventListener("click", closeArticleModal);
  articleModalClose?.addEventListener("click", closeArticleModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && articleModal && !articleModal.hidden) {
      closeArticleModal();
    }
  });

  function renderPosts() {
    journalGrid.innerHTML = "";

    const visiblePosts = activeCategory === "all"
      ? allPosts
      : allPosts.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase());

    if (visiblePosts.length === 0) {
      journalGrid.innerHTML = `
        <div class="journal-empty" style="grid-column: 1 / -1;">
          <p>No published journal posts found in this category.</p>
        </div>
      `;
      return;
    }

    visiblePosts.forEach((post) => {
      const card = document.createElement("article");
      card.className = "journal-card";

      const hasCover = post.cover_image && typeof post.cover_image === "string" && post.cover_image.trim().length > 0;
      const coverHtml = hasCover
        ? `<img class="journal-card-cover" src="${post.cover_image}" alt="${post.title}" loading="lazy" onError="this.style.display='none'" />`
        : "";

      card.innerHTML = `
        ${coverHtml}
        <div class="journal-card-body">
          <div class="journal-card-meta">
            <span class="journal-card-badge">${post.category || 'Journal'}</span>
            <span>${formatDate(post.published_at || post.created_at)}</span>
          </div>
          <h3 class="journal-card-title">${post.title || 'Untitled'}</h3>
          <p class="journal-card-excerpt">${post.excerpt || 'Read this entry...'}</p>
          <span class="journal-card-link">Read Article ↗</span>
        </div>
      `;

      card.addEventListener("click", () => openArticleModal(post));
      journalGrid.appendChild(card);
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      activeCategory = btn.dataset.category || "all";
      renderPosts();
    });
  });

  // Fetch posts from Supabase
  if (!window.portfolioDb) return;

  try {
    const { data, error } = await window.portfolioDb
      .from("journal_posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Error fetching public journal posts:", error);
      journalGrid.innerHTML = `<p class="journal-empty" style="grid-column: 1 / -1;">Could not load journal posts.</p>`;
      return;
    }

    allPosts = data || [];
    renderPosts();
  } catch (err) {
    console.error("Public Journal Error:", err);
  }
}
