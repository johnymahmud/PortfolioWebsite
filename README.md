# Visual Artist Portfolio

A lightweight, zero-build static portfolio designed for GitHub Pages. Edit `index.html` to replace the placeholder name, email, social links, client names, and work sections. Add web-optimized images to `assets/images/` and a CV PDF at `assets/cv.pdf`.

## Project structure

```text
assets/       # Images, CV, and future media
scripts/      # JavaScript organised by feature
styles/       # CSS organised by responsibility
  base.css        # Design tokens and global reset
  layout.css      # Navigation and page structure
  components.css  # Reusable content sections
  responsive.css  # Narrow-screen rules
  main.css        # Single stylesheet entry point
index.html    # Page structure and content
```

When adding a new feature, keep its styles in the closest existing stylesheet. Create a focused new file only when the feature is substantial, then import it from `styles/main.css`.

## Publish free with GitHub Pages

1. Push this repository to GitHub.
2. Open the repository **Settings → Pages**.
3. Select **Deploy from a branch**, then choose `main` and `/ (root)`.
4. Save. GitHub will provide the live URL: `https://johnymahmud.github.io/PortfolioWebsite/`.

No build command is required. Any update pushed to `main` is published automatically.

## Before publishing

- Replace every `নাম এখানে লিখুন` and `hello@example.com`.
- Add your social profile URLs.
- Replace client placeholders with approved brand logos/names.
- Export portfolio images as WebP or JPEG (roughly 1600–2200 px on the long edge), and use descriptive alt text.
