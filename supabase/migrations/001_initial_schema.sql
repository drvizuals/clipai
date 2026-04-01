-- ============================================================
-- Omnia — Initial Database Schema
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- PROJECTS
-- A project groups related clips into a campaign or series.
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  description   TEXT,
  cover_url     TEXT,
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own projects"
  ON projects FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- CLIPS
-- The raw source recording uploaded by the creator.
-- ============================================================
CREATE TABLE IF NOT EXISTS clips (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id      UUID REFERENCES projects(id) ON DELETE SET NULL,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  raw_file_url    TEXT,
  thumbnail_url   TEXT,
  duration_secs   INTEGER,
  file_size_bytes BIGINT,
  mime_type       TEXT,
  transcript      TEXT,
  status          TEXT NOT NULL DEFAULT 'uploading'
                    CHECK (status IN ('uploading', 'processing', 'ready', 'failed')),
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clips_user_id    ON clips(user_id);
CREATE INDEX idx_clips_project_id ON clips(project_id);
CREATE INDEX idx_clips_status     ON clips(status);
ALTER TABLE clips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own clips"
  ON clips FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- PLATFORM_CONNECTIONS
-- OAuth tokens for each connected social platform.
-- ============================================================
CREATE TABLE IF NOT EXISTS platform_connections (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform            TEXT NOT NULL
                        CHECK (platform IN (
                          'youtube', 'tiktok', 'instagram', 'linkedin',
                          'twitter', 'threads', 'snapchat'
                        )),
  platform_user_id    TEXT,
  platform_username   TEXT,
  platform_avatar_url TEXT,
  access_token        TEXT,
  refresh_token       TEXT,
  token_expires_at    TIMESTAMPTZ,
  scopes              TEXT[],
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, platform)
);

CREATE INDEX idx_platform_connections_user_id ON platform_connections(user_id);
ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own platform connections"
  ON platform_connections FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- DISTRIBUTIONS
-- A distribution is a clip formatted and published to
-- one specific platform.
-- ============================================================
CREATE TABLE IF NOT EXISTS distributions (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clip_id             UUID NOT NULL REFERENCES clips(id) ON DELETE CASCADE,
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform            TEXT NOT NULL
                        CHECK (platform IN (
                          'youtube', 'tiktok', 'instagram', 'linkedin',
                          'twitter', 'threads', 'snapchat'
                        )),
  platform_post_id    TEXT,
  platform_post_url   TEXT,
  status              TEXT NOT NULL DEFAULT 'draft'
                        CHECK (status IN (
                          'draft', 'scheduled', 'publishing', 'published', 'failed'
                        )),
  title               TEXT,
  description         TEXT,
  hashtags            TEXT[],
  formatted_file_url  TEXT,
  thumbnail_url       TEXT,
  aspect_ratio        TEXT,
  scheduled_at        TIMESTAMPTZ,
  published_at        TIMESTAMPTZ,
  error_message       TEXT,
  ai_suggestions      JSONB DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_distributions_clip_id   ON distributions(clip_id);
CREATE INDEX idx_distributions_user_id   ON distributions(user_id);
CREATE INDEX idx_distributions_platform  ON distributions(platform);
CREATE INDEX idx_distributions_status    ON distributions(status);
CREATE INDEX idx_distributions_scheduled ON distributions(scheduled_at)
  WHERE scheduled_at IS NOT NULL AND status = 'scheduled';
ALTER TABLE distributions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own distributions"
  ON distributions FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- CLIP_ANALYTICS
-- Performance snapshots pulled from each platform's API.
-- ============================================================
CREATE TABLE IF NOT EXISTS clip_analytics (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  distribution_id     UUID NOT NULL REFERENCES distributions(id) ON DELETE CASCADE,
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform            TEXT NOT NULL,
  views               BIGINT DEFAULT 0,
  likes               BIGINT DEFAULT 0,
  comments            BIGINT DEFAULT 0,
  shares              BIGINT DEFAULT 0,
  saves               BIGINT DEFAULT 0,
  watch_time_secs     BIGINT DEFAULT 0,
  avg_watch_pct       NUMERIC(5,2),
  click_through_rate  NUMERIC(5,4),
  impressions         BIGINT DEFAULT 0,
  reach               BIGINT DEFAULT 0,
  raw_payload         JSONB DEFAULT '{}',
  recorded_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clip_analytics_distribution_id ON clip_analytics(distribution_id);
CREATE INDEX idx_clip_analytics_user_id         ON clip_analytics(user_id);
CREATE INDEX idx_clip_analytics_recorded_at     ON clip_analytics(recorded_at DESC);
ALTER TABLE clip_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view their own analytics"
  ON clip_analytics FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- SUBSCRIPTIONS
-- Billing plan per user.
-- ============================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan                    TEXT NOT NULL DEFAULT 'free'
                            CHECK (plan IN ('free', 'creator', 'pro', 'business')),
  status                  TEXT NOT NULL DEFAULT 'active'
                            CHECK (status IN (
                              'active', 'trialing', 'past_due',
                              'cancelled', 'unpaid', 'paused'
                            )),
  stripe_customer_id      TEXT UNIQUE,
  stripe_subscription_id  TEXT UNIQUE,
  current_period_start    TIMESTAMPTZ,
  current_period_end      TIMESTAMPTZ,
  trial_end               TIMESTAMPTZ,
  cancel_at_period_end    BOOLEAN DEFAULT FALSE,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view their own subscription"
  ON subscriptions FOR SELECT USING (auth.uid() = user_id);
-- Subscription writes handled server-side via service role

-- ============================================================
-- BRAND_KITS
-- Saved brand settings applied to distributed content.
-- ============================================================
CREATE TABLE IF NOT EXISTS brand_kits (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name              TEXT NOT NULL DEFAULT 'Default',
  is_default        BOOLEAN NOT NULL DEFAULT FALSE,
  logo_url          TEXT,
  primary_color     TEXT DEFAULT '#c8ff00',
  secondary_color   TEXT DEFAULT '#000000',
  font_family       TEXT DEFAULT 'Inter',
  watermark_url     TEXT,
  watermark_opacity NUMERIC(3,2) DEFAULT 0.8,
  watermark_position TEXT DEFAULT 'bottom-right'
                      CHECK (watermark_position IN (
                        'top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'
                      )),
  intro_clip_url    TEXT,
  outro_clip_url    TEXT,
  caption_style     JSONB DEFAULT '{"font":"Inter","size":16,"color":"#ffffff","background":"rgba(0,0,0,0.6)"}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_brand_kits_user_id ON brand_kits(user_id);
ALTER TABLE brand_kits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own brand kits"
  ON brand_kits FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- AUTO-UPDATE updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_clips_updated_at
  BEFORE UPDATE ON clips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_platform_connections_updated_at
  BEFORE UPDATE ON platform_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_distributions_updated_at
  BEFORE UPDATE ON distributions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_brand_kits_updated_at
  BEFORE UPDATE ON brand_kits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
