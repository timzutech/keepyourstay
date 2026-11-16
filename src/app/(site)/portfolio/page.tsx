import { Cta } from "@/components/Cta";
import { PageHeader } from "@/components/PageHeader";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { getPortfolioCategories, getProjects } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Portfolio — Vacation Rental Website Design",
  description:
    "Vacation rental website work from KeepYourStay: villas, beach houses, holiday apartments, cabins and multi-property businesses. Concept designs are clearly labelled.",
  path: "/portfolio",
});

export default async function PortfolioPage() {
  const [projects, categories] = await Promise.all([getProjects(), getPortfolioCategories()]);
  const hasConcepts = projects.some((p) => p.kind === "concept");
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Our work", path: "/portfolio" }]}
        title="Websites for places people want to stay"
        lede="Different properties need different websites. Here is how we approach villas, beach houses, apartments, cabins and multi-property businesses."
      />
      <section className="wrap pb-20 lg:pb-28">
        {hasConcepts && (
          <p className="mb-10 max-w-[46em] rounded-lg border-2 border-ink bg-paper p-5 text-[1rem] leading-relaxed">
            <strong>About concept projects.</strong> Work labelled “Concept Project — Illustrative Design” is fictional.
            The properties and businesses are invented to demonstrate our design approach, and the photographs are
            licensed stock images. They are not client work.
          </p>
        )}
        {projects.length ? (
          <PortfolioGrid projects={projects} categories={categories} />
        ) : (
          <p className="reading">Projects will appear here soon. In the meantime, get in touch to see examples of our work.</p>
        )}
      </section>
      <Cta preset="discuss" title="Want something like this for your property?" />
    </>
  );
}
