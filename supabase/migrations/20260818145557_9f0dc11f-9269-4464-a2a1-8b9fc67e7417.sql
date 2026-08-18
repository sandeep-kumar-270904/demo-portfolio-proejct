ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS glance_media jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS architecture_images jsonb NOT NULL DEFAULT '[]'::jsonb;