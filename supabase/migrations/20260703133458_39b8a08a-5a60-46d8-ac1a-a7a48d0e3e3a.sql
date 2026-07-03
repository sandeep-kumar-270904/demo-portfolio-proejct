
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS status_badge text,
  ADD COLUMN IF NOT EXISTS hero_images text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS architecture jsonb NOT NULL DEFAULT '{"nodes":[],"edges":[]}'::jsonb,
  ADD COLUMN IF NOT EXISTS features_deep jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS frontend_cards jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS backend_cards jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS key_decision jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS stack_groups jsonb NOT NULL DEFAULT '[]'::jsonb;
