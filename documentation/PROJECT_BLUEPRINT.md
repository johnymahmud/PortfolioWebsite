# 🎯 Project Blueprint — Vision & Scope Specification

**Project Title:** Shah Mahmud Portfolio Website  
**Owner:** Shah Mahmud (Multidisciplinary Visual Artist, Art Director & Creative Strategist)  
**Repository:** `PortfolioWebsite`  

---

## 🎨 1. Vision & Objective

The primary objective of this project is to build an international-grade, visually stunning, high-performance portfolio and art journal website for **Shah Mahmud**. The site showcases a diverse body of creative work spanning Fine Arts, Commercial Campaigns, Above The Line (ATL) advertising, Photography, and Literature.

---

## 👥 2. Target Audience & Stakeholders

- **Art Collectors & Galleries:** Looking for fine arts, watercolors, sketches, and experimental art.
- **Advertising Agencies & Clients:** Seeking an experienced Art Director for ATL/BTL campaigns, brand identity, and commercial projects.
- **Readers & Art Enthusiasts:** Interested in reading art criticism, folk art essays, and creative journals.

---

## 🌟 3. Key Core Modules

1. **Territory Portfolio Showcase (`/`, `/atl`, `/fine-arts`, `/passion-works`, `/professional-works`):**
   - Dynamic category filtering across creative territories.
   - High-resolution image gallery grid with interactive modal previews.
   - Integration with Behance and Video links.

2. **Art & Design Journal (`/journal`):**
   - Rich-text blogging engine reading from Supabase `journal_posts`.
   - Rich typography optimized for Bengali (`Noto Serif Bengali`, `Noto Sans Bengali`) and English (`Playfair Display`, `Manrope`).

3. **Admin Content Management System (`/admin`):**
   - Secure login via Supabase Authentication.
   - Full CRUD operations for portfolio projects and journal essays.
   - Direct file uploads to Supabase Storage.
   - Integrated WYSIWYG editor (`react-quill-new`).

---

## 💎 4. Aesthetic & Experience Guidelines

- **Theme:** Sleek, modern dark mode (`#09090b` background) with high-contrast typography and subtle borders.
- **User Experience (UX):** Single-page application feel with instant route transitions and zero page reloads.
- **Responsiveness:** Fluid grid scaling from mobile displays to ultra-wide desktop monitors.
