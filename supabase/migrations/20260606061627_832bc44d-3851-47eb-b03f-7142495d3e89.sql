ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS my_role text,
  ADD COLUMN IF NOT EXISTS duration text,
  ADD COLUMN IF NOT EXISTS team_size text,
  ADD COLUMN IF NOT EXISTS challenges text,
  ADD COLUMN IF NOT EXISTS results text,
  ADD COLUMN IF NOT EXISTS lessons text;