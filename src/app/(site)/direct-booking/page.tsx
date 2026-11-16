import Link from "next/link";
import { Cta } from "@/components/Cta";
import { PageHeader } from "@/components/PageHeader";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Direct Booking Guide for Vacation Rental Owners",
  description:
    "What direct bookings are, how independent booking channels work, what they cost, and how a website, calendar, payments, trust and marketing fit together.",
  path: "/direct-booking",
});

const sections = [
  { id: "what", title: "What direct bookings are" },
  { id: "how", title: "How an independent channel works" },
  { id: "why", title: "Why have your own website" },
  { id: "discover", title: "How guests find you independently" },
  { id: "calendars-payments", title: "Calendars and payments" },
  { id: "trust", title: "Trust, reviews and the booking experience" },
  { id: "marketing", title: "The role of SEO and marketing" },
  { id: "origin", title: "Platform bookings and independent bookings" },
  { id: "costs", title: "What direct bookings cost" },
];

export default function DirectBookingPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Direct booking guide", path: "/direct-booking" }]}
        title="A plain guide to direct bookings"
        lede="What they are, how they work, what they cost, and where a website fits. Written for owners who want the facts before the sales pitch."
      />

      <div className="wrap grid gap-12 pb-20 lg:grid-cols-12 lg:pb-28">
        <nav aria-label="On this page" className="lg:col-span-4">
          <div className="rounded-xl bg-sand p-6 lg:sticky lg:top-24">
            <h2 className="font-bold">On this page</h2>
            <ol className="mt-4 grid gap-2.5 text-[1rem]">
              {sections.map((s, i) => (
                <li key={s.id} className="flex gap-3">
                  <span className="w-5 flex-none font-bold text-forest" aria-hidden="true">{i + 1}</span>
                  <a href={`#${s.id}`} className="hover:underline underline-offset-4">{s.title}</a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <article className="prose lg:col-span-7 lg:col-start-6 [&_h2]:scroll-mt-24 [&>h2:first-child]:mt-0">
          <h2 id="what">What direct bookings are</h2>
          <p>
            A direct booking is a reservation a guest makes with you, the owner or manager, rather than through a
            third-party booking platform. The guest finds your business, checks availability, and books and pays
            through a channel you control, usually your own website.
          </p>
          <p>
            The agreement is between you and the guest. You set the terms, hold the booking details, and are
            responsible for the payment, the communication and the stay.
          </p>

          <h2 id="how">How an independent channel works</h2>
          <p>An independent booking channel has four working parts:</p>
          <ul>
            <li><strong>A website</strong> that presents the property and gives guests the confidence to book.</li>
            <li><strong>An availability calendar</strong> that shows which dates are free and stays in step with your other channels.</li>
            <li><strong>A booking flow</strong>, which may be an enquiry form, a request to book, or instant booking.</li>
            <li><strong>A payment method</strong>, normally card payment through a recognised provider.</li>
          </ul>
          <p>
            Behind those sits a fifth part that matters just as much: a way for guests to arrive in the first place.
          </p>

          <h2 id="why">Why a property business may benefit from its own website</h2>
          <ul>
            <li><strong>Ownership.</strong> The domain, the design and the content are yours, and they don't change when a platform changes its rules.</li>
            <li><strong>Brand.</strong> Guests see your name and your property, not a listing in a grid of alternatives.</li>
            <li><strong>Guest relationships.</strong> With consent, you can stay in touch with guests who book with you and invite them back.</li>
            <li><strong>Resilience.</strong> A second source of bookings makes the business less exposed to any single one.</li>
            <li><strong>Different economics.</strong> Independent bookings carry no platform commission, although they do have their own costs, covered below.</li>
          </ul>
          <p>
            None of this is automatic. A website creates the opportunity for direct bookings. It does not guarantee
            them.
          </p>

          <h2 id="discover">How guests can discover a property independently</h2>
          <p>Direct bookings come from people who find you by routes that don't run through a platform:</p>
          <ul>
            <li>Searching for your property or business by name</li>
            <li>Searching for a specific kind of stay in your area and finding your website</li>
            <li>A recommendation from a previous guest, friend or local business</li>
            <li>Your social media accounts</li>
            <li>Returning after an earlier stay</li>
            <li>Email you send to past guests who agreed to hear from you</li>
            <li>Local tourism listings, press and partnerships</li>
            <li>Advertising you pay for</li>
          </ul>

          <h2 id="calendars-payments">How booking calendars and payment integrations work</h2>
          <p>
            <strong>Calendars.</strong> If your property can be booked in more than one place, each calendar has to
            learn about bookings made elsewhere. That happens through iCal feeds, which are widely supported but
            update on a delay, or through a property management system or channel manager, which is faster and
            carries more information. Which is right for you depends on the tools you use and how busy the property
            is. <Link href="/blog/how-booking-calendar-integration-works">Read more about calendar integration</Link>.
          </p>
          <p>
            <strong>Payments.</strong> To take card payments, you open an account with a payment provider in your
            business's name. The provider's secure form is embedded in your booking flow, so card details never touch
            your website. The provider pays out to your bank account and charges a processing fee on each
            transaction. Availability and fees vary by country and provider.
          </p>

          <h2 id="trust">The importance of trust, reviews, photos and a good booking experience</h2>
          <p>
            On a platform, guests rely on the platform's reputation. On your own website, they rely on yours. Guests
            look for:
          </p>
          <ul>
            <li>Clear, honest photographs of the whole property</li>
            <li>Genuine reviews from past guests, published with permission</li>
            <li>A named business with real contact details</li>
            <li>Plainly stated prices, policies and house rules</li>
            <li>Secure payment through a provider they recognise</li>
            <li>A site that works well on a phone and makes booking simple</li>
          </ul>
          <p>
            A confusing booking flow or a surprise fee at the last step loses bookings that good marketing worked
            hard to win.
          </p>

          <h2 id="marketing">The role of SEO and marketing</h2>
          <p>
            A website needs visitors. Search engine optimisation helps people who search for your property, or for a
            stay like yours, find your site. It takes months to build and nobody can promise a ranking. Marketing,
            whether social media, email or advertising, brings your own audience to the site. Both take time, and
            often money. Both should be measured, so you know what each produces.
          </p>

          <h2 id="origin">The difference between platform-originated and independently acquired bookings</h2>
          <p>
            Where a guest first found you matters. A guest who discovers your property on a booking platform is using
            that platform's service, and platforms have terms about keeping those enquiries and bookings on the
            platform. You agreed to those terms when you listed, and you should follow them.
          </p>
          <p>
            An independently acquired booking is different: the guest found you through your own website, your own
            marketing, a recommendation or a return visit. That is the channel a direct-booking website is built to
            serve.
          </p>
          <p>
            We do not help clients move platform enquiries off-platform. We help them build new routes for guests to
            find and book with them independently.
          </p>

          <h2 id="costs">What direct bookings cost</h2>
          <p>Direct bookings are not free. Expect some or all of these:</p>
          <ul>
            <li><strong>Website hosting and domain.</strong> Ongoing, usually modest.</li>
            <li><strong>Booking software or PMS.</strong> Typically a monthly subscription or a per-booking fee.</li>
            <li><strong>Payment processing.</strong> A percentage of each transaction, charged by the payment provider.</li>
            <li><strong>Advertising and marketing.</strong> Whatever you spend bringing guests to the site.</li>
            <li><strong>Maintenance.</strong> Keeping the site secure, current and working.</li>
            <li><strong>Your time.</strong> Answering enquiries and handling issues a platform would otherwise mediate.</li>
          </ul>
          <p>
            Whether an independent channel pays for itself depends on your figures. Our{" "}
            <Link href="/savings-calculator">savings calculator</Link> lets you compare platform fees with these
            costs using your own assumptions.
          </p>
        </article>
      </div>

      <Cta preset="calculator" />
    </>
  );
}
