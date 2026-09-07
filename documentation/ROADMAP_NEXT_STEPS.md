# 🗺️ Project Roadmap & Next Steps

**Project:** Shah Mahmud Portfolio Website  
**Branch:** `home-nextJsSetup`  

---

## ✅ Completed Milestones

- [x] **Milestone 0: Static to Next.js App Router Migration**
  - [x] Converted legacy HTML pages into Next.js App Router pages (`app/page.js`, `app/atl`, `app/fine-arts`, `app/journal`, `app/admin`).
  - [x] Modularized Supabase service layer (`lib/supabase/client.js`, `lib/supabase/projects.js`, `lib/supabase/journals.js`).
  - [x] Cleaned up root workspace clutter (`My portfolio`, `portfolio-admin-starter`).
  - [x] Permanently archived and removed legacy HTML static files.
  - [x] Created comprehensive `documentation/` suite.

---

## 🔮 Upcoming Feature Roadmap

### 📍 Phase 1: Dynamic Journal Detail Routes (`/journal/[slug]`)
- [ ] Create dynamic Next.js App route `app/journal/[slug]/page.js` to display full individual art essays with rich HTML typography.
- [ ] Add SEO Open Graph tags for social media sharing.

### 📍 Phase 2: Unified 3-Tier Architecture & Standard REST APIs (with PATCH)
- [ ] **Tier A (Public Frontend):** Remove public `CMS Admin` link from global navigation header across all pages; convert into hidden/secret access.
- [ ] **Tier B (Backend API Engine):** Implement modular Next.js Route Handlers (`app/api/v1/projects`, `app/api/v1/journals`, `app/api/v1/media`) with standardized `GET`, `POST`, `PUT`, `PATCH`, `DELETE` methods and uniform JSON responses.
- [ ] **Tier C (Protected Admin Studio):** Implement route protection and admin authentication with Supabase Auth or Session Guard.

### 📍 Phase 3: Interactive Engagement System (Like, Comment & Share)
- [ ] **Smart Reactions (Likes):** Implement 1-click frictionless Heart/Clap counter with `localStorage` persistence and IP-hash rate limiting.
- [ ] **Guest Comments Engine:** Guest submission form with Honeypot and Cloudflare Turnstile anti-spam protection; pending by default.
- [ ] **Social Share Tracker:** Web Share API integration with copy link and event logging to `/api/v1/analytics/share`.

### 📍 Phase 4: Admin Live Notification Hub & Moderation Center
- [ ] **Realtime Notification Bell:** Supabase Realtime WebSocket subscription for instant notification badges on new comments, likes, and shares.
- [ ] **Comment Moderation Studio:** One-click Approve/Reject interface in `/admin` with instant live publishing.
- [ ] **Activity Analytics:** Insights dashboard displaying most liked and shared projects and essays.

### 📍 Phase 5: Profile, About & Contact Inbox Editor
- [ ] Build Profile & About section editor in Admin Dashboard.
- [ ] Implement Contact Message Inbox backed by Supabase `contact_messages` table.

### 📍 Phase 6: Production Deployment & Domain Setup
- [ ] Deploy Next.js repository to **Vercel** with automatic GitHub CD pipeline.
- [ ] Configure custom domain and SSL certificate.

