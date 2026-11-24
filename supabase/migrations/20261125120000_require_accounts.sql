-- Everyone who acts on the map needs a confirmed account. Anonymous Supabase
-- sessions (is_anonymous in the JWT) can still read, but can no longer write.

create function public.is_identified()
returns boolean
language sql
stable
set search_path = ''
as $$
  select (select auth.uid()) is not null
    and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, true) = false
$$;

grant execute on function public.is_identified to anon, authenticated;

drop policy "quem está logado marca problemas" on public.occurrences;
create policy "quem tem conta marca problemas" on public.occurrences
  for insert to authenticated
  with check (user_id = (select auth.uid()) and (select public.is_identified()));

drop policy "cada um confirma por si" on public.confirmations;
create policy "quem tem conta confirma por si" on public.confirmations
  for insert to authenticated
  with check (user_id = (select auth.uid()) and (select public.is_identified()));

drop policy "quem está logado denuncia" on public.content_reports;
create policy "quem tem conta denuncia" on public.content_reports
  for insert to authenticated
  with check (user_id = (select auth.uid()) and (select public.is_identified()));

drop policy "cada um envia fotos na própria pasta" on storage.objects;
create policy "quem tem conta envia fotos na própria pasta" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'occurrence-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.is_identified())
  );

-- Profiles: the name comes from Google when there is one; people who sign up
-- by e-mail choose it on their first visit.

alter table public.profiles
  add constraint profiles_display_name_not_blank
  check (display_name is null or char_length(trim(display_name)) between 2 and 60);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  google_name text := nullif(trim(coalesce(
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'name'
  )), '');
begin
  insert into public.profiles (id, display_name)
  values (new.id, left(google_name, 60))
  on conflict do nothing;
  return new;
end;
$$;

-- "Cauã Campos" becomes "Cauã C."; hidden or nameless authors get null and the
-- app shows "Morador(a) de Resende".
create function public.public_author_name(full_name text)
returns text
language sql
immutable
set search_path = ''
as $$
  select case
    when parts is null or array_length(parts, 1) is null then null
    when array_length(parts, 1) = 1 then parts[1]
    else parts[1] || ' ' || upper(left(parts[array_length(parts, 1)], 1)) || '.'
  end
  from (select regexp_split_to_array(nullif(trim(full_name), ''), '\s+') as parts) words
$$;

create function public.occurrence_author(target bigint)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select case when o.anonymous then null else public.public_author_name(p.display_name) end
  from public.occurrences o
  left join public.profiles p on p.id = o.user_id
  where o.id = target
$$;

create or replace view public.occurrences_public
with (security_invoker = true)
as
select
  o.id,
  o.category_id,
  o.status,
  o.title,
  o.description,
  o.neighborhood,
  extensions.st_y(o.location::extensions.geometry) as lat,
  extensions.st_x(o.location::extensions.geometry) as lng,
  o.photo_path,
  o.anonymous,
  o.forwarded_to,
  o.moderation,
  o.duplicate_of,
  o.confirmations_count,
  public.has_confirmed(o.id) as confirmed_by_me,
  public.is_my_occurrence(o.id) as is_mine,
  o.created_at,
  public.occurrence_author(o.id) as author_name
from public.occurrences o;

-- "Cadastros" on the indicators page: confirmed accounts, not counting the team.
create function public.registered_residents()
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::integer
  from auth.users u
  where not u.is_anonymous
    and (u.email_confirmed_at is not null or u.raw_app_meta_data ->> 'provider' <> 'email')
    and not exists (select 1 from public.staff s where s.user_id = u.id)
$$;

grant execute on function public.registered_residents to anon, authenticated;

drop function public.participating_residents();

-- With accounts, the name shows by default; hiding it is the person's choice.
alter table public.occurrences alter column anonymous set default false;

-- Accounts created before this change get the Google name when there is one.
update public.profiles p
set display_name = left(nullif(trim(coalesce(
  u.raw_user_meta_data ->> 'full_name',
  u.raw_user_meta_data ->> 'name'
)), ''), 60)
from auth.users u
where u.id = p.id and p.display_name is null;
