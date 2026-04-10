alter table public.lodging_options
  add column if not exists price_total integer,
  add column if not exists currency text,
  add column if not exists room_name text,
  add column if not exists board_type text,
  add column if not exists cancellation_summary text,
  add column if not exists refundable boolean,
  add column if not exists hotel_address text,
  add column if not exists city text,
  add column if not exists state text,
  add column if not exists country text,
  add column if not exists latitude double precision,
  add column if not exists longitude double precision,
  add column if not exists star_rating numeric(3,1),
  add column if not exists review_score numeric(3,1),
  add column if not exists thumbnail_url text,
  add column if not exists amenities text[] not null default '{}',
  add column if not exists check_in date,
  add column if not exists check_out date,
  add column if not exists guest_count integer,
  add column if not exists offer_id text,
  add column if not exists hotel_id text,
  add column if not exists raw_provider_data jsonb not null default '{}'::jsonb,
  add column if not exists top_pick boolean not null default false;

create table if not exists public.lodging_search_requests (
  id uuid primary key default gen_random_uuid(),
  outing_id uuid references public.outings (id) on delete cascade,
  provider text not null,
  destination_query text not null,
  request_json jsonb not null default '{}'::jsonb,
  results_count integer not null default 0,
  used_fallback boolean not null default false,
  status text not null default 'completed',
  error_message text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.saved_lodging_options (
  id uuid primary key default gen_random_uuid(),
  outing_id uuid not null references public.outings (id) on delete cascade,
  lodging_option_id uuid not null references public.lodging_options (id) on delete cascade,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (outing_id, lodging_option_id)
);

create table if not exists public.lodging_prebooks (
  id uuid primary key default gen_random_uuid(),
  outing_id uuid not null references public.outings (id) on delete cascade,
  provider text not null,
  offer_id text not null,
  prebook_id text not null,
  status text not null default 'created',
  price_total integer,
  currency text,
  expires_at timestamptz,
  response_json jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.lodging_bookings (
  id uuid primary key default gen_random_uuid(),
  outing_id uuid not null references public.outings (id) on delete cascade,
  provider text not null,
  prebook_id text not null,
  provider_booking_id text,
  provider_confirmation_code text,
  status text not null default 'pending',
  total_price integer,
  currency text,
  guest_email text,
  client_reference text,
  response_json jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.lodging_api_errors (
  id uuid primary key default gen_random_uuid(),
  outing_id uuid references public.outings (id) on delete cascade,
  provider text not null,
  route text not null,
  error_message text not null,
  context_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create unique index if not exists lodging_options_outing_offer_id_idx
  on public.lodging_options (outing_id, offer_id)
  where offer_id is not null;

create unique index if not exists lodging_prebooks_provider_prebook_idx
  on public.lodging_prebooks (provider, prebook_id);

create unique index if not exists lodging_bookings_provider_booking_idx
  on public.lodging_bookings (provider, provider_booking_id)
  where provider_booking_id is not null;

alter table public.lodging_search_requests enable row level security;
alter table public.saved_lodging_options enable row level security;
alter table public.lodging_prebooks enable row level security;
alter table public.lodging_bookings enable row level security;
alter table public.lodging_api_errors enable row level security;

create policy "lodging_search_requests_member_select"
on public.lodging_search_requests for select
using (
  public.is_admin()
  or created_by = auth.uid()
  or exists (
    select 1 from public.outings
    where id = lodging_search_requests.outing_id
      and organizer_id = auth.uid()
  )
  or exists (
    select 1 from public.outing_members
    where outing_id = lodging_search_requests.outing_id
      and profile_id = auth.uid()
  )
);

create policy "lodging_search_requests_insert"
on public.lodging_search_requests for insert
with check (
  public.is_admin()
  or created_by = auth.uid()
);

create policy "saved_lodging_options_member_select"
on public.saved_lodging_options for select
using (
  public.is_admin()
  or exists (
    select 1 from public.outings
    where id = saved_lodging_options.outing_id
      and organizer_id = auth.uid()
  )
  or exists (
    select 1 from public.outing_members
    where outing_id = saved_lodging_options.outing_id
      and profile_id = auth.uid()
  )
);

create policy "saved_lodging_options_manage"
on public.saved_lodging_options for all
using (
  public.is_admin()
  or exists (
    select 1 from public.outings
    where id = saved_lodging_options.outing_id
      and organizer_id = auth.uid()
  )
)
with check (
  public.is_admin()
  or exists (
    select 1 from public.outings
    where id = saved_lodging_options.outing_id
      and organizer_id = auth.uid()
  )
);

create policy "lodging_prebooks_member_select"
on public.lodging_prebooks for select
using (
  public.is_admin()
  or exists (
    select 1 from public.outings
    where id = lodging_prebooks.outing_id
      and organizer_id = auth.uid()
  )
  or exists (
    select 1 from public.outing_members
    where outing_id = lodging_prebooks.outing_id
      and profile_id = auth.uid()
  )
);

create policy "lodging_prebooks_manage"
on public.lodging_prebooks for all
using (
  public.is_admin()
  or exists (
    select 1 from public.outings
    where id = lodging_prebooks.outing_id
      and organizer_id = auth.uid()
  )
)
with check (
  public.is_admin()
  or exists (
    select 1 from public.outings
    where id = lodging_prebooks.outing_id
      and organizer_id = auth.uid()
  )
);

create policy "lodging_bookings_member_select"
on public.lodging_bookings for select
using (
  public.is_admin()
  or exists (
    select 1 from public.outings
    where id = lodging_bookings.outing_id
      and organizer_id = auth.uid()
  )
  or exists (
    select 1 from public.outing_members
    where outing_id = lodging_bookings.outing_id
      and profile_id = auth.uid()
  )
);

create policy "lodging_bookings_manage"
on public.lodging_bookings for all
using (
  public.is_admin()
  or exists (
    select 1 from public.outings
    where id = lodging_bookings.outing_id
      and organizer_id = auth.uid()
  )
)
with check (
  public.is_admin()
  or exists (
    select 1 from public.outings
    where id = lodging_bookings.outing_id
      and organizer_id = auth.uid()
  )
);

create policy "lodging_api_errors_admin_select"
on public.lodging_api_errors for select
using (public.is_admin());
