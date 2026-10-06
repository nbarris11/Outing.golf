-- Additive: legacy round assignments remain readable until first edit.
alter table public.outings add column if not exists persons_per_room integer not null default 2 check (persons_per_room between 1 and 8);
alter table public.golf_course_options add column if not exists round_days integer[];

-- Serialize round edits per trip so concurrent organizers cannot lose rounds or rest-day changes.
create or replace function public.edit_trip_round(p_outing uuid, p_course uuid, p_actor uuid, p_operation text, p_index integer, p_day integer)
returns void language plpgsql security invoker set search_path = '' as $$
declare o public.outings; c public.golf_course_options; days integer[]; max_day integer;
begin
 select * into o from public.outings where id = p_outing for update;
 if o.id is null or (o.organizer_id <> p_actor and not exists(select 1 from public.outing_members where outing_id=p_outing and profile_id=p_actor and role='co_organizer')) then raise exception 'Organizer access required'; end if;
 select * into c from public.golf_course_options where id=p_course and outing_id=p_outing for update;
 if c.id is null then raise exception 'Course not found'; end if;
 max_day := coalesce(((o.preferred_date_windows->0->>'end')::date - (o.preferred_date_windows->0->>'start')::date) + 1, 4);
 if p_day is not null and (p_day < 1 or p_day > max_day) then raise exception 'Choose a date within the trip'; end if;
 days := coalesce(c.round_days, array_fill(c.schedule_day, array[greatest(1,coalesce(c.schedule_rounds,1))]));
 if p_operation='add' then
   if not c.featured then days := array[p_day]; else days := array_append(days,p_day); end if;
 elsif p_operation='move' then
   if p_index < 0 or p_index >= cardinality(days) then raise exception 'Round changed. Refresh and try again'; end if;
   days[p_index+1] := p_day;
 elsif p_operation='remove' then
   if p_index < 0 or p_index >= cardinality(days) then raise exception 'Round changed. Refresh and try again'; end if;
   days := days[1:p_index] || days[p_index+2:cardinality(days)];
 else raise exception 'Invalid round operation'; end if;
 if cardinality(days)>20 then raise exception 'Maximum 20 rounds per course'; end if;
 update public.golf_course_options set round_days=days, schedule_day=days[1], schedule_rounds=greatest(1,cardinality(days)), featured=(cardinality(days)>0) where id=p_course;
 if p_day is not null and p_operation<>'remove' then
   update public.outings set no_golf_days=array_remove(coalesce(no_golf_days,'{}'),p_day) where id=p_outing;
 end if;
end $$;
revoke all on function public.edit_trip_round(uuid,uuid,uuid,text,integer,integer) from public, anon, authenticated;
grant execute on function public.edit_trip_round(uuid,uuid,uuid,text,integer,integer) to service_role;

create or replace function public.toggle_trip_rest_day(p_outing uuid, p_actor uuid, p_day integer)
returns void language plpgsql security invoker set search_path = '' as $$
declare o public.outings; max_day integer;
begin
 select * into o from public.outings where id=p_outing for update;
 if o.id is null or (o.organizer_id<>p_actor and not exists(select 1 from public.outing_members where outing_id=p_outing and profile_id=p_actor and role='co_organizer')) then raise exception 'Organizer access required'; end if;
 max_day := coalesce(((o.preferred_date_windows->0->>'end')::date - (o.preferred_date_windows->0->>'start')::date)+1,4);
 if p_day is null or p_day<1 or p_day>max_day then raise exception 'Choose a date within the trip'; end if;
 if exists(select 1 from public.golf_course_options c where c.outing_id=p_outing and c.featured and not c.hidden and p_day=any(coalesce(c.round_days,array_fill(c.schedule_day,array[greatest(1,coalesce(c.schedule_rounds,1))])))) then raise exception 'Move the rounds on this date before marking it as no golf'; end if;
 update public.outings set no_golf_days=case when p_day=any(coalesce(o.no_golf_days,'{}')) then array_remove(o.no_golf_days,p_day) else array_append(coalesce(o.no_golf_days,'{}'),p_day) end where id=p_outing;
end $$;
revoke all on function public.toggle_trip_rest_day(uuid,uuid,integer) from public,anon,authenticated;
grant execute on function public.toggle_trip_rest_day(uuid,uuid,integer) to service_role;
