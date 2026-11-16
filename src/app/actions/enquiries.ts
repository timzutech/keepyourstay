"use server";

import { calculate, formatMoney } from "@/lib/calculator";
import { enquiryNotification, leadInbox, sendEmail, type Row } from "@/lib/email";
import { calculatorSchema, formConfigs, issuesToErrors, readForm, schemaFor, type FormKind } from "@/lib/forms";
import { looksAutomated, visitorHash } from "@/lib/spam";
import { serviceClient } from "@/lib/supabase/admin";

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
  values?: Record<string, string | string[]>;
};

const KINDS: FormKind[] = ["contact", "project", "consultation", "calculator"];
const TYPE_LABEL = { contact: "Contact request", project: "Project enquiry", consultation: "Consultation request" };

// Columns that exist on the enquiries table; every other answer goes into `details`.
const COLUMNS = new Set([
  "full_name", "email", "whatsapp", "business_name", "website_url", "country",
  "property_type", "property_count", "services", "preferred_contact", "message",
]);

const MAX_PER_WINDOW = 5;
const WINDOW_MINUTES = 10;

export async function submitEnquiry(_prev: FormState, fd: FormData): Promise<FormState> {
  const kind = String(fd.get("form_kind")) as FormKind;
  if (!KINDS.includes(kind)) return { status: "error", message: "This form could not be sent. Reload the page and try again." };

  const values = readForm(kind, fd);
  const fail = (message: string, errors?: Record<string, string>): FormState => ({ status: "error", message, errors, values });

  if (looksAutomated(fd)) {
    return fail("This submission was blocked by our spam filter. Wait a few seconds and send it again, or email us directly.");
  }

  const parsed = schemaFor(kind).safeParse(values);
  if (!parsed.success) {
    return fail("Some fields need your attention. Check the messages below.", issuesToErrors(parsed.error.issues));
  }
  const data = parsed.data as Record<string, string | string[]>;

  // The calculator form carries the visitor's inputs. Results are recomputed
  // here rather than trusted from the browser.
  let calculator: Record<string, unknown> | null = null;
  if (kind === "calculator") {
    let raw: unknown;
    try {
      raw = JSON.parse(String(fd.get("calculator") ?? ""));
    } catch {
      return fail("Your calculator figures could not be read. Adjust a value in the calculator and send again.");
    }
    const calc = calculatorSchema.safeParse(raw);
    if (!calc.success) {
      return fail("Check the figures in the calculator above, then send again.");
    }
    calculator = { inputs: calc.data, results: calculate(calc.data) };
  }

  const db = serviceClient();
  if (!db) {
    console.error("[enquiry] Supabase is not configured; enquiry was NOT saved.");
    return fail("We couldn't save your enquiry because the site's database isn't connected yet. Please email or WhatsApp us instead.");
  }

  const ipHash = await visitorHash();
  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();
  const { count } = await db
    .from("enquiries")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);
  if ((count ?? 0) >= MAX_PER_WINDOW) {
    return fail("You've sent several enquiries in a short time. Wait a few minutes before sending another.");
  }

  const fields = formConfigs[kind].fields;
  const details: Record<string, string> = {};
  const row: Record<string, unknown> = {
    type: kind === "calculator" ? "consultation" : kind,
    consent: true,
    ip_hash: ipHash,
    source_path: String(fd.get("source_path") ?? "").slice(0, 200) || null,
    calculator,
  };
  for (const f of fields) {
    const v = data[f.name];
    if (COLUMNS.has(f.name)) row[f.name] = Array.isArray(v) ? v : v || null;
    else if (v && !Array.isArray(v)) details[f.label.replace(/ \(optional\)$/, "")] = v;
  }
  row.details = details;

  const { data: saved, error } = await db.from("enquiries").insert(row).select("id").single();
  if (error || !saved) {
    console.error("[enquiry] insert failed", error);
    return fail("We couldn't save your enquiry. Nothing was sent. Try again in a moment, or email us directly.");
  }

  // Saved. Now notify the business. A notification failure does not undo the
  // save; it is recorded so the admin dashboard can show it.
  const rows: Row[] = fields.map((f) => {
    const v = data[f.name];
    const label = f.name === "full_name" ? "Name" : f.label.replace(/ \(optional\)$/, "");
    return [label, Array.isArray(v) ? v.join(", ") : v];
  });
  if (calculator) {
    const i = calculator.inputs as Parameters<typeof calculate>[0];
    const r = calculator.results as ReturnType<typeof calculate>;
    const m = (n: number) => formatMoney(n, i.currency);
    rows.push(
      ["Preferred currency", i.currency],
      ["Monthly booking revenue", m(i.monthlyRevenue)],
      ["Independent booking share", `${i.independentSharePct}%`],
      ["Platform fee rate", `${i.platformFeePct}%`],
      ["Payment processing rate", `${i.paymentFeePct}%`],
      ["Software cost / month", m(i.softwareCost)],
      ["Marketing cost / month", m(i.marketingCost)],
      ["Illustrative platform fees / month", m(r.platformFees)],
      ["Alternative-channel costs / month", m(r.alternativeCosts)],
      ["Estimated net difference / month", m(r.monthlyDifference)],
      ["Annualised illustrative difference", m(r.annualDifference)],
    );
  }
  const type = row.type as keyof typeof TYPE_LABEL;
  const mail = enquiryNotification({ typeLabel: TYPE_LABEL[type], id: saved.id, rows });
  const result = await sendEmail({ to: leadInbox(), replyTo: String(data.email), ...mail });
  if (result.sent) {
    await db.from("enquiries").update({ notification_sent: true }).eq("id", saved.id);
  } else {
    console.warn("[enquiry] saved but notification email not sent:", result.reason);
  }

  return {
    status: "success",
    message: "We've received your details and will reply by email, usually within two working days.",
  };
}
