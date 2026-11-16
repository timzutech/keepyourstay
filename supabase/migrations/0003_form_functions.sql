-- Public forms save through these functions instead of the service-role key.
-- Each one requires a shared secret known only to the site's server
-- (FORMS_SECRET). Only its SHA-256 hash is stored here, in a schema the API
-- cannot read. The functions do exactly one job each, so a leaked secret could
-- submit enquiries but could never read or change anything else.

create table if not exists private.app_config (
  key text primary key,
  value text not null
);
revoke all on private.app_config from anon, authenticated;

create or replace function private.forms_secret_ok(p_secret text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from private.app_config
    where key = 'forms_secret_hash'
      and value = encode(sha256(convert_to(coalesce(p_secret, ''), 'utf8')), 'hex')
  );
$$;
revoke all on function private.forms_secret_ok(text) from public, anon, authenticated;

-- Saves one enquiry. Returns its id. Raises 'forbidden' or 'rate_limited'.
create or replace function public.submit_enquiry(p_secret text, p_row jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_ip text := nullif(p_row->>'ip_hash', '');
begin
  if not private.forms_secret_ok(p_secret) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if v_ip is not null and (
    select count(*) from public.enquiries
    where ip_hash = v_ip and created_at > now() - interval '10 minutes'
  ) >= 5 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  insert into public.enquiries (
    type, full_name, email, whatsapp, business_name, website_url, country,
    property_type, property_count, services, preferred_contact, message,
    details, calculator, consent, source_path, ip_hash
  ) values (
    p_row->>'type',
    left(p_row->>'full_name', 200),
    left(p_row->>'email', 200),
    left(p_row->>'whatsapp', 40),
    left(p_row->>'business_name', 200),
    left(p_row->>'website_url', 300),
    left(p_row->>'country', 200),
    left(p_row->>'property_type', 200),
    left(p_row->>'property_count', 40),
    coalesce(array(select left(x, 100) from jsonb_array_elements_text(coalesce(p_row->'services', '[]'::jsonb)) x limit 20), '{}'),
    left(p_row->>'preferred_contact', 40),
    left(p_row->>'message', 5000),
    coalesce(p_row->'details', '{}'::jsonb),
    nullif(p_row->'calculator', 'null'::jsonb),
    coalesce((p_row->>'consent')::boolean, false),
    left(p_row->>'source_path', 200),
    v_ip
  )
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.mark_enquiry_notified(p_secret text, p_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not private.forms_secret_ok(p_secret) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  update public.enquiries set notification_sent = true where id = p_id;
end;
$$;

-- Subscribes or re-subscribes an address. Returns {"state": "new" | "already", "token": uuid}.
create or replace function public.subscribe_newsletter(p_secret text, p_email text, p_ip_hash text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(trim(p_email));
  v_row public.newsletter_subscribers;
begin
  if not private.forms_secret_ok(p_secret) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' or length(v_email) > 200 then
    raise exception 'invalid_email' using errcode = 'P0001';
  end if;

  select * into v_row from public.newsletter_subscribers where email = v_email;
  if found and v_row.status = 'subscribed' then
    return jsonb_build_object('state', 'already', 'token', v_row.unsubscribe_token);
  elsif found then
    update public.newsletter_subscribers
      set status = 'subscribed', consent = true, unsubscribed_at = null
      where id = v_row.id;
    return jsonb_build_object('state', 'new', 'token', v_row.unsubscribe_token);
  end if;

  insert into public.newsletter_subscribers (email, consent, ip_hash)
  values (v_email, true, nullif(p_ip_hash, ''))
  returning * into v_row;
  return jsonb_build_object('state', 'new', 'token', v_row.unsubscribe_token);
end;
$$;

-- Returns true when a subscription was found for the token and switched off.
create or replace function public.unsubscribe_newsletter(p_secret text, p_token uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count int;
begin
  if not private.forms_secret_ok(p_secret) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  update public.newsletter_subscribers
    set status = 'unsubscribed', unsubscribed_at = now()
    where unsubscribe_token = p_token;
  get diagnostics v_count = row_count;
  return v_count > 0;
end;
$$;

revoke all on function public.submit_enquiry(text, jsonb) from public;
revoke all on function public.mark_enquiry_notified(text, uuid) from public;
revoke all on function public.subscribe_newsletter(text, text, text) from public;
revoke all on function public.unsubscribe_newsletter(text, uuid) from public;
grant execute on function public.submit_enquiry(text, jsonb) to anon, authenticated;
grant execute on function public.mark_enquiry_notified(text, uuid) to anon, authenticated;
grant execute on function public.subscribe_newsletter(text, text, text) to anon, authenticated;
grant execute on function public.unsubscribe_newsletter(text, uuid) to anon, authenticated;

-- After running this file, store the hash of your FORMS_SECRET (see README):
--   insert into private.app_config (key, value) values ('forms_secret_hash', '<sha256 hex>')
--   on conflict (key) do update set value = excluded.value;
