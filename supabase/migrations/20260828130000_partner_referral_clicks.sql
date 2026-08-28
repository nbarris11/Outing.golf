-- Durable log of outbound partner referral clicks (e.g. Pin Seeker Competitions).
-- Session-replay tools only retain ~30 days; this is the permanent record used for
-- partnership reporting, so rows are never expired automatically.
create table if not exists public.partner_referral_clicks (
  id uuid primary key default gen_random_uuid(),
  partner text not null,
  outing_id uuid references public.outings (id) on delete set null,
  profile_id uuid references public.profiles (id) on delete set null,
  referrer text,
  user_agent text,
  clicked_at timestamptz not null default now()
);

create index if not exists partner_referral_clicks_partner_idx
  on public.partner_referral_clicks (partner, clicked_at desc);

create index if not exists partner_referral_clicks_outing_idx
  on public.partner_referral_clicks (outing_id);

alter table public.partner_referral_clicks enable row level security;

-- No client-side policies: inserts and reads go through the service role only.
-- Click volume is business data, not user-facing content.
