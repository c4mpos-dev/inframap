create function public.has_confirmed(target bigint)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.confirmations
    where occurrence_id = target and user_id = (select auth.uid())
  )
$$;

create function public.is_my_occurrence(target bigint)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.occurrences where id = target and user_id = (select auth.uid())
  )
$$;

create view public.occurrences_public
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
  o.created_at
from public.occurrences o;

revoke all on public.occurrences_public from anon, authenticated;
grant select on public.occurrences_public to anon, authenticated;

create function public.nearby_occurrences(
  p_lat double precision,
  p_lng double precision,
  p_category text,
  p_radius_meters double precision,
  p_exclude bigint default null
)
returns table (occurrence_id bigint, distance_meters double precision)
language sql
stable
set search_path = ''
as $$
  select o.id, extensions.st_distance(
    o.location,
    extensions.st_setsrid(extensions.st_makepoint(p_lng, p_lat), 4326)::extensions.geography
  )
  from public.occurrences o
  where o.moderation is null
    and o.status <> 'resolvida'
    and o.category_id = p_category
    and (p_exclude is null or o.id <> p_exclude)
    and extensions.st_dwithin(
      o.location,
      extensions.st_setsrid(extensions.st_makepoint(p_lng, p_lat), 4326)::extensions.geography,
      least(p_radius_meters, 1000)
    )
  order by 2
  limit 10
$$;

grant execute on function public.nearby_occurrences to anon, authenticated;

create view public.indicator_records
with (security_invoker = true)
as
select
  o.created_at,
  o.status,
  o.category_id,
  o.neighborhood,
  o.photo_path is not null as has_photo,
  char_length(trim(o.description)) > 0 as has_description,
  o.confirmations_count as confirmations
from public.occurrences o
where o.moderation is null;

revoke all on public.indicator_records from anon, authenticated;
grant select on public.indicator_records to anon, authenticated;

create function public.participating_residents()
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::integer from (
    select user_id from public.occurrences where user_id is not null and moderation is null
    union
    select user_id from public.confirmations
  ) participants
$$;

grant execute on function public.participating_residents to anon, authenticated;
