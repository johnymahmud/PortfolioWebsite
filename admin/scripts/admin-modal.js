/**
 * Admin Panel & Modal Helpers Module
 */

export function openPanel(panelEl, backdropEl, bodyClass = "") {
  if (panelEl) {
    panelEl.classList.add("is-open");
    panelEl.setAttribute("aria-hidden", "false");
  }
  if (backdropEl) {
    backdropEl.hidden = false;
  }
  if (bodyClass) {
    document.body.classList.add(bodyClass);
  }
}

export function closePanel(panelEl, backdropEl, bodyClass = "") {
  if (panelEl) {
    panelEl.classList.remove("is-open");
    panelEl.setAttribute("aria-hidden", "true");
  }
  if (backdropEl) {
    backdropEl.hidden = true;
  }
  if (bodyClass) {
    document.body.classList.remove(bodyClass);
  }
}

export function showMessage(element, message, state = "") {
  if (!element) return;
  element.textContent = message;
  if (state) {
    element.dataset.state = state;
  } else {
    delete element.dataset.state;
  }
}
