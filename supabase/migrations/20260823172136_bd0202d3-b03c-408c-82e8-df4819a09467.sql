CREATE TABLE IF NOT EXISTS public.github_cache (
  id text PRIMARY KEY,
  payload jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.github_cache TO service_role;
ALTER TABLE public.github_cache ENABLE ROW LEVEL SECURITY;