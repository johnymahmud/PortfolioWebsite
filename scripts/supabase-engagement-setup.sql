-- ==============================================================================
-- SUPABASE ENGAGEMENT, ANTI-SPAM & NOTIFICATION SETUP SCRIPT
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Create public.reactions table (Likes / Reactions)
CREATE TABLE IF NOT EXISTS public.reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    target_type TEXT NOT NULL CHECK (target_type IN ('project', 'journal')),
    target_id UUID NOT NULL,
    reaction_type TEXT NOT NULL DEFAULT 'heart',
    ip_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning-fast aggregated counts and rate-limit checks
CREATE INDEX IF NOT EXISTS idx_reactions_target ON public.reactions(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_reactions_ip_target ON public.reactions(target_type, target_id, ip_hash);

-- 2. Create public.comments table (Visitor Comments with Moderation)
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    target_type TEXT NOT NULL CHECK (target_type IN ('project', 'journal')),
    target_id UUID NOT NULL,
    author_name TEXT NOT NULL,
    author_email TEXT,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    ip_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_comments_target_status ON public.comments(target_type, target_id, status);
CREATE INDEX IF NOT EXISTS idx_comments_status ON public.comments(status);

-- 3. Create public.share_logs table (Share Analytics Tracking)
CREATE TABLE IF NOT EXISTS public.share_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    target_type TEXT NOT NULL CHECK (target_type IN ('project', 'journal')),
    target_id UUID NOT NULL,
    platform TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_share_logs_target ON public.share_logs(target_type, target_id);

-- 4. Create public.admin_notifications table (Admin Realtime Notification Hub)
CREATE TABLE IF NOT EXISTS public.admin_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('comment', 'reaction', 'share', 'contact', 'system')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    target_url TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_unread ON public.admin_notifications(is_read, created_at DESC);

-- 5. Enable Row Level Security (RLS) on all new tables
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.share_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- 6. Grant Permissions to anon, authenticated, and service_role
GRANT ALL ON TABLE public.reactions TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.comments TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.share_logs TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.admin_notifications TO anon, authenticated, service_role;

-- 7. Drop existing policies if any
DROP POLICY IF EXISTS "Public can view reactions count" ON public.reactions;
DROP POLICY IF EXISTS "Public can insert reactions" ON public.reactions;
DROP POLICY IF EXISTS "Public can view approved comments" ON public.comments;
DROP POLICY IF EXISTS "Public can insert comments as pending" ON public.comments;
DROP POLICY IF EXISTS "Public can log shares" ON public.share_logs;
DROP POLICY IF EXISTS "Admin full access notifications" ON public.admin_notifications;

-- 8. Policies for reactions
CREATE POLICY "Public can view reactions count"
ON public.reactions FOR SELECT
USING (true);

CREATE POLICY "Public can insert reactions"
ON public.reactions FOR INSERT
WITH CHECK (true);

-- 9. Policies for comments
CREATE POLICY "Public can view approved comments"
ON public.comments FOR SELECT
USING (status = 'approved');

CREATE POLICY "Public can insert comments as pending"
ON public.comments FOR INSERT
WITH CHECK (status = 'pending');

CREATE POLICY "Allow all operations for admin on comments"
ON public.comments FOR ALL
USING (true)
WITH CHECK (true);

-- 10. Policies for share_logs
CREATE POLICY "Public can log shares"
ON public.share_logs FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow all operations for admin on share_logs"
ON public.share_logs FOR SELECT
USING (true);

-- 11. Policies for admin_notifications
CREATE POLICY "Allow all operations for notifications"
ON public.admin_notifications FOR ALL
USING (true)
WITH CHECK (true);

-- 12. Enable Supabase Realtime for admin_notifications (if publication exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_notifications;
    END IF;
END $$;
