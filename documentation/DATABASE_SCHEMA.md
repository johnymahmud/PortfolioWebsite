# 🗄️ Database Schema & Storage Specification

**Database Engine:** Supabase PostgreSQL  
**Storage Engine:** Supabase Storage Bucket (`portfolio-assets`)  
**Project Reference URL:** `https://uytqxpxbwzspxqffdgxv.supabase.co`  

---

## 📊 1. Database Tables

### Table 1: `public.projects`
Stores all portfolio work items across Fine Arts, ATL/BTL, Commercial, and Passion categories.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, `gen_random_uuid()` | Unique project ID |
| `title` | `TEXT` | `NOT NULL` | Project Title |
| `work_type` | `TEXT` | `NOT NULL` | Territory (e.g. Fine Arts, Professional Works) |
| `category` | `TEXT` | `NOT NULL` | Specific Category (e.g. Campaign, Press Ad, Watercolor) |
| `year` | `TEXT` | Optional | Creation Year (e.g. 2026) |
| `client` | `TEXT` | Optional | Client or Organization Name |
| `image_url` | `TEXT` | Optional | Cover / Main Image URL |
| `behance_url` | `TEXT` | Optional | External Behance Project Link |
| `video_url` | `TEXT` | Optional | External Video / Vimeo / YouTube Link |
| `description` | `TEXT` | Optional | Short Teaser / Summary |
| `full_content` | `TEXT` | Optional | Full HTML / Rich Text Details |
| `sort_order` | `INT` | Default: `1` | Manual Display Order |
| `is_featured` | `BOOLEAN` | Default: `true` | Show in Homepage Featured Section |
| `is_published` | `BOOLEAN` | Default: `true` | Publish Status Flag |
| `created_at` | `TIMESTAMPTZ`| Default: `NOW()` | Record Creation Timestamp |
| `updated_at` | `TIMESTAMPTZ`| Default: `NOW()` | Record Last Update Timestamp |

---

### Table 2: `public.journal_posts`
Stores art essays, folk art studies, and creative blog posts.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, `gen_random_uuid()` | Unique journal entry ID |
| `title` | `TEXT` | `NOT NULL` | Essay Title |
| `slug` | `TEXT` | `NOT NULL`, `UNIQUE` | URL Slug (e.g. `lokkhir-sora-folk-art`) |
| `category` | `TEXT` | `NOT NULL` | Essay Category (e.g. Art Journal, Opinion) |
| `status` | `TEXT` | Default: `'draft'` | Publication Status (`draft` / `published`) |
| `excerpt` | `TEXT` | Optional | Short Teaser Text |
| `content` | `TEXT` | Optional | Full HTML Rich Text Content |
| `cover_image` | `TEXT` | Optional | Cover Image URL |
| `is_featured` | `BOOLEAN` | Default: `false` | Featured Article Flag |
| `published_at` | `TIMESTAMPTZ`| Optional | Official Publication Date |
| `created_at` | `TIMESTAMPTZ`| Default: `NOW()` | Record Creation Timestamp |

---

### Table 3: `public.profiles`
Stores admin user permissions.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, FK to `auth.users` | User UUID |
| `display_name` | `TEXT` | Optional | User Full Name |
| `is_admin` | `BOOLEAN` | Default: `false` | Admin Privilege Flag |
| `created_at` | `TIMESTAMPTZ`| Default: `NOW()` | Creation Timestamp |

---

## 📦 2. Storage Bucket Specification

- **Bucket Name:** `portfolio-assets`
- **Public Access:** `true` (Public URL generation enabled)
- **Allowed Operations:** 
  - `SELECT`: Public access allowed.
  - `INSERT / UPDATE / DELETE`: Permissive upload policy for project and journal assets.

---

## 🔒 3. Row Level Security (RLS) & SQL Indexes

- Indexes on `public.journal_posts(slug)` and `public.journal_posts(status)` for optimal query speeds.
- Row Level Security (RLS) enabled on all tables.
