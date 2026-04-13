create table if not exists public.trip_packing_items (
  id uuid primary key default gen_random_uuid(),
  outing_id uuid not null references public.outings(id) on delete cascade,
  label text not null,
  is_default boolean not null default true,
  checked_by uuid references public.profiles(id) on delete set null,
  checked_at timestamptz,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.trip_packing_items enable row level security;

create policy "Members can view packing items for their outing"
  on public.trip_packing_items for select
  using (
    exists (
      select 1 from public.outing_members
      where outing_members.outing_id = trip_packing_items.outing_id
        and outing_members.profile_id = auth.uid()
    )
  );

create policy "Members can update packing items for their outing"
  on public.trip_packing_items for update
  using (
    exists (
      select 1 from public.outing_members
      where outing_members.outing_id = trip_packing_items.outing_id
        and outing_members.profile_id = auth.uid()
    )
  );

create policy "Organizer can insert packing items"
  on public.trip_packing_items for insert
  with check (
    exists (
      select 1 from public.outings
      where outings.id = outing_id
        and outings.organizer_id = auth.uid()
    )
    or
    exists (
      select 1 from public.outing_members
      where outing_members.outing_id = trip_packing_items.outing_id
        and outing_members.profile_id = auth.uid()
    )
  );

create policy "Organizer can delete packing items"
  on public.trip_packing_items for delete
  using (
    exists (
      select 1 from public.outings
      where outings.id = outing_id
        and outings.organizer_id = auth.uid()
    )
  );
