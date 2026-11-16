-- Moves the admin check out of the public API schema, so it cannot be called
-- as an RPC endpoint. Policies keep working: they reference the function itself.
create schema if not exists private;
grant usage on schema private to anon, authenticated;
alter function public.is_admin() set schema private;
