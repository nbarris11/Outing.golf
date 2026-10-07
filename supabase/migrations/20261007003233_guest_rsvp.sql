-- Nullable: existing preferences must not imply a confirmed RSVP.
alter table public.preference_submissions
  add column if not exists response_status text
  check (response_status in ('in', 'maybe', 'declined'));
comment on column public.preference_submissions.response_status is
  'Explicit golfer RSVP; null means no RSVP yet. Existing member RLS applies.';
