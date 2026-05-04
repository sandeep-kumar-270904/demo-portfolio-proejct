
-- Visitor tracking: simple counter table
CREATE TABLE public.site_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL DEFAULT '/',
  user_agent text,
  referrer text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record a visit"
  ON public.site_visits FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can read site_visits"
  ON public.site_visits FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Public aggregate count (so we can show total visitors without exposing rows)
CREATE OR REPLACE FUNCTION public.get_visit_count()
RETURNS bigint
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT count(*)::bigint FROM public.site_visits;
$$;

-- Add socials JSON to personal_info usage by inserting default keys (key/value table already exists)
INSERT INTO public.personal_info (key, value) VALUES
  ('social_github', 'https://github.com/edhubilli-sandeep'),
  ('social_linkedin', ''),
  ('social_twitter', ''),
  ('social_youtube', ''),
  ('social_instagram', '')
ON CONFLICT DO NOTHING;
