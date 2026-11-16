import { AdminHeading } from "@/components/admin/Fields";
import { formatDate } from "@/lib/data";
import { requireAdmin } from "@/lib/supabase/server";

export const metadata = { title: "Subscribers" };

export default async function SubscribersPage() {
  const { supabase } = await requireAdmin();
  const { data: rows } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, status, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  return (
    <>
      <AdminHeading title="Newsletter subscribers" />
      <p className="mt-3 max-w-[46em] text-sm muted">
        People who subscribed through the site and consented to email. Only contact addresses marked “Subscribed”.
      </p>
      {rows?.length ? (
        <div className="mt-6 overflow-x-auto rounded-xl border-2 border-ink bg-paper">
          <table className="w-full min-w-[30rem] text-left text-[0.95rem]">
            <thead className="bg-sand text-sm">
              <tr><th scope="col" className="p-3">Email</th><th scope="col" className="p-3">Status</th><th scope="col" className="p-3">Subscribed</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-ink/20">
                  <td className="p-3 break-all">{r.email}</td>
                  <td className="p-3"><span className={`chip ${r.status === "subscribed" ? "chip-forest" : ""}`}>{r.status === "subscribed" ? "Subscribed" : "Unsubscribed"}</span></td>
                  <td className="p-3 whitespace-nowrap">{formatDate(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-6 rounded-xl border-2 border-dashed border-ink/40 p-8">No subscribers yet.</p>
      )}
    </>
  );
}
