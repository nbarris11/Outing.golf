-- Add voting_open flag to outings so organizer can open/close group votes
alter table public.outings
  add column if not exists voting_open boolean not null default false;

-- Add "international" to the destination_type enum
-- (already in TypeScript types but missing from DB)
alter type public.destination_type add value if not exists 'international';
