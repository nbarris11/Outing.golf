-- ── Fix infinite recursion in outing_members RLS ────────────────────────────
--
-- The recursion chain:
--   trip_packing_items SELECT → outing_members SELECT policy
--   → outings SELECT (to check organizer_id)
--   → outing_members SELECT (to check membership)
--   → loop
--
-- Fix: introduce a SECURITY DEFINER helper that queries outings directly
-- (bypassing RLS), breaking the cycle.

create or replace function public.is_outing_organizer(p_outing_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.outings
    where id = p_outing_id
      and organizer_id = auth.uid()
  );
$$;

-- Drop and recreate the outing_members SELECT policy using the helper
drop policy if exists "outing_members_member_select" on public.outing_members;

create policy "outing_members_member_select"
on public.outing_members for select
using (
  profile_id = auth.uid()
  or public.is_outing_organizer(outing_id)
  or public.is_admin()
);

-- Also fix the organizer manage policy the same way (it also queries outings)
drop policy if exists "outing_members_organizer_manage" on public.outing_members;

create policy "outing_members_organizer_manage"
on public.outing_members for all
using (
  public.is_outing_organizer(outing_id)
  or public.is_admin()
)
with check (
  public.is_outing_organizer(outing_id)
  or public.is_admin()
);
