-- RLS: allow co_organizer to update the outing (same as organizer)
drop policy if exists "Organizer can update their outing" on public.outings;

create policy "Organizer or co-organizer can update outing"
  on public.outings
  for update
  using (
    organizer_id = auth.uid()
    or exists (
      select 1 from public.outing_members
      where outing_id = outings.id
        and profile_id = auth.uid()
        and role = 'co_organizer'
    )
  );
