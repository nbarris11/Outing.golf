-- Add home_city to profiles for user location preference
alter table public.profiles add column if not exists home_city text;

-- Add golf_only flag to outings (organizer can opt out of hotel)
alter table public.outings add column if not exists golf_only boolean not null default false;

-- Add co_organizer value to outing_role enum
alter type public.outing_role add value if not exists 'co_organizer';
