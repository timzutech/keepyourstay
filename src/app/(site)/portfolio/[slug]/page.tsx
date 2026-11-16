import Link from "next/link";
import { notFound } from "next/navigation";
import { KindLabel } from "@/components/Cards";
import { Cta } from "@/components/Cta";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Photo } from "@/components/Photo";
import { getService } from "@/content/services";
import { getProject, getProjects } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const p = await getProject((await params).slug);
  if (!p) return {};
  return pageMeta({
    title: `${p.name} — ${p.kind === "concept" ? "Concept Project" : "Client Project"}`,
    description: p.summary,
    path: `/portfolio/${p.slug}`,
    image: p.cover_image,
  });
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProject((await params).slug);
  if (!project) notFound();
  const related = project.services.map(getService).filter((s) => s !== undefined);
  const showOutcomes = project.kind === "completed" && project.outcomes_verified && project.outcomes.length > 0;

  return (
    <>
      <div className="wrap pt-8 lg:pt-10">
        <Breadcrumbs crumbs={[{ name: "Our work", path: "/portfolio" }, { name: project.name, path: `/portfolio/${project.slug}` }]} />
        <div className="mt-8 flex flex-wrap items-center gap-2 lg:mt-12">
          <KindLabel kind={project.kind} />
          {project.category && <span className="chip">{project.category.name}</span>}
        </div>
        <h1 className="display mt-5">{project.name}</h1>
        <p className="lede mt-6">{project.summary}</p>
        {project.kind === "completed" && project.website_url && (
          <a href={project.website_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-7">
            Visit the live website<span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </div>

      {project.cover_image && (
        <div className="wrap mt-12">
          <Photo src={project.cover_image} alt={project.cover_alt ?? ""} ratio="21 / 10" sizes="100vw" priority />
        </div>
      )}

      {project.kind === "concept" && (
        <div className="wrap mt-6">
          <p className="max-w-[48em] text-sm muted">
            This is a fictional concept created to illustrate our design approach. The property and business are
            invented, and the photographs are licensed stock images, not a client's property.
          </p>
        </div>
      )}

      <section className="wrap band grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="heading">{project.kind === "concept" ? "The brief we set ourselves" : "Property and business overview"}</h2>
          <p className="reading mt-4 whitespace-pre-line">{project.overview}</p>

          {project.design_approach && (
            <>
              <h2 className="heading mt-12">Design approach</h2>
              <p className="reading mt-4 whitespace-pre-line">{project.design_approach}</p>
            </>
          )}
        </div>

        <aside className="lg:col-span-4 lg:col-start-9">
          {project.objectives.length > 0 && (
            <>
              <h2 className="subheading font-bold">Project objectives</h2>
              <ul className="mt-4 rule-t">
                {project.objectives.map((o) => (
                  <li key={o} className="rule-b reading-sm py-3">{o}</li>
                ))}
              </ul>
            </>
          )}
          {project.technologies.length > 0 && (
            <>
              <h2 className="subheading mt-10 font-bold">Technologies and integrations</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <li key={t} className="chip">{t}</li>
                ))}
              </ul>
            </>
          )}
        </aside>
      </section>

      {project.features.length > 0 && (
        <section className="bg-sand">
          <div className="wrap band grid gap-10 lg:grid-cols-12">
            <h2 className="title lg:col-span-4">Features {project.kind === "concept" ? "designed" : "implemented"}</h2>
            <ul className="rule-t lg:col-span-7 lg:col-start-6">
              {project.features.map((f) => (
                <li key={f} className="rule-b py-4 text-xl font-semibold tracking-tight">{f}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {project.images.length > 0 && (
        <section className="wrap band" aria-label="Project gallery">
          <h2 className="title">Gallery</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {project.images.map((img, i) => (
              <div key={img.url + i} className={project.images.length % 2 === 1 && i === 0 ? "md:col-span-2" : ""}>
                <Photo
                  src={img.url}
                  alt={img.alt}
                  ratio={project.images.length % 2 === 1 && i === 0 ? "21 / 10" : "4 / 3"}
                  sizes={project.images.length % 2 === 1 && i === 0 ? "100vw" : "(min-width: 48rem) 50vw, 100vw"}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {showOutcomes && (
        <section className="bg-paper">
          <div className="wrap band grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="title">Verified results</h2>
              <p className="mt-4 text-sm muted">Reported by the client and published with their permission.</p>
            </div>
            <ul className="rule-t lg:col-span-7 lg:col-start-6">
              {project.outcomes.map((o) => (
                <li key={o} className="rule-b reading py-4">{o}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="wrap band-tight">
          <h2 className="heading">Related services</h2>
          <ul className="mt-6 grid gap-x-8 md:grid-cols-3">
            {related.map((s) => (
              <li key={s.slug} className="rule-t py-5">
                <Link href={`/services/${s.slug}`} className="text-xl font-bold tracking-tight hover:underline decoration-2 underline-offset-4">
                  {s.name}
                </Link>
                <p className="reading-sm mt-2 muted">{s.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Cta preset="discuss" title="Discuss a similar project for your property." />
    </>
  );
}
