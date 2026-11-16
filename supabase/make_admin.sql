-- Run AFTER creating the user in Supabase → Authentication → Users.
-- Replace the email below with the admin's sign-in email.
insert into public.admin_profiles (id, email, full_name)
select id, email, 'Site admin'
from auth.users
where email = 'REPLACE_WITH_ADMIN_EMAIL'
on conflict (id) do nothing;
