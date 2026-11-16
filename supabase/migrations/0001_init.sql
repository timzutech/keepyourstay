-- KeepYourStay — initial schema, security policies and storage.
-- Apply once in the Supabase SQL editor, or with `supabase db push`.

create extension if not exists pgcrypto;

-- ───────────────────────── Helpers ─────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ───────────────────────── Admins ─────────────────────────

create table public.admin_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz not null default now()
);

-- True when the signed-in user has a row in admin_profiles.
-- SECURITY DEFINER so policies on other tables can call it without
-- granting anyone read access to admin_profiles itself.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_profiles where id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ───────────────────────── Enquiries ─────────────────────────

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('contact', 'project', 'consultation')),
  status text not null default 'new'
    check (status in ('new', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'won', 'lost')),
  full_name text not null,
  email text not null,
  whatsapp text,
  business_name text,
  website_url text,
  country text,
  property_type text,
  property_count text,
  services text[] not null default '{}',
  preferred_contact text,
  message text,
  -- Form-specific answers (timeline, budget range, booking channels, …).
  details jsonb not null default '{}'::jsonb,
  -- Savings calculator inputs and results, when submitted from the calculator.
  calculator jsonb,
  consent boolean not null default false,
  source_path text,
  ip_hash text,
  notification_sent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index enquiries_created_idx on public.enquiries (created_at desc);
create index enquiries_status_idx on public.enquiries (status);
create index enquiries_type_idx on public.enquiries (type);
create index enquiries_ip_hash_idx on public.enquiries (ip_hash, created_at desc);

create trigger enquiries_updated_at before update on public.enquiries
  for each row execute function public.set_updated_at();

create table public.enquiry_notes (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries (id) on delete cascade,
  author_id uuid references auth.users (id) on delete set null,
  author_email text,
  body text not null,
  created_at timestamptz not null default now()
);

create index enquiry_notes_enquiry_idx on public.enquiry_notes (enquiry_id, created_at);

-- ───────────────────────── Portfolio ─────────────────────────

create table public.portfolio_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  sort_order int not null default 0
);

create table public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category_id uuid references public.portfolio_categories (id) on delete set null,
  kind text not null default 'concept' check (kind in ('concept', 'completed')),
  summary text not null default '',
  overview text not null default '',
  objectives text[] not null default '{}',
  design_approach text not null default '',
  features text[] not null default '{}',
  services text[] not null default '{}',      -- service slugs
  technologies text[] not null default '{}',
  outcomes text[] not null default '{}',
  outcomes_verified boolean not null default false,
  website_url text,
  client_permission boolean not null default false,
  cover_image text,
  cover_alt text,
  featured boolean not null default false,
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- A completed client project can only be published with permission to show it.
  constraint completed_needs_permission
    check (not (published and kind = 'completed' and not client_permission))
);

create index portfolio_projects_published_idx on public.portfolio_projects (published, sort_order);
create index portfolio_projects_category_idx on public.portfolio_projects (category_id);

create trigger portfolio_projects_updated_at before update on public.portfolio_projects
  for each row execute function public.set_updated_at();

create table public.portfolio_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.portfolio_projects (id) on delete cascade,
  url text not null,
  alt text not null default '',
  sort_order int not null default 0
);

create index portfolio_images_project_idx on public.portfolio_images (project_id, sort_order);

-- ───────────────────────── Blog ─────────────────────────

create table public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null
);

create table public.blog_tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',            -- Markdown
  cover_image text,
  cover_alt text,
  category_id uuid references public.blog_categories (id) on delete set null,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index blog_posts_status_idx on public.blog_posts (status, published_at desc);
create index blog_posts_category_idx on public.blog_posts (category_id);

create trigger blog_posts_updated_at before update on public.blog_posts
  for each row execute function public.set_updated_at();

create table public.blog_post_tags (
  post_id uuid not null references public.blog_posts (id) on delete cascade,
  tag_id uuid not null references public.blog_tags (id) on delete cascade,
  primary key (post_id, tag_id)
);

create index blog_post_tags_tag_idx on public.blog_post_tags (tag_id);

-- ───────────────────────── Testimonials ─────────────────────────

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author_name text not null,
  author_role text,
  business_name text,
  -- Both must be true before a testimonial can be published.
  verified boolean not null default false,
  client_approved boolean not null default false,
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_needs_verification
    check (not published or (verified and client_approved))
);

create trigger testimonials_updated_at before update on public.testimonials
  for each row execute function public.set_updated_at();

-- ───────────────────────── Site settings (single row) ─────────────────────────

create table public.site_settings (
  id int primary key default 1 check (id = 1),
  site_title text not null default 'KeepYourStay',
  tagline text not null default 'Your property. Your website. Your bookings.',
  seo_description text not null default 'KeepYourStay designs and builds vacation rental websites with booking calendars, payments and search visibility, so your property business has a booking channel of its own.',
  business_email text not null default 'KeepYourStay@gmail.com',
  whatsapp_number text not null default '19514692722',
  brand_blurb text not null default 'Vacation rental website design and direct-booking solutions for short-term rental businesses worldwide.',
  footer_note text not null default '',
  social_links jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (1);

create trigger site_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ───────────────────────── Newsletter ─────────────────────────

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  status text not null default 'subscribed' check (status in ('subscribed', 'unsubscribed')),
  consent boolean not null default false,
  unsubscribe_token uuid not null unique default gen_random_uuid(),
  ip_hash text,
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

-- ───────────────────────── Row Level Security ─────────────────────────
-- Visitors never write to the database directly. Enquiries and newsletter
-- sign-ups go through the site's server, which validates them and inserts
-- with the service-role key (which bypasses RLS and never reaches the browser).
-- So the anon role gets read access to published content and nothing else.

alter table public.admin_profiles enable row level security;
alter table public.enquiries enable row level security;
alter table public.enquiry_notes enable row level security;
alter table public.portfolio_categories enable row level security;
alter table public.portfolio_projects enable row level security;
alter table public.portfolio_images enable row level security;
alter table public.blog_categories enable row level security;
alter table public.blog_tags enable row level security;
alter table public.blog_posts enable row level security;
alter table public.blog_post_tags enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_settings enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Admin profiles: an admin can see the admin list; nobody can edit it from the app.
create policy "admins read admin profiles" on public.admin_profiles
  for select to authenticated using ((select public.is_admin()));

-- Private tables: admins only.
create policy "admins manage enquiries" on public.enquiries
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "admins manage enquiry notes" on public.enquiry_notes
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "admins manage subscribers" on public.newsletter_subscribers
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- Portfolio
create policy "public reads portfolio categories" on public.portfolio_categories
  for select to anon, authenticated using (true);
create policy "admins manage portfolio categories" on public.portfolio_categories
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "public reads published projects" on public.portfolio_projects
  for select to anon, authenticated using (published or (select public.is_admin()));
create policy "admins manage projects" on public.portfolio_projects
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "public reads images of published projects" on public.portfolio_images
  for select to anon, authenticated using (
    (select public.is_admin())
    or exists (
      select 1 from public.portfolio_projects p
      where p.id = portfolio_images.project_id and p.published
    )
  );
create policy "admins manage project images" on public.portfolio_images
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- Blog
create policy "public reads blog categories" on public.blog_categories
  for select to anon, authenticated using (true);
create policy "admins manage blog categories" on public.blog_categories
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "public reads blog tags" on public.blog_tags
  for select to anon, authenticated using (true);
create policy "admins manage blog tags" on public.blog_tags
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "public reads published posts" on public.blog_posts
  for select to anon, authenticated using (
    (status = 'published' and published_at is not null and published_at <= now())
    or (select public.is_admin())
  );
create policy "admins manage posts" on public.blog_posts
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "public reads tags of published posts" on public.blog_post_tags
  for select to anon, authenticated using (
    (select public.is_admin())
    or exists (
      select 1 from public.blog_posts p
      where p.id = blog_post_tags.post_id
        and p.status = 'published' and p.published_at is not null and p.published_at <= now()
    )
  );
create policy "admins manage post tags" on public.blog_post_tags
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- Testimonials
create policy "public reads published testimonials" on public.testimonials
  for select to anon, authenticated using (published or (select public.is_admin()));
create policy "admins manage testimonials" on public.testimonials
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- Site settings: everything in this table is public-facing information.
create policy "public reads site settings" on public.site_settings
  for select to anon, authenticated using (true);
create policy "admins update site settings" on public.site_settings
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- ───────────────────────── Storage ─────────────────────────
-- One public bucket for portfolio and blog images. Anyone can view a file
-- by URL; only admins can upload, replace or delete.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;

create policy "admins list media" on storage.objects
  for select to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
create policy "admins upload media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and (select public.is_admin()));
create policy "admins update media" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and (select public.is_admin()))
  with check (bucket_id = 'media' and (select public.is_admin()));
create policy "admins delete media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));

-- ───────────────────────── Starter categories ─────────────────────────

insert into public.portfolio_categories (slug, name, sort_order) values
  ('luxury-villas', 'Luxury Villas', 1),
  ('holiday-apartments', 'Holiday Apartments', 2),
  ('boutique-vacation-rentals', 'Boutique Vacation Rentals', 3),
  ('beach-houses', 'Beach Houses', 4),
  ('cabins-and-cottages', 'Cabins and Cottages', 5),
  ('multi-property-businesses', 'Multi-Property Businesses', 6);

insert into public.blog_categories (slug, name) values
  ('direct-bookings', 'Direct Bookings'),
  ('website-design', 'Website Design'),
  ('seo-and-marketing', 'SEO and Marketing'),
  ('operations', 'Operations');
