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

### 📍 Phase 2: Category Management & Gallery Upgrades
- [ ] Add multiple gallery image upload support per portfolio project in Admin Dashboard.
- [ ] Dynamic category filter management from database.

### 📍 Phase 3: Profile, About & Contact Inbox Editor
- [ ] Build Profile & About section editor in Admin Dashboard.
- [ ] Implement Contact Message Inbox backed by Supabase `contact_messages` table.

### 📍 Phase 4: Production Deployment & Domain Setup
- [ ] Deploy Next.js repository to **Vercel** with automatic GitHub CD pipeline.
- [ ] Configure custom domain and SSL certificate.
