insert into auth.users (id, instance_id, aud, role, email, is_anonymous, created_at, updated_at)
values (
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'exemplos@inframap.local',
  false,
  now(),
  now()
);

insert into public.occurrences
  (user_id, category_id, status, title, description, neighborhood, location, created_at, confirmations_count)
values
  ('00000000-0000-4000-8000-000000000001', 'vias', 'aberta', 'Buraco que vira lagoa quando chove',
   'O buraco fica cheio d’água quando chove e os carros desviam pela contramão.', 'Campos Elíseos',
   'SRID=4326;POINT(-44.4505 -22.4641)', now() - interval '2 days', 0),
  ('00000000-0000-4000-8000-000000000001', 'calcadas', 'andamento', 'Calçada levantada por raiz de árvore',
   'A raiz levantou as placas e quem passa com carrinho precisa ir pela rua.', 'Centro',
   'SRID=4326;POINT(-44.4474 -22.4683)', now() - interval '5 days', 0),
  ('00000000-0000-4000-8000-000000000001', 'saneamento', 'aberta', 'Bueiro entupido na esquina',
   'Com qualquer chuva a água volta e alaga a esquina inteira.', 'Jardim Jalisco',
   'SRID=4326;POINT(-44.4551 -22.4667)', now() - interval '1 day', 0),
  ('00000000-0000-4000-8000-000000000001', 'sinalizacao', 'resolvida', 'Placa de PARE caída',
   'A placa caiu depois do temporal e o cruzamento ficou sem sinalização.', 'Manejo',
   'SRID=4326;POINT(-44.4575 -22.4695)', now() - interval '14 days', 0),
  ('00000000-0000-4000-8000-000000000001', 'iluminacao', 'andamento', 'Poste apagado no quarteirão todo',
   'Os três postes da rua estão apagados há mais de uma semana.', 'Paraíso',
   'SRID=4326;POINT(-44.4362 -22.4561)', now() - interval '3 days', 0),
  ('00000000-0000-4000-8000-000000000001', 'sinalizacao', 'aberta', 'Faixa de pedestre apagada',
   'A faixa em frente à escola quase não aparece mais.', 'Vila Julieta',
   'SRID=4326;POINT(-44.4612 -22.4704)', now() - interval '3 hours', 0),
  ('00000000-0000-4000-8000-000000000001', 'saneamento', 'aberta', 'Esgoto correndo na sarjeta',
   'O esgoto escorre pela sarjeta e o cheiro chega nas casas.', 'Cidade Alegria',
   'SRID=4326;POINT(-44.4940 -22.4801)', now() - interval '4 days', 0),
  ('00000000-0000-4000-8000-000000000001', 'vias', 'resolvida', 'Buraco na ciclovia',
   'Buraco no meio da ciclovia, perigoso para quem passa de bicicleta à noite.', 'Itapuca',
   'SRID=4326;POINT(-44.4806 -22.4714)', now() - interval '31 days', 0);

insert into public.status_events (occurrence_id, kind, note, created_at) values
  (140, 'andamento', 'Repassada à secretaria de obras junto com outros relatos do bairro.', now() - interval '3 days'),
  (142, 'andamento', 'Repassada ao setor de trânsito da prefeitura.', now() - interval '12 days'),
  (142, 'resolvida', 'A placa foi recolocada. A equipe conferiu no local.', now() - interval '6 days'),
  (143, 'andamento', 'Repassada à concessionária de energia junto com outros relatos do bairro.', now() - interval '1 day'),
  (146, 'andamento', 'Repassada à secretaria de obras.', now() - interval '30 days'),
  (146, 'resolvida', 'Buraco tapado. A equipe conferiu no local.', now() - interval '10 days');
