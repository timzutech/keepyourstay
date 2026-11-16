import Link from "next/link";
import { ProjectCard } from "@/components/Cards";
import { Cta } from "@/components/Cta";
import { FaqList } from "@/components/FaqList";
import { HeroBrowser } from "@/components/HeroBrowser";
import { Photo } from "@/components/Photo";
import { homeFaqs } from "@/content/faqs";
import { services } from "@/content/services";
import { getProjects, getSettings, getTestimonials } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { photo, photos } from "@/lib/site";

export async function generateMetadata() {
  const s = await getSettings();
  return {
    ...pageMeta({
      title: "KeepYourStay — Vacation rental websites and direct-booking solutions",
      description: s.seo_description,
      path: "/",
    }),
    title: { absolute: "KeepYourStay — Vacation rental websites and direct-booking solutions" },
  };
}

const owned = [
  {
    title: "Your property.",
    text: "Presented the way you would show a guest around: your photographs, your story, your standards. Not one tile in a grid of lookalikes.",
  },
  {
    title: "Your website.",
    text: "A domain in your name and a design that belongs to your brand, connected to the calendar and payment tools you already use where they support it.",
  },
  {
    title: "Your bookings.",
    text: "A way for guests who find you independently to book with you, and to come back to you next time.",
  },
];

const steps = [
  { title: "Consultation", text: "We learn how your business takes bookings today and what you want a website to change." },
  { title: "Scope and quotation", text: "You receive a written scope and a custom quote. Nothing starts until you approve both." },
  { title: "Design", text: "We design the key pages around your property and agree the direction with you." },
  { title: "Build and connect", text: "We build the site and connect calendars, payments and other systems, then test every step." },
  { title: "Launch and support", text: "We launch on your domain, hand over what you need to run it, and stay available afterwards." },
];

const reasons = [
  {
    title: "We only work with short-term rentals",
    text: "Calendars, changeover days, cleaning fees, house rules, platform terms. We know the details that general web designers have to learn on your time.",
  },
  {
    title: "We tell you what a website can't do",
    text: "A website is one part of a direct-booking strategy. We won't promise bookings or savings, and we'll say so if the numbers don't support the project.",
  },
  {
    title: "We build around your systems",
    text: "Before quoting, we check what your booking tools, PMS and payment provider actually support, so you know what will connect and what won't.",
  },
  {
    title: "You own what we build",
    text: "Your domain, your content and your provider accounts stay in your name. If we part ways, your website stays with you.",
  },
];

export default async function HomePage() {
  const [projects, testimonials] = await Promise.all([getProjects(), getTestimonials()]);
  const featured = (projects.filter((p) => p.featured).length ? projects.filter((p) => p.featured) : projects).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="wrap grid gap-12 pb-20 pt-10 lg:grid-cols-12 lg:gap-10 lg:pb-28 lg:pt-16">
        <div className="lg:col-span-6 lg:pt-6">
          <h1 className="display">Your property deserves a booking channel of its own.</h1>
          <p className="lede mt-7">
            KeepYourStay designs and builds websites for vacation rentals, with booking calendars, payments and search
            visibility built in. So guests who find you independently have somewhere to book that belongs to you.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/savings-calculator" className="btn btn-primary">Calculate My Potential Savings</Link>
            <Link href="/portfolio" className="btn btn-outline">Explore Our Work</Link>
          </div>
          <p className="mt-6 max-w-[34em] text-sm muted">
            For Airbnb hosts, villa and holiday-home owners, cabin and cottage operators, and property managers in the
            US, UK, Canada, Australia and worldwide.
          </p>
        </div>
        <div className="lg:col-span-6 lg:pl-4">
          <HeroBrowser />
        </div>
      </section>

      {/* Value proposition */}
      <section className="bg-sand">
        <div className="wrap band">
          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {owned.map((o) => (
              <div key={o.title} className="rule-t pt-5">
                <h2 className="title">{o.title}</h2>
                <p className="reading mt-4">{o.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="wrap band grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Photo
            src={photo(photos.beachHouse, 1200)}
            alt="Timber beach house beside a quiet coastal road"
            ratio="4 / 5"
            sizes="(min-width: 64rem) 40vw, 100vw"
          />
        </div>
        <div className="lg:col-span-6 lg:col-start-7 lg:self-center">
          <h2 className="title">When every booking comes through someone else's platform, so do the rules.</h2>
          <div className="reading mt-6 grid gap-4">
            <p>
              Booking platforms are excellent at bringing guests. They also set the fees, decide how your listing
              looks and where it ranks, and stand between you and the people who stay with you.
            </p>
            <p>
              None of that is a reason to leave them. It is a reason not to rely on them for everything. A change to
              a fee, a policy or a search algorithm shouldn't be able to reshape your whole business overnight.
            </p>
          </div>
          <ul className="mt-8 grid gap-3 text-[1.05rem] font-semibold">
            {[
              "A fee on every booking, at a rate you don't set",
              "Limited control over how your property is presented",
              "Little direct relationship with your guests",
              "No recognisable brand outside the platform",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-[0.6em] h-2 w-2 flex-none bg-olive" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Opportunity */}
      <section className="on-dark bg-forest text-cream">
        <div className="wrap band grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="title">An independent channel, built alongside the platforms you already use.</h2>
            <div className="reading mt-6 grid gap-4 text-cream/90">
              <p>
                Some guests already look for you directly: people who stayed before, friends they told, travellers who
                saw your name and searched for it. Today, most of them end up back on a platform because there's
                nowhere else to go.
              </p>
              <p>
                Your own website gives those guests a place to land, a reason to trust you, and a way to book. Over
                time, with good marketing and a good reputation, that channel can carry more of your business.
              </p>
            </div>
            <p className="mt-6 max-w-[40em] text-sm text-cream/75">
              Bookings and enquiries that start on a platform should stay there, in line with its terms. We help you
              build new routes for guests who find you on their own.
            </p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <Link href="/direct-booking" className="btn btn-primary w-full">Read the direct booking guide</Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="wrap band">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 className="title lg:col-span-7">Everything a rental website needs, from one team.</h2>
          <p className="reading lg:col-span-4 lg:col-start-9">
            Take the whole build, or only the part you're missing. Each service is scoped and quoted for your property.
          </p>
        </div>
        <ul className="mt-12 rule-t">
          {services.map((s) => (
            <li key={s.slug} className="rule-b">
              <Link href={`/services/${s.slug}`} className="group grid gap-2 py-5 md:grid-cols-12 md:items-baseline md:gap-6">
                <h3 className="heading group-hover:underline decoration-2 underline-offset-4 md:col-span-5">{s.name}</h3>
                <p className="reading-sm md:col-span-6">{s.summary}</p>
                <span className="hidden text-right text-sm font-bold md:col-span-1 md:block" aria-hidden="true">View</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Featured work */}
      {featured.length > 0 && (
        <section className="bg-paper">
          <div className="wrap band">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="title">Selected work</h2>
              <Link href="/portfolio" className="link">See the full portfolio</Link>
            </div>
            <div className="mt-12 grid gap-x-8 gap-y-14 lg:grid-cols-12">
              {featured.map((p, i) => (
                <div key={p.slug} className={i === 0 ? "lg:col-span-12" : "lg:col-span-6"}>
                  <ProjectCard project={p} ratio={i === 0 ? "21 / 10" : "4 / 3"} sizes={i === 0 ? "100vw" : "(min-width: 64rem) 50vw, 100vw"} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      <section className="wrap band">
        <h2 className="title max-w-[16ch]">How a project works</h2>
        <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {steps.map((s, i) => (
            <li key={s.title} className="rule-t pt-4">
              <span className="text-[2.6rem] font-bold leading-none text-forest [font-stretch:80%]" aria-hidden="true">{i + 1}</span>
              <h3 className="subheading mt-3 font-bold">{s.title}</h3>
              <p className="reading-sm mt-2">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Savings explanation */}
      <section className="bg-sand">
        <div className="wrap band grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 className="title">Direct isn't free. It can still be worth it.</h2>
            <div className="reading mt-6 grid gap-4">
              <p>
                A direct booking carries no platform commission, but it does carry other costs: card processing,
                booking software, hosting, maintenance, and whatever you spend bringing guests to your site.
              </p>
              <p>
                Whether the difference works in your favour depends on your own figures, and on how many bookings you
                can realistically attract independently. Our calculator lets you test that with your own assumptions
                before you spend anything.
              </p>
            </div>
            <Link href="/savings-calculator" className="btn btn-primary mt-8">Calculate My Potential Savings</Link>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="rounded-xl border-2 border-ink bg-paper p-6 sm:p-8">
              <p className="font-bold">The calculation, in plain terms</p>
              <dl className="mt-4 text-[1rem]">
                {[
                  ["Platform fees on bookings you could win independently", "+"],
                  ["Payment processing on those bookings", "−"],
                  ["Booking software and website costs", "−"],
                  ["Marketing costs", "−"],
                ].map(([label, sign]) => (
                  <div key={label} className="rule-t flex items-baseline gap-4 py-3">
                    <dd className="w-5 flex-none text-xl font-bold text-forest">{sign}</dd>
                    <dt>{label}</dt>
                  </div>
                ))}
                <div className="rule-t rule-b flex items-baseline gap-4 py-3 font-bold">
                  <dd className="w-5 flex-none text-xl text-forest">=</dd>
                  <dt>Estimated net difference</dt>
                </div>
              </dl>
              <p className="mt-4 text-sm muted">An illustrative estimate from your own inputs. Not a forecast or a guarantee.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why KeepYourStay */}
      <section className="wrap band">
        <h2 className="title max-w-[18ch]">Why owners choose KeepYourStay</h2>
        <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {reasons.map((r) => (
            <div key={r.title} className="rule-t pt-5">
              <h3 className="heading">{r.title}</h3>
              <p className="reading mt-3">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials — rendered only when verified testimonials are published */}
      {testimonials.length > 0 && (
        <section className="bg-paper">
          <div className="wrap band">
            <h2 className="title">What clients say</h2>
            <div className="mt-12 grid gap-10 md:grid-cols-2">
              {testimonials.map((t) => (
                <figure key={t.id} className="rule-t pt-5">
                  <blockquote className="font-serif text-[1.35rem] leading-snug">“{t.quote}”</blockquote>
                  <figcaption className="mt-4 text-sm">
                    <span className="font-bold">{t.author_name}</span>
                    {(t.author_role || t.business_name) && (
                      <span className="muted">, {[t.author_role, t.business_name].filter(Boolean).join(", ")}</span>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="wrap band grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="title">Common questions</h2>
          <p className="reading mt-5">The questions owners ask us most before starting.</p>
          <Link href="/faq" className="link mt-5 inline-block">Read all questions</Link>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <FaqList items={homeFaqs} />
        </div>
      </section>

      <Cta preset="calculator" title="Find out what a channel of your own could be worth." />
    </>
  );
}
