insert into public.feature_flags (key, label, enabled)
values
  ('demo_mode', 'Demo mode', true),
  ('provider_mock_data', 'Mock provider data', true),
  ('lodging_mock_fallback', 'Allow mock lodging fallback during local liteAPI testing', false),
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
  ),
  (
    'site_access_gate',
    'Website coming soon',
    'We''re still getting the public site ready. If you have private preview access, enter the password below.',
    null,
    null
  )
on conflict (key) do update set
  title = excluded.title,
  body = excluded.body,
  cta_label = excluded.cta_label,
  cta_href = excluded.cta_href,
  updated_at = now();

insert into public.admin_settings (key, value)
values
  (
    'site_profile',
    jsonb_build_object(
      'legalBusinessName', 'Outing.golf',
      'heroBadge', 'Golf trip planning, simplified',
      'launchStatusLabel', 'Private preview',
      'supportEmail', 'hello@outing.golf',
      'footerTagline', 'Plan golf trips without spreadsheets, group-text chaos, or budget confusion.'
    )
  ),
  (
    'landing_page',
    jsonb_build_object(
      'painPointsTitle', 'Golf trips fall apart in the gap between idea and decision',
      'painPointsBody', 'Most groups do not need more options. They need one clean place to collect the basics, see what overlaps, and make a call.',
      'painPoints', jsonb_build_array(
        'The date discussion lives in three different places.',
        'Nobody knows the real budget range until it is too late.',
        'Course and lodging ideas get buried in the chat.',
        'The organizer ends up rebuilding the whole trip in a spreadsheet.'
      ),
      'stepsTitle', 'Three simple steps from messy idea to real plan',
      'steps', jsonb_build_array(
        jsonb_build_object('step', '1', 'title', 'Start the outing', 'body', 'Set the destination idea, date windows, budget target, and trip style in a minute or two.'),
        jsonb_build_object('step', '2', 'title', 'Collect the group input', 'body', 'Everyone shares budgets, available dates, lodging preferences, and destination lean in one short flow.'),
        jsonb_build_object('step', '3', 'title', 'See the best plan', 'body', 'Outing.golf highlights the strongest overlap so the group can narrow the trip and book faster.')
      ),
      'outcomesTitle', 'The outcomes that actually make planning easier',
      'outcomes', jsonb_build_array(
        jsonb_build_object('title', 'Know the real budget early', 'body', 'See where the group actually lines up before you waste time planning the wrong trip.'),
        jsonb_build_object('title', 'Spot date overlap instantly', 'body', 'The easiest date window rises to the top so the organizer can move the group forward.'),
        jsonb_build_object('title', 'Compare destinations in one place', 'body', 'Courses, lodging, and group votes stay tied to the same shortlist instead of scattered ideas.'),
        jsonb_build_object('title', 'Keep one decision thread', 'body', 'The group stays in one planning flow, which means fewer side texts and fewer repeated questions.')
      ),
      'socialProofTitle', 'Built for the person who always ends up organizing the trip',
      'socialProofBody', 'This placeholder is ready for testimonials and launch partners later. For now, it signals the kind of confidence the product is designed to create.',
      'socialProofItems', jsonb_build_array(
        'People actually fill out their preferences because it feels quick.',
        'The organizer can immediately see what is still blocking the decision.',
        'Course and lodging options stay tied to the same shortlist.',
        'The group gets to a confident next step much faster.'
      ),
      'faqs', jsonb_build_array(
        jsonb_build_object('question', 'Do invitees need accounts?', 'answer', 'For the MVP, yes. It keeps outing access private and makes permissions simple.'),
        jsonb_build_object('question', 'Can we compare multiple destinations at once?', 'answer', 'Yes. The compare view keeps destinations, courses, and lodging together so tradeoffs stay clear.'),
        jsonb_build_object('question', 'Can I test this before live provider APIs are connected?', 'answer', 'Yes. The product ships with mock provider adapters and seeded data so the full workflow can be tested now.'),
        jsonb_build_object('question', 'Is this trying to replace booking tools?', 'answer', 'Not in version one. The goal is to get the group to a clear plan first, then layer official booking integrations in later.')
      ),
      'finalCtaEyebrow', 'Start planning',
      'finalCtaTitle', 'Make the plan obvious for everyone',
      'finalCtaBody', 'Bring budgets, dates, courses, and lodging into one calm workflow so the group can stop circling and start deciding.',
      'finalCtaLabel', 'Start Planning Free',
      'finalCtaHref', '/sign-up'
    )
  )
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();
