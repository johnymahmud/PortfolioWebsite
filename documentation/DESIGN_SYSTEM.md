# 🎨 Design System & Visual Tokens Specification

**Theme:** Modern Dark Aesthetic  
**Styles Directory:** `f:\Vibecoding\Portfolio\PortfolioWebsite\styles`  

---

## 🎨 1. Color Palette & Tokens

The design uses a refined, high-contrast dark theme with subtle borders and smooth glassmorphism.

```css
:root {
  color-scheme: dark;
  --background: #09090b;       /* Deep dark background */
  --surface: #121215;          /* Card & container surface */
  --surface-hover: #1c1c21;    /* Hover interaction state */
  --text: #f4f4f5;             /* Primary high-contrast text */
  --muted: #a1a1aa;            /* Muted secondary text */
  --border: rgba(255, 255, 255, 0.12); /* Subtle glass border */
  --border-focus: #ffffff;     /* High-contrast focus state */
  --accent: #3b82f6;           /* Primary interactive accent */
  --error: #f87171;            /* Error / Alert state */
  --success: #4ade80;          /* Success state */
}
```

---

## 🔤 2. Typography & Google Fonts

The project integrates curated Google Fonts loaded dynamically in `app/layout.js`:

| Font Family | Usage Area | Fallback |
| :--- | :--- | :--- |
| **`Playfair Display`** | Display Headlines & Elegant Art Titles | `serif` |
| **`Manrope`** | Primary UI Body Text & Subtitles | `sans-serif` |
| **`DM Mono`** | Metadata, Tags, Year, Technical Badges | `monospace` |
| **`Noto Serif Bengali`** | Bengali Art Essays & Journal Headlines | `serif` |
| **`Noto Sans Bengali`** | Bengali UI Text & Subtitles | `sans-serif` |

---

## 📱 3. Responsive Layout & Spacing Tokens

- **Max Container Width:** `1400px` centered with dynamic padding.
- **Grid Layout:** CSS Grid with auto-fill / auto-fit for responsive gallery items.
- **Micro-animations:** 180ms cubic-bezier transition (`cubic-bezier(0.16, 1, 0.3, 1)`) for hover states and modal popups.

---

## 📁 4. CSS File Structure

- **`styles/base.css`:** Reset rules, CSS variables, global HTML/body styling.
- **`styles/layout.css`:** Navigation bar, site shell wrapper, footer layout.
- **`styles/components.css`:** Reusable UI components, modal overlays, buttons.
- **`styles/responsive.css`:** Mobile, tablet, and widescreen breakpoints.
- **`styles/homepage.css`:** Hero section and interactive gallery styles.
- **`styles/work.css`:** Work filter tabs and project card styles.
- **`styles/journal-public.css`:** Art journal typography and reading layout.
- **`styles/admin/`:** Admin dashboard, auth login form, and WYSIWYG modal styles.
