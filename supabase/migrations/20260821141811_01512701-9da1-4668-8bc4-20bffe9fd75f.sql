alter table public.experience add column if not exists company_logo_url text;
alter table public.certificates replica identity full;
alter publication supabase_realtime add table public.certificates;