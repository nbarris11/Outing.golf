-- Add client_reference and lodging_option_id to lodging_prebooks.
-- client_reference is generated at prebook time and threaded through to the booking call.
-- lodging_option_id links the prebook back to the saved lodging_options row (if one exists).

alter table public.lodging_prebooks
  add column if not exists client_reference text,
  add column if not exists lodging_option_id uuid references public.lodging_options (id) on delete set null;
