
-- Public storage buckets for portfolio assets
insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('project-images', 'project-images', true),
  ('testimonial-avatars', 'testimonial-avatars', true),
  ('resume', 'resume', true)
on conflict (id) do nothing;

-- Public read for all four buckets
create policy "Public read avatars"
  on storage.objects for select
  using (bucket_id in ('avatars','project-images','testimonial-avatars','resume'));

-- Admin-only writes (insert/update/delete)
create policy "Admins can upload to portfolio buckets"
  on storage.objects for insert to authenticated
  with check (
    bucket_id in ('avatars','project-images','testimonial-avatars','resume')
    and has_role(auth.uid(), 'admin'::app_role)
  );

create policy "Admins can update portfolio buckets"
  on storage.objects for update to authenticated
  using (
    bucket_id in ('avatars','project-images','testimonial-avatars','resume')
    and has_role(auth.uid(), 'admin'::app_role)
  );

create policy "Admins can delete from portfolio buckets"
  on storage.objects for delete to authenticated
  using (
    bucket_id in ('avatars','project-images','testimonial-avatars','resume')
    and has_role(auth.uid(), 'admin'::app_role)
  );
