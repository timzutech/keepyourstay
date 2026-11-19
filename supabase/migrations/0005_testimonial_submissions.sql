-- Lets clients send testimonials through the private /feedback page.
-- A submission is stored with the client's consent recorded but is NOT
-- verified or published: the admin checks it came from a real client,
-- ticks "verified", and publishes it from the dashboard.

alter table public.testimonials
  add column if not exists source text not null default 'admin'
    check (source in ('admin', 'feedback_form')),
  add column if not exists submitter_name text,
  add column if not exists submitter_email text,
  add column if not exists website_url text,
  add column if not exists consent_given_at timestamptz,
  add column if not exists ip_hash text;

create index if not exists testimonials_ip_hash_idx on public.testimonials (ip_hash, created_at desc);

-- Saves one submission. Returns its id. Raises 'forbidden' or 'rate_limited'.
create or replace function public.submit_testimonial(p_secret text, p_row jsonb)
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
  if coalesce((p_row->>'consent')::boolean, false) is not true then
    raise exception 'consent_required' using errcode = 'P0001';
  end if;
  if v_ip is not null and (
    select count(*) from public.testimonials
    where ip_hash = v_ip and created_at > now() - interval '10 minutes'
  ) >= 3 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  insert into public.testimonials (
    quote, author_name, author_role, business_name, website_url,
    submitter_name, submitter_email, source, consent_given_at, ip_hash,
    verified, client_approved, published, sort_order
  ) values (
    left(p_row->>'message', 1200),
    left(p_row->>'display_name', 80),
    nullif(left(p_row->>'author_role', 80), ''),
    nullif(left(p_row->>'business_name', 120), ''),
    nullif(left(p_row->>'website_url', 300), ''),
    left(p_row->>'full_name', 200),
    left(p_row->>'email', 200),
    'feedback_form',
    now(),
    v_ip,
    false, true, false, 100
  )
  returning id into v_id;
  return v_id;
end;
$$;

revoke all on function public.submit_testimonial(text, jsonb) from public;
grant execute on function public.submit_testimonial(text, jsonb) to anon, authenticated;
