-- Keep existing trips on the group-planning flow. Confirmation is explicit and dated.
alter table public.outings add column if not exists planning_mode text not null default 'group' check (planning_mode in ('organizer','group'));
alter table public.outings add column if not exists confirmed_date_window jsonb;
alter table public.outings add column if not exists lodging_booking jsonb;
