import Link from "next/link";
import { Cta } from "@/components/Cta";
import { PageHeader } from "@/components/PageHeader";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Pricing and Project Quotes",
  description:
    "KeepYourStay quotes every vacation rental website individually, in USD or GBP. See what affects the cost of a project and request a custom quote.",
  path: "/pricing",
});

const factors = [
  ["Number of properties", "A single villa needs one set of pages. A portfolio needs search, filters and a page for every home."],
  ["Design complexity", "How bespoke the design is, how many page types it has, and whether brand work is needed first."],
  ["Booking functionality", "An enquiry form, a request-to-book flow and instant online booking are very different builds."],
  ["Calendar requirements", "How many calendars need to stay in step, and whether they connect through iCal, a booking tool or a PMS."],
  ["Payment integration", "Whether you take payment online, which provider you use, and how deposits and balances are handled."],
  ["PMS integrations", "What your property management system allows, and how much of your listing data the website draws from it."],
  ["Content and SEO", "Whether you supply text and photographs, or need copywriting, location pages and search setup."],
  ["Marketing", "Whether you want help bringing visitors to the site through social media, email or advertising."],
  ["Ongoing maintenance", "Whether we look after updates, backups, checks and content changes after launch."],
];

const quoteSteps = [
  { title: "Tell us about the project", text: "Use the project enquiry form, or book a consultation if you'd rather talk first." },
  { title: "We check what's involved", text: "Including what your booking tools, PMS and payment provider support." },
  { title: "You receive a written quotation", text: "A fixed scope and price in US dollars or pounds sterling, with a timeline." },
  { title: "You decide", text: "There's no obligation, and no charge for the quotation." },
];

export default function PricingPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Pricing", path: "/pricing" }]}
        title="Quoted for your property, not picked from a price list"
        lede="We don't publish package prices, because no two rental businesses need the same website. You get a custom quotation based on what your project involves, in USD or GBP."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/contact#project" className="btn btn-primary">Request a Custom Quote</Link>
          <Link href="/contact#consultation" className="btn btn-outline">Book a Website Consultation</Link>
        </div>
      </PageHeader>

      <section className="bg-sand">
        <div className="wrap band grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="title">What your quote depends on</h2>
            <p className="reading mt-5">Nine things shape the size of a project. Knowing them helps you understand any quotation you receive, from us or anyone else.</p>
          </div>
          <dl className="rule-t lg:col-span-7 lg:col-start-6">
            {factors.map(([term, desc]) => (
              <div key={term} className="rule-b grid gap-1 py-4 sm:grid-cols-5 sm:gap-6">
                <dt className="text-lg font-bold tracking-tight sm:col-span-2">{term}</dt>
                <dd className="reading-sm sm:col-span-3">{desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="wrap band">
        <h2 className="title">How quoting works</h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {quoteSteps.map((s, i) => (
            <li key={s.title} className="rule-t pt-4">
              <span className="text-[2.6rem] font-bold leading-none text-forest [font-stretch:80%]" aria-hidden="true">{i + 1}</span>
              <h3 className="subheading mt-3 font-bold">{s.title}</h3>
              <p className="reading-sm mt-2">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-paper">
        <div className="wrap band grid gap-10 lg:grid-cols-12">
          <h2 className="title lg:col-span-5">Costs to plan for beyond the build</h2>
          <div className="reading grid gap-4 lg:col-span-6 lg:col-start-7">
            <p>
              A website has running costs that are separate from our fee and usually paid directly to the provider:
              your domain name, hosting, any booking software or PMS subscription, and payment processing fees on
              each transaction.
            </p>
            <p>
              We list the ones that apply to your project in the quotation, so you can see the full picture before
              you commit. To estimate how those costs compare with platform fees, use the{" "}
              <Link href="/savings-calculator" className="link">savings calculator</Link>.
            </p>
          </div>
        </div>
      </section>

      <Cta preset="quote" />
    </>
  );
}
