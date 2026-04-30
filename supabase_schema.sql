-- Run this SQL in your Supabase Dashboard SQL Editor

-- 1. Create a custom roles ENUM
CREATE TYPE app_role AS ENUM (
  'admin', 
  'executive_officer', 
  'hr', 
  'marketing', 
  'manager', 
  'team_lead', 
  'senior_developer', 
  'junior_developer', 
  'intern'
);

-- 2. Create Custom Users Table extending Supabase Auth
CREATE TABLE public.profiles (
  id UUID references auth.users not null primary key,
  email TEXT unique not null,
  full_name TEXT,
  role app_role not null default 'intern',
  created_at TIMESTAMP WITH TIME ZONE default timezone('utc'::text, now()) not null
);

-- Turn on RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Allow admins to read all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'hr', 'executive_officer')
  )
);

-- 3. Create Tasks Table
CREATE TABLE public.tasks (
  id UUID default uuid_generate_v4() primary key,
  title TEXT not null,
  description TEXT,
  status TEXT not null default 'Pending',
  priority TEXT not null default 'Medium',
  assignee_id UUID references public.profiles(id),
  project_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE default timezone('utc'::text, now()) not null,
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view tasks (restrict later based on role if needed)
CREATE POLICY "Authenticated users can view tasks" 
ON public.tasks FOR SELECT 
USING (auth.role() = 'authenticated');

-- Users can update tasks assigned to them
CREATE POLICY "Users can update own assigned tasks" 
ON public.tasks FOR UPDATE 
USING (auth.uid() = assignee_id);

-- Admins and Managers can update any task
CREATE POLICY "Managers can update any task" 
ON public.tasks FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'team_lead')
  )
);

-- 4. Create Time Logs Table
CREATE TABLE public.time_logs (
  id UUID default uuid_generate_v4() primary key,
  user_id UUID references public.profiles(id) not null,
  task_id UUID references public.tasks(id),
  start_time BIGINT not null,
  duration BIGINT not null,
  log_date DATE not null default CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE default timezone('utc'::text, now()) not null
);

ALTER TABLE public.time_logs ENABLE ROW LEVEL SECURITY;

-- Users can view and insert their own logs
CREATE POLICY "Users can manage own time logs" 
ON public.time_logs FOR ALL 
USING (auth.uid() = user_id);

-- Admins can view all logs
CREATE POLICY "Admins can view all time logs" 
ON public.time_logs FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'hr')
  )
);

-- 5. Trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', COALESCE((new.raw_user_meta_data->>'role')::app_role, 'intern'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
