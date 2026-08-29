-- Return the admin dashboard in one PostgREST request. The function runs as the
-- caller, so every table's existing RLS policy remains in force.
create or replace function public.get_admin_dashboard_snapshot()
returns jsonb
language plpgsql
stable
security invoker
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;

  return jsonb_build_object(
    'profiles', coalesce((
      select jsonb_agg(to_jsonb(row_data) order by row_data.created_at desc)
      from (
        select id, email, full_name, app_role, created_at
        from public.profiles
        order by created_at desc
        limit 12
      ) as row_data
    ), '[]'::jsonb),
    'outings', coalesce((
      select jsonb_agg(to_jsonb(row_data) order by row_data.created_at desc)
      from (
        select id, name, status, created_at
        from public.outings
        order by created_at desc
        limit 12
      ) as row_data
    ), '[]'::jsonb),
    'content_blocks', coalesce((
      select jsonb_agg(to_jsonb(row_data) order by row_data.key)
      from (
        select key, title, body, cta_label, cta_href, updated_at
        from public.content_blocks
        order by key
      ) as row_data
    ), '[]'::jsonb),
    'feature_flags', coalesce((
      select jsonb_agg(to_jsonb(row_data) order by row_data.key)
      from (
        select key, label, enabled, updated_at
        from public.feature_flags
        order by key
      ) as row_data
    ), '[]'::jsonb),
    'admin_settings', coalesce((
      select jsonb_agg(to_jsonb(row_data) order by row_data.key)
      from (
        select key, value
        from public.admin_settings
        order by key
      ) as row_data
    ), '[]'::jsonb),
    'destination_options', coalesce((
      select jsonb_agg(to_jsonb(row_data) order by row_data.created_at desc)
      from (
        select id, name, summary, featured, hidden, created_at
        from public.destination_options
        order by created_at desc
        limit 8
      ) as row_data
    ), '[]'::jsonb),
    'golf_course_options', coalesce((
      select jsonb_agg(to_jsonb(row_data) order by row_data.created_at desc)
      from (
        select id, name, summary, featured, hidden, created_at
        from public.golf_course_options
        order by created_at desc
        limit 8
      ) as row_data
    ), '[]'::jsonb),
    'lodging_options', coalesce((
      select jsonb_agg(to_jsonb(row_data) order by row_data.created_at desc)
      from (
        select id, name, summary, featured, hidden, created_at
        from public.lodging_options
        order by created_at desc
        limit 8
      ) as row_data
    ), '[]'::jsonb),
    'lodging_api_errors', coalesce((
      select jsonb_agg(to_jsonb(row_data) order by row_data.created_at desc)
      from (
        select id, route, error_message, created_at
        from public.lodging_api_errors
        order by created_at desc
        limit 8
      ) as row_data
    ), '[]'::jsonb),
    'lodging_mock_fallback_enabled', coalesce((
      select enabled
      from public.feature_flags
      where key = 'lodging_mock_fallback'
      limit 1
    ), false),
    'analytics', jsonb_build_object(
      'total_users', (select count(*) from public.profiles),
      'total_outings', (select count(*) from public.outings),
      'active_invites', (select count(*) from public.invites where status = 'pending'),
      'total_messages', (select count(*) from public.chat_messages)
    )
  );
end;
$$;

revoke all on function public.get_admin_dashboard_snapshot() from public;
revoke all on function public.get_admin_dashboard_snapshot() from anon;
grant execute on function public.get_admin_dashboard_snapshot() to authenticated;
