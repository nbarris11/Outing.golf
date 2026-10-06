-- Provider offer tokens can exceed PostgreSQL's B-tree entry limit.
-- Keep the full token in the row and index its fixed-size digest instead.
begin;
set local lock_timeout = '5s';
create unique index if not exists lodging_options_outing_offer_hash_idx
  on public.lodging_options (outing_id, md5(offer_id))
  where offer_id is not null;
drop index if exists public.lodging_options_outing_offer_id_idx;
commit;
