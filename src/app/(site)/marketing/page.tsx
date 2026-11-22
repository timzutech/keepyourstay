import Link from "next/link";
import { ProjectCard } from "@/components/Cards";
import { Cta } from "@/components/Cta";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { channels, ninetyDays, weMeasure } from "@/content/marketing";
import { getProjects } from "@/lib/data";
import { pageMeta, serviceLd } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Vacation Rental Marketing: Getting Guests to Your Website",
  description:
    "How we bring guests to your direct booking website: Google Business Profile, SEO, returning guests, social media, paid ads and local partners, with monthly reporting.",
  path: "/marketing",
});

export default async function MarketingPage() {
  const results = (await getProjects()).filter(
    (p) => p.kind === "completed" && p.outcomes_verified && p.outcomes.length > 0,
  );

  return (
    <>
      <JsonLd
        data={serviceLd({
          name: "Direct booking marketing for vacation rentals",
          description: "Marketing that brings guests to a vacation rental's own booking website.",
          path: "/marketing",
        })}
      />
      <PageHeader
        crumbs={[{ name: "Marketing", path: "/marketing" }]}
        title="A website is step one. Getting guests to it is step two."
        lede="A new website doesn't bring guests on its own. We build the website and the marketing around it, so travellers can find you, trust you and book with you directly."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/contact#project" className="btn btn-primary">Plan my marketing</Link>
          <Link href="/savings-calculator" className="btn btn-outline">See what direct bookings could save</Link>
        </div>
      </PageHeader>

      <section className="bg-sand">
        <div className="wrap band">
          <h2 className="title max-w-[20ch]">Six ways guests find your website</h2>
          <p className="reading mt-4 max-w-[40em]">
            We pick the channels that suit your property, location and budget. Most owners start with the first three,
            because they cost little and keep working.
          </p>
          <ol className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {channels.map((c, i) => (
              <li key={c.title} className="rule-t pt-5">
                <span className="text-[2.4rem] font-bold leading-none text-forest [font-stretch:80%]" aria-hidden="true">{i + 1}</span>
                <h3 className="heading mt-3">{c.title}</h3>
                <p className="reading-sm mt-2 font-semibold">{c.short}</p>
                <p className="reading-sm mt-2">{c.text}</p>
                <p className="mt-3 text-sm muted">Typical time to see results: {c.timeToWork}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap band">
        <h2 className="title max-w-[18ch]">Your first 90 days</h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {ninetyDays.map((s) => (
            <li key={s.title} className="rule-t pt-4">
              <h3 className="subheading font-bold">{s.title}</h3>
              <p className="reading-sm mt-2">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {results.length > 0 && (
        <section className="bg-paper">
          <div className="wrap band">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="title">Results for our clients</h2>
              <Link href="/portfolio" className="link">See all our work</Link>
            </div>
            <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2">
              {results.map((p) => (
                <div key={p.slug}>
                  <ProjectCard project={p} />
                  <ul className="mt-4 rule-t">
                    {p.outcomes.slice(0, 3).map((o) => (
                      <li key={o} className="rule-b reading-sm py-2.5 font-semibold">{o}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-10 max-w-[44em] text-sm muted">
              Results are shared with each client's permission and checked against their booking records. Every
              property is different, so these are examples, not a guarantee of what you will get.
            </p>
          </div>
        </section>
      )}

      <section className="on-dark bg-forest text-cream">
        <div className="wrap band grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 className="title">What we measure</h2>
            <p className="reading mt-4 text-cream/90">
              You'll know where your direct bookings come from and what each channel costs, so you can put your time
              and money where it works.
            </p>
          </div>
          <ul className="rule-t lg:col-span-5 lg:col-start-8">
            {weMeasure.map((m) => (
              <li key={m} className="rule-b reading py-3.5">{m}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="wrap band grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="title">Honest expectations</h2>
        </div>
        <div className="reading grid gap-4 lg:col-span-6 lg:col-start-7">
          <p>
            Direct bookings build up. Google search takes months, social media takes consistency, and ads cost money
            for as long as they run. Results depend on your location, season, reviews and nightly rate.
          </p>
          <p>
            Your listings on Airbnb, Vrbo and Booking.com keep working alongside your website. We grow new routes for
            guests who find you on their own, and we never ask guests who booked through a platform to move off it.
          </p>
          <p>
            <Link href="/services/booking-marketing" className="link">See the marketing service in detail</Link>
          </p>
        </div>
      </section>

      <Cta
        preset="discuss"
        title="Want guests to find your website? Let's plan it together."
        text="Tell us about your property and where your guests come from today. We'll suggest the channels worth your time and budget."
      />
    </>
  );
}
