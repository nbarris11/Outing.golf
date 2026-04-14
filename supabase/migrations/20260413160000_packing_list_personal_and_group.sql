-- Add profile_id to distinguish personal items (profile_id set) from
-- group/shared items (profile_id null).
alter table public.trip_packing_items
  add column if not exists profile_id uuid references public.profiles(id) on delete cascade;

-- Index for fast per-user queries
create index if not exists trip_packing_items_profile_id_idx
  on public.trip_packing_items(outing_id, profile_id);

-- ── Update RLS policies ──────────────────────────────────────────────────────

-- SELECT: members see shared items (profile_id IS NULL) + their own personal items
drop policy if exists "Members can view packing items for their outing" on public.trip_packing_items;
create policy "Members can view packing items for their outing"
  on public.trip_packing_items for select
  using (
    (
      profile_id is null
      or profile_id = auth.uid()
    )
    and exists (
      select 1 from public.outing_members
      where outing_members.outing_id = trip_packing_items.outing_id
        and outing_members.profile_id = auth.uid()
    )
  );

-- UPDATE: members can update shared items; users can only update their own personal items
drop policy if exists "Members can update packing items for their outing" on public.trip_packing_items;
create policy "Members can update packing items for their outing"
  on public.trip_packing_items for update
  using (
    exists (
      select 1 from public.outing_members
      where outing_members.outing_id = trip_packing_items.outing_id
        and outing_members.profile_id = auth.uid()
    )
    and (profile_id is null or profile_id = auth.uid())
  );

-- INSERT: members can insert (personal items have profile_id = auth.uid(), shared items have profile_id null)
drop policy if exists "Organizer can insert packing items" on public.trip_packing_items;
create policy "Members can insert packing items"
  on public.trip_packing_items for insert
  with check (
    exists (
      select 1 from public.outing_members
      where outing_members.outing_id = trip_packing_items.outing_id
        and outing_members.profile_id = auth.uid()
    )
    and (profile_id is null or profile_id = auth.uid())
  );

-- DELETE: organizer can delete shared items; users can delete their own personal items
drop policy if exists "Organizer can delete packing items" on public.trip_packing_items;
create policy "Organizer can delete packing items"
  on public.trip_packing_items for delete
  using (
    (
      profile_id is null
      and public.is_outing_organizer(outing_id)
    )
    or profile_id = auth.uid()
    or public.is_admin()
  );
