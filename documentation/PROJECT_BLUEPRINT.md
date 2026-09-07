# 🎯 Project Blueprint — Vision & Scope Specification

**Project Title:** Shah Mahmud Portfolio Website & Creative Platform  
**Owner:** Shah Mahmud (Multidisciplinary Visual Artist, Art Director & Creative Strategist)  
**Repository:** `PortfolioWebsite`  
**Current Active Branch:** `feat/modular-cms-architecture-v3`  

---

## 🎨 1. Vision & Objective

The primary objective of this project is to build an international-grade, visually stunning, high-performance portfolio and art journal website for **Shah Mahmud**. The site showcases a diverse body of creative work spanning Fine Arts, Commercial Campaigns, Above The Line (ATL) advertising, Photography, and Literature, accompanied by an interactive visitor engagement pipeline and real-time administrative studio.

---

## 👥 2. Target Audience & Stakeholders

- **Art Collectors & Galleries:** Looking for fine arts, watercolors, sketches, and experimental art.
- **Advertising Agencies & Clients:** Seeking an experienced Art Director for ATL/BTL campaigns, brand identity, and commercial projects.
- **Readers & Art Enthusiasts:** Interested in reading art criticism, folk art essays, and creative journals.
- **Engaged Visitors & Peers:** Participating via constructive comments, appreciations (likes), and social sharing.

---

## 🌟 3. Key Core Modules

1. **Territory Portfolio Showcase (`/`, `/work`, `/atl`, `/fine-arts`, `/passion-works`, `/professional-works`):**
   - Dynamic category filtering across creative territories.
   - High-resolution image gallery grid with interactive modal previews.
   - Integration with Behance, YouTube video embeds, and client briefs.
   - Fully isolated public navigation with zero admin clutter.

2. **Art & Design Journal (`/journal`):**
   - Rich-text blogging engine reading from Supabase `journal_posts`.
   - Rich typography optimized for Bengali (`Noto Serif Bengali`, `Noto Sans Bengali`) and English (`Playfair Display`, `Manrope`).
   - Integrated full-screen article reader modal with scroll progress and sharing.

3. **Visitor Engagement Engine (Likes, Comments & Shares):**
   - **Reactions (Likes):** 1-click animated Heart counter with `localStorage` persistent state and privacy-safe HMAC-SHA-256 IP/User-Agent rate-limiting.
   - **Guest Comments:** Frictionless guest submission (Name, optional Email, Message) backed by a 4-layer defense pipeline.
   - **Social Share Tracking:** Quick sharing to WhatsApp, LinkedIn, Facebook, and Copy Link with analytics event logging.

   #### 🛡️ Multi-Layer Anti-Bot & Visitor Protection Pipeline:
   - **• Honeypot Anti-Bot Trap:** Hidden form field (`website`) that catches automated bot submissions and silently neutralizes them without human friction.
   - **• IP/User-Agent Hash Rate-Limiting:** Privacy-safe salted SHA-256 hash enforcing a strict maximum of 5 reactions/actions per item per 24 hours (GDPR/CCPA compliant, zero raw IP stored).
   - **• Cloudflare Turnstile (Smart Bot Defense):** Invisible, privacy-first bot mitigation keeping automated scrapers and spam engines out without annoying CAPTCHA puzzle images.
   - **• Admin Moderation Shield:** Default `status='pending'` ensures no comment is ever published live on the website until approved in the Admin Studio.

4. **Standardized REST API Engine (`/api/v1/...`):**
   - Uniform JSON response structure across all endpoints (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
   - Partial resource updating support via `PATCH` method.
   - Graceful schema fallbacks for unmigrated database tables.

5. **Admin Content Management Studio (`/admin`):**
   - Direct file uploads to Supabase Storage bucket `portfolio-assets`.
   - Full CRUD operations for portfolio projects and journal essays with `react-quill-new` WYSIWYG editor.
   - Dedicated **Comments Moderation Studio** allowing 1-click Approve & Publish, Reject, and Delete.
   - **Live Notification Hub** with topbar bell icon and Supabase Realtime WebSocket unread badge counters.

---

## 💎 4. Aesthetic & Experience Guidelines

- **Theme:** Sleek, modern dark mode (`#09090b` background) with high-contrast typography and subtle borders.
- **User Experience (UX):** Single-page application feel with instant route transitions and zero page reloads.
- **Responsiveness:** Fluid grid scaling from mobile displays to ultra-wide desktop monitors.
- **Security & Privacy:** Public forms protected against spam without friction; zero raw IP addresses stored; full moderation control over published user content.
