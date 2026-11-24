insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('occurrence-photos', 'occurrence-photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "fotos dos relatos são públicas" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'occurrence-photos');

create policy "cada um envia fotos na própria pasta" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'occurrence-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
