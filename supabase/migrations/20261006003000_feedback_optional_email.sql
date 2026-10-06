-- Let respondents identify their feedback without agreeing to a follow-up call.
alter table public.feedback_responses
  drop constraint if exists feedback_contact_requires_consent;
