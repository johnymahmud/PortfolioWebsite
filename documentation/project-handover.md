# Portfolio Website — Project Handover

## Purpose

This repository contains a lightweight, static portfolio website for a visual artist and advertising art director. It is intentionally framework-free so it can run on GitHub Pages with no build step and no annual hosting cost.

The site is designed to showcase:

- Professional biography and downloadable CV
- Manual and raw artistic work
- Digital and advertising work (ATL, BTL, TTL)
- Client/brand showcase
- Contact and social links

## Current implementation status

The initial one-page website is complete and works as a static HTML site.

- All interface copy is in English.
- The layout is responsive, with a mobile navigation menu.
- The visual direction is an original editorial portfolio treatment inspired by the *high-level* structure of the Alexander Neubauer reference: a desktop vertical sidebar, generous whitespace, monochrome contrast and gallery-first emphasis.
- No third-party images, text, logos, source code or branding were copied from the reference website.
- Placeholder copy, client names, social URLs and portfolio entries still need to be replaced with the artist's real information.

## Technology choices

| Area | Choice | Reason |
| --- | --- | --- |
| Page structure | HTML | Simple, portable and easy to edit |
| Styling | Modular CSS | No dependency or build process required |
| Interactions | Vanilla JavaScript | Only handles the mobile menu and current year |
| Hosting target | GitHub Pages | Free `github.io` address and automatic publishing from Git |

## Folder structure

```text
PortfolioWebsite/
├── assets/                    # Add portfolio images and cv.pdf here
├── documentation/
│   └── project-handover.md    # This document
├── scripts/
│   └── main.js                # Shared JavaScript entry point
├── styles/
│   ├── base.css               # Design tokens, reset and global rules
│   ├── layout.css             # Header, sidebar, sections and page layout
│   ├── components.css         # Reusable blocks: cards, stats, client grid, contact
│   ├── responsive.css         # Narrow-screen and mobile rules
│   └── main.css               # CSS import entry point
├── .gitignore
├── index.html                 # Content and page structure
└── README.md                  # Quick setup and publishing guide
```

## Editing guide

### Change content

Edit `index.html` for all visible text and links.

Search for and replace these placeholders before launch:

- `Your Name` and `NAME`
- `hello@example.com`
- `#` in the LinkedIn, Behance and Instagram links
- `CLIENT 01` through `CLIENT 08`
- Work-section placeholder descriptions

### Add the CV

Place the final PDF at:

```text
assets/cv.pdf
```

The existing **Download CV** button already points to that location.

### Add portfolio work

Create image folders as needed, for example:

```text
assets/images/manual/
assets/images/digital/
```

Use WebP or well-compressed JPEG images. Aim for 1600–2200px on the longest edge. Add descriptive `alt` text to every new image.

When adding a project, use a small case-study structure:

1. Project title
2. Client/brand
3. Category and year
4. Short creative brief or role
5. Selected visual assets

Only publish work that is cleared for portfolio use by the client or agency.

## Style system

The site deliberately uses a restrained editorial visual system:

- Background: white (`--paper`)
- Primary colour: near-black (`--ink`)
- Supporting colour: neutral gray (`--muted`)
- Structure: thin monochrome divider lines
- Typography: Manrope for display/body; DM Mono for labels and metadata
- Desktop: fixed 250px left sidebar
- Mobile: conventional top header with expandable navigation

Global design tokens are located at the top of `styles/base.css`.

## CSS and JavaScript conventions

- Keep global variables and resets in `styles/base.css`.
- Keep page-level structure in `styles/layout.css`.
- Keep reusable UI sections in `styles/components.css`.
- Keep viewport-specific overrides in `styles/responsive.css`.
- Import any substantial new stylesheet from `styles/main.css`.
- Keep JavaScript focused by feature. If a new feature becomes substantial, create a separate file in `scripts/` and reference it from `index.html`.
- Do not introduce a framework or build step unless the site needs features that plain HTML/CSS/JS cannot reasonably support.

## Publishing plan: GitHub Pages

1. Push the `main` branch to the `origin` GitHub repository.
2. In GitHub, open **Settings → Pages**.
3. Set source to **Deploy from a branch**.
4. Select `main` and the repository root (`/`).
5. Save the setting.

The expected free address is:

```text
https://johnymahmud.github.io/PortfolioWebsite/
```

Every later push to `main` will publish the updated static site automatically.

## Git status and history

The following commits were created during the initial implementation:

```text
77a9498 feat: initialize visual artist portfolio
6098b5b feat: switch portfolio copy to English
87b230e style: adopt editorial portfolio art direction
66e7815 refactor: organize frontend into modular folders
```

### Current publishing blocker

The remote repository is configured as:

```text
https://github.com/johnymahmud/PortfolioWebsite.git
```

An attempted push was rejected because this machine does not currently have valid GitHub credentials. Authenticate GitHub through GitHub Desktop, Git Credential Manager, or a Personal Access Token, then push `main`.

## Suggested next work

1. Replace every placeholder with accurate personal information.
2. Add 6–12 strongest examples for each work category.
3. Add the CV PDF and social profile URLs.
4. Replace client placeholders with approved logos or typographic wordmarks.
5. Test all links and the mobile menu.
6. Push to GitHub and enable GitHub Pages.
7. Optionally buy a custom domain later; it is not required for the free `github.io` launch.
