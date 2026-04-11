create table if not exists public.outing_share_links (
  id uuid primary key default gen_random_uuid(),
  outing_id uuid not null unique references public.outings (id) on delete cascade,
  token text not null unique,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.outing_share_links enable row level security;

create policy "outing_share_links_organizer_manage"
on public.outing_share_links for all
using (
  public.is_admin()
  or exists (
    select 1 from public.outings
    where id = outing_share_links.outing_id
      and organizer_id = auth.uid()
  )
)
with check (
  public.is_admin()
  or exists (
    select 1 from public.outings
    where id = outing_share_links.outing_id
      and organizer_id = auth.uid()
  )
);
