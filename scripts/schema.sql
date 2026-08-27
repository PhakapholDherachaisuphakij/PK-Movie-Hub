-- ==============================================================================
-- ALL PROJECTS - COMPLETE SUPABASE SCHEMA & POLICIES
-- Target: Self-Hosted Supabase (homelab.tail7d4c51.ts.net)
-- Covers: PK Movie Hub, Portfolio, Life OS Design, etc.
-- ==============================================================================

-- 1. Table: 'Store' (Movies & Series Collection)
CREATE TABLE IF NOT EXISTS public."Store" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    src TEXT,
    title TEXT,
    description TEXT,
    category TEXT,
    genre TEXT,
    ratings JSONB DEFAULT '{"excitement": 0, "romance": 0, "emotion": 0, "overall": 0}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    hot BOOLEAN DEFAULT false
);

-- 2. Table: 'profiles' (User Profiles / Team Members)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    nickname TEXT,
    level TEXT,
    role TEXT,
    description TEXT,
    streak TEXT,
    total_xp TEXT,
    quote TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Table: 'projects' (Portfolio Projects)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    tech_stack JSONB DEFAULT '[]'::jsonb,
    image_url TEXT,
    experience_text TEXT,
    link TEXT,
    order_idx INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Table: 'skills' (Portfolio Skills & Tech Stack)
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    progress INTEGER DEFAULT 0,
    level TEXT,
    image_url TEXT,
    is_main BOOLEAN DEFAULT false,
    order_idx INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Table: 'user_identity' (Life OS Personal Memory & Strategy)
CREATE TABLE IF NOT EXISTS public.user_identity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT,
    role TEXT,
    scholarship JSONB DEFAULT '{}'::jsonb,
    scb_contract JSONB DEFAULT '{}'::jsonb,
    kmutt_student JSONB DEFAULT '{}'::jsonb,
    side_projects JSONB DEFAULT '[]'::jsonb,
    daily_data JSONB DEFAULT '{}'::jsonb,
    background TEXT
);

-- 6. Table: 'life_logs' (Life OS Logs)
CREATE TABLE IF NOT EXISTS public.life_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    log_type TEXT,
    content TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 7. Table: 'todos' (Life OS Tasks & Deadlines)
CREATE TABLE IF NOT EXISTS public.todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'medium',
    due_date TEXT,
    reason TEXT,
    category TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public."Store" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_identity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.life_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- RLS POLICIES FOR ALL TABLES (CRUD OPEN FOR ANON & AUTHENTICATED)
-- ==============================================================================

-- 1. Policies for 'Store'
DROP POLICY IF EXISTS "Store_select_all" ON public."Store";
CREATE POLICY "Store_select_all" ON public."Store" FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Store_insert_all" ON public."Store";
CREATE POLICY "Store_insert_all" ON public."Store" FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Store_update_all" ON public."Store";
CREATE POLICY "Store_update_all" ON public."Store" FOR UPDATE TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Store_delete_all" ON public."Store";
CREATE POLICY "Store_delete_all" ON public."Store" FOR DELETE TO public USING (true);

-- 2. Policies for 'profiles'
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "profiles_insert_all" ON public.profiles;
CREATE POLICY "profiles_insert_all" ON public.profiles FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "profiles_update_all" ON public.profiles;
CREATE POLICY "profiles_update_all" ON public.profiles FOR UPDATE TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "profiles_delete_all" ON public.profiles;
CREATE POLICY "profiles_delete_all" ON public.profiles FOR DELETE TO public USING (true);

-- 3. Policies for 'projects'
DROP POLICY IF EXISTS "projects_select_all" ON public.projects;
CREATE POLICY "projects_select_all" ON public.projects FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "projects_insert_all" ON public.projects;
CREATE POLICY "projects_insert_all" ON public.projects FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "projects_update_all" ON public.projects;
CREATE POLICY "projects_update_all" ON public.projects FOR UPDATE TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "projects_delete_all" ON public.projects;
CREATE POLICY "projects_delete_all" ON public.projects FOR DELETE TO public USING (true);

-- 4. Policies for 'skills'
DROP POLICY IF EXISTS "skills_select_all" ON public.skills;
CREATE POLICY "skills_select_all" ON public.skills FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "skills_insert_all" ON public.skills;
CREATE POLICY "skills_insert_all" ON public.skills FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "skills_update_all" ON public.skills;
CREATE POLICY "skills_update_all" ON public.skills FOR UPDATE TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "skills_delete_all" ON public.skills;
CREATE POLICY "skills_delete_all" ON public.skills FOR DELETE TO public USING (true);

-- 5. Policies for 'user_identity'
DROP POLICY IF EXISTS "user_identity_select_all" ON public.user_identity;
CREATE POLICY "user_identity_select_all" ON public.user_identity FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "user_identity_insert_all" ON public.user_identity;
CREATE POLICY "user_identity_insert_all" ON public.user_identity FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "user_identity_update_all" ON public.user_identity;
CREATE POLICY "user_identity_update_all" ON public.user_identity FOR UPDATE TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "user_identity_delete_all" ON public.user_identity;
CREATE POLICY "user_identity_delete_all" ON public.user_identity FOR DELETE TO public USING (true);

-- 6. Policies for 'life_logs'
DROP POLICY IF EXISTS "life_logs_select_all" ON public.life_logs;
CREATE POLICY "life_logs_select_all" ON public.life_logs FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "life_logs_insert_all" ON public.life_logs;
CREATE POLICY "life_logs_insert_all" ON public.life_logs FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "life_logs_update_all" ON public.life_logs;
CREATE POLICY "life_logs_update_all" ON public.life_logs FOR UPDATE TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "life_logs_delete_all" ON public.life_logs;
CREATE POLICY "life_logs_delete_all" ON public.life_logs FOR DELETE TO public USING (true);

-- 7. Policies for 'todos'
DROP POLICY IF EXISTS "todos_select_all" ON public.todos;
CREATE POLICY "todos_select_all" ON public.todos FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "todos_insert_all" ON public.todos;
CREATE POLICY "todos_insert_all" ON public.todos FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "todos_update_all" ON public.todos;
CREATE POLICY "todos_update_all" ON public.todos FOR UPDATE TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "todos_delete_all" ON public.todos;
CREATE POLICY "todos_delete_all" ON public.todos FOR DELETE TO public USING (true);

-- ==============================================================================
-- STORAGE BUCKETS SETUP ('image', 'avatars', 'portfolio-assets')
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('image', 'image', true),
    ('avatars', 'avatars', true),
    ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies (Allow Full Access for Public, Anon, Authenticated)
DROP POLICY IF EXISTS "Public_Storage_All" ON storage.objects;
DROP POLICY IF EXISTS "Public_Storage_Read" ON storage.objects;
DROP POLICY IF EXISTS "Public_Storage_Insert" ON storage.objects;
DROP POLICY IF EXISTS "Public_Storage_Update" ON storage.objects;
DROP POLICY IF EXISTS "Public_Storage_Delete" ON storage.objects;

CREATE POLICY "Public_Storage_All"
ON storage.objects FOR ALL
TO public
USING (true)
WITH CHECK (true);
