# 🤖 AI Agent Vibecoding Protocol & Workflow Guidelines

**Target Agent:** Antigravity / Gemini / AI Pair Programmers  
**Scope:** `f:\Vibecoding\Portfolio\PortfolioWebsite`  

---

## 📜 1. Core Vibecoding Rules

1. **Strict Step-by-Step Workflow (Plan ➔ Implement ➔ Test ➔ Commit):**
   - **Plan:** Analyze requirements, check documentation in `documentation/`, and outline proposed changes.
   - **Implement:** Write clean, modular code obeying the design system.
   - **Test:** Verify code execution on local dev server (`http://localhost:3000`).
   - **Commit:** Commit verified changes cleanly to Git branch `home-nextJsSetup`.

2. **Never Guess Schemas or Paths:**
   - Always inspect `documentation/DATABASE_SCHEMA.md` and `documentation/ARCHITECTURE_SYSTEM_DESIGN.md` before querying Supabase or importing components.

3. **No Superficial Symptom Patches:**
   - Always fix the root cause of an error. Inspect full task/error logs before forming a diagnostic hypothesis.

4. **Zero Downtime Migration Policy:**
   - Never delete existing working files until new Next.js routes are 100% verified and working.

---

## 💬 2. Communication Style

- **Language:** Respond in clear, professional Bengali (বাংলা) as requested by the user, while keeping code and documentation terms formatted cleanly in markdown.
- **Conciseness:** Keep responses structured, concise, and highlight open questions or action items directly.
- **File Links:** Always format clickable file links using GitHub-style `file:///` URLs.

---

## ✅ 3. Verification Checklist

Before declaring any feature complete:
- [ ] Run build or check live dev server on `http://localhost:3000`.
- [ ] Verify HTTP response status (200 OK).
- [ ] Inspect task/server logs for any uncaught runtime errors.
- [ ] Update `documentation/CURRENT_STATE.md` to reflect newly verified routes or features.
