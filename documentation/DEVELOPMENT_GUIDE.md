# 🛠️ Development & Environment Setup Guide

**Project Directory:** `PortfolioWebsite` (Cross-PC Workspace: `d:\Personal\PortfolioWebsite` / `f:\Vibecoding\...`)  
**Current Active Branch:** `feat/modular-cms-architecture-v3`  

---

## ⚡ 1. Prerequisites

- **Node.js:** v20.0.0 or higher (v24.x tested & verified)
- **Package Manager:** `npm` (v10.x or higher)
- **Supabase Cloud Project:** Active PostgreSQL Database + Storage Bucket (`portfolio-assets`)
- **Code Editor:** VS Code / Antigravity IDE

---

## 🚀 2. Quick Start & Local Execution

```bash
# 1. Install dependencies (required once per PC)
npm install

# 2. Start the Next.js local development server (Turbopack engine)
npm run dev
```

Once started, open your browser and navigate to:  
👉 **`http://localhost:3000`** (Public Portfolio)  
👉 **`http://localhost:3000/admin`** (Admin CMS Studio)  

---

## 🔑 3. Environment Variables Setup (`.env.local`)

1. Copy `.env.example` to create your local `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Ensure the active Supabase Publishable Key and URL are set:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://uytqxpxbwzspxqffdgxv.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_mciDuuNRVSe-eZUkOe5AEA_VlmpDFeP
   ```
3. *Note: `.env.local` is strictly ignored by Git in `.gitignore` to protect credentials.*

---

## 🗄️ 4. Supabase Database Migration Scripts

When setting up a new Supabase project or verifying tables, run these scripts in your [Supabase SQL Editor](https://supabase.com/dashboard/project/uytqxpxbwzspxqffdgxv/sql):

1. **Core Portfolio & Journal Setup:**  
   Execute: [scripts/supabase-journal-setup.sql](file:///d:/Personal/PortfolioWebsite/scripts/supabase-journal-setup.sql)  
   *(Creates `projects`, `journal_posts`, `profiles` and `portfolio-assets` storage bucket).*
2. **Engagement, Reactions & Notification Hub:**  
   Execute: [scripts/supabase-engagement-setup.sql](file:///d:/Personal/PortfolioWebsite/scripts/supabase-engagement-setup.sql)  
   *(Creates `reactions`, `comments`, `share_logs`, `admin_notifications` and Realtime publications).*

---

## 🌐 5. REST API Endpoints Reference (`/api/v1/...`)

All REST endpoints return uniform JSON responses:
```json
{ "success": true, "message": "Success", "data": [...], "meta": null, "error": null }
```

- **Projects:** `GET /api/v1/projects`, `POST /api/v1/projects`, `GET /api/v1/projects/:id`, `PUT /api/v1/projects/:id`, `PATCH /api/v1/projects/:id`, `DELETE /api/v1/projects/:id`
- **Journals:** `GET /api/v1/journals`, `POST /api/v1/journals`, `GET /api/v1/journals/:slug`, `PUT /api/v1/journals/:slug`, `PATCH /api/v1/journals/:slug`, `DELETE /api/v1/journals/:slug`
- **Reactions (Likes):** `GET /api/v1/reactions?target_type=project&target_id=...`, `POST /api/v1/reactions`
- **Comments:** `GET /api/v1/comments?target_type=...&target_id=...`, `POST /api/v1/comments` (Guest with Honeypot), `PATCH /api/v1/comments` (Approve/Reject), `DELETE /api/v1/comments?id=...`
- **Shares & Analytics:** `GET /api/v1/analytics/share`, `POST /api/v1/analytics/share`, `GET /api/v1/analytics/overview` (Totals, Platform shares, and Item metrics)
- **Notifications:** `GET /api/v1/notifications`, `PATCH /api/v1/notifications` (Mark read), `DELETE /api/v1/notifications?id=...`

---

## 🛑 6. Strict Human Permission-First Governance Protocol

1. **Pre-Task Deep Audit:** Every session must begin by reviewing all markdown files in `documentation/` before proposing or writing code.
2. **No Autonomous Documentation Edits:** Never edit markdown files autonomously; always answer questions and request permission first.
3. **Mandatory Plan & Pre-Permission:** Always outline Scope, Rationale, Pros, Cons/Risks and obtain explicit proceed permission before executing code changes.
4. **No Autonomous Code Changes:** Never modify codebase components without user authorization.
5. **No Autonomous Push:** Never run `git push` without explicit, typed human confirmation.
6. **No Autonomous Branching:** Never create or switch branches without explicit user instruction.
7. **Pre-Commit Review:** Always summarize changes and await approval before running `git commit`.
8. **Continuous Documentation Sync:** Always update `documentation/` markdown files at the conclusion of any architectural change before commit.
