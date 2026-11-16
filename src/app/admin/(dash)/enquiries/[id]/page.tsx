import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminForm } from "@/components/admin/AdminForm";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { AdminHeading, Panel } from "@/components/admin/Fields";
import { formatMoney, type CalculatorInputs, type CalculatorResult } from "@/lib/calculator";
import { requireAdmin } from "@/lib/supabase/server";
import { ENQUIRY_STATUSES, ENQUIRY_TYPES } from "@/lib/types";
import { addEnquiryNote, deleteEnquiry, updateEnquiryStatus } from "../../../actions";

export const metadata = { title: "Enquiry" };

const stamp = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(iso)) + " UTC";

export default async function EnquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { supabase } = await requireAdmin();
  const [{ data: e }, { data: notes }] = await Promise.all([
    supabase.from("enquiries").select("*").eq("id", id).maybeSingle(),
    supabase.from("enquiry_notes").select("*").eq("enquiry_id", id).order("created_at"),
  ]);
  if (!e) notFound();

  const rows: [string, string | null][] = [
    ["Email", e.email],
    ["WhatsApp", e.whatsapp],
    ["Business or property", e.business_name],
    ["Website", e.website_url],
    ["Country", e.country],
    ["Property type", e.property_type],
    ["Number of properties", e.property_count],
    ["Services", e.services?.length ? e.services.join(", ") : null],
    ["Preferred contact", e.preferred_contact],
    ...Object.entries((e.details ?? {}) as Record<string, string>),
    ["Submitted from", e.source_path],
  ];
  const calc = e.calculator as { inputs: CalculatorInputs; results: CalculatorResult } | null;
  const m = (n: number) => (calc ? formatMoney(n, calc.inputs.currency) : "");

  return (
    <>
      <p className="text-sm"><Link href="/admin/enquiries" className="link">All enquiries</Link></p>
      <div className="mt-4">
        <AdminHeading title={e.full_name}>
          <a href={`mailto:${e.email}`} className="btn btn-primary btn-sm">Reply by email</a>
        </AdminHeading>
        <p className="mt-2 text-sm muted">
          {ENQUIRY_TYPES.find((t) => t.value === e.type)?.label}, received {stamp(e.created_at)}.{" "}
          {e.notification_sent ? "Notification email sent." : "Notification email was not sent."}
        </p>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="grid gap-6 xl:col-span-2">
          <Panel title="Details">
            <dl className="rule-t -mt-1">
              {rows.filter(([, v]) => v).map(([label, value]) => (
                <div key={label} className="rule-b grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-semibold muted">{label}</dt>
                  <dd className="break-words sm:col-span-2">{value}</dd>
                </div>
              ))}
            </dl>
            {e.message && (
              <div>
                <h3 className="text-sm font-semibold muted">Message</h3>
                <p className="mt-2 whitespace-pre-wrap font-serif text-[1.05rem] leading-relaxed">{e.message}</p>
              </div>
            )}
          </Panel>

          {calc && (
            <Panel title={`Savings calculator scenario (${calc.inputs.currency})`}>
              <dl className="rule-t -mt-1">
                {[
                  ["Monthly booking revenue", m(calc.inputs.monthlyRevenue)],
                  ["Independent booking share", `${calc.inputs.independentSharePct}%`],
                  ["Platform fee rate", `${calc.inputs.platformFeePct}%`],
                  ["Payment processing rate", `${calc.inputs.paymentFeePct}%`],
                  ["Software cost per month", m(calc.inputs.softwareCost)],
                  ["Marketing cost per month", m(calc.inputs.marketingCost)],
                  ["Illustrative platform fees per month", m(calc.results.platformFees)],
                  ["Alternative-channel costs per month", m(calc.results.alternativeCosts)],
                  ["Estimated net difference per month", m(calc.results.monthlyDifference)],
                  ["Annualised illustrative difference", m(calc.results.annualDifference)],
                ].map(([label, value]) => (
                  <div key={label} className="rule-b flex justify-between gap-4 py-2.5">
                    <dt>{label}</dt>
                    <dd className="font-bold tabular-nums">{value}</dd>
                  </div>
                ))}
              </dl>
            </Panel>
          )}

          <Panel title="Internal notes">
            {notes?.length ? (
              <ul className="grid gap-3">
                {notes.map((n) => (
                  <li key={n.id} className="rounded-lg bg-sand p-4">
                    <p className="whitespace-pre-wrap">{n.body}</p>
                    <p className="mt-2 text-xs muted">{n.author_email ?? "Admin"}, {stamp(n.created_at)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">No notes yet. Notes are only visible to admins.</p>
            )}
            <AdminForm action={addEnquiryNote} submitLabel="Add note" resetOnSuccess>
              <input type="hidden" name="enquiry_id" value={e.id} />
              <label htmlFor="note-body" className="label">New note</label>
              <textarea id="note-body" name="body" rows={3} className="input" />
            </AdminForm>
          </Panel>
        </div>

        <div className="grid content-start gap-6">
          <Panel title="Status">
            <form action={updateEnquiryStatus}>
              <input type="hidden" name="id" value={e.id} />
              <label htmlFor="status" className="label">Pipeline stage</label>
              <select id="status" name="status" defaultValue={e.status} className="input">
                {ENQUIRY_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <button type="submit" className="btn btn-primary btn-sm mt-4">Update status</button>
            </form>
          </Panel>
          <Panel title="Delete enquiry">
            <p className="text-sm">Permanently removes this enquiry and its notes. This can't be undone.</p>
            <form action={deleteEnquiry}>
              <input type="hidden" name="id" value={e.id} />
              <ConfirmButton label="Delete enquiry" confirm={`Delete the enquiry from ${e.full_name}? This can't be undone.`} />
            </form>
          </Panel>
        </div>
      </div>
    </>
  );
}
