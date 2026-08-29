-- Track which surface a partner referral click came from. The Pin Seeker pilot
-- runs three placements at once (Trip HQ, planning stage, confirmation email),
-- so attribution is what makes the results actionable.
alter table public.partner_referral_clicks
  add column if not exists placement text;

create index if not exists partner_referral_clicks_placement_idx
  on public.partner_referral_clicks (partner, placement, clicked_at desc);
