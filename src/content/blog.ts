import { photo, photos } from "@/lib/site";
import type { BlogCategory, Post } from "@/lib/types";

export const blogCategories: BlogCategory[] = [
  { slug: "direct-bookings", name: "Direct Bookings" },
  { slug: "website-design", name: "Website Design" },
  { slug: "seo-and-marketing", name: "SEO and Marketing" },
  { slug: "operations", name: "Operations" },
];

const cat = (slug: string) => blogCategories.find((c) => c.slug === slug)!;
const tag = (name: string) => ({ name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-") });

type Seed = Omit<Post, "seo_title" | "seo_description" | "cover_alt"> & { cover_alt: string };

const seeds: Seed[] = [
  {
    slug: "why-vacation-rental-owners-need-their-own-website",
    title: "Why Vacation Rental Owners Need Their Own Website",
    excerpt:
      "A listing puts your property in front of a platform's audience. A website gives you somewhere that is yours. Here is what that changes, and what it does not.",
    category: cat("direct-bookings"),
    tags: [tag("Direct bookings"), tag("Getting started")],
    featured: true,
    published_at: "2026-11-18T14:30:00Z",
    cover_image: photo(photos.villaPool),
    cover_alt: "Villa terrace beside a private swimming pool",
    content: `Booking platforms are very good at one thing: putting your property in front of people who are ready to travel. For many owners they are the reason the business exists at all. This article is not an argument against them.

It is an argument against having nothing else.

## A listing is rented space

Your listing lives inside someone else's product. The platform decides how it looks, where it ranks, what it charges, and what you may say to a guest. Those terms can change, and you find out when they do. None of that is unreasonable. It is simply what it means to be a tenant.

A website is the part of your online presence that you own. The domain is yours. The design is yours. The guest who books there has a relationship with your business rather than with an intermediary.

## What a website gives you

**Somewhere to send people.** A guest who loved their stay tells a friend. A local restaurant recommends you. Someone sees your sign from the road. Each of these people will search for your property by name. If the only result is a platform listing, that is where they go. If you have a website, they have a choice.

**A place to say more.** A listing has fixed fields. A website can explain the walk to the beach, the story of the house, what the kitchen is really like for someone who cooks. Detail builds confidence, and confidence is what a guest needs before paying a stranger.

**A foundation for marketing.** Social posts, emails to past guests, a mention in a local guide: every one of these needs a destination. Without a website, your own marketing sends people back to a page where your property sits beside its competitors.

## What a website does not do

A website does not produce bookings by existing. People have to find it, trust it, and be able to book easily. That takes search visibility, reviews, good photographs, sensible pricing and some marketing effort. It also has costs: hosting, booking software, payment processing and maintenance.

Nor is a website a way around platform rules. A guest who finds you on a platform should book on that platform. Your website is for the guests who find you independently.

## Who benefits most

Owners with repeat guests, strong word of mouth, a distinctive property or a recognisable name tend to gain the most, because they already have people looking for them directly. If that describes you, a website gives that interest somewhere to land.

If you are just starting out, a website is still worth having. Expect it to grow slowly, alongside the platforms rather than instead of them.`,
  },
  {
    slug: "direct-bookings-vs-third-party-booking-platforms",
    title: "Direct Bookings vs Third-Party Booking Platforms",
    excerpt:
      "It is not a contest. Platforms and direct bookings do different jobs, and most healthy rental businesses use both. A plain comparison of what each offers.",
    category: cat("direct-bookings"),
    tags: [tag("Direct bookings"), tag("Booking platforms")],
    featured: true,
    published_at: "2026-11-18T14:31:00Z",
    cover_image: photo(photos.beachHouse),
    cover_alt: "Timber beach house beside a quiet road",
    content: `Owners often frame this as a choice. It rarely is. The useful question is not "platform or direct?" but "what proportion of each suits my business, and how do I get there?"

## What platforms do well

**Reach.** A large platform has an audience no individual owner can match. A new property with no reputation can receive bookings within days.

**Trust.** Guests know the platform. They trust its payment handling, its review system and its support if something goes wrong.

**Convenience.** Calendars, messaging, payments and reviews are built in.

The price of all this is a fee on each booking, limited control over presentation, and rules about how you communicate with guests.

## What direct bookings offer

**A direct relationship.** The guest books with your business. You hold the booking details and can, with their consent, stay in touch.

**Control.** Your policies, your presentation, your brand.

**Different costs.** There is no platform commission on a direct booking, but there are other costs: payment processing, booking software, hosting, maintenance, and whatever you spend bringing guests to your site. Direct is not free. Whether it works out cheaper depends on your numbers.

The price here is effort. You have to attract the guests yourself and earn their trust without a platform's badge beside your name.

## Where each booking comes from matters

A guest who discovers you on a platform is that platform's customer for that booking. Platforms set rules about moving those enquiries elsewhere, and you should follow them.

Direct bookings come from people who find you by other routes: a search for your property's name, a recommendation, your social accounts, a return visit, a local partnership. Growing direct bookings means growing those routes, not diverting platform guests.

## A realistic mix

For most owners the sensible aim is to keep the platforms working and gradually build an independent channel beside them. A property with many repeat guests might see a meaningful share of direct bookings fairly soon. A new listing in a crowded city may take much longer.

There is no universal target. The right mix is the one that leaves you less exposed to any single source of bookings.

## Where to start

1. Have a website that deserves trust: good photographs, clear policies, real contact details.
2. Make booking easy, with live availability and secure payment.
3. Make sure people who search for your property by name can find it.
4. Give past guests a reason, and a way, to come back.`,
  },
  {
    slug: "how-to-build-a-direct-booking-website",
    title: "How to Build a Direct Booking Website",
    excerpt:
      "The decisions that matter, in the order you should make them: domain, booking engine, payments, content and launch.",
    category: cat("website-design"),
    tags: [tag("Direct bookings"), tag("Getting started"), tag("Booking engines")],
    featured: false,
    published_at: "2026-11-18T14:32:00Z",
    cover_image: photo(photos.livingRoom),
    cover_alt: "Modern living room with an armchair and framed art",
    content: `A direct booking website has more moving parts than an ordinary brochure site. Taking the decisions in a sensible order saves rework.

## 1. Decide what "booking" means for you

There are three common models:

- **Enquiry only.** Guests send dates and you reply. Simple, but slower for the guest.
- **Request to book.** Guests choose available dates and submit a request that you approve.
- **Instant booking.** Guests choose dates, pay, and receive confirmation immediately.

Instant booking converts best when trust is high, but it demands an accurate calendar and clear policies. High-value or complex stays often suit request-to-book.

## 2. Choose where availability lives

Something has to be the single source of truth for your calendar. If you use a property management system or channel manager, it should be that. If you do not, a dedicated booking tool or carefully synchronised calendars can fill the role. Decide this before design begins, because it shapes everything else.

## 3. Register a domain in your own name

The domain is the address of your business. Register it yourself, in an account you control, even if someone else builds the site. Choose something short, easy to say aloud, and close to your property's name.

## 4. Sort out payments

To take card payments you need an account with a payment provider, held in your business's name. Availability varies by country. Card details should be entered on the provider's secure fields, never stored on your website. Processing fees apply to each transaction, so include them in your pricing.

## 5. Gather the content

This is where most projects stall. You will need:

- Photographs of every room, the exterior and the surroundings
- A description written for guests, not for an algorithm
- Amenities, sleeping arrangements and accessibility information
- House rules, cancellation policy and terms
- Location details: travel, parking, what is nearby

## 6. Design for the phone first

Most guests will first see your site on a phone. Dates, price and the booking button should be reachable without hunting. Test the full journey on a small screen before anything else.

## 7. Test before launch

Make test bookings. Check the confirmation emails. Block dates in one calendar and confirm they disappear from the other. Try to break it. It is better that you find the fault than a guest.

## 8. Plan what happens after launch

A website needs visitors. Decide in advance how people will find it: search, social accounts, past guests, local partners. And decide who will keep the site updated and check that it is still working.`,
  },
  {
    slug: "how-booking-calendar-integration-works",
    title: "How Booking Calendar Integration Works",
    excerpt:
      "iCal feeds, API connections and channel managers explained without jargon, including why double bookings happen and how to make them unlikely.",
    category: cat("operations"),
    tags: [tag("Calendars"), tag("Property management systems")],
    featured: false,
    published_at: "2026-11-18T14:33:00Z",
    cover_image: photo(photos.sunlitRoom),
    cover_alt: "Sunlit room with a desk, computer and sofa",
    content: `If your property can be booked in more than one place, each of those places needs to know when it has been booked somewhere else. That is all calendar integration is. The details are in how quickly, and how reliably, the news travels.

## iCal: the common language

Almost every booking platform and tool can export a calendar as an iCal feed, which is a web address that lists your booked dates. Other systems can import that feed and block the same dates.

iCal is widely supported and costs nothing. Its limits are worth knowing:

- **It is not instant.** Each system checks the feed on its own schedule. Depending on the system, that may be every few minutes or every few hours.
- **It carries dates, not details.** Usually it only says "these nights are unavailable". Rates, guest names and minimum stays do not travel.
- **It works in one direction per feed.** For two calendars to stay in step, each must import the other's feed.

For a single property with modest booking volume, iCal is often enough. The risk is the gap between a booking being made and the other calendars hearing about it.

## API connections: faster and richer

An API connection lets two systems talk directly. When a booking is made, the other system is told immediately, and more than dates can be exchanged: rates, restrictions, reservation details.

Platforms generally offer API connections to approved software rather than to individual websites. In practice, that means you get them by using a property management system or channel manager that holds those connections.

## Channel managers and PMS

A channel manager sits in the middle. You set availability and rates once; it pushes them to every connected channel and pulls reservations back. A property management system usually includes this along with other tools such as guest messaging and cleaning schedules.

If your website connects to the same system, it becomes one more channel drawing from the same source of truth.

## Why double bookings happen

Nearly always for one of three reasons:

1. Two guests book the same dates in the gap between calendar updates.
2. A feed was set up in one direction only.
3. A feed address changed or expired and nobody noticed.

## Making them unlikely

- Use the fastest connection your tools support.
- Check that every calendar both sends and receives.
- After setup, make a test booking in each place and watch it appear in the others.
- Consider a short advance-notice rule, so same-day bookings cannot collide.
- Recheck the connections every few months.

No setup makes double bookings impossible, but a well-tested one makes them rare.`,
  },
  {
    slug: "how-to-improve-vacation-rental-seo",
    title: "How to Improve Vacation Rental SEO",
    excerpt:
      "You will not outrank the big platforms for 'villas in Tuscany'. You do not need to. Where a single-property website can realistically be found.",
    category: cat("seo-and-marketing"),
    tags: [tag("SEO"), tag("Google")],
    featured: true,
    published_at: "2026-11-18T14:34:00Z",
    cover_image: photo(photos.cabinMeadow),
    cover_alt: "Log cabin in a meadow of wildflowers",
    content: `Search engine optimisation for a rental property is less about tricks than about being the clearest, most useful result for a small number of searches that matter.

## Start with your own name

The most valuable search is the simplest one: your property's name. People who type it already know about you. They have seen a listing, heard a recommendation or stayed before.

Search for your property now. If your own website is not near the top, fix that first:

- Put the property name in the page title and main heading of your home page.
- Use the name consistently everywhere it appears online.
- Claim a Google Business Profile if your property is eligible, and complete it fully.

## Be specific about the place

Broad destination searches are dominated by large platforms and travel publishers. Narrow searches are different. Someone looking for a dog-friendly cottage near a particular village, or a house within walking distance of a particular beach, is looking for something you may be able to answer precisely.

Write pages that describe exactly where you are and what is nearby. Name the village, the beach, the trailhead, the station. Give real distances and walking times.

## Get the technical basics right

None of this is glamorous, and all of it matters:

- A unique, descriptive title and description for every page
- A sitemap submitted through Google Search Console
- Pages that load quickly, especially on mobile data
- Images compressed, with text descriptions
- A secure connection (https)
- Structured data that tells search engines the page describes a place to stay

## Write for the guest

Search engines try to reward pages that answer the searcher's question. So answer it. How many does it sleep? Is there parking? How far is the nearest shop? Can you swim there in May? Useful detail serves guests and search at the same time.

Avoid stuffing pages with repeated keywords. It reads badly and does not help.

## Earn mentions

Links from relevant local websites help: a tourism board listing, a nearby attraction's "where to stay" page, a local business you recommend. Ask the people you already know.

## Be patient and measure

Search visibility builds over months. Use Search Console to see which searches bring people to you and which pages they land on, then improve those pages. Be wary of anyone who promises a specific ranking; nobody controls that.`,
  },
  {
    slug: "what-guests-expect-from-a-vacation-rental-website",
    title: "What Guests Expect From a Vacation Rental Website",
    excerpt:
      "Guests arrive with a short list of questions. A website that answers them quickly earns the booking. One that hides the answers loses it.",
    category: cat("website-design"),
    tags: [tag("Guest experience"), tag("Website features")],
    featured: false,
    published_at: "2026-11-18T14:35:00Z",
    cover_image: photo(photos.bedroom),
    cover_alt: "Bedroom with a white sofa and warm lighting",
    content: `A guest visiting your website is trying to answer a handful of questions as quickly as possible. Understanding them is most of what good rental website design comes down to.

## Is it available, and what will it cost?

This comes first, and it should be answerable in seconds. A calendar showing free dates, and a total price that includes cleaning and other fees, removes the biggest reason guests leave. Surprise costs at the last step are a reliable way to lose a booking.

## What is it really like?

Photographs do most of the work. Guests expect:

- Every bedroom and bathroom, not only the best one
- The kitchen and living areas as they would actually be used
- The outside space and the view
- Enough images to understand how the rooms connect

A simple floor plan or a clear sleeping arrangement ("Bedroom 2: two singles") saves a great many questions.

## Where exactly is it?

Not the exact address before booking, necessarily, but enough to plan: the area, what is within walking distance, how far to the beach or the slopes or the centre, how to arrive, where to park.

## Can I trust this?

On a platform, trust is supplied. On your own website, you have to supply it:

- Reviews from real past guests, with permission
- A named person or business and real contact details
- Clear cancellation and house-rule policies
- Secure payment through a recognised provider
- A site that looks cared for and works properly

A broken link or an out-of-date notice makes guests wonder what else has been neglected.

## What are the rules?

Check-in and check-out times, pets, children, smoking, events, minimum stay. State them plainly before the guest books, not after.

## How do I book, and what happens next?

The route to booking should be obvious on every page. After booking, the guest should receive an immediate confirmation that says what they have paid, what is still due, and when they will hear from you about arrival.

## Does it work on my phone?

Most guests will first visit on a phone, often while doing something else. If the gallery is fiddly or the date picker is impossible with a thumb, they will not wait until they are at a desk. They will go elsewhere.

## The short version

Answer the practical questions early, show the property honestly, make the price clear, and make booking simple. Everything else is decoration.`,
  },
  {
    slug: "how-multi-property-owners-can-organize-their-online-presence",
    title: "How Multi-Property Owners Can Organize Their Online Presence",
    excerpt:
      "One website or several? One brand or many? A practical way to decide when you manage more than one rental.",
    category: cat("operations"),
    tags: [tag("Multi-property"), tag("Property management systems")],
    featured: false,
    published_at: "2026-11-18T14:36:00Z",
    cover_image: photo(photos.villaWhite),
    cover_alt: "White house beside a swimming pool in morning light",
    content: `The second property changes things. With one rental, the property is the brand. With several, you have to decide what guests are choosing: a particular house, or you.

## One website or several?

**One website for the portfolio** is usually the better choice. It costs less to run, concentrates your search visibility in one place, and lets a guest whose first choice is booked find your second. It also gives returning guests a reason to try another of your properties.

**Separate websites** can make sense when properties are very different in character and audience: a city apartment and a remote lodge, say, with no realistic overlap in guests. Even then, the running cost is multiplied.

A middle path is one portfolio website where each property has a distinctive page, and perhaps its own memorable domain that points to that page.

## Choose a naming system

Decide whether you are building a brand for the business, for each property, or both. A common and workable pattern is a business name guests can remember, with a distinct name for each home beneath it. Whatever you choose, apply it consistently across your website, listings, signage and email.

## Keep one source of truth

With several properties across several channels, manual updating stops being realistic. A property management system or channel manager lets you hold rates, availability and descriptions once and distribute them. If your website draws from the same system, it stays correct without extra work.

Before choosing a system, check that it can connect to a website in the way you need. Options vary a great deal between providers and plans.

## Make comparison easy

Guests choosing between your properties want to compare quickly. Help them:

- Search by date, number of guests and area
- Show the same key facts for every property, in the same order
- Use one page layout so guests learn it once
- Suggest alternatives when dates are unavailable

## Think about owners too

If you manage properties on behalf of their owners, your website has a second audience. A clear section explaining what you do for owners, with its own enquiry form, lets the same site support both sides of the business.

## Plan for the next property

The test of a multi-property website is how much work the next addition takes. If adding a home means entering its details and uploading photographs, the structure is right. If it means a redesign, it is not.`,
  },
  {
    slug: "how-to-build-trust-on-a-direct-booking-website",
    title: "How to Build Trust on a Direct Booking Website",
    excerpt:
      "A platform lends you its reputation. On your own website, you start without one. The signals guests look for before paying an owner directly.",
    category: cat("direct-bookings"),
    tags: [tag("Guest experience"), tag("Direct bookings"), tag("Reviews")],
    featured: false,
    published_at: "2026-11-18T14:37:00Z",
    cover_image: photo(photos.cotswoldCottage),
    cover_alt: "Stone cottage with a thatched roof and clipped hedges",
    content: `Asking someone to pay for a stay on a website they have never heard of is asking for trust. Guests are right to be careful; rental scams exist. Your job is to make it easy for an honest guest to see that you are an honest host.

## Show who is behind it

Anonymous websites are suspicious. Say who you are. A short "about" section with the name of the owner or business, a real email address, and another way to reach you does more than any badge.

Respond quickly when people get in touch. A prompt, human reply to a first question is itself a strong trust signal.

## Use real reviews, properly

Reviews matter, and so does how you handle them:

- Only publish reviews from guests who actually stayed.
- Ask permission before reproducing a guest's words on your own website.
- Do not edit a review to improve it.
- Never invent one. It is dishonest, and in many places unlawful.

If you are new and have few reviews, say less and show more: detailed photographs and thorough information do the persuading until reviews accumulate.

## Be consistent everywhere

Guests check. They will search your property's name and compare what they find. The same name, photographs and details across your website, your listings, your social profiles and your Google Business Profile reassure them that the property is real and that you are its legitimate host.

## Take payment through a recognised provider

A request for a bank transfer is the classic warning sign of a scam. Card payment through a well-known provider gives guests the protection they are used to. Make sure your site uses a secure connection throughout.

## Put policies in plain sight

Cancellation terms, deposits, house rules and what happens if something goes wrong should be easy to find and written in ordinary language. Guests trust a host who is upfront about the terms more than one who seems to be hiding them.

## Look after the site

Design is not vanity. A site with sharp photographs, working links, and current information signals a host who pays attention. An outdated notice, a broken gallery or a calendar that never changes signals the opposite.

## Be honest about the property

Overselling produces disappointed guests and poor reviews. If the road is steep, the stairs are narrow or the nearest shop is a drive away, say so. Guests who arrive knowing what to expect are the ones who return and recommend you.

Trust on a direct website is built from many small, verifiable things. None is difficult. Together they do the work a platform's logo does elsewhere.`,
  },
  {
    slug: "website-features-every-vacation-rental-business-needs",
    title: "Website Features Every Vacation Rental Business Needs",
    excerpt:
      "A checklist separated into what is essential on day one, what is worth adding next, and what you can safely leave out.",
    category: cat("website-design"),
    tags: [tag("Website features"), tag("Getting started")],
    featured: false,
    published_at: "2026-11-18T14:38:00Z",
    cover_image: photo(photos.poolTerrace),
    cover_alt: "Pool terrace with a table and chairs",
    content: `Feature lists grow easily. This one is sorted by priority, so you can launch with what matters and add the rest when it is justified.

## Essential from day one

**A fast, mobile-friendly design.** Most guests will arrive on a phone. If the site is slow or awkward there, little else matters.

**A proper photo gallery.** Large, well-lit images of every room and the surroundings, quick to browse with a thumb.

**Clear property information.** Sleeping arrangements, bathrooms, amenities, accessibility notes, parking and wifi.

**An availability calendar.** Guests should see free dates without having to ask.

**A way to book or enquire.** Either online booking or a short, reliable enquiry form. Test it regularly; a silent broken form is expensive.

**Transparent pricing.** Nightly rates, fees and taxes, with a total before the guest commits.

**Location information.** The area, travel directions and what is nearby.

**Policies.** Cancellation terms, house rules, a privacy policy and booking terms.

**Contact details.** A real email address and at least one other way to reach you.

**Search basics.** Page titles, descriptions, a sitemap and a secure connection.

## Worth adding next

**Online payment.** Card payment for deposits and balances, through a recognised provider.

**Guest reviews.** Genuine reviews from past guests, published with their permission.

**A local guide.** Places to eat, walks, beaches, things to do when it rains. Useful for guests and for search visibility.

**Email sign-up.** A way for interested visitors and past guests to hear about availability, with clear consent.

**Analytics with consent.** Knowing which pages people visit and where they come from, collected in line with privacy rules.

**Frequently asked questions.** Each answer here is an email you do not have to write.

## Useful for some businesses

**Multi-property search**, if you have several rentals.

**PMS integration**, if you already run one.

**Additional languages**, if a meaningful share of your guests read another language.

**A journal or blog**, if you will actually keep it up.

## What you can leave out

Auto-playing video with sound, pop-ups that appear before the page has loaded, countdown timers and "three people are looking at this" messages. They slow the site and wear down the trust you are trying to build.

A rental website does not need to be large. It needs to be clear, honest and easy to book from.`,
  },
  {
    slug: "do-i-need-a-website-for-my-airbnb",
    title: "Do I Need a Website for My Airbnb?",
    excerpt:
      "Not every host needs one straight away. Here is how to tell whether a website would help your rental, what it can and cannot do, and how to run one without breaking platform rules.",
    category: cat("direct-bookings"),
    tags: [tag("Getting started"), tag("Booking platforms")],
    featured: false,
    published_at: "2026-11-22T09:00:00Z",
    cover_image: photo(photos.blueHouse),
    cover_alt: "Blue and white house under a clear sky",
    content: `The honest answer is: not always, and not on day one. A website is useful when there are people looking for your property who have nowhere of yours to land. If that is not happening yet, a listing may be all you need for now.

This article will help you work out which situation you are in.

## What a listing already does for you

Airbnb and similar platforms bring an audience, handle payments, collect reviews and give guests a familiar way to book. For a new property with no reputation, that is hard to replicate. If you are just starting out, getting the listing right (photos, description, pricing, reviews) is usually the better use of your time.

## Signs a website would help

**People search for your property by name.** Past guests recommend you, a local business mentions you, or someone sees your sign. When they search, a website of your own gives them somewhere to arrive.

**Guests come back.** Repeat guests who already know and trust you are the most likely to look you up directly next time they plan a trip.

**You have more than one property.** A single site can present a whole collection, which no individual listing can.

**You want a presence that does not depend on one company.** Platforms change their fees, their search rankings and their rules. A website is the part of your online presence that stays the same.

**You want to explain things properly.** A website gives you room for a local guide, detailed house information and the story of the place, without a character limit.

## What a website will not do

A website does not bring visitors by itself. Nobody finds a new site by accident. It needs search visibility, which takes months to build, and it works best alongside the people who already know your property.

It will not replace a platform's reach for a new property. And it creates some work: keeping the calendar accurate, answering enquiries, and handling payments and cancellations yourself or through a booking tool.

## Staying within platform rules

Each platform has terms about guest communication and off-platform bookings. Airbnb, for example, does not allow hosts to use its messaging or booking process to steer guests elsewhere. Read the current terms for every platform you use.

In practice, a direct booking website should grow through channels you own: your own name in search results, your social profiles, local partners, signage, and guests who come back on their own. It should not be used to divert a booking that started on a platform. That approach puts your listing at risk and is not worth it.

## A sensible order of steps

1. **Get the listing working well first.** Good photos, a clear description and genuine reviews.
2. **Register your property's name as a domain**, even before you build anything.
3. **Launch a simple site** with photos, information, an availability calendar and a way to enquire or book.
4. **Connect the calendar** to your listings so you never double-book. Our guide to [how booking calendar integration works](/blog/how-booking-calendar-integration-works) explains the options.
5. **Add online payment and search work** once the basics are running.

If you want a rough idea of what direct bookings could be worth to you, the [savings calculator](/savings-calculator) lets you enter your own numbers. It is an illustration, not a forecast.

## The short version

You do not need a website to host successfully. You need one when people are looking for your property and have nowhere of yours to find it, or when you want part of your business to stand on its own. If that describes you, start small and build from there.`,
  },
  {
    slug: "how-much-does-a-vacation-rental-website-cost",
    title: "How Much Does a Vacation Rental Website Cost?",
    excerpt:
      "There is no single price, because the cost depends on what the site has to do. Here are the factors that drive it, the running costs people forget, and the questions to ask before you get a quote.",
    category: cat("website-design"),
    tags: [tag("Getting started"), tag("Website features")],
    featured: false,
    published_at: "2026-11-22T10:00:00Z",
    cover_image: photo(photos.cabinSmoke),
    cover_alt: "Cabin among trees with smoke rising from its chimney",
    content: `"How much does a website cost?" is a bit like "how much does a renovation cost?" The honest answer is that it depends on what you need it to do. A simple information site and a multi-property site with live booking and payments are different projects.

Rather than quote a number that would be wrong for most readers, this article explains what drives the cost, so you can compare quotes properly and decide what you actually need.

## The main cost drivers

**How many properties.** One property needs a handful of pages. A portfolio needs a page for every property, plus search and filtering. This is often the biggest single factor.

**Booking: enquiry or instant book.** An enquiry form, where you confirm by email, is simpler. Live availability with instant booking needs a booking engine and careful testing.

**Calendar and PMS connections.** Showing availability from iCal is straightforward. A full connection to a property management system depends on what that system allows, and some require a paid plan or a specific booking tool. See [how booking calendar integration works](/blog/how-booking-calendar-integration-works) for the differences.

**Payments.** Taking deposits and balances online means setting up a payment provider, handling refunds and testing every step.

**Design.** A design built around your property and brand takes more work than adapting a template. Both can work well.

**Content.** Who writes the text and supplies the photos? If you already have good photography and descriptions, the project is quicker. If not, they need to be planned in.

**Languages.** Each extra language adds pages to write, translate and maintain.

**Moving from an old site.** A redesign needs redirects so existing search results and links keep working.

## Running costs people forget

The build is one cost. These continue afterwards:

- **Domain name**, renewed every year.
- **Hosting**, monthly or yearly.
- **Booking engine or PMS subscription**, if you use one. Some charge per booking, some a flat fee.
- **Payment processing fees** on each card transaction, charged by the payment provider.
- **Email**, if you want an address on your own domain.
- **Maintenance**: updates, backups and checking that forms, calendars and payments still work. A broken booking form that nobody notices is the most expensive problem a rental site can have.

## Platform website builders

Some booking tools and PMS providers include a basic website builder. These can be a sensible starting point: low setup cost and the calendar is already connected. The trade-offs are usually less control over design and search visibility, and a site that is tied to that provider. If you switch tools later, you may have to start the website again.

## Questions to ask before you get a quote

1. How many properties should the site show now, and in a year's time?
2. Do you want instant booking, or an enquiry you approve?
3. Which booking tool or PMS do you use, and does it offer a website connection?
4. Do you need online payment, and in which currencies?
5. Do you have professional photos and written descriptions?
6. Who will update the site after launch?

Answering these before you speak to anyone will get you quotes you can compare like for like.

## Getting a figure for your project

We don't publish fixed prices because the right site for a single cabin and a twelve-property portfolio are very different projects. Every project starts with a consultation and a written quote that lists what is included, what you would pay separately (such as booking software), and the timeline.

If you want to explore what a direct booking channel could be worth before deciding, try the [savings calculator](/savings-calculator) with your own figures. When you are ready, you can [request a custom quote](/contact#project).`,
  },
];

export const seedPosts: Post[] = seeds.map((s) => ({
  ...s,
  seo_title: null,
  seo_description: null,
}));
