begin;
create extension if not exists pgtap with schema extensions;
set search_path = public, extensions;

select plan(26);

insert into auth.users (id, instance_id, aud, role, email, is_anonymous, created_at, updated_at) values
  ('11111111-1111-4111-8111-111111111111', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'maria@teste.local', false, now(), now()),
  ('22222222-2222-4222-8222-222222222222', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'joao@teste.local', false, now(), now()),
  ('33333333-3333-4333-8333-333333333333', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'equipe@teste.local', false, now(), now()),
  ('44444444-4444-4444-8444-444444444444', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', null, true, now(), now());
update public.profiles set display_name = 'Maria da Silva Souza' where id = '11111111-1111-4111-8111-111111111111';
insert into auth.users (id, instance_id, aud, role, email, is_anonymous, created_at, updated_at, raw_user_meta_data) values
  ('55555555-5555-4555-8555-555555555555', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'google@teste.local', false, now(), now(), '{"full_name": "Ana Paula Lima"}');
update auth.users set email_confirmed_at = now() where not is_anonymous and email like '%@teste.local';
insert into public.staff (user_id) values ('33333333-3333-4333-8333-333333333333');

create temporary table ids (name text primary key, id bigint);
grant all on ids to anon, authenticated;

select is(
  (select display_name from public.profiles where id = '55555555-5555-4555-8555-555555555555'),
  'Ana Paula Lima',
  'quem entra com Google já ganha o nome no perfil'
);

set local role authenticated;
set local request.jwt.claims = '{"sub": "44444444-4444-4444-8444-444444444444", "role": "authenticated", "is_anonymous": true}';

select throws_ok(
  $$ insert into public.occurrences (category_id, title, neighborhood, location)
     values ('vias', 'Sessão anônima', 'Centro', 'SRID=4326;POINT(-44.447 -22.468)') $$,
  '42501',
  null,
  'sessão anônima não marca problema'
);

set local request.jwt.claims = '{"sub": "11111111-1111-4111-8111-111111111111", "role": "authenticated", "is_anonymous": false}';

insert into public.occurrences (category_id, title, neighborhood, location)
values ('vias', 'Buraco de teste', 'Centro', 'SRID=4326;POINT(-44.447 -22.468)');
insert into ids select 'mine', max(id) from public.occurrences_public where is_mine;
insert into public.occurrences (category_id, title, neighborhood, location, anonymous)
values ('vias', 'Buraco sem nome', 'Centro', 'SRID=4326;POINT(-44.46 -22.47)', true);
insert into ids select 'hidden', max(id) from public.occurrences_public where is_mine;

select is(
  (select count(*)::integer from public.occurrences_public where is_mine and id = (select id from ids where name = 'mine')),
  1,
  'morador cria relato e ele nasce como dele'
);
select is(
  (select status::text from public.occurrences_public where id = (select id from ids where name = 'mine')),
  'aberta',
  'relato novo nasce aberto'
);
select throws_ok(
  $$ insert into public.occurrences (category_id, title, neighborhood, location, status)
     values ('vias', 'Tentando escolher a situação', 'Centro', 'SRID=4326;POINT(-44.447 -22.468)', 'resolvida') $$,
  '42501',
  null,
  'morador não escolhe a situação do relato'
);
select throws_ok(
  $$ insert into public.occurrences (category_id, title, neighborhood, location, user_id)
     values ('vias', 'Fingindo ser outra pessoa', 'Centro', 'SRID=4326;POINT(-44.447 -22.468)', '22222222-2222-4222-8222-222222222222') $$,
  '42501',
  null,
  'morador não marca em nome de outra pessoa'
);
select throws_ok(
  $$ update public.occurrences set status = 'resolvida' $$,
  '42501',
  null,
  'morador não muda a situação direto na tabela'
);
select throws_ok(
  $$ select user_id from public.occurrences $$,
  '42501',
  null,
  'ninguém lê quem marcou o relato'
);
select throws_ok(
  $$ select public.team_mark_invalid((select id from ids where name = 'mine')) $$,
  '42501',
  null,
  'morador não usa funções da equipe'
);
select is_empty(
  $$ select * from public.content_reports $$,
  'morador não lê denúncias'
);

set local request.jwt.claims = '{"sub": "44444444-4444-4444-8444-444444444444", "role": "authenticated", "is_anonymous": true}';

select throws_ok(
  $$ insert into public.confirmations (occurrence_id) values ((select id from ids where name = 'mine')) $$,
  '42501',
  null,
  'sessão anônima não confirma'
);
select throws_ok(
  $$ insert into public.content_reports (occurrence_id, reason) values ((select id from ids where name = 'mine'), 'ofensivo') $$,
  '42501',
  null,
  'sessão anônima não denuncia'
);

set local request.jwt.claims = '{"sub": "22222222-2222-4222-8222-222222222222", "role": "authenticated", "is_anonymous": false}';

insert into public.confirmations (occurrence_id) values ((select id from ids where name = 'mine'));
select is(
  (select confirmations_count from public.occurrences_public where id = (select id from ids where name = 'mine')),
  1,
  'confirmação de outra pessoa soma no contador'
);
select ok(
  (select confirmed_by_me from public.occurrences_public where id = (select id from ids where name = 'mine')),
  'a pessoa vê que já confirmou'
);
select throws_ok(
  $$ insert into public.confirmations (occurrence_id, user_id)
     values ((select id from ids where name = 'mine'), '11111111-1111-4111-8111-111111111111') $$,
  '42501',
  null,
  'ninguém confirma em nome de outra pessoa'
);
insert into public.content_reports (occurrence_id, reason) values ((select id from ids where name = 'mine'), 'ofensivo');

reset role;
set local role anon;
set local request.jwt.claims = '{"role": "anon"}';

select ok(
  (select count(*) from public.occurrences_public) > 0,
  'visitante vê os relatos públicos'
);
select throws_ok(
  $$ insert into public.occurrences (category_id, title, neighborhood, location)
     values ('vias', 'Visitante', 'Centro', 'SRID=4326;POINT(-44.447 -22.468)') $$,
  '42501',
  null,
  'visitante sem sessão não marca'
);
select ok(
  (select count(*) from public.indicator_records) > 0,
  'visitante vê os indicadores'
);
select is(
  (select author_name from public.occurrences_public where id = (select id from ids where name = 'mine')),
  'Maria S.',
  'relato com nome mostra primeiro nome e inicial'
);
select is(
  (select author_name from public.occurrences_public where id = (select id from ids where name = 'hidden')),
  null,
  'relato com nome oculto não mostra o autor'
);

reset role;
set local role authenticated;
set local request.jwt.claims = '{"sub": "33333333-3333-4333-8333-333333333333", "role": "authenticated", "is_anonymous": false}';

select lives_ok(
  $$ select public.team_update_occurrence((select id from ids where name = 'mine'), 'andamento', 'Prefeitura · Obras', 'Repassado.') $$,
  'equipe muda a situação'
);
select is(
  (select kind::text || ':' || note from public.status_events
   where occurrence_id = (select id from ids where name = 'mine') order by id desc limit 1),
  'andamento:Repassado.',
  'mudança da equipe entra no andamento com a nota'
);
select is(
  (select report_count from public.team_queue() where occurrence_id = (select id from ids where name = 'mine')),
  1,
  'equipe vê a denúncia na fila'
);

insert into public.occurrences (category_id, title, neighborhood, location)
values ('vias', 'Buraco repetido', 'Centro', 'SRID=4326;POINT(-44.447 -22.468)');
insert into ids select 'copy', max(id) from public.occurrences_public;
select public.team_mark_duplicate(
  (select id from ids where name = 'copy'),
  (select id from ids where name = 'mine')
);
select public.team_mark_invalid((select id from ids where name = 'mine'));

reset role;
set local role anon;
set local request.jwt.claims = '{"role": "anon"}';

select is_empty(
  $$ select * from public.occurrences_public where id = (select id from ids where name = 'mine') $$,
  'relato inválido some para o público'
);
select is(
  (select duplicate_of from public.occurrences_public where id = (select id from ids where name = 'copy')),
  (select id from ids where name = 'mine'),
  'duplicado continua legível e aponta para o original'
);

select ok(
  public.registered_residents() >= 3,
  'cadastros contam contas confirmadas'
);

select * from finish();
rollback;
