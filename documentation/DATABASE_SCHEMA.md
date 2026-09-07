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

### Table 4: `public.reactions`
Stores anonymous, rate-limited visitor reactions/likes across projects and journals.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, `gen_random_uuid()` | Unique reaction ID |
| `target_type` | `TEXT` | `NOT NULL` (`project` / `journal`) | Target resource type |
| `target_id` | `UUID` | `NOT NULL` | Foreign ID of project or journal |
| `reaction_type` | `TEXT` | Default: `'heart'` | Reaction identifier (`heart`, `clap`) |
| `ip_hash` | `TEXT` | `NOT NULL` | SHA-256 salted hash of visitor IP for rate-limiting |
| `created_at` | `TIMESTAMPTZ`| Default: `NOW()` | Reaction timestamp |

---

### Table 5: `public.comments`
Stores guest/visitor comments with moderation workflow and anti-spam protection.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, `gen_random_uuid()` | Unique comment ID |
| `target_type` | `TEXT` | `NOT NULL` (`project` / `journal`) | Target resource type |
| `target_id` | `UUID` | `NOT NULL` | Foreign ID of project or journal |
| `author_name` | `TEXT` | `NOT NULL` | Display name of the commenter |
| `author_email` | `TEXT` | Optional | Email for avatar / moderation (never public) |
| `content` | `TEXT` | `NOT NULL` | Comment body text |
| `status` | `TEXT` | Default: `'pending'` | Moderation status (`pending`, `approved`, `rejected`) |
| `ip_hash` | `TEXT` | Optional | Visitor IP hash for spam filtering |
| `created_at` | `TIMESTAMPTZ`| Default: `NOW()` | Submission timestamp |
| `approved_at` | `TIMESTAMPTZ`| Optional | Moderation approval timestamp |

---

### Table 6: `public.share_logs`
Tracks analytics events whenever a visitor shares an artwork or journal article.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, `gen_random_uuid()` | Unique share log ID |
| `target_type` | `TEXT` | `NOT NULL` (`project` / `journal`) | Target resource type |
| `target_id` | `UUID` | `NOT NULL` | Foreign ID of project or journal |
| `platform` | `TEXT` | `NOT NULL` | Target channel (`whatsapp`, `linkedin`, `facebook`, `copy_link`) |
| `created_at` | `TIMESTAMPTZ`| Default: `NOW()` | Share timestamp |

---

### Table 7: `public.admin_notifications`
Central event hub for all live notifications delivered to the Admin CMS.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, `gen_random_uuid()` | Unique notification ID |
| `type` | `TEXT` | `NOT NULL` | Notification category (`comment`, `reaction`, `share`, `contact`) |
| `title` | `TEXT` | `NOT NULL` | Short title (e.g. "New Comment Pending") |
| `message` | `TEXT` | `NOT NULL` | Detail description of the action |
| `target_url` | `TEXT` | Optional | Quick link to moderate or view the item |
| `is_read` | `BOOLEAN` | Default: `false` | Read status flag |
| `created_at` | `TIMESTAMPTZ`| Default: `NOW()` | Notification generation timestamp |

---

## 📦 2. Storage Bucket Specification

- **Bucket Name:** `portfolio-assets`
- **Public Access:** `true` (Public URL generation enabled)
- **Allowed Operations:** 
  - `SELECT`: Public access allowed.
  - `INSERT / UPDATE / DELETE`: Restricted to authenticated admin sessions.

---

## 🔒 3. Row Level Security (RLS) & Performance Indexes

### Indexes:
- `idx_journal_posts_slug` ON `journal_posts(slug)`
- `idx_journal_posts_status` ON `journal_posts(status)`
- `idx_reactions_target` ON `reactions(target_type, target_id)`
- `idx_reactions_ip_target` ON `reactions(target_type, target_id, ip_hash)`
- `idx_comments_target_status` ON `comments(target_type, target_id, status)`
- `idx_notifications_unread` ON `admin_notifications(is_read, created_at)`

### RLS Policies:
- **`projects` & `journal_posts`:** Public `SELECT` for published items. Authenticated Admin only for `INSERT`, `UPDATE`, `PATCH`, `DELETE`.
- **`reactions`:** Public `INSERT` (rate-limited via API); Public `SELECT` aggregated counts; Admin full access.
- **`comments`:** Public `INSERT` (sets `status='pending'`); Public `SELECT` only where `status='approved'`; Admin full read & update moderation rights.
- **`share_logs`:** Public `INSERT` (logging pings); Admin only `SELECT`.
- **`admin_notifications`:** Authenticated Admin only `SELECT`, `UPDATE` (`is_read`), `DELETE`.

