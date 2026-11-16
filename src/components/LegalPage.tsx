import type { ReactNode } from "react";
import type { Crumb } from "@/lib/seo";
import { PageHeader } from "./PageHeader";

/** Wrapper for the legal templates. The review notice shows until NEXT_PUBLIC_LEGAL_REVIEWED=true. */
export function LegalPage({ crumb, title, updated, children }: { crumb: Crumb; title: string; updated: string; children: ReactNode }) {
  const reviewed = process.env.NEXT_PUBLIC_LEGAL_REVIEWED === "true";
  return (
    <>
      <PageHeader crumbs={[crumb]} title={title}>
        <p className="mt-5 text-sm muted">Last updated: {updated}</p>
      </PageHeader>
      <div className="wrap pb-20 lg:pb-28">
        {!reviewed && (
          <p role="note" className="mb-10 max-w-[46em] rounded-lg border-2 border-alert bg-paper p-5 text-[1rem] leading-relaxed">
            <strong>Template pending legal review.</strong> This page is a starting template. It has not been reviewed
            by a lawyer and is not a statement of legal compliance. Items in [square brackets] must be completed
            before publication.
          </p>
        )}
        <div className="prose">{children}</div>
      </div>
    </>
  );
}
