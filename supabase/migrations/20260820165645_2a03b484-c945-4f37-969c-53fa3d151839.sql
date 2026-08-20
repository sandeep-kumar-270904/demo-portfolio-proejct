CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issuer_logo_url TEXT,
  issue_date TEXT,
  verify_url TEXT,
  source_type TEXT NOT NULL DEFAULT 'manual',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.certificates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificates TO authenticated;
GRANT ALL ON public.certificates TO service_role;

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Certificates are publicly readable"
ON public.certificates FOR SELECT
USING (true);

CREATE POLICY "Admins manage certificates"
ON public.certificates FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_certificates_updated_at
BEFORE UPDATE ON public.certificates
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();