-- Optional star rating (1–5) given by the client. Left empty when the client
-- didn't give one; the site only shows stars for testimonials that have a rating.
alter table public.testimonials
  add column if not exists rating smallint check (rating between 1 and 5);

create or replace function public.submit_testimonial(p_secret text, p_row jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_ip text := nullif(p_row->>'ip_hash', '');
  v_rating smallint;
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
  if (p_row->>'rating') ~ '^[1-5]$' then
    v_rating := (p_row->>'rating')::smallint;
  end if;

  insert into public.testimonials (
    quote, author_name, author_role, business_name, website_url, rating,
    submitter_name, submitter_email, source, consent_given_at, ip_hash,
    verified, client_approved, published, sort_order
  ) values (
    left(p_row->>'message', 1200),
    left(p_row->>'display_name', 80),
    nullif(left(p_row->>'author_role', 80), ''),
    nullif(left(p_row->>'business_name', 120), ''),
    nullif(left(p_row->>'website_url', 300), ''),
    v_rating,
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
