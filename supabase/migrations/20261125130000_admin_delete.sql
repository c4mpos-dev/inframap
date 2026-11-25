-- Admins are team members who can also delete reports for good. Everyone on the
-- team still reviews, forwards and invalidates; only admins erase.

alter table public.staff add column is_admin boolean not null default false;

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.staff where user_id = (select auth.uid()) and is_admin
  )
$$;

-- Invalid reports are out of the map and the queue; the team still needs to see
-- them to decide whether to erase them.
create function public.team_invalid_queue()
returns table (occurrence_id bigint, report_count integer)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public.assert_staff();
  return query
    select o.id, (select count(*)::integer from public.content_reports r where r.occurrence_id = o.id)
    from public.occurrences o
    where o.moderation = 'invalida'
    order by o.created_at desc;
end;
$$;

-- Deletes the report, its duplicates, and everything hanging from them
-- (confirmations, history, reports). Returns the photo paths so the app can
-- remove the files from storage, which SQL cannot do.
create function public.team_delete_occurrence(p_id bigint)
returns text[]
language plpgsql
security definer
set search_path = ''
as $$
declare
  paths text[];
begin
  if not public.is_admin() then
    raise exception 'Só quem é admin da equipe pode apagar relatos.' using errcode = '42501';
  end if;

  select coalesce(array_agg(photo_path) filter (where photo_path is not null), '{}')
  into paths
  from public.occurrences
  where id = p_id or duplicate_of = p_id;

  delete from public.occurrences where duplicate_of = p_id;
  delete from public.occurrences where id = p_id;
  if not found then
    raise exception 'Relato não encontrado.' using errcode = 'P0002';
  end if;

  return paths;
end;
$$;

create policy "admin apaga fotos de relatos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'occurrence-photos' and (select public.is_admin()));

revoke execute on function public.is_admin, public.team_invalid_queue, public.team_delete_occurrence
  from public, anon;
grant execute on function public.is_admin, public.team_invalid_queue, public.team_delete_occurrence
  to authenticated;
