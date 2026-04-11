create policy "outings_organizer_delete"
on public.outings for delete
using (organizer_id = auth.uid() or public.is_admin());
