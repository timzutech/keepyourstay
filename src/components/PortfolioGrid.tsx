"use client";

import { useState } from "react";
import type { PortfolioCategory, Project } from "@/lib/types";
import { ProjectCard } from "./Cards";

export function PortfolioGrid({ projects, categories }: { projects: Project[]; categories: PortfolioCategory[] }) {
  const [active, setActive] = useState<string>("all");
  const shown = active === "all" ? projects : projects.filter((p) => p.category?.slug === active);
  const filters = [{ slug: "all", name: "All work" }, ...categories];

  return (
    <div>
      <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
        {filters.map((c) => (
          <button
            key={c.slug}
            type="button"
            aria-pressed={active === c.slug}
            onClick={() => setActive(c.slug)}
            className={`btn btn-sm ${active === c.slug ? "btn-primary" : "btn-outline"}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm muted" role="status">
        Showing {shown.length} {shown.length === 1 ? "project" : "projects"}
        {active !== "all" && ` in ${filters.find((f) => f.slug === active)?.name}`}
      </p>

      {shown.length ? (
        <div className="mt-8 grid gap-x-8 gap-y-14 md:grid-cols-2">
          {shown.map((p, i) => (
            <div key={p.slug} className={active === "all" && i % 3 === 0 ? "md:col-span-2" : ""}>
              <ProjectCard
                project={p}
                ratio={active === "all" && i % 3 === 0 ? "21 / 10" : "4 / 3"}
                sizes={active === "all" && i % 3 === 0 ? "100vw" : "(min-width: 48rem) 50vw, 100vw"}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-lg border-2 border-dashed border-ink/40 p-8">
          <p className="subheading font-bold">No projects in this category yet.</p>
          <p className="reading-sm mt-2 muted">Choose another category, or see all work.</p>
          <button type="button" className="btn btn-outline btn-sm mt-4" onClick={() => setActive("all")}>
            Show all work
          </button>
        </div>
      )}
    </div>
  );
}
