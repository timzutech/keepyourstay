import { z } from "zod";
import { services } from "@/content/services";
import { calculatorLimits } from "./calculator";

export const HONEYPOT_FIELD = "company_site";
export const TIMESTAMP_FIELD = "started_at";

export type FieldType = "text" | "email" | "url" | "tel" | "textarea" | "select" | "checkboxes";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  hint?: string;
  autoComplete?: string;
  half?: boolean;
  max?: number;
};

export type FormKind = "contact" | "project" | "consultation" | "calculator";

const propertyCounts = ["1", "2–5", "6–20", "21–50", "More than 50"];
const contactMethods = ["Email", "WhatsApp", "Video call"];

const name: Field = { name: "full_name", label: "Full name", type: "text", required: true, autoComplete: "name", half: true };
const email: Field = { name: "email", label: "Email", type: "email", required: true, autoComplete: "email", half: true };
const country: Field = { name: "country", label: "Country", type: "text", required: true, autoComplete: "country-name", half: true };

export const formConfigs: Record<FormKind, { submitLabel: string; successTitle: string; fields: Field[] }> = {
  contact: {
    submitLabel: "Send message",
    successTitle: "Message sent",
    fields: [
      name,
      email,
      { name: "business_name", label: "Business name", type: "text", autoComplete: "organization", half: true },
      country,
      { name: "preferred_contact", label: "Preferred contact method", type: "select", options: contactMethods, required: true },
      { name: "message", label: "Message", type: "textarea", required: true, max: 4000 },
    ],
  },
  project: {
    submitLabel: "Send project enquiry",
    successTitle: "Project enquiry sent",
    fields: [
      name,
      email,
      { name: "business_name", label: "Business or property name", type: "text", required: true, autoComplete: "organization", half: true },
      { name: "website_url", label: "Website URL", type: "url", hint: "Leave blank if you don't have one yet.", half: true },
      country,
      {
        name: "property_type", label: "Property type", type: "select", required: true, half: true,
        options: ["Villa", "Holiday home", "Apartment", "Beach house", "Cabin or cottage", "Boutique accommodation", "Mixed portfolio", "Other"],
      },
      { name: "property_count", label: "Number of properties", type: "select", options: propertyCounts, required: true, half: true },
      {
        name: "website_status", label: "Current website status", type: "select", required: true, half: true,
        options: ["No website yet", "Have a website that needs a redesign", "Have a website, need booking added", "Have a website, need other help"],
      },
      { name: "services", label: "Services you're interested in", type: "checkboxes", required: true, options: services.map((s) => s.short) },
      { name: "booking_systems", label: "Booking platforms or PMS you use now", type: "text", hint: "For example the platforms you list on, and any channel manager or PMS." },
      {
        name: "budget_range", label: "Project budget range (optional)", type: "select", half: true,
        options: ["Not sure yet", "Under $2,000 / £1,600", "$2,000–$5,000 / £1,600–£4,000", "$5,000–$10,000 / £4,000–£8,000", "Over $10,000 / £8,000"],
      },
      {
        name: "timeline", label: "Desired timeline", type: "select", required: true, half: true,
        options: ["As soon as possible", "Within 1–3 months", "Within 3–6 months", "No fixed date"],
      },
      { name: "message", label: "Additional details", type: "textarea", max: 4000 },
    ],
  },
  consultation: {
    submitLabel: "Request consultation",
    successTitle: "Consultation requested",
    fields: [
      name,
      email,
      { name: "whatsapp", label: "WhatsApp number (optional)", type: "tel", autoComplete: "tel", hint: "Include your country code.", half: true },
      { name: "business_name", label: "Business name", type: "text", autoComplete: "organization", half: true },
      country,
      { name: "property_count", label: "Number of properties", type: "select", options: propertyCounts, required: true, half: true },
      { name: "booking_channels", label: "Current booking channels", type: "text", required: true, hint: "Where your bookings come from today." },
      { name: "main_challenge", label: "Main challenge", type: "textarea", required: true, max: 2000 },
      { name: "preferred_time", label: "Preferred consultation time", type: "text", required: true, hint: "Days and times that suit you, with your time zone." },
      { name: "message", label: "Additional message", type: "textarea", max: 4000 },
    ],
  },
  calculator: {
    submitLabel: "Send my estimate and request a consultation",
    successTitle: "Estimate sent",
    fields: [
      name,
      email,
      { name: "business_name", label: "Business or property name", type: "text", required: true, autoComplete: "organization", half: true },
      { name: "website_url", label: "Website URL, if you have one", type: "url", half: true },
      { name: "property_count", label: "Number of properties", type: "select", options: propertyCounts, required: true, half: true },
      country,
      { name: "message", label: "Message", type: "textarea", max: 4000 },
    ],
  },
};

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1).replace(/ \(optional\)$/, "");

function fieldSchema(f: Field) {
  const label = lower(f.label);
  if (f.type === "checkboxes") {
    const arr = z.array(z.enum(f.options as [string, ...string[]]));
    return f.required ? arr.min(1, "Choose at least one option") : arr;
  }
  if (f.type === "select") {
    const opt = z.enum(f.options as [string, ...string[]], { error: `Choose your ${label}` });
    return f.required ? opt : z.union([z.literal(""), opt]);
  }
  let s = z.string().trim().max(f.max ?? 200, `Keep this under ${f.max ?? 200} characters`);
  if (f.type === "email") {
    return s.min(1, "Enter your email address").pipe(z.email("Enter a valid email address, like name@example.com"));
  }
  if (f.type === "url") {
    return s.transform((v) => (v && !/^https?:\/\//i.test(v) ? `https://${v}` : v)).pipe(
      z.union([
        z.literal(""),
        z.url({ protocol: /^https?$/, hostname: z.regexes.domain, error: "Enter a valid web address, like yourproperty.com" }),
      ]),
    );
  }
  if (f.type === "tel") {
    return s.refine((v) => v === "" || /^\+?[\d\s().-]{7,20}$/.test(v), "Enter a valid phone number with country code");
  }
  if (f.required) s = s.min(1, `Enter your ${label}`);
  return s;
}

export function schemaFor(kind: FormKind) {
  const shape: Record<string, z.ZodType> = {};
  for (const f of formConfigs[kind].fields) shape[f.name] = fieldSchema(f);
  shape.consent = z.literal("yes", { error: "Tick the box to agree before sending" });
  return z.object(shape);
}

const num = (key: keyof typeof calculatorLimits, label: string) =>
  z.coerce
    .number({ error: `Enter a number for ${label}` })
    .min(calculatorLimits[key].min, `${label} can't be negative`)
    .max(calculatorLimits[key].max, `${label} is too high`);

export const calculatorSchema = z.object({
  monthlyRevenue: num("monthlyRevenue", "Monthly booking revenue"),
  independentSharePct: num("independentSharePct", "Independent booking share"),
  platformFeePct: num("platformFeePct", "Platform fee"),
  paymentFeePct: num("paymentFeePct", "Payment processing fee"),
  softwareCost: num("softwareCost", "Software cost"),
  marketingCost: num("marketingCost", "Marketing cost"),
  currency: z.enum(["USD", "GBP"]),
});

export const newsletterSchema = z.object({
  email: z.string().trim().min(1, "Enter your email address").max(200).pipe(z.email("Enter a valid email address, like name@example.com")),
  consent: z.literal("yes", { error: "Tick the box to agree before subscribing" }),
});

/** Reads a FormData into plain values according to a form's field list. */
export function readForm(kind: FormKind, fd: FormData) {
  const values: Record<string, string | string[]> = {};
  for (const f of formConfigs[kind].fields) {
    values[f.name] = f.type === "checkboxes" ? fd.getAll(f.name).map(String) : String(fd.get(f.name) ?? "");
  }
  values.consent = String(fd.get("consent") ?? "");
  return values;
}

export function issuesToErrors(issues: z.core.$ZodIssue[]) {
  const errors: Record<string, string> = {};
  for (const i of issues) {
    const key = String(i.path[0] ?? "form");
    if (!errors[key]) errors[key] = i.message;
  }
  return errors;
}
