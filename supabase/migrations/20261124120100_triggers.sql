create function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.staff where user_id = (select auth.uid()))
$$;

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.enforce_report_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (
    select count(*) from public.occurrences
    where user_id = new.user_id and created_at > now() - interval '24 hours'
  ) >= 10 then
    raise exception 'Você já marcou 10 problemas nas últimas 24 horas. Tente de novo amanhã.'
      using errcode = 'P0001';
  end if;
  return new;
end;
$$;

create trigger occurrences_rate_limit
  before insert on public.occurrences
  for each row execute function public.enforce_report_rate_limit();

create function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger occurrences_touch_updated_at
  before update on public.occurrences
  for each row execute function public.touch_updated_at();

create function public.sync_confirmations_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target bigint := coalesce(new.occurrence_id, old.occurrence_id);
  total integer;
begin
  select count(*) into total from public.confirmations where occurrence_id = target;
  update public.occurrences set confirmations_count = total where id = target;

  if total >= 5 and not exists (
    select 1 from public.status_events where occurrence_id = target and kind = 'confirmada'
  ) then
    insert into public.status_events (occurrence_id, kind) values (target, 'confirmada');
  end if;

  return null;
end;
$$;

create trigger confirmations_sync_count
  after insert or delete on public.confirmations
  for each row execute function public.sync_confirmations_count();
