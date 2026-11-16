# KeepYourStay

**Your property. Your website. Your bookings.**

The marketing website, lead-capture system and admin dashboard for KeepYourStay, a vacation rental website design and direct-booking solutions provider.

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4, self-hosted fonts (Bricolage Grotesque, Source Serif 4)
- **Backend:** Supabase (Postgres, Auth, Storage, Row Level Security)
- **Email:** Resend
- **Hosting:** Vercel

## Contents

1. [Run it locally](#run-it-locally)
2. [Environment variables](#environment-variables)
3. [Supabase setup](#supabase-setup)
4. [Email setup (Resend)](#email-setup-resend)
5. [Analytics and cookie consent](#analytics-and-cookie-consent)
6. [Deploy to Vercel](#deploy-to-vercel)
7. [Connect a domain](#connect-a-domain)
8. [Post-deployment checklist](#post-deployment-checklist)
9. [Managing content](#managing-content)
10. [How it is built](#how-it-is-built)
11. [Testing](#testing)
12. [Still needed from you](#still-needed-from-you)

## Run it locally

```bash
npm install
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

Open http://localhost:3000. Without Supabase credentials the public site still runs on its bundled starter content. Forms will refuse to submit (and say so) rather than pretend to succeed, and `/admin` shows a "not connected" notice.

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm test` | Unit tests (calculator formulas, form validation) |
| `node tests/e2e/smoke.mjs` | Browser smoke test against a running server (`BASE_URL`, default `http://localhost:3000`) |

## Environment variables

All are listed with comments in `.env.example`.

| Variable | Required | Exposed to browser | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | Yes | Public URL, no trailing slash. Drives canonical URLs, sitemap, Open Graph and email links. |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Yes | Supabase anon (publishable) key. Safe to expose; limited by Row Level Security. |
| `FORMS_SECRET` | Yes | **No** | Server only. A long random string; the database stores its hash and requires it to save an enquiry or subscriber. Never give it a `NEXT_PUBLIC_` prefix. |
| `RESEND_API_KEY` | For email | No | Resend API key |
| `EMAIL_FROM` | For email | No | Sender, on a domain verified in Resend, e.g. `KeepYourStay <hello@your-domain.com>` |
| `LEAD_NOTIFICATION_EMAIL` | No | No | Where lead notifications go. Defaults to `KeepYourStay@gmail.com`. |
| `NEXT_PUBLIC_BUSINESS_EMAIL` | No | Yes | Default public email (overridable in Admin → Site settings) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | No | Yes | Default WhatsApp number, digits only (`19514692722`) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | Yes | Google Analytics 4 ID. Loaded only after consent. |
| `RATE_LIMIT_SALT` | Yes | No | Long random string used to hash visitor IPs for rate limiting |
| `NEXT_PUBLIC_LEGAL_REVIEWED` | No | Yes | Set to `true` only after a lawyer has reviewed the legal pages; hides the "template" notice |

## Supabase setup

1. **Create a project** at https://supabase.com/dashboard (or choose an existing empty one). The `keepyourstay` project (ref `fgvrynwvqoklklorugin`, US East) already exists with both migrations applied, with all three migrations and the secret hash applied, so for that project skip to step 4. Use a dedicated project: the migration creates tables such as `testimonials` and `site_settings` that could clash with another app's tables.
2. **Apply the schema.** Open *SQL Editor*, run `supabase/migrations/0001_init.sql`, `0002_private_is_admin.sql` and `0003_form_functions.sql`, each once, in that order. With the Supabase CLI instead:

   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

   ```bash
   supabase db push
   ```

   This creates all tables, indexes, constraints, Row Level Security policies, the public `media` storage bucket and the starter categories.
3. **Copy the keys.** *Project Settings → API*: copy the project URL and the anon (publishable) key into your environment variables. The service-role key is not used.
3a. **Set the forms secret.** Generate a random string and its hash:

   ```bash
   SECRET=$(openssl rand -hex 32); echo "FORMS_SECRET=$SECRET"; printf '%s' "$SECRET" | sha256sum
   ```

   Put `FORMS_SECRET` in your environment variables, and store the hash in the SQL Editor:

   ```sql
   insert into private.app_config (key, value) values ('forms_secret_hash', 'PASTE_HASH_HERE')
   on conflict (key) do update set value = excluded.value;
   ```

   To rotate the secret later, repeat both halves.
4. **Create the admin user.** *Authentication → Users → Add user*. Enter an email and a strong password and tick "Auto confirm user".
5. **Grant admin access.** Open `supabase/make_admin.sql`, replace `REPLACE_WITH_ADMIN_EMAIL` with that email, and run it in the SQL Editor. Only users with a row in `admin_profiles` can use `/admin`.
6. **Turn off public sign-ups.** *Authentication → Sign In / Providers*: disable "Allow new users to sign up". (A signed-up non-admin could not read or change anything anyway, but there is no reason to allow it.)
7. **Load the starter content.** Sign in at `/admin` and press **Import starter content**. It adds the six concept projects, three unpublished placeholders for your real client work, and nine articles.

### Security model

| Who | Can do |
| --- | --- |
| Visitor (anon key) | Read published projects, their images, published posts, published testimonials, categories, tags and site settings. Nothing else. No direct writes at all. |
| Site server (anon key + `FORMS_SECRET`) | Call four database functions: save an enquiry, mark it notified, subscribe, unsubscribe. Nothing else. The secret never reaches the browser, and the service-role key is not used anywhere. |
| Signed-in non-admin | Same as a visitor. |
| Admin (row in `admin_profiles`) | Manage everything, through their own session, so the database enforces the same rule as the app. |

Database constraints back up the content rules: a completed client project cannot be published without `client_permission`, and a testimonial cannot be published unless it is both `verified` and `client_approved`.

## Email setup (Resend)

1. Create an account at https://resend.com.
2. *Domains → Add domain*, then add the DNS records it shows you. Resend only sends from a verified domain, so this step needs your domain. (A Gmail address cannot be the sender; it can be the recipient.)
3. *API Keys → Create API key* with "Sending access".
4. Set `RESEND_API_KEY`, `EMAIL_FROM` (an address on the verified domain) and, if you want, `LEAD_NOTIFICATION_EMAIL`.

Emails sent: new contact request, new project enquiry, new consultation request (all to the lead inbox, with reply-to set to the enquirer), a newsletter welcome with an unsubscribe link (to the subscriber) and a new-subscriber notice (to the lead inbox).

Until email is configured, enquiries are still saved and visible in the dashboard. The dashboard shows a warning, and each enquiry records whether its notification was sent.

## Analytics and cookie consent

- Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to a GA4 ID (`G-XXXXXXXXXX`). Leave it empty for no analytics.
- The GA script is not loaded until the visitor chooses **Accept all** or switches analytics on under **Manage preferences**. **Reject non-essential** is a first-level button with the same prominence as Accept.
- The choice is stored in the browser's local storage (`kys_consent`). Visitors can change it from **Cookie preferences** in the footer or on the cookie policy page.
- To use a different analytics provider, replace the two `<Script>` tags in `src/components/CookieConsent.tsx`.

## Deploy to Vercel

1. Push this repository to GitHub, GitLab or Bitbucket.
2. In Vercel: *Add New → Project*, import the repository.
3. Framework preset: **Next.js** (auto-detected). Build command `next build`, output directory default, install command `npm install`. No `vercel.json` is needed.
4. Add every variable from the table above under *Settings → Environment Variables* for Production (and Preview if you use it). Set `NEXT_PUBLIC_SITE_URL` to the Vercel URL for now.
5. Deploy.

`NEXT_PUBLIC_*` variables are baked in at build time, so redeploy after changing any of them.

## Connect a domain

1. Buy the domain from any registrar, in your own name.
2. Vercel: *Project → Settings → Domains → Add*. Add both `yourdomain.com` and `www.yourdomain.com` and choose which one redirects to the other.
3. Add the DNS records Vercel shows at your registrar. HTTPS is issued automatically.
4. Change `NEXT_PUBLIC_SITE_URL` to `https://yourdomain.com` (your chosen primary) and redeploy.
5. Supabase: *Authentication → URL Configuration*, set Site URL to the same address.
6. Verify the same domain in Resend and update `EMAIL_FROM`.
7. Add the site to Google Search Console and submit `https://yourdomain.com/sitemap.xml`.

## Post-deployment checklist

- [ ] Home, services, portfolio, blog and contact pages load on a phone and a desktop
- [ ] Portfolio and blog photographs load
- [ ] Submit each of the three forms on `/contact`; each appears in *Admin → Enquiries*
- [ ] Submit the savings calculator form; the enquiry shows the calculator scenario
- [ ] A notification email arrives at the lead inbox for each, and replying addresses the enquirer
- [ ] Subscribe to the newsletter; the welcome email arrives and its unsubscribe link works
- [ ] WhatsApp buttons open a chat with +1 (951) 469-2722 and a prefilled message
- [ ] `/admin` redirects to sign-in when signed out; sign-in works; a non-admin account is refused
- [ ] Editing a project, article and site setting in the dashboard changes the public site
- [ ] Uploading an image in the project editor works
- [ ] `/sitemap.xml` and `/robots.txt` show the real domain
- [ ] Cookie banner appears; rejecting loads no analytics; accepting loads GA (if configured)
- [ ] Share a page link in a messaging app and check the preview card
- [ ] Legal pages completed and reviewed, then `NEXT_PUBLIC_LEGAL_REVIEWED=true`

## Managing content

Sign in at `/admin`.

| Section | What you can do |
| --- | --- |
| Overview | Counts of enquiries by type and status, projects, posts and subscribers; recent activity |
| Enquiries | Search, filter by type and status, open details, move through the pipeline (New → Contacted → Qualified → Proposal Sent → Negotiation → Won / Lost), add internal notes, delete |
| Portfolio | Add, edit, delete, publish or unpublish projects; upload a cover and gallery; mark concept or completed; set featured; add verified outcomes; add categories |
| Blog | Write in Markdown, save drafts, publish, schedule, feature; categories, tags, featured image, SEO title and description |
| Testimonials | Add and edit; publishing requires "genuine" and "client approved" to be ticked |
| Subscribers | Newsletter list with status |
| Site settings | Business email, WhatsApp number, social links, site title, tagline, default SEO description, brand and footer text |

Rules the system enforces for you:

- Concept projects always display "Concept Project — Illustrative Design", cannot have a live URL and cannot have outcomes.
- Completed client projects need the client-permission box ticked before they can be published.
- Outcomes show only on completed projects and only when marked verified.
- The homepage testimonial section is hidden until a testimonial is published.

Changes appear on the public site immediately after saving.

**Adding your real projects:** open one of the "Client project (add details)" drafts under Portfolio, fill in the name, URL, description, services, features and screenshots, tick the permission box once you have it, and publish.

Service descriptions, FAQs and the copy on fixed pages live in code (`src/content/` and `src/app/(site)/`), since they change rarely.

## How it is built

```
src/
  app/
    (site)/            Public pages: home, about, services, portfolio, pricing,
                       direct-booking, savings-calculator, blog, contact, faq, legal, 404
    admin/             Sign-in, dashboard and editors (all server-checked)
    actions/           Public form handlers (enquiries, newsletter)
    sitemap.ts, robots.ts, opengraph-image.tsx
  components/          Header, footer, forms, calculator, cookie consent, cards
  content/             Services, FAQs, starter portfolio and blog content
  lib/                 Data access, validation schemas, calculator, email, SEO, Supabase clients
  middleware.ts        Session refresh and /admin gate
supabase/
  migrations/0001_init.sql   Schema, RLS policies, storage bucket
  make_admin.sql             Grants admin access to a user
tests/                 Unit tests and the browser smoke test
```

Decisions worth knowing about:

- **Forms never fake success.** The server validates again with the same Zod schemas as the browser, saves the row, and only then returns success. If the database is unreachable the visitor is told, and pointed to email and WhatsApp.
- **Visitors cannot write to the database.** Inserts go through server actions that call secret-protected database functions. The site never holds the service-role key, so even a full server compromise could not read enquiries or alter content.
- **Spam protection** is a hidden honeypot field, a minimum time on the form, and a limit of five enquiries per ten minutes per visitor, enforced in the database (by salted IP hash; raw IPs are not stored). No third-party CAPTCHA, so no extra cookies or scripts.
- **Calculator results are recomputed on the server** from the submitted inputs, not trusted from the browser.
- **Content is cached** and refreshed when an admin saves, with a five-minute fallback.
- **SEO:** unique titles and descriptions, canonical URLs, Open Graph and Twitter cards, `sitemap.xml`, `robots.txt`, breadcrumbs, and JSON-LD for Organization/ProfessionalService, WebSite, Service, Article, BreadcrumbList and FAQPage. No rating or review schema.
- **Accessibility:** semantic landmarks, skip link, labelled fields with linked error messages, visible focus, keyboard-operable menu and filters, reduced-motion support.
- **Images:** portfolio and blog photographs are Unsplash images served through Next.js image optimisation. Admin uploads go to the Supabase `media` bucket.

## Testing

Run in the build environment before hand-over:

| Check | Result |
| --- | --- |
| `npm run build` | Passes; 47 routes generated |
| `npm run lint` | No errors or warnings |
| `npm run typecheck` | No errors |
| `npm test` | 19 of 19 unit tests pass (calculator formulas, all four form schemas, WhatsApp link) |
| `tests/e2e/smoke.mjs` | 49 of 49 browser checks pass |
| Schema and RLS | Migration applied to a local Postgres 16; anon, signed-in non-admin and admin roles exercised |

The browser test crawls every internal link (103 URLs), checks SEO tags on each page, the 404 page, WhatsApp and email links, cookie consent and analytics gating, calculator arithmetic and validation, client and server form validation, the honeypot, portfolio filters and labels, blog search, categories, tags and pagination, that every admin route redirects when signed out, horizontal overflow at 375 px on 14 pages, the mobile menu and the skip link.

**Not yet tested, because they need your accounts:**

- Saving enquiries and subscribers to a live Supabase project, and the admin dashboard against live data (sign-in, editing, image upload). The code paths are type-checked and the SQL they depend on is tested, but they have not run against a real Supabase API.
- Email delivery through Resend.
- Google Analytics receiving data.
- Photographs loading from Unsplash (the build environment blocked that host).

After connecting Supabase, run the smoke test in backend mode:

```bash
BASE_URL=https://your-site EXPECT_BACKEND=1 node tests/e2e/smoke.mjs
```

It submits one test contact enquiry and one newsletter sign-up; delete them afterwards in the dashboard.

`npm audit` reports one moderate advisory in `minimatch`, a dependency of the lint tooling only. It is not part of the deployed site.

## Still needed from you

| Item | Why |
| --- | --- |
| An admin user in the `keepyourstay` Supabase project | Dashboard access |
| An admin email and password | Dashboard access |
| A domain name | Site address; also required before email can be sent |
| A Resend account and API key | Lead notification and newsletter emails |
| A GA4 measurement ID (optional) | Analytics |
| Details and screenshots of your real client websites, with each client's permission | Portfolio |
| Verified client testimonials (optional) | Homepage testimonial section |
| Legal entity name and address, retention periods, governing law, and a lawyer's review | Privacy policy, terms and cookie policy |
| Social media profile links (optional) | Footer and structured data |
| A decision on the About page | No founder biography, team or history has been written; add them if you want them |
