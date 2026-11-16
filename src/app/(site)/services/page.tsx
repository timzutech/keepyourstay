import Link from "next/link";
import { Cta } from "@/components/Cta";
import { PageHeader } from "@/components/PageHeader";
import { services } from "@/content/services";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Vacation Rental Website Services",
  description:
    "Website design, direct booking development, calendar and payment integration, PMS connections, SEO, maintenance and marketing for short-term rental businesses.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Services", path: "/services" }]}
        title="Services for short-term rental businesses"
        lede="Ten services that cover a rental website from first design to ongoing care. Take the full build or the single piece you're missing. Each is scoped and quoted for your property."
      />
      <section className="wrap pb-20 lg:pb-28">
        <ul className="grid gap-x-10 md:grid-cols-2">
          {services.map((s) => (
            <li key={s.slug} className="rule-t group relative py-7">
              <h2 className="heading">
                <Link href={`/services/${s.slug}`} className="after:absolute after:inset-0 group-hover:underline decoration-2 underline-offset-4">
                  {s.name}
                </Link>
              </h2>
              <p className="reading mt-3">{s.summary}</p>
              <p className="mt-4 text-sm font-bold" aria-hidden="true">View service</p>
            </li>
          ))}
        </ul>
        <p className="reading mt-10 rule-t pt-6 muted">
          Integrations depend on the systems you already use and the connections they support. We check compatibility
          before quoting and tell you what is and isn't possible.
        </p>
      </section>
      <Cta preset="quote" />
    </>
  );
}
