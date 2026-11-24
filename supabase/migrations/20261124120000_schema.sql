create extension if not exists postgis with schema extensions;

create type public.occurrence_status as enum ('aberta', 'andamento', 'resolvida');
create type public.moderation_kind as enum ('duplicada', 'invalida');
create type public.event_kind as enum ('nota', 'confirmada', 'andamento', 'resolvida');
create type public.report_reason as enum ('dados_pessoais', 'ofensivo', 'nao_e_infraestrutura', 'outro');

create table public.categories (
  id text primary key,
  label text not null,
  short_label text not null,
  sort_order smallint not null
);

insert into public.categories (id, label, short_label, sort_order) values
  ('vias', 'Vias e buracos', 'Vias', 1),
  ('calcadas', 'Calçadas', 'Calçadas', 2),
  ('saneamento', 'Saneamento', 'Saneamento', 3),
  ('sinalizacao', 'Sinalização', 'Sinalização', 4),
  ('iluminacao', 'Iluminação', 'Iluminação', 5),
  ('outros', 'Outros', 'Outros', 6);

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text check (char_length(display_name) <= 80),
  created_at timestamptz not null default now()
);

create table public.staff (
  user_id uuid primary key references auth.users on delete cascade,
  created_at timestamptz not null default now()
);

create table public.occurrences (
  id bigint generated always as identity (start with 139) primary key,
  user_id uuid default auth.uid() references auth.users on delete set null,
  category_id text not null references public.categories,
  status public.occurrence_status not null default 'aberta',
  title text not null check (char_length(title) between 1 and 120),
  description text not null default '' check (char_length(description) <= 500),
  neighborhood text not null check (char_length(neighborhood) between 1 and 80),
  location extensions.geography(point, 4326) not null,
  photo_path text,
  anonymous boolean not null default true,
  forwarded_to text check (char_length(forwarded_to) <= 80),
  moderation public.moderation_kind,
  duplicate_of bigint references public.occurrences on delete set null,
  confirmations_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (moderation is distinct from 'duplicada' or duplicate_of is not null)
);

create index occurrences_location_idx on public.occurrences using gist (location);
create index occurrences_created_at_idx on public.occurrences (created_at desc);
create index occurrences_user_id_idx on public.occurrences (user_id);
create index occurrences_visible_idx on public.occurrences (status, category_id) where moderation is null;

create table public.confirmations (
  occurrence_id bigint not null references public.occurrences on delete cascade,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  primary key (occurrence_id, user_id)
);

create index confirmations_user_id_idx on public.confirmations (user_id);

create table public.status_events (
  id bigint generated always as identity primary key,
  occurrence_id bigint not null references public.occurrences on delete cascade,
  kind public.event_kind not null,
  note text check (char_length(note) <= 300),
  created_by uuid references auth.users on delete set null,
  created_at timestamptz not null default now()
);

create index status_events_occurrence_idx on public.status_events (occurrence_id, created_at);

create table public.content_reports (
  id bigint generated always as identity primary key,
  occurrence_id bigint not null references public.occurrences on delete cascade,
  user_id uuid default auth.uid() references auth.users on delete set null,
  reason public.report_reason not null,
  details text not null default '' check (char_length(details) <= 300),
  created_at timestamptz not null default now()
);

create index content_reports_occurrence_idx on public.content_reports (occurrence_id);

create table public.duplicate_dismissals (
  occurrence_id bigint not null references public.occurrences on delete cascade,
  other_id bigint not null references public.occurrences on delete cascade,
  primary key (occurrence_id, other_id)
);
