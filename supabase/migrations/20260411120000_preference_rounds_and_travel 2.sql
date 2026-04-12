-- Add preferred_rounds and home_city to preference_submissions
alter table public.preference_submissions
  add column if not exists preferred_rounds integer check (preferred_rounds between 1 and 7),
  add column if not exists home_city text;
