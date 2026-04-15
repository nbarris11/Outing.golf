-- Add tee_time_bookings JSONB column to outings
-- Stores organizer-entered tee time details visible to the whole group on Trip HQ

alter table outings
  add column if not exists tee_time_bookings jsonb not null default '[]'::jsonb;
