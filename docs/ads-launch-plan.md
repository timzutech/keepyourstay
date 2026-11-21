# KeepYourStay — first ad campaigns (United States)

**Goal:** get the first enquiries from property owners and managers who don't know KeepYourStay yet, and learn which messages and keywords bring them.

**Suggested starting budget:** about **$25/day** in total for the first 30 days: $15/day on Google Search, $10/day on Facebook & Instagram. That's roughly $750 for the month. Change it to whatever you're comfortable losing while you learn. A first month of ads is mostly for learning what works.

**Rule for every ad:** no promises of bookings, revenue or savings. Say what you do, not what will happen. Don't use the Airbnb name or logo in ad text or images (it's their trademark). "Short-term rental", "vacation rental" and "holiday home" are fine.

---

## Part 1 — Set up the accounts (once, about 45 minutes)

### 1. Google Analytics 4
1. Go to https://analytics.google.com and sign in with KeepYourStay@gmail.com.
2. **Admin → Create → Property.** Name: `KeepYourStay`. Time zone and currency: your choice (USD is simplest for US ads).
3. Choose **Web**, enter `https://www.keepyourstay.com`, stream name `Website`.
4. Copy the **Measurement ID** (starts with `G-`).

### 2. Google Ads
1. Go to https://ads.google.com and sign in with the same Google account.
2. When it pushes you to create a campaign straight away, look for **"Switch to Expert Mode"** (small link at the bottom) and then **"Create an account without a campaign"**. Set the country, time zone and **USD** currency. Billing can be added now or later.
3. **Link Analytics:** Tools → Data manager → Google Analytics (GA4) → Link.
4. **Create the lead conversion:** Goals → Conversions → Summary → **+ New conversion action** → **Website** → enter `https://www.keepyourstay.com` → choose **"Add a conversion action manually"**:
   - Goal category: **Submit lead form**
   - Name: `Website lead`
   - Value: **Don't use a value**
   - Count: **One**
   - Click-through window: 30 days
5. Choose **"Use Google tag"** → **"Install the tag yourself"** and look at the **event snippet**. It contains `send_to: 'AW-123456789/AbCdEfGhIj'`.
   - The part before the slash (`AW-123456789`) is your **Google Ads ID**.
   - The part after the slash (`AbCdEfGhIj`) is your **conversion label**.
   - You don't paste the snippet anywhere. The website already sends this conversion. You only need those two values.

### 3. Meta (Facebook & Instagram)
1. You need a Facebook Page for KeepYourStay. Create one if you don't have it.
2. Go to https://business.facebook.com and create a Business portfolio for KeepYourStay.
3. **Events Manager → Connect data sources → Web → Meta Pixel.** Name it `KeepYourStay website`, enter `https://www.keepyourstay.com`, choose **"Install code manually"** only to see the **Pixel ID** (a long number). Copy it and close; the website already contains the code.
4. **Verify your domain:** Business settings → Brand safety → Domains → Add `keepyourstay.com`, choose the **DNS TXT** method and add that record in Namecheap (Advanced DNS), same as you did for Google.
5. **Aggregated Event Measurement:** Events Manager → your pixel → Aggregated Event Measurement → configure web events → add **Lead** at the top priority.

### 4. Add the IDs to Vercel
In Vercel → `keepyourstay-vxc4` → **Settings → Environment Variables**, add (type **Config**, environments **Production and Preview**):

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL=XXXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXXX
```

Then **Deployments → ⋯ → Redeploy**. Tell Claude when it's done and the setup will be checked.

### How tracking works on the site (already built)
- Nothing loads until a visitor chooses in the cookie banner. **Analytics** loads Google Analytics; **Advertising** loads the Google Ads tag and the Meta Pixel.
- When any enquiry form saves successfully (contact, project, consultation, savings calculator), the site reports **one lead** to Google Analytics (`generate_lead`), Google Ads (your `Website lead` conversion) and Meta (`Lead`). Newsletter sign-ups are reported as a sign-up, not a lead.
- Visitors who reject cookies aren't tracked. Expect the numbers in Google and Meta to be lower than the real enquiries in your `/admin` dashboard. **Your dashboard is the true count.**

---

## Part 2 — Google Search campaign

### Settings
| Setting | Value |
| --- | --- |
| Campaign type | **Search** (goal: Leads) |
| Networks | Google Search only. **Untick** Search Partners and Display Network |
| Location | United States. Under Location options choose **"Presence: people in or regularly in your included locations"** |
| Language | English |
| Budget | $15/day |
| Bidding | Start with **Maximize clicks** with a **maximum CPC limit of $5**. After the campaign has 15–30 recorded leads, switch to **Maximize conversions** |
| Ad schedule | All days to start |
| Auto-applied recommendations | Turn these **off** (Recommendations → Auto-apply). They tend to add broad keywords and spend more |

### Ad group 1 — Vacation rental website design
**Final URL:** `https://www.keepyourstay.com/services/vacation-rental-website-design`

Keywords (type them exactly as shown; quotes = phrase match, brackets = exact match):
```
"vacation rental website design"
"vacation rental website designer"
"short term rental website design"
"holiday rental website design"
[vacation rental website builder]
"website for vacation rental property"
"website for my rental property"
"cabin rental website design"
"villa rental website design"
```

Headlines (all within Google's 30-character limit):
```
Vacation Rental Website Design
Websites for Rental Owners
Your Own Booking Website
Custom Rental Property Sites
Mobile-Ready Rental Websites
Show Off Your Property Online
Written Quote Before We Start
Book a Free Consultation
Built Around Your Property
Your Brand, Not a Listing
Websites for Villas & Cabins
Explore Our Live Demo Site
US & UK Clients Welcome
Fixed Scope, No Surprises
KeepYourStay Web Design
```

Descriptions (within the 90-character limit):
```
Custom websites for vacation rentals. Photo-led, mobile-first and quoted to your needs.
Give guests who find you on their own somewhere to book. See our work and get a quote.
Tested on phones before launch, with a private preview link. Get a written quote first.
One property or many. Calendars, payments and search basics built in. Book a consultation.
```

### Ad group 2 — Direct booking websites
**Final URL:** `https://www.keepyourstay.com/services/direct-booking-websites`

Keywords:
```
"direct booking website"
"direct booking website for vacation rental"
"vacation rental booking website"
"short term rental booking website"
"booking website for rental property"
"accept direct bookings vacation rental"
"vacation rental booking engine website"
[direct booking site for hosts]
```

Headlines:
```
Direct Booking Websites
Take Bookings On Your Own Site
Booking Calendar Integration
Secure Card Payments Built In
Works With Your PMS
A Booking Channel of Your Own
Keep Your Platform Listings
Calculate Your Potential Fees
Request a Custom Quote
Live Availability Calendars
Try Our Free Savings Tool
Built for Short-Term Rentals
Book a Free Consultation
Written Quote Before We Start
See a Working Demo Site
```

Descriptions:
```
Your own booking website alongside the platforms you use. Calendar and payments included.
Connects to your PMS, calendar or booking tool where supported. We check before quoting.
Estimate what an independent channel could mean for you with our free calculator.
We build it, test real bookings end to end, and launch on your domain. Request a quote.
```

### Ad group 3 — Property managers
**Final URL:** `https://www.keepyourstay.com/services/multi-property-websites`

Keywords:
```
"vacation rental property management website"
"property manager website design"
"short term rental management website"
"website for vacation rental management company"
"multi property booking website"
```

Headlines:
```
Websites for Property Managers
One Site for All Your Rentals
Multi-Property Booking Sites
Search Across Every Property
PMS-Connected Websites
Grow Your Owner Portfolio
Built to Add New Listings
Request a Custom Quote
Book a Free Consultation
Written Quote Before We Start
Consistent Pages, One Brand
See Our Portfolio Concepts
Direct Booking Websites
Owner Enquiry Pages Included
For US Property Managers
```

Descriptions:
```
One website for your whole portfolio: search, filters and a page for every property.
Listings drawn from your PMS where it allows, so rates and availability stay in step.
A section that speaks to property owners too, with its own enquiry form. Get a quote.
Adding the next property should mean entering details, not a redesign. Talk to us.
```

### Negative keywords (add at campaign level)
These stop the ads showing to job-seekers, renters and people wanting free tools:
```
free
template
templates
wordpress theme
jobs
job
salary
course
course online
how to become
for rent
apartments for rent
cheap vacation rentals
vacation rentals near me
book a cabin
login
sign in
airbnb login
vrbo login
reviews of
```

### Assets (add at campaign level)
**Sitelinks** (25 characters max; each with two short description lines):
| Sitelink text | URL |
| --- | --- |
| Savings Calculator | /savings-calculator |
| Our Portfolio | /portfolio |
| Direct Booking Guide | /direct-booking |
| Request a Quote | /contact#project |

**Callouts:** `Written Quote First` · `Private Preview Link` · `Tested on Real Phones` · `Reply in 2 Working Days` · `You Own Your Domain`

**Business name:** KeepYourStay. **Logo:** upload the house icon from the website.

---

## Part 3 — Facebook & Instagram campaign

### Settings
| Setting | Value |
| --- | --- |
| Objective | **Leads** |
| Conversion location | **Website**, pixel `KeepYourStay website`, event **Lead** |
| Budget | $10/day (Advantage campaign budget on) |
| Location | United States |
| Age | 25–65+ |
| Audience | Start with **Advantage+ audience** and add these as suggestions: *Vacation rental*, *Short-term rental*, *Airbnb* (interest), *Vrbo*, *Property management*, *Real estate investing*, *Small business owners* |
| Placements | Advantage+ placements |
| Special ad category | None. You're advertising a web design service, not housing for rent |

If Meta asks you to choose a special ad category for "housing" because the ads mention rentals, choose it. That only limits the targeting options and doesn't stop the ads.

### Ad 1 — The calculator (send to `/savings-calculator`)
**Primary text:**
> Most of your bookings come through platforms, and that's fine. But what would a channel of your own be worth? Put your own numbers into our free calculator and see an honest estimate. No sign-up needed.

**Headline:** `Free savings calculator for hosts`
**Description:** `Your numbers, your assumptions.`
**Button:** Learn more
**Image:** a screenshot of the calculator's green results panel, or a clean photo of a rental with the text "What's a booking channel of your own worth?"

### Ad 2 — The live demo (send to `/portfolio/juniper-and-tide`)
**Primary text:**
> This is what a direct booking website for a vacation rental can look like: three homes, live availability, house rules and a clear route to booking. Click through our working demo, then ask us what we'd build for yours.

**Headline:** `See a working rental website`
**Description:** `Concept demo by KeepYourStay`
**Button:** Learn more
**Image:** a screenshot of the Juniper & Tide homepage (it's your own demo, so you can use it). Keep "Concept" or "Demo" visible in the text so nobody thinks it's a real client.

### Ad 3 — Owning your presence (send to `/services/direct-booking-websites`)
**Primary text:**
> A listing is rented space. A website is yours: your domain, your photos, your way of describing the place. We design vacation rental websites with calendars and secure payments, quoted in writing before any work starts.

**Headline:** `Your property. Your website.`
**Description:** `Get a custom quote`
**Button:** Get quote
**Image:** a strong property photo (licensed: use Unsplash photos or your own; never a client's photos without permission).

**Tracking tags:** at the end of each Meta ad's website URL add
`?utm_source=meta&utm_medium=paid_social&utm_campaign=launch_us&utm_content=calculator` (change the last word to `demo` or `owned` for ads 2 and 3). Google Ads tags its own links automatically.

---

## Part 4 — The first 30 days

**Daily for the first 3 days:** check both campaigns are spending and ads are approved. Disapproved ads usually just need a wording change.

**Every week:**
1. **Google Ads → Insights and reports → Search terms.** Add anything irrelevant as a negative keyword. This is the single most valuable 10 minutes you'll spend.
2. Compare spend with the enquiries in `/admin → Enquiries`. Note which page each enquiry came from (shown as "Submitted from").
3. In Meta, pause any ad with a cost per click more than double the others after about $40 of spend on it.

**After 30 days, decide:**
- Which platform produced enquiries at a cost you'd happily pay again?
- Move the budget there, and raise it only on what's working.
- Expect a cost per lead of roughly $30–150 in this market. It varies widely, so treat your own numbers as the truth.

**Don't:** turn on Display Network or Search Partners, accept auto-applied recommendations, or judge results before about 2 weeks and $200 of spend per platform.

---

## Before you switch ads on, check
- [ ] Cookie banner shows **Analytics** and **Advertising** under Manage preferences
- [ ] GA4 Realtime shows your own visit after you click **Accept all**
- [ ] Meta Events Manager → Test events shows **PageView**, and **Lead** after you send a test enquiry
- [ ] Google Ads conversion `Website lead` shows "Recording conversions" within about 24 hours of a test enquiry
- [ ] Delete the test enquiries afterwards in `/admin`
