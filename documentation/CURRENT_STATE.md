# 📍 Project Current State & Environment Status

**Project Name:** Shah Mahmud — Visual Artist & Art Director Portfolio  
**Active Working Path:** `d:\Personal\PortfolioWebsite` (Cross-PC Workspace)  
**Last Updated:** September 7, 2026  

---

## 🟢 Live Environment Status

- **Framework:** Next.js 16.2.12 (React 19.2.8) — Turbopack App Router
- **Architecture:** Unified 3-Tier Model (Public Frontend, REST API Engine with PATCH, Protected Admin Studio)
- **Active Git Branch:** `feat/modular-cms-architecture-v3`
- **Dev Server:** Active on `http://localhost:3000` (Fast compilation, Turbopack verified)
- **Public Nav Cleanliness:** 100% Clean — `CMS Admin` link removed from all public visitor navigation headers.

---

## 🗺️ Verified Active Routes & REST API Endpoints

### 1. Presentation Layer (Public Pages & Admin)
| Route Path | Type | Purpose | Verified Status |
| :--- | :--- | :--- | :---: |
| `/` | Public Page | Main Home Page, Visual Identity & Creative Philosophy | ✅ 200 OK |
| `/work` | Public Page | Combined Work Showcase & Category Filter Hub | ✅ 200 OK |
| `/atl` | Public Page | Above The Line / Commercial Campaigns | ✅ 200 OK |
| `/fine-arts` | Public Page | Fine Arts (Watercolors, Sketches, Mixed Media) | ✅ 200 OK |
| `/passion-works` | Public Page | Photography, Literature & Performing Arts | ✅ 200 OK |
| `/professional-works`| Public Page | Commercial Campaigns & Press Ads | ✅ 200 OK |
| `/journal` | Public Page | Art Essays, Folk Art Studies & Creative Blog | ✅ 200 OK |
| `/admin` | Admin Studio | Full Project & Journal CRUD, Comments Moderation & Realtime Alerts | ✅ 200 OK |

### 2. Backend REST API Layer (`/api/v1/...`)
| Endpoint | Supported Methods | Purpose | Verified Status |
| :--- | :--- | :--- | :---: |
| `/api/v1/projects` | `GET`, `POST` | Projects collection query & creation | ✅ 200 OK |
| `/api/v1/projects/[id]` | `GET`, `PUT`, `PATCH`, `DELETE` | Single project CRUD & partial updates | ✅ 200 OK |
| `/api/v1/journals` | `GET`, `POST` | Journal essays collection query & creation | ✅ 200 OK |
| `/api/v1/journals/[slug]`| `GET`, `PUT`, `PATCH`, `DELETE` | Single journal CRUD & partial updates | ✅ 200 OK |
| `/api/v1/reactions` | `GET`, `POST` | 1-click likes/reactions with IP rate-limiting | ✅ 200 OK |
| `/api/v1/comments` | `GET`, `POST`, `PATCH`, `DELETE` | Guest comments (Honeypot trap, moderation workflow) | ✅ 200 OK |
| `/api/v1/analytics/share`| `GET`, `POST` | Social share tracking (WhatsApp, LinkedIn, Facebook, Link) | ✅ 200 OK |
| `/api/v1/notifications`| `GET`, `PATCH`, `DELETE` | Admin live notification hub & mark-as-read | ✅ 200 OK |

---

## ☁️ Database & Services Status

- **Database Provider:** Supabase PostgreSQL (`https://uytqxpxbwzspxqffdgxv.supabase.co`)
- **Active Tables (7 Tables):**
  1. `public.projects` — Portfolio artworks & campaigns
  2. `public.journal_posts` — Essays & creative writing
  3. `public.profiles` — Admin privileges
  4. `public.reactions` — Anonymous, rate-limited visitor reactions
  5. `public.comments` — Guest comments with moderation (`pending`/`approved`/`rejected`)
  6. `public.share_logs` — Social share tracking
  7. `public.admin_notifications` — Realtime notification hub
- **Storage Bucket:** Supabase Storage (`portfolio-assets`) — Public CDN URL access enabled
- **Realtime Channel:** Supabase Realtime WebSocket enabled on `admin_notifications`
- **Environment Configuration:** Configured via `.env.local` with `.env.example` template tracked in Git.

---

## 🎯 Current Phase Summary

The project has achieved **Architecture v3**:
1. **Public Site Isolation:** Casual visitors experience an international-grade, distraction-free artist portfolio with zero visible admin links.
2. **Visitor Engagement Engine:** Integrated 1-click Hearts/Likes, Honeypot-protected Guest Comments, and Social Share toolbars into both `ProjectViewerModal` and `JournalReaderModal`.
3. **Admin Studio Upgrades:** Mounted `AdminNotificationBell` with live WebSocket unread badge counter, and added dedicated **Comments Moderation** studio in `/admin`.
