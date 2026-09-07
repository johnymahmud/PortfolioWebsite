# SHAH MAHMUD Portfolio CMS v2

> Version: 2.0
> Status: Planning Stage
> Project Type: Portfolio CMS
> Owner: Shah Mahmud
> Creative Director & Lead System Design: ChatGPT

---

# 1. Project Vision

This is not a traditional portfolio website.

The goal of this project is to build a professional creative platform that represents Shah Mahmud as an Art Director, Creative Thinker, Visual Storyteller, and Design Strategist.

The website will serve as a long-term digital identity instead of only displaying completed works.

Visitors should first understand the person, philosophy, and design thinking before exploring the portfolio.

This platform will continuously evolve with new projects, research, exhibitions, AI experiments, achievements, and professional experiences.

---

# 2. Core Philosophy

The homepage should not showcase projects.

Instead, it should create curiosity.

Visitors will first meet the designer.

Only after understanding the designer will they enter the portfolio.

The experience should feel calm, elegant, cinematic, and premium.

The website should communicate confidence without unnecessary visual noise.

---

# 3. Design Principles

• Dark Interface

• Minimal Design

• Premium Typography

• Elegant Motion

• Clean Layout

• Story-driven Navigation

• Case Study Focus

• Future-ready Architecture

• Zero-Spam Guest Engagement & Multi-Layer Security:
  - **Honeypot Anti-Bot Trap:** Hidden form fields silently trapping automated spam crawlers.
  - **IP/User-Agent Hash Rate-Limiting:** Salted HMAC-SHA-256 IP/User-Agent hashing limiting actions (max 5/24h) with 100% GDPR/privacy compliance.
  - **Cloudflare Turnstile (Bot Defense):** Frictionless, smart bot defense blocking malicious bots without annoying CAPTCHAs.
  - **Admin Moderation Shield:** Default `pending` state so zero unvetted links/spam ever appear live without approval.

---

Status:
Draft Version 1

# Personal Creative Identity (Draft)

## Professional Identity

Fine Artist · Art Director · Creative Strategist

## My Core Beliefs

- I believe God is the Supreme Artist.
- Art is one of the purest ways to appreciate the beauty of creation.
- Without art, the world loses emotion, imagination, and color.
- Design is purposeful creativity. Art is limitless freedom.
- I don't follow trends. I aim to create timeless creative experiences.

## What Visitors Should Feel

Visitors should not only see my work.
They should understand how I think.

The goal is not to impress people with visuals.
The goal is to make them trust my creative thinking.

---

# 4. Future Implementation & Production Deployment Blueprint

## 🛡️ Security & Anti-Bot Hardening (ভবিষ্যৎ নিরাপত্তা কনফিগারেশন)
- [ ] **Cloudflare Turnstile Setup:** Production Keys (`NEXT_PUBLIC_TURNSTILE_SITE_KEY` এবং `TURNSTILE_SECRET_KEY`) এনভায়রনমেন্ট ভ্যারিয়েবলে যুক্ত করে গেস্ট কমেন্ট ফর্মে লাইভ এনফোর্স করা।
- [ ] **Honeypot Trap & IP-Hash Rate-Limiting:** স্বয়ংক্রিয় স্প্যাম বটের বিরুদ্ধে লাইভ প্রোডাকশনে স্ট্রেস-টেস্টিং ও ২৪ ঘণ্টার রিয়্যাকশন থ্রোটলিং পরীক্ষা।
- [ ] **Database RLS Hardening:** সুপাবেজের প্রতিটি টেবিলের জন্য কঠোর Row Level Security (RLS) পলিসি অডিট ও ভেরিফিকেশন।

## 🚀 Production Hosting & Infrastructure (ক্লাউড ও ডেপ্লয়মেন্ট আর্কিটেকচার)
- [ ] **Hosting Platform:** **Vercel Production Environment** (Next.js App Router-এর অপটিমাইজড পারফরম্যান্স, অটোমেটিক গিটহাব সিআই/সিডি এবং গ্লোবাল এজ নেটওয়ার্ক)।
- [ ] **Database & Storage:** **Supabase Cloud (EU/Frankfurt বা SG/Singapore Region)** — অটোমেটিক ব্যাকআপ, হাই অ্যাভেইল্যাবিলিটি ও মিডিয়া অ্যাসেট ক্যাশিং।
- [ ] **Domain & DNS Management:** **Cloudflare DNS & Proxy** — কাস্টম ডোমেইন কানেকশন, অটোমেটিক SSL/TLS এনক্রিপশন ও ডিডস (DDoS) প্রটেকশন।
- [ ] **Secrets & Environment Governance:** প্রোডাকশনে সুপাবেজ Anon Key নিরাপদে রাখা, Service Role Secret শুধু ব্যাকএন্ডে রাখা এবং কোনো সংবেদনশীল কি যাতে ফ্রন্টএন্ডে এক্সপোজ না হয় তা কঠোরভাবে নিশ্চিত করা।

## 🔐 Admin Authentication & Governance (অ্যাডমিন নিরাপত্তা ও নোটিফিকেশন)
- [ ] **Admin Route Guard:** `/admin` ড্যাশবোর্ডে প্রবেশের জন্য সুপাবেজ Auth-ভিত্তিক সিকিউর লগইন সিস্টেম বা সেশন গার্ড স্থাপন।
- [ ] **Live Notification Dispatch:** কমেন্ট, রিয়্যাকশন ও শেয়ারের রিয়েলটাইম ড্যাশবোর্ড অ্যালার্টের পাশাপাশি অ্যাডমিনের জন্য ইমেইল নোটিফিকেশন সিস্টেম ইন্টিগ্রেশন (Resend API / Supabase Database Webhooks)।

