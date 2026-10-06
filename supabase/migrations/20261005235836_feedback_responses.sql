create table if not exists public.feedback_responses (
  id uuid primary key default gen_random_uuid(),
  rating smallint not null check (rating between 1 and 10),
  liked_most text check (char_length(liked_most) <= 2000),
  frustrations text check (char_length(frustrations) <= 2000),
  requested_change text not null check (char_length(requested_change) between 1 and 2000),
  likelihood_to_return text not null check (likelihood_to_return in (
    'Definitely', 'Probably', 'Maybe', 'Probably not', 'Definitely not'
  )),
  additional_comments text check (char_length(additional_comments) <= 2000),
  willing_to_talk boolean not null,
  contact_email text check (char_length(contact_email) <= 254),
  user_id uuid references auth.users (id) on delete set null,
  submitted_at timestamptz not null default now(),
  notification_sent_at timestamptz,
  submission_fingerprint text not null,
  submission_window bigint not null,
  constraint feedback_contact_requires_consent check (contact_email is null or willing_to_talk),
  constraint feedback_one_per_window unique (submission_fingerprint, submission_window)
);

-- Also covers databases where the table was created before email notifications.
alter table public.feedback_responses
  add column if not exists notification_sent_at timestamptz;

create index if not exists feedback_responses_submitted_at_idx
  on public.feedback_responses (submitted_at desc);

alter table public.feedback_responses enable row level security;

-- Survey writes use the existing server-only service-role client. No public
-- insert or read policies are granted, so answers and emails stay private.
revoke all on public.feedback_responses from anon, authenticated;
