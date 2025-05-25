-- Enable pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA public;

-- Enum Types
CREATE TYPE public.project_status AS ENUM (
    'not_started',
    'in_progress',
    'on_hold',
    'completed',
    'cancelled'
);

CREATE TYPE public.project_priority AS ENUM (
    'low',
    'medium',
    'high'
);

CREATE TYPE public.task_status AS ENUM (
    'todo',
    'in_progress',
    'done',
    'blocked'
);

CREATE TYPE public.task_priority AS ENUM (
    'low',
    'medium',
    'high'
);

CREATE TYPE public.notification_type AS ENUM (
    'project_assigned',
    'task_assigned',
    'comment_mention',
    'status_update'
);

CREATE TYPE public.activity_log_type AS ENUM (
    'project_created',
    'project_updated',
    'task_created',
    'task_updated',
    'comment_added'
);

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'project_manager',
    'developer',
    'viewer'
);

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tables

-- Profiles Table
-- id will be linked to NextAuth users table via Drizzle schema
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT,
    avatar_url TEXT,
    email TEXT UNIQUE, -- Email might be managed by NextAuth user table, but can be here for denormalization/lookup
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- User Roles Table (linking profiles to roles)
CREATE TABLE public.user_roles (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role public.user_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, role)
);

-- Projects Table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    status public.project_status DEFAULT 'not_started',
    priority public.project_priority DEFAULT 'medium',
    start_date DATE,
    due_date DATE,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Project can exist without an owner or owner profile deleted
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Project Tags Table (Many-to-Many for Projects and Tags)
-- Assuming a separate 'tags' table might exist or tags are simple text labels.
-- For simplicity, using text tags here. If a tags table (e.g., `CREATE TABLE public.tags (id SERIAL PRIMARY KEY, name TEXT UNIQUE);`)
-- were used, project_tags would reference that.
CREATE TABLE public.project_tags (
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    tag_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (project_id, tag_name)
);

-- Project Members Table
CREATE TABLE public.project_members (
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT, -- e.g., 'Lead', 'Contributor' specific to the project
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (project_id, user_id)
);

-- Tasks Table
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status public.task_status DEFAULT 'todo',
    priority public.task_priority DEFAULT 'medium',
    due_date DATE,
    assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Task can be unassigned or assignee profile deleted
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    parent_task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL, -- For sub-tasks
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Task Tags Table
CREATE TABLE public.task_tags (
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    tag_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (task_id, tag_name)
);

-- Task Dependencies Table (e.g., Task A must be completed before Task B)
CREATE TABLE public.task_dependencies (
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    depends_on_task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (task_id, depends_on_task_id),
    CONSTRAINT check_task_dependency_not_self CHECK (task_id <> depends_on_task_id)
);

-- Comments Table
CREATE TABLE public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE, -- For comments on projects directly
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Comment remains if user profile deleted
    content TEXT NOT NULL,
    parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE, -- For threaded comments
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT check_comment_target CHECK (task_id IS NOT NULL OR project_id IS NOT NULL)
);

CREATE TRIGGER update_comments_updated_at
BEFORE UPDATE ON public.comments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Comment Mentions Table
CREATE TABLE public.comment_mentions (
    comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE, -- Mentioned user
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (comment_id, user_id)
);

-- Notifications Table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE, -- The user to notify
    type public.notification_type NOT NULL,
    related_project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    related_task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    related_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Activity Logs Table
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Activity log remains if user profile is deleted
    type public.activity_log_type NOT NULL,
    details JSONB, -- For storing arbitrary details about the activity
    related_project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL, -- Use SET NULL to keep log if project is deleted
    related_task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL, -- Use SET NULL to keep log if task is deleted
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Time Entries Table
CREATE TABLE public.time_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT check_end_time_after_start_time CHECK (end_time IS NULL OR end_time > start_time)
);

CREATE TRIGGER update_time_entries_updated_at
BEFORE UPDATE ON public.time_entries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for foreign keys and common query patterns (optional but good practice)
CREATE INDEX idx_projects_owner_id ON public.projects(owner_id);
CREATE INDEX idx_project_members_user_id ON public.project_members(user_id);
CREATE INDEX idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX idx_tasks_assignee_id ON public.tasks(assignee_id);
CREATE INDEX idx_tasks_reporter_id ON public.tasks(reporter_id);
CREATE INDEX idx_comments_task_id ON public.comments(task_id);
CREATE INDEX idx_comments_project_id ON public.comments(project_id);
CREATE INDEX idx_comments_user_id ON public.comments(user_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_time_entries_task_id ON public.time_entries(task_id);
CREATE INDEX idx_time_entries_user_id ON public.time_entries(user_id);

-- Note: Supabase-specific auth triggers, RLS policies, and auth.uid() functions have been removed.
-- User profile creation (formerly handle_new_user) is expected to be handled by NextAuth callbacks.
-- The profiles.id will be linked to the users table created by NextAuth Drizzle adapter.
-- Access control (formerly RLS and get_user_role/can_user_impersonate) will be managed at the application layer.
