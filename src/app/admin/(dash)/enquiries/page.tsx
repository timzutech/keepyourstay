import Link from "next/link";
import { AdminHeading } from "@/components/admin/Fields";
import { formatDate } from "@/lib/data";
import { requireAdmin } from "@/lib/supabase/server";
import { ENQUIRY_STATUSES, ENQUIRY_TYPES } from "@/lib/types";

export const metadata = { title: "Enquiries" };

const PAGE_SIZE = 25;
type Search = { q?: string; type?: string; status?: string; page?: string };

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const { supabase } = await requireAdmin();
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  // Strip characters that have meaning in PostgREST filter syntax.
  const q = (sp.q ?? "").replace(/[,()%*\\]/g, " ").trim().slice(0, 80);

  let query = supabase
    .from("enquiries")
    .select("id, type, status, full_name, email, business_name, country, created_at, notification_sent", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (ENQUIRY_TYPES.some((t) => t.value === sp.type)) query = query.eq("type", sp.type!);
  if (ENQUIRY_STATUSES.some((s) => s.value === sp.status)) query = query.eq("status", sp.status!);
  if (q) query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%,business_name.ilike.%${q}%,message.ilike.%${q}%`);

  const { data: rows, count, error } = await query;
  const pages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));
  const link = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (sp.type) params.set("type", sp.type);
    if (sp.status) params.set("status", sp.status);
    if (p > 1) params.set("page", String(p));
    const s = params.toString();
    return s ? `/admin/enquiries?${s}` : "/admin/enquiries";
  };

  return (
    <>
      <AdminHeading title="Enquiries" />

      <form method="get" className="mt-6 grid gap-4 rounded-xl border-2 border-ink bg-paper p-5 md:grid-cols-4 md:items-end">
        <div className="md:col-span-2">
          <label htmlFor="q" className="label">Search</label>
          <input id="q" name="q" type="search" defaultValue={q} className="input" placeholder="Name, email, business or message" />
        </div>
        <div>
          <label htmlFor="type" className="label">Type</label>
          <select id="type" name="type" defaultValue={sp.type ?? ""} className="input">
            <option value="">All types</option>
            {ENQUIRY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="label">Status</label>
          <select id="status" name="status" defaultValue={sp.status ?? ""} className="input">
            <option value="">All statuses</option>
            {ENQUIRY_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div className="flex gap-2 md:col-span-4">
          <button type="submit" className="btn btn-primary btn-sm">Apply filters</button>
          <Link href="/admin/enquiries" className="btn btn-outline btn-sm">Clear</Link>
        </div>
      </form>

      {error && <p role="alert" className="field-error mt-6">Enquiries couldn't be loaded: {error.message}</p>}

      <p className="mt-6 text-sm muted" role="status">{count ?? 0} {count === 1 ? "enquiry" : "enquiries"}</p>

      {rows?.length ? (
        <div className="mt-3 overflow-x-auto rounded-xl border-2 border-ink bg-paper">
          <table className="w-full min-w-[44rem] text-left text-[0.95rem]">
            <thead className="bg-sand text-sm">
              <tr>
                <th scope="col" className="p-3">Name</th>
                <th scope="col" className="p-3">Type</th>
                <th scope="col" className="p-3">Status</th>
                <th scope="col" className="p-3">Country</th>
                <th scope="col" className="p-3">Received</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-ink/20 hover:bg-sand/50">
                  <td className="p-3">
                    <Link href={`/admin/enquiries/${r.id}`} className="font-bold underline decoration-olive underline-offset-4">{r.full_name}</Link>
                    <span className="block text-sm muted">{r.business_name || r.email}</span>
                  </td>
                  <td className="p-3">{ENQUIRY_TYPES.find((t) => t.value === r.type)?.label}</td>
                  <td className="p-3">
                    <span className={`chip ${r.status === "new" ? "chip-forest" : ""}`}>{ENQUIRY_STATUSES.find((s) => s.value === r.status)?.label}</span>
                  </td>
                  <td className="p-3">{r.country}</td>
                  <td className="p-3 whitespace-nowrap">{formatDate(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-6 rounded-xl border-2 border-dashed border-ink/40 p-8">
          {q || sp.type || sp.status ? "No enquiries match these filters." : "No enquiries yet. When someone submits a form on the site, it appears here."}
        </p>
      )}

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-6 flex items-center justify-between">
          {page > 1 ? <Link href={link(page - 1)} className="btn btn-outline btn-sm">Previous</Link> : <span />}
          <p className="text-sm font-semibold">Page {page} of {pages}</p>
          {page < pages ? <Link href={link(page + 1)} className="btn btn-outline btn-sm">Next</Link> : <span />}
        </nav>
      )}
    </>
  );
}
