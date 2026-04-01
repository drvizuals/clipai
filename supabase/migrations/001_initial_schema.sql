-- ============================================================
-- Omnia — Database Schema
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/npkafbhmgcnjxzideyni/sql
-- ============================================================

-- Projects
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  status text default 'uploading',
  -- uploading | transcribing | analyzing | ready | error
  original_video_url text,
  duration float,
  transcript jsonb,
  industry text default 'general',
  -- founder | agency | real_estate | hotel | spa | restaurant | saas | general
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Clips
create table if not exists clips (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  title text,
  start_time float not null,
  end_time float not null,
  hook_score integer,
  viral_score integer,
  retention_score integer,
  platform text,
  caption text,
  hook_line text,
  cta text,
  hashtags text[],
  thumbnail_url text,
  status text default 'draft',
  -- draft | rendering | rendered | scheduled | published
  rendered_url text,
  caption_style text default 'karaoke',
  -- karaoke | bold_pop | minimal
  created_at timestamp with time zone default now()
);

-- Distributions
create table if not exists distributions (
  id uuid default gen_random_uuid() primary key,
  clip_id uuid references clips(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  platform text not null,
  status text default 'scheduled',
  -- scheduled | publishing | published | failed
  scheduled_for timestamp with time zone,
  published_at timestamp with time zone,
  platform_post_id text,
  platform_url text,
  error_message text,
  created_at timestamp with time zone default now()
);

-- Platform Connections
create table if not exists platform_connections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  platform text not null,
  access_token text,
  refresh_token text,
  expires_at timestamp with time zone,
  platform_user_id text,
  platform_username text,
  created_at timestamp with time zone default now(),
  unique(user_id, platform)
);

-- Analytics
create table if not exists clip_analytics (
  id uuid default gen_random_uuid() primary key,
  clip_id uuid references clips(id) on delete cascade,
  distribution_id uuid references distributions(id) on delete cascade,
  platform text,
  views integer default 0,
  likes integer default 0,
  comments integer default 0,
  shares integer default 0,
  saves integer default 0,
  watch_time float default 0,
  synced_at timestamp with time zone default now()
);

-- Subscriptions
create table if not exists subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text default 'free',
  clips_used integer default 0,
  clips_limit integer default 3,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Brand Kits
create table if not exists brand_kits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  name text,
  logo_url text,
  primary_color text default '#C8F135',
  secondary_color text default '#FFFFFF',
  font_family text default 'DM Sans',
  caption_style text default 'karaoke',
  created_at timestamp with time zone default now()
);

-- RLS
alter table projects enable row level security;
alter table clips enable row level security;
alter table distributions enable row level security;
alter table platform_connections enable row level security;
alter table clip_analytics enable row level security;
alter table subscriptions enable row level security;
alter table brand_kits enable row level security;

create policy "Users own their projects" on projects for all using (auth.uid() = user_id);
create policy "Users own their clips" on clips for all using (auth.uid() = user_id);
create policy "Users own their distributions" on distributions for all using (auth.uid() = user_id);
create policy "Users own their connections" on platform_connections for all using (auth.uid() = user_id);
create policy "Users own their analytics" on clip_analytics for all using (auth.uid() = user_id);
create policy "Users own their subscriptions" on subscriptions for all using (auth.uid() = user_id);
create policy "Users own their brand kits" on brand_kits for all using (auth.uid() = user_id);
