create or replace function public.resolve_outing_share_token(share_token text)
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select outing_id
  from public.outing_share_links
  where token = share_token
  limit 1;
$$;

revoke all on function public.resolve_outing_share_token(text) from public;
grant execute on function public.resolve_outing_share_token(text) to anon, authenticated;
