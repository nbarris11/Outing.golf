-- ── Organizer UPDATE policies ───────────────────────────────────────────────
-- golf_course_options: organizer can update schedule_day, schedule_rounds, featured, etc.
create policy "golf_organizer_update"
on public.golf_course_options for update
using (
  exists (
    select 1 from public.outings
    where id = golf_course_options.outing_id
      and organizer_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.outings
    where id = golf_course_options.outing_id
      and organizer_id = auth.uid()
  )
);

-- lodging_options: organizer can update featured, etc.
create policy "lodging_organizer_update"
on public.lodging_options for update
using (
  exists (
    select 1 from public.outings
    where id = lodging_options.outing_id
      and organizer_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.outings
    where id = lodging_options.outing_id
      and organizer_id = auth.uid()
  )
);

-- ── Rounds per course ────────────────────────────────────────────────────────
-- How many rounds are scheduled at this course. Defaults to 1.
alter table public.golf_course_options
  add column if not exists schedule_rounds integer not null default 1;
