import Link from "next/link";
import { notFound } from "next/navigation";
import { Cta } from "@/components/Cta";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { articlesForService } from "@/content/related";
import { getService, services } from "@/content/services";
import { getPosts } from "@/lib/data";
import { pageMeta, serviceLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => services.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: Props) {
  const s = getService((await params).slug);
  if (!s) return {};
  return pageMeta({ title: s.seoTitle, description: s.seoDescription, path: `/services/${s.slug}` });
}

export default async function ServicePage({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) notFound();
  const path = `/services/${service.slug}`;
  const others = services.filter((s) => s.slug !== service.slug).slice(0, 4);
  const wanted = articlesForService(service.slug);
  const reading = (await getPosts()).filter((p) => wanted.includes(p.slug)).slice(0, 3);

  return (
    <>
      <JsonLd data={serviceLd({ name: service.name, description: service.seoDescription, path })} />
      <PageHeader
        crumbs={[{ name: "Services", path: "/services" }, { name: service.short, path }]}
        title={service.name}
        lede={service.summary}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/contact#project" className="btn btn-primary">Request a Custom Quote</Link>
          <Link href="/contact#consultation" className="btn btn-outline">Book a Website Consultation</Link>
        </div>
      </PageHeader>

      <section className="bg-sand">
        <div className="wrap band grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 className="heading">What it involves</h2>
            <p className="reading mt-4">{service.involves}</p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <h2 className="heading">The problem it addresses</h2>
            <p className="reading mt-4">{service.problem}</p>
          </div>
        </div>
      </section>

      <section className="wrap band grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="heading">Who needs it</h2>
          <ul className="mt-5 rule-t">
            {service.whoNeedsIt.map((w) => (
              <li key={w} className="rule-b reading-sm py-3.5 text-[1.05rem]">{w}</li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <h2 className="heading">What you receive</h2>
          <ul className="mt-5 rule-t">
            {service.youReceive.map((w) => (
              <li key={w} className="rule-b flex gap-3 py-3.5">
                <svg width="20" height="20" viewBox="0 0 20 20" className="mt-1 flex-none text-forest" aria-hidden="true">
                  <path d="M3 10.5 8 15.500 17 5" fill="none" stroke="currentColor" strokeWidth="2.4" />
                </svg>
                <span className="reading-sm text-[1.05rem]">{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-paper">
        <div className="wrap band">
          <h2 className="title">How the project works</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {service.howItWorks.map((step, i) => (
              <li key={step.title} className="rule-t pt-4">
                <span className="text-[2.6rem] font-bold leading-none text-forest [font-stretch:80%]" aria-hidden="true">{i + 1}</span>
                <h3 className="subheading mt-3 font-bold">{step.title}</h3>
                <p className="reading-sm mt-2">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap band grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 className="heading">What we need to get started</h2>
          <ul className="mt-5 rule-t">
            {service.toGetStarted.map((w) => (
              <li key={w} className="rule-b reading-sm py-3.5 text-[1.05rem]">{w}</li>
            ))}
          </ul>
          <p className="mt-5 text-sm muted">
            Don't have everything yet? Get in touch anyway. We can help you work out what's needed.
          </p>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <h2 className="heading">Related services</h2>
          <ul className="mt-5 grid gap-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/services/${o.slug}`} className="link">{o.name}</Link>
              </li>
            ))}
            <li><Link href="/services" className="link">All services</Link></li>
          </ul>
          {reading.length > 0 && (
            <>
              <h2 className="heading mt-12">Further reading</h2>
              <ul className="mt-5 grid gap-3">
                {reading.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/blog/${p.slug}`} className="link">{p.title}</Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      <Cta preset="discuss" title={`Ask us about ${service.short.toLowerCase()} for your property.`} />
    </>
  );
}
