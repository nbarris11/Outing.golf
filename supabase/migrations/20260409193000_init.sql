create extension if not exists "pgcrypto";

create type public.app_role as enum ('member', 'admin');
create type public.outing_role as enum ('organizer', 'participant');
create type public.outing_status as enum ('planning', 'narrowed_down', 'booked', 'completed');
create type public.invite_status as enum ('pending', 'accepted', 'declined');
create type public.destination_type as enum ('open', 'city', 'state', 'region');
create type public.trip_style as enum ('value', 'classic', 'premium', 'bucket_list');
create type public.golf_intensity as enum ('light', 'balanced', 'golf_first');
create type public.lodging_type as enum ('hotel', 'resort', 'house', 'mixed');
create type public.vote_entity_type as enum ('destination', 'golf_course', 'lodging');

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text not null,
  avatar_url text,
  home_airport text,
  handicap text,
  app_role public.app_role not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and app_role = 'admin'
  );
$$;

create table if not exists public.outings (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  destination_type public.destination_type not null,
  destination_label text not null,
  preferred_date_windows jsonb not null default '[]'::jsonb,
  budget_target integer not null check (budget_target > 0),
  trip_style public.trip_style not null,
  number_of_players integer not null check (number_of_players between 2 and 24),
  golf_intensity public.golf_intensity not null,
  lodging_preference public.lodging_type not null,
  notes text,
  status public.outing_status not null default 'planning',
  organizer_weighting integer not null default 5 check (organizer_weighting between 1 and 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.outing_members (
  id uuid primary key default gen_random_uuid(),
  outing_id uuid not null references public.outings (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  role public.outing_role not null default 'participant',
  joined_at timestamptz not null default now(),
  unique (outing_id, profile_id)
);

create table if not exists public.invites (
  id uuid primary key default gen_random_uuid(),
  outing_id uuid not null references public.outings (id) on delete cascade,
  email text not null,
  invited_by uuid not null references public.profiles (id) on delete cascade,
  status public.invite_status not null default 'pending',
  token text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.preference_submissions (
  id uuid primary key default gen_random_uuid(),
  outing_id uuid not null references public.outings (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  budget_min integer not null,
  budget_max integer not null,
  available_dates text[] not null default '{}',
  destination_votes text[] not null default '{}',
  lodging_preferences public.lodging_type[] not null default '{}',
  course_quality_preference integer not null default 5 check (course_quality_preference between 1 and 10),
  walking_preference text not null default 'either',
  comments text,
  updated_at timestamptz not null default now(),
  unique (outing_id, profile_id)
);

create table if not exists public.destination_options (
  id uuid primary key default gen_random_uuid(),
  outing_id uuid not null references public.outings (id) on delete cascade,
  provider_key text not null,
  name text not null,
  region text not null,
  drive_hours numeric,
  flight_hours numeric,
  average_nightly_rate integer not null,
  average_round_cost integer not null,
  tags text[] not null default '{}',
  summary text not null,
  featured boolean not null default false,
  hidden boolean not null default false,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.golf_course_options (
  id uuid primary key default gen_random_uuid(),
  outing_id uuid not null references public.outings (id) on delete cascade,
  destination_option_id uuid not null references public.destination_options (id) on delete cascade,
  provider_key text not null,
  name text not null,
  location_label text not null,
  average_greens_fee integer not null,
  quality_score integer not null,
  ride_friendly boolean not null default true,
  walking_friendly boolean not null default true,
  summary text not null,
  tags text[] not null default '{}',
  featured boolean not null default false,
  hidden boolean not null default false,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.lodging_options (
  id uuid primary key default gen_random_uuid(),
  outing_id uuid not null references public.outings (id) on delete cascade,
  destination_option_id uuid not null references public.destination_options (id) on delete cascade,
  provider_key text not null,
  name text not null,
  nightly_rate integer not null,
  lodging_type public.lodging_type not null,
  sleeps integer not null,
  summary text not null,
  tags text[] not null default '{}',
  featured boolean not null default false,
  hidden boolean not null default false,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  outing_id uuid not null references public.outings (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  entity_type public.vote_entity_type not null,
  entity_id uuid not null,
  weight integer not null default 1 check (weight between 1 and 5),
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  outing_id uuid not null references public.outings (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  entity_type public.vote_entity_type not null,
  entity_id uuid not null,
  created_at timestamptz not null default now(),
  unique (outing_id, profile_id, entity_type, entity_id)
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  outing_id uuid not null references public.outings (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.feature_flags (
  key text primary key,
  label text not null,
  enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.content_blocks (
  key text primary key,
  title text not null,
  body text not null,
  cta_label text,
  cta_href text,
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid references public.profiles (id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.outings enable row level security;
alter table public.outing_members enable row level security;
alter table public.invites enable row level security;
alter table public.preference_submissions enable row level security;
alter table public.destination_options enable row level security;
alter table public.golf_course_options enable row level security;
alter table public.lodging_options enable row level security;
alter table public.votes enable row level security;
alter table public.favorites enable row level security;
alter table public.chat_messages enable row level security;
alter table public.feature_flags enable row level security;
alter table public.admin_settings enable row level security;
alter table public.content_blocks enable row level security;
alter table public.activity_log enable row level security;

create policy "profiles_self_select"
on public.profiles for select
using (id = auth.uid() or public.is_admin());

create policy "profiles_self_update"
on public.profiles for update
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

create policy "outings_member_select"
on public.outings for select
using (
  organizer_id = auth.uid()
  or exists (
    select 1 from public.outing_members
    where outing_id = public.outings.id
      and profile_id = auth.uid()
  )
  or public.is_admin()
);

create policy "outings_organizer_insert"
on public.outings for insert
with check (organizer_id = auth.uid() or public.is_admin());

create policy "outings_organizer_update"
on public.outings for update
using (organizer_id = auth.uid() or public.is_admin())
with check (organizer_id = auth.uid() or public.is_admin());

create policy "outing_members_member_select"
on public.outing_members for select
using (
  profile_id = auth.uid()
  or exists (
    select 1 from public.outings
    where id = outing_members.outing_id
      and organizer_id = auth.uid()
  )
  or public.is_admin()
);

create policy "outing_members_organizer_manage"
on public.outing_members for all
using (
  exists (
    select 1 from public.outings
    where id = outing_members.outing_id
      and organizer_id = auth.uid()
  )
  or public.is_admin()
)
with check (
  exists (
    select 1 from public.outings
    where id = outing_members.outing_id
      and organizer_id = auth.uid()
  )
  or public.is_admin()
);

create policy "invites_member_select"
on public.invites for select
using (
  exists (
    select 1 from public.outing_members
    where outing_id = invites.outing_id
      and profile_id = auth.uid()
  )
  or exists (
    select 1 from public.outings
    where id = invites.outing_id
      and organizer_id = auth.uid()
  )
  or public.is_admin()
);

create policy "invites_organizer_manage"
on public.invites for all
using (
  exists (
    select 1 from public.outings
    where id = invites.outing_id
      and organizer_id = auth.uid()
  )
  or public.is_admin()
)
with check (
  exists (
    select 1 from public.outings
    where id = invites.outing_id
      and organizer_id = auth.uid()
  )
  or public.is_admin()
);

create policy "preferences_member_select"
on public.preference_submissions for select
using (
  profile_id = auth.uid()
  or exists (
    select 1 from public.outing_members
    where outing_id = preference_submissions.outing_id
      and profile_id = auth.uid()
  )
  or exists (
    select 1 from public.outings
    where id = preference_submissions.outing_id
      and organizer_id = auth.uid()
  )
  or public.is_admin()
);

create policy "preferences_member_upsert"
on public.preference_submissions for all
using (
  profile_id = auth.uid()
  or public.is_admin()
)
with check (
  profile_id = auth.uid()
  or public.is_admin()
);

create policy "destination_member_select"
on public.destination_options for select
using (
  exists (
    select 1 from public.outing_members
    where outing_id = destination_options.outing_id
      and profile_id = auth.uid()
  )
  or exists (
    select 1 from public.outings
    where id = destination_options.outing_id
      and organizer_id = auth.uid()
  )
  or public.is_admin()
);

create policy "destination_admin_manage"
on public.destination_options for all
using (public.is_admin())
with check (public.is_admin());

create policy "golf_member_select"
on public.golf_course_options for select
using (
  exists (
    select 1 from public.outing_members
    where outing_id = golf_course_options.outing_id
      and profile_id = auth.uid()
  )
  or exists (
    select 1 from public.outings
    where id = golf_course_options.outing_id
      and organizer_id = auth.uid()
  )
  or public.is_admin()
);

create policy "golf_admin_manage"
on public.golf_course_options for all
using (public.is_admin())
with check (public.is_admin());

create policy "lodging_member_select"
on public.lodging_options for select
using (
  exists (
    select 1 from public.outing_members
    where outing_id = lodging_options.outing_id
      and profile_id = auth.uid()
  )
  or exists (
    select 1 from public.outings
    where id = lodging_options.outing_id
      and organizer_id = auth.uid()
  )
  or public.is_admin()
);

create policy "lodging_admin_manage"
on public.lodging_options for all
using (public.is_admin())
with check (public.is_admin());

create policy "votes_member_select"
on public.votes for select
using (
  profile_id = auth.uid()
  or exists (
    select 1 from public.outing_members
    where outing_id = votes.outing_id
      and profile_id = auth.uid()
  )
  or public.is_admin()
);

create policy "votes_member_write"
on public.votes for all
using (
  profile_id = auth.uid()
  or public.is_admin()
)
with check (
  profile_id = auth.uid()
  or public.is_admin()
);

create policy "favorites_member_select"
on public.favorites for select
using (
  profile_id = auth.uid()
  or exists (
    select 1 from public.outing_members
    where outing_id = favorites.outing_id
      and profile_id = auth.uid()
  )
  or public.is_admin()
);

create policy "favorites_member_write"
on public.favorites for all
using (
  profile_id = auth.uid()
  or public.is_admin()
)
with check (
  profile_id = auth.uid()
  or public.is_admin()
);

create policy "chat_member_select"
on public.chat_messages for select
using (
  exists (
    select 1 from public.outing_members
    where outing_id = chat_messages.outing_id
      and profile_id = auth.uid()
  )
  or exists (
    select 1 from public.outings
    where id = chat_messages.outing_id
      and organizer_id = auth.uid()
  )
  or public.is_admin()
);

create policy "chat_member_insert"
on public.chat_messages for insert
with check (
  profile_id = auth.uid()
  and (
    exists (
      select 1 from public.outing_members
      where outing_id = chat_messages.outing_id
        and profile_id = auth.uid()
    )
    or exists (
      select 1 from public.outings
      where id = chat_messages.outing_id
        and organizer_id = auth.uid()
    )
    or public.is_admin()
  )
);

create policy "admin_tables_admin_only_flags"
on public.feature_flags for all
using (public.is_admin())
with check (public.is_admin());

create policy "admin_tables_admin_only_settings"
on public.admin_settings for all
using (public.is_admin())
with check (public.is_admin());

create policy "content_blocks_public_read"
on public.content_blocks for select
using (true);

create policy "content_blocks_admin_write"
on public.content_blocks for all
using (public.is_admin())
with check (public.is_admin());

create policy "activity_log_admin_only"
on public.activity_log for select
using (public.is_admin());

alter publication supabase_realtime add table public.chat_messages;
