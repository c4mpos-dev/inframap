create function public.assert_staff()
returns void
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_staff() then
    raise exception 'Só a equipe pode fazer isso.' using errcode = '42501';
  end if;
end;
$$;

create function public.team_queue()
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
    where o.moderation is null
    order by o.created_at desc;
end;
$$;

create function public.team_update_occurrence(
  p_id bigint,
  p_status public.occurrence_status,
  p_forwarded_to text,
  p_note text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_status public.occurrence_status;
  clean_note text := nullif(trim(p_note), '');
begin
  perform public.assert_staff();

  select status into current_status from public.occurrences where id = p_id for update;
  if not found then
    raise exception 'Relato não encontrado.' using errcode = 'P0002';
  end if;

  update public.occurrences
  set status = p_status, forwarded_to = nullif(trim(p_forwarded_to), '')
  where id = p_id;

  if p_status <> current_status or clean_note is not null then
    insert into public.status_events (occurrence_id, kind, note, created_by)
    values (
      p_id,
      case p_status when 'aberta' then 'nota' else p_status::text end::public.event_kind,
      clean_note,
      (select auth.uid())
    );
  end if;
end;
$$;

create function public.team_mark_duplicate(p_id bigint, p_original_id bigint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.assert_staff();
  if p_id = p_original_id then
    raise exception 'Um relato não pode ser duplicado dele mesmo.' using errcode = '22023';
  end if;
  update public.occurrences
  set moderation = 'duplicada', duplicate_of = p_original_id
  where id = p_id;
end;
$$;

create function public.team_dismiss_duplicate(p_id bigint, p_other_id bigint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.assert_staff();
  insert into public.duplicate_dismissals (occurrence_id, other_id)
  values (p_id, p_other_id), (p_other_id, p_id)
  on conflict do nothing;
end;
$$;

create function public.team_mark_invalid(p_id bigint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.assert_staff();
  update public.occurrences set moderation = 'invalida' where id = p_id;
end;
$$;

create function public.team_possible_duplicate(p_id bigint)
returns table (occurrence_id bigint, distance_meters double precision)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public.assert_staff();
  return query
    select other.id, extensions.st_distance(other.location, target.location)
    from public.occurrences target
    join public.occurrences other
      on other.id <> target.id
     and other.category_id = target.category_id
     and other.moderation is null
     and other.status <> 'resolvida'
     and extensions.st_dwithin(other.location, target.location, 50)
    where target.id = p_id
      and not exists (
        select 1 from public.duplicate_dismissals d
        where d.occurrence_id = p_id and d.other_id = other.id
      )
    order by 2
    limit 1;
end;
$$;

revoke execute on all functions in schema public from public, anon;
grant execute on function public.nearby_occurrences to anon, authenticated;
grant execute on function public.participating_residents to anon, authenticated;
grant execute on function public.has_confirmed to anon, authenticated;
grant execute on function public.is_my_occurrence to anon, authenticated;
grant execute on function public.is_staff to anon, authenticated;
grant execute on function
  public.team_queue,
  public.team_update_occurrence,
  public.team_mark_duplicate,
  public.team_dismiss_duplicate,
  public.team_mark_invalid,
  public.team_possible_duplicate
to authenticated;
