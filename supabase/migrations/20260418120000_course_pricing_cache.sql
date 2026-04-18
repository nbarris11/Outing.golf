-- Course pricing cache — populated via Anthropic web search. Keyed by normalized
-- (course name + location) so all outings share the same enriched price.
create table if not exists public.course_pricing (
  id uuid primary key default gen_random_uuid(),
  lookup_key text not null unique,
  course_name text not null,
  location_label text not null,
  weekday_rate integer,
  weekend_rate integer,
  avg_rate integer,
  source_url text,
  source_name text,
  notes text,
  confidence text check (confidence in ('high', 'medium', 'low')),
  fetched_at timestamptz not null default now()
);

create index if not exists course_pricing_lookup_key_idx on public.course_pricing (lookup_key);

alter table public.course_pricing enable row level security;

-- Everyone authenticated can read the shared cache
create policy "course_pricing_select_authenticated"
on public.course_pricing for select
to authenticated
using (true);

-- Only service role (server) writes — no client write policy
