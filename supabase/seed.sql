insert into public.feature_flags (key, label, enabled)
values
  ('demo_mode', 'Demo mode', true),
  ('provider_mock_data', 'Mock provider data', true),
  ('chat_moderation_hooks', 'Chat moderation hooks', true)
on conflict (key) do update set
  label = excluded.label,
  enabled = excluded.enabled,
  updated_at = now();

insert into public.content_blocks (key, title, body, cta_label, cta_href)
values
  (
    'hero',
    'Plan the golf trip without the group text chaos',
    'Collect budgets, dates, courses, and lodging in one place so your group can actually decide and book faster.',
    'Start Planning Free',
    '/sign-up'
  ),
  (
    'faq',
    'Can I use Outing.golf before live provider integrations are connected?',
    'Yes. This MVP ships with provider-agnostic mock adapters and seeded options so the team flow can be tested immediately.',
    null,
    null
  )
on conflict (key) do update set
  title = excluded.title,
  body = excluded.body,
  cta_label = excluded.cta_label,
  cta_href = excluded.cta_href,
  updated_at = now();
