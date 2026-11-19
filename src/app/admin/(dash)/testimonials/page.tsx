import Link from "next/link";
import { AdminHeading, Saved } from "@/components/admin/Fields";
import { requireAdmin } from "@/lib/supabase/server";

export const metadata = { title: "Testimonials" };

export default async function AdminTestimonials({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data: items } = await supabase.from("testimonials").select("*").order("published").order("sort_order").order("created_at", { ascending: false });

  return (
    <>
      <AdminHeading title="Testimonials">
        <Link href="/admin/testimonials/new" className="btn btn-primary btn-sm">Add testimonial</Link>
      </AdminHeading>
      <p className="mt-3 max-w-[46em] text-sm muted">
        Only add words a real client actually gave you, and only publish them with that client's approval. The
        homepage testimonial section stays hidden until at least one is published.
      </p>
      <p className="mt-3 max-w-[46em] text-sm">
        To collect feedback, send clients this private link when their project ends:{" "}
        <Link href="/feedback" className="link" target="_blank">/feedback</Link>. Their replies appear here, marked
        &ldquo;From feedback form&rdquo;, and stay hidden until you verify and publish them.
      </p>
      <Saved show={saved === "1"} />

      {items?.length ? (
        <ul className="mt-6 grid gap-4">
          {items.map((t) => (
            <li key={t.id} className="rounded-xl border-2 border-ink bg-paper p-5">
              <p className="font-serif text-lg leading-snug">“{t.quote}”</p>
              <p className="mt-3 text-sm">
                <span className="font-bold">{t.author_name}</span>
                {[t.author_role, t.business_name].filter(Boolean).length > 0 && <span className="muted">, {[t.author_role, t.business_name].filter(Boolean).join(", ")}</span>}
              </p>
              {t.source === "feedback_form" && (
                <p className="mt-2 text-sm muted">
                  From feedback form: {t.submitter_name}, {t.submitter_email}
                  {t.consent_given_at && <>, agreed to publication on {new Date(t.consent_given_at).toLocaleDateString("en-GB")}</>}
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className={`chip ${t.published ? "chip-forest" : ""}`}>{t.published ? "Published" : "Unpublished"}</span>
                <span className="chip">{t.verified ? "Verified" : "Not verified"}</span>
                <span className="chip">{t.client_approved ? "Client approved" : "Awaiting client approval"}</span>
                <Link href={`/admin/testimonials/${t.id}`} className="btn btn-outline btn-sm ml-auto">Edit</Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 rounded-xl border-2 border-dashed border-ink/40 p-8">No testimonials yet. Add the first one when a client gives you permission to quote them.</p>
      )}
    </>
  );
}
