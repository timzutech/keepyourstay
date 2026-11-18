-- The owner's account becomes an admin automatically when it is created in
-- Supabase Auth. No other address is ever granted admin by this trigger.
-- To use a different owner email, change it below and re-run this file.
create or replace function private.grant_owner_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if lower(new.email) = 'keepyourstay@gmail.com' then
    insert into public.admin_profiles (id, email, full_name)
    values (new.id, new.email, 'Site owner')
    on conflict (id) do nothing;
  end if;
  return new;
end;
$$;
revoke all on function private.grant_owner_admin() from public, anon, authenticated;

drop trigger if exists grant_owner_admin on auth.users;
create trigger grant_owner_admin
  after insert or update of email on auth.users
  for each row execute function private.grant_owner_admin();

-- In case the account already exists.
insert into public.admin_profiles (id, email, full_name)
select id, email, 'Site owner' from auth.users where lower(email) = 'keepyourstay@gmail.com'
on conflict (id) do nothing;
