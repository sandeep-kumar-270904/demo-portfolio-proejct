-- ============ projects ============
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  long_description text,
  tags text[] NOT NULL DEFAULT '{}',
  tech_stack text[] NOT NULL DEFAULT '{}',
  live_url text,
  github_url text,
  image_url text,
  featured boolean NOT NULL DEFAULT false,
  category text CHECK (category IN ('SaaS','Ecommerce','DevTools','AI','Other')),
  sort_order integer NOT NULL DEFAULT 0,
  stats jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admins can insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can update projects" ON public.projects FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can delete projects" ON public.projects FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ skills ============
CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text CHECK (category IN ('Frontend','Backend','DevOps','Tools','Database')),
  level integer CHECK (level BETWEEN 0 AND 100),
  icon text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Admins can insert skills" ON public.skills FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can update skills" ON public.skills FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can delete skills" ON public.skills FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- ============ experience ============
CREATE TABLE public.experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  company text NOT NULL,
  period text,
  type text CHECK (type IN ('work','education')),
  bullets text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read experience" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Admins can insert experience" ON public.experience FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can update experience" ON public.experience FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can delete experience" ON public.experience FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- ============ testimonials ============
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL,
  name text NOT NULL,
  role text,
  company text,
  avatar_url text,
  linkedin_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Admins can insert testimonials" ON public.testimonials FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can update testimonials" ON public.testimonials FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can delete testimonials" ON public.testimonials FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- ============ blog_posts (external link blog, separate from existing posts table) ============
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text,
  published_date date,
  read_time text,
  tags text[] NOT NULL DEFAULT '{}',
  external_url text,
  is_published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published blog_posts" ON public.blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can read all blog_posts" ON public.blog_posts FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can insert blog_posts" ON public.blog_posts FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can update blog_posts" ON public.blog_posts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can delete blog_posts" ON public.blog_posts FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- ============ personal_info (key-value) ============
CREATE TABLE public.personal_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.personal_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read personal_info" ON public.personal_info FOR SELECT USING (true);
CREATE POLICY "Admins can insert personal_info" ON public.personal_info FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can update personal_info" ON public.personal_info FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can delete personal_info" ON public.personal_info FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_personal_info_updated BEFORE UPDATE ON public.personal_info FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.personal_info (key, value) VALUES
  ('name','Edhubilli Sandeep Kumar'),
  ('tagline','Full Stack Engineer · Architecting systems that scale'),
  ('bio_1','I architect full-stack systems that scale — from PostgreSQL schemas to Kubernetes clusters. I turn complex business problems into clean, performant, production-grade products.'),
  ('bio_2','Based in India, I work async-first with teams across timezones. My focus: shipping fast without sacrificing engineering quality.'),
  ('bio_3','When I''m not coding, I''m probably reading distributed-systems papers or tinkering with side projects.'),
  ('location','India'),
  ('timezone','IST (UTC+5:30)'),
  ('email','sandeepkumar.dev@gmail.com'),
  ('resume_url','/resume.pdf'),
  ('is_available','true'),
  ('available_until','April 2026'),
  ('github_username','edhubilli-sandeep'),
  ('linkedin_url',''),
  ('twitter_url','');

-- ============ contact_messages: add new columns alongside existing 'body' ============
ALTER TABLE public.contact_messages
  ADD COLUMN IF NOT EXISTS message text,
  ADD COLUMN IF NOT EXISTS budget_range text;
-- 'subject' already exists. Backfill 'message' from 'body' so existing data isn't lost.
UPDATE public.contact_messages SET message = body WHERE message IS NULL;
-- Allow new inserts to use either 'message' or 'body' by relaxing body to nullable.
ALTER TABLE public.contact_messages ALTER COLUMN body DROP NOT NULL;