alter table public.categories enable row level security;
alter table public.profiles enable row level security;
alter table public.staff enable row level security;
alter table public.occurrences enable row level security;
alter table public.confirmations enable row level security;
alter table public.status_events enable row level security;
alter table public.content_reports enable row level security;
alter table public.duplicate_dismissals enable row level security;

revoke all on all tables in schema public from anon, authenticated;

grant select on public.categories to anon, authenticated;
create policy "categorias são públicas" on public.categories
  for select to anon, authenticated using (true);

grant select, update (display_name) on public.profiles to authenticated;
create policy "cada um lê o próprio perfil" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy "cada um edita o próprio perfil" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

grant select on public.staff to authenticated;
create policy "cada um vê se é equipe" on public.staff
  for select to authenticated using (user_id = (select auth.uid()));

grant select (
  id, category_id, status, title, description, neighborhood, location, photo_path, anonymous,
  forwarded_to, moderation, duplicate_of, confirmations_count, created_at, updated_at
) on public.occurrences to anon, authenticated;
grant insert (category_id, title, description, neighborhood, location, photo_path, anonymous)
  on public.occurrences to authenticated;

create policy "relatos visíveis são públicos" on public.occurrences
  for select to anon, authenticated
  using (moderation is distinct from 'invalida' or (select public.is_staff()));
create policy "quem está logado marca problemas" on public.occurrences
  for insert to authenticated
  with check (user_id = (select auth.uid()));

grant select, insert, delete on public.confirmations to authenticated;
create policy "cada um vê as próprias confirmações" on public.confirmations
  for select to authenticated using (user_id = (select auth.uid()));
create policy "cada um confirma por si" on public.confirmations
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "cada um desfaz a própria confirmação" on public.confirmations
  for delete to authenticated using (user_id = (select auth.uid()));

grant select (id, occurrence_id, kind, note, created_at) on public.status_events to anon, authenticated;
create policy "andamento é público" on public.status_events
  for select to anon, authenticated using (true);

grant insert (occurrence_id, reason, details) on public.content_reports to authenticated;
grant select on public.content_reports to authenticated;
create policy "quem está logado denuncia" on public.content_reports
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "só a equipe lê denúncias" on public.content_reports
  for select to authenticated using ((select public.is_staff()));

grant select on public.duplicate_dismissals to authenticated;
create policy "só a equipe vê duplicados descartados" on public.duplicate_dismissals
  for select to authenticated using ((select public.is_staff()));
