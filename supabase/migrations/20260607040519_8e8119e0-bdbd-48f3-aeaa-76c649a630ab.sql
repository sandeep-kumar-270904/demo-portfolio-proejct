ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS overview TEXT,
  ADD COLUMN IF NOT EXISTS case_study_url TEXT;