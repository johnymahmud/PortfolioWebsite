# 🛠️ Development & Environment Setup Guide

**Project Directory:** `f:\Vibecoding\Portfolio\PortfolioWebsite`  

---

## ⚡ 1. Prerequisites

- **Node.js:** v18.0.0 or higher
- **Package Manager:** `npm` (v9.0.0 or higher)
- **Code Editor:** VS Code / Antigravity IDE

---

## 🚀 2. Quick Start & Local Execution

> [!IMPORTANT]
> Always navigate to the `PortfolioWebsite` directory before running any `npm` commands.

```bash
# 1. Navigate to the project root
cd PortfolioWebsite

# 2. Install dependencies (if needed)
npm install

# 3. Start the Next.js local development server
npm run dev
```

Once started, open your browser and navigate to:  
👉 **`http://localhost:3000`**

---

## 🔑 3. Environment Variables Setup (`.env.local`)

Create a `.env.local` file inside `PortfolioWebsite` with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://uytqxpxbwzspxqffdgxv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_public_key_here
```

---

## 📜 4. Available NPM Scripts

- `npm run dev`: Starts the Next.js development server on port 3000.
- `npm run build`: Compiles and builds the production bundle.
- `npm run start`: Launches the compiled production server.
- `npm run lint`: Runs ESLint check across Next.js pages and components.

---

## ⚠️ 5. Troubleshooting Gotchas

- **ENOENT `package.json` not found:** Ensure your shell terminal working directory is inside `PortfolioWebsite`, not the parent `Portfolio` folder.
- **500 Module Not Found:** If adding new CSS files, verify the import path in `app/layout.js`.
