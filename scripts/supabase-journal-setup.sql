-- ========================================================
-- SUPABASE DATABASE SETUP & PERMISSIONS FOR JOURNAL & PROJECTS
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ========================================================

-- 1. Create journal_posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.journal_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    excerpt TEXT,
    content TEXT,
    cover_image TEXT,
    is_featured BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure cover_image and all columns exist if table was previously created without them
ALTER TABLE public.journal_posts ADD COLUMN IF NOT EXISTS cover_image TEXT;
ALTER TABLE public.journal_posts ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.journal_posts ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE public.journal_posts ADD COLUMN IF NOT EXISTS excerpt TEXT;
ALTER TABLE public.journal_posts ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.journal_posts ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.journal_posts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';


-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_journal_posts_slug ON public.journal_posts(slug);
CREATE INDEX IF NOT EXISTS idx_journal_posts_status ON public.journal_posts(status);

-- 2. Create projects table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    work_type TEXT NOT NULL,
    category TEXT NOT NULL,
    year TEXT,
    client TEXT,
    image_url TEXT,
    behance_url TEXT,
    video_url TEXT,
    description TEXT,
    full_content TEXT,
    sort_order INT DEFAULT 1,
    is_featured BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.journal_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 4. Grant table access to anon, authenticated, and service_role
GRANT ALL ON TABLE public.journal_posts TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.projects TO anon, authenticated, service_role;

-- 5. Drop existing policies to prevent duplication/conflicts
DROP POLICY IF EXISTS "Allow all operations for journal posts" ON public.journal_posts;
DROP POLICY IF EXISTS "Allow all operations for projects" ON public.projects;

-- 6. Create permissive RLS policy for journal_posts
CREATE POLICY "Allow all operations for journal posts" 
ON public.journal_posts 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 7. Create permissive RLS policy for projects
CREATE POLICY "Allow all operations for projects" 
ON public.projects 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 8. Setup Storage Bucket 'portfolio-assets'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies
DROP POLICY IF EXISTS "Public access to portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploads to portfolio assets" ON storage.objects;

CREATE POLICY "Public access to portfolio assets" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Allow uploads to portfolio assets" 
ON storage.objects FOR ALL 
USING (bucket_id = 'portfolio-assets') 
WITH CHECK (bucket_id = 'portfolio-assets');

-- 9. Insert Sample Test Journal Post (if not exists)
INSERT INTO public.journal_posts (title, slug, category, status, excerpt, content, is_featured, published_at)
VALUES (
    'লক্ষীর সরা — গ্রামীণ বাংলার লোকশিল্প',
    'lokkhir-sora-folk-art',
    'Art Journal',
    'published',
    'লক্ষীর সরা হলো প্রাচীন বাংলার লোকশিল্পের এক অনন্য মাটির পাত্র, যা দেবী লক্ষ্মীর প্রতীক হিসেবে কোজাগরী লক্ষ্মী পূজায় ব্যবহার করা হয়।',
    '<h2>লক্ষীর সরা — ঐতিহ্যবাহী লোকশিল্প</h2><p>লক্ষীর সরা হলো পটিন বাংলার লোকশিল্পের এক অনন্য মাটির পাত, যা দেবী লক্ষ্মীর প্রতীক হিসেবে কোজাগরী লক্ষ্মী পূজায় ব্যবহার করা হয়। এটি মূলত ঢাকাতি সরা, ফরিদপুরী সরা ও সুরেশ্বরী সরা এই কয়েকটি প্রধান ভাগে বিভক্ত। মাটির তৈরি এই সরার গায়ে নিখুঁতভাবে দেবীর রূপ ও নানা আলপনা আঁকা হয়।</p><p>আমাদের শিল্প সংস্কৃতির এই ঐতিহ্যময় লোকজ রূপ সংরক্ষণ ও চর্চা অত্যন্ত গুরুত্বপূর্ণ।</p>',
    true,
    NOW()
)
ON CONFLICT (slug) DO NOTHING;

