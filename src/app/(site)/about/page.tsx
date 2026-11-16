import Link from "next/link";
import { Cta } from "@/components/Cta";
import { PageHeader } from "@/components/PageHeader";
import { Photo } from "@/components/Photo";
import { pageMeta } from "@/lib/seo";
import { photo, photos } from "@/lib/site";

export const metadata = pageMeta({
  title: "About KeepYourStay",
  description:
    "KeepYourStay builds websites and direct-booking solutions for short-term rental businesses. What we do, why we exist and how we work.",
  path: "/about",
});

const principles = [
  {
    title: "Transparency",
    text: "You get a written scope and quotation before work starts, plain answers about what your systems can and can't do, and no promises about bookings or revenue that nobody could keep.",
  },
  {
    title: "Usability",
    text: "A rental website succeeds when a guest on a phone can see the property, check dates, understand the price and book without friction. Every design decision is tested against that.",
  },
  {
    title: "Measurable goals",
    text: "We agree what the website is for before we design it: more enquiries from people searching your name, a working booking flow for repeat guests, a portfolio guests can search. Then we set up the tools to see whether it's happening.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "About", path: "/about" }]}
        title="We help rental businesses own their place online."
        lede="KeepYourStay is a vacation rental website design and direct-booking solutions provider. We work with hosts, owners and property managers who want an online presence that belongs to them."
      />

      <section className="wrap grid gap-10 pb-20 lg:grid-cols-12 lg:pb-28">
        <div className="lg:col-span-7">
          <Photo
            src={photo(photos.villaPool, 1500)}
            alt="Villa terrace beside a private swimming pool"
            ratio="16 / 10"
            sizes="(min-width: 64rem) 58vw, 100vw"
            priority
          />
        </div>
        <div className="lg:col-span-5 lg:self-end">
          <h2 className="heading">What we do</h2>
          <p className="reading mt-4">
            We design and build websites for short-term rentals: single villas and cabins, small collections of
            apartments, and portfolios run by property managers. Alongside the design, we connect booking calendars,
            payment providers and property management systems, set up search visibility, and maintain the site after
            launch.
          </p>
        </div>
      </section>

      <section className="bg-sand">
        <div className="wrap band grid gap-10 lg:grid-cols-12">
          <h2 className="title lg:col-span-5">Why KeepYourStay exists</h2>
          <div className="reading grid gap-4 lg:col-span-6 lg:col-start-7">
            <p>
              Most short-term rental businesses are built on booking platforms, and for good reason. Platforms bring
              guests. But a business with a single source of bookings has a single point of failure, and very little
              that it can call its own.
            </p>
            <p>
              Owners tell us the same things. The fees keep them awake. They can't present the property the way they
              would like. Guests remember the platform's name rather than theirs. Running several properties means
              running several listings. And the technical side of fixing any of it, from calendars to payments to
              search, looks like a second job.
            </p>
            <p>
              KeepYourStay exists to take that technical work off your hands and give your business a channel you
              control: your own website, with your own brand, where independently sourced guests can book with you.
            </p>
          </div>
        </div>
      </section>

      <section className="wrap band grid gap-10 lg:grid-cols-12">
        <h2 className="title lg:col-span-5">Our approach to direct booking</h2>
        <div className="reading grid gap-4 lg:col-span-6 lg:col-start-7">
          <p>
            We treat a website as one part of a direct-booking strategy, not the whole of it. A good site makes
            booking with you easy and trustworthy. Whether guests arrive at it depends on marketing, reputation,
            pricing and availability as well.
          </p>
          <p>
            We also work with the platforms, not around them. Most of our clients keep their listings. Enquiries that
            begin on a platform stay there, under its terms. The website serves a different group: the guests who
            come looking for you directly.
          </p>
          <p>
            <Link href="/direct-booking" className="link">Read our direct booking guide</Link>
          </p>
        </div>
      </section>

      <section className="bg-paper">
        <div className="wrap band">
          <h2 className="title">What we commit to</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {principles.map((p) => (
              <div key={p.title} className="rule-t pt-5">
                <h3 className="heading">{p.title}</h3>
                <p className="reading mt-3">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap band grid gap-10 lg:grid-cols-12">
        <h2 className="title lg:col-span-5">Who we work with</h2>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="reading">
            Airbnb hosts, vacation rental and holiday-home owners, luxury villa operators, apartment rental
            businesses, boutique accommodation, beach houses, cabins and cottages, and property managers with one
            property or many. We work worldwide, with most of our clients in the United States, United Kingdom, Canada
            and Australia.
          </p>
          <Link href="/contact" className="btn btn-outline mt-8">Get in touch</Link>
        </div>
      </section>

      <Cta preset="quote" />
    </>
  );
}
