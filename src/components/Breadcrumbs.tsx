import Link from "next/link";
import { breadcrumbLd, type Crumb } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <li>
          <Link href="/" className="underline underline-offset-4 decoration-olive hover:decoration-current">Home</Link>
        </li>
        {crumbs.map((c, i) => (
          <li key={c.path} className="flex items-center gap-2">
            <span aria-hidden="true" className="muted">/</span>
            {i === crumbs.length - 1 ? (
              <span aria-current="page" className="muted">{c.name}</span>
            ) : (
              <Link href={c.path} className="underline underline-offset-4 decoration-olive hover:decoration-current">
                {c.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
