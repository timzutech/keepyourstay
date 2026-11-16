import { describe, expect, it } from "vitest";
import { calculatorSchema, formConfigs, issuesToErrors, newsletterSchema, schemaFor } from "@/lib/forms";
import { whatsappLink } from "@/lib/site";

const contact = {
  full_name: "Ada Host",
  email: "ada@example.com",
  business_name: "",
  country: "United Kingdom",
  preferred_contact: "Email",
  message: "Hello",
  consent: "yes",
};

describe("contact form", () => {
  it("accepts a valid submission", () => {
    expect(schemaFor("contact").safeParse(contact).success).toBe(true);
  });
  it("rejects missing required fields with readable messages", () => {
    const r = schemaFor("contact").safeParse({ ...contact, full_name: " ", email: "nope", message: "", consent: "" });
    expect(r.success).toBe(false);
    const errors = issuesToErrors(r.error!.issues);
    expect(errors.full_name).toBe("Enter your full name");
    expect(errors.email).toMatch(/valid email/);
    expect(errors.message).toBe("Enter your message");
    expect(errors.consent).toMatch(/Tick the box/);
  });
  it("rejects an option that isn't offered", () => {
    expect(schemaFor("contact").safeParse({ ...contact, preferred_contact: "Fax" }).success).toBe(false);
  });
  it("rejects over-long input", () => {
    expect(schemaFor("contact").safeParse({ ...contact, message: "x".repeat(4001) }).success).toBe(false);
  });
});

describe("project enquiry form", () => {
  const project = {
    full_name: "Ada Host", email: "ada@example.com", business_name: "Tide House", website_url: "tidehouse.example.com",
    country: "USA", property_type: "Beach house", property_count: "1", website_status: "No website yet",
    services: [formConfigs.project.fields.find((f) => f.name === "services")!.options![0]],
    booking_systems: "", budget_range: "", timeline: "No fixed date", message: "", consent: "yes",
  };
  it("accepts a valid submission and normalises the URL", () => {
    const r = schemaFor("project").safeParse(project);
    expect(r.success).toBe(true);
    expect((r.data as Record<string, unknown>).website_url).toBe("https://tidehouse.example.com");
  });
  it("allows an empty optional URL and budget", () => {
    expect(schemaFor("project").safeParse({ ...project, website_url: "" }).success).toBe(true);
  });
  it("requires at least one service", () => {
    const r = schemaFor("project").safeParse({ ...project, services: [] });
    expect(r.success).toBe(false);
    expect(issuesToErrors(r.error!.issues).services).toMatch(/at least one/);
  });
  it("rejects a malformed URL", () => {
    expect(schemaFor("project").safeParse({ ...project, website_url: "not a url" }).success).toBe(false);
    expect(schemaFor("project").safeParse({ ...project, website_url: "javascript:alert(1)" }).success).toBe(false);
  });
});

describe("consultation form", () => {
  const c = {
    full_name: "Ada", email: "ada@example.com", whatsapp: "+1 951 555 0100", business_name: "", country: "Canada",
    property_count: "2–5", booking_channels: "Platforms", main_challenge: "Fees", preferred_time: "Weekdays ET", message: "", consent: "yes",
  };
  it("accepts valid input, with or without WhatsApp", () => {
    expect(schemaFor("consultation").safeParse(c).success).toBe(true);
    expect(schemaFor("consultation").safeParse({ ...c, whatsapp: "" }).success).toBe(true);
  });
  it("rejects a bad phone number", () => {
    expect(schemaFor("consultation").safeParse({ ...c, whatsapp: "call me" }).success).toBe(false);
  });
});

describe("calculator payload", () => {
  const ok = { monthlyRevenue: 8000, independentSharePct: 20, platformFeePct: 15, paymentFeePct: 3, softwareCost: 60, marketingCost: 0, currency: "GBP" };
  it("accepts valid figures", () => expect(calculatorSchema.safeParse(ok).success).toBe(true));
  it("rejects negatives, percentages over 100 and unknown currencies", () => {
    expect(calculatorSchema.safeParse({ ...ok, monthlyRevenue: -1 }).success).toBe(false);
    expect(calculatorSchema.safeParse({ ...ok, platformFeePct: 101 }).success).toBe(false);
    expect(calculatorSchema.safeParse({ ...ok, currency: "EUR" }).success).toBe(false);
    expect(calculatorSchema.safeParse({ ...ok, softwareCost: "abc" }).success).toBe(false);
  });
});

describe("newsletter", () => {
  it("needs a valid email and consent", () => {
    expect(newsletterSchema.safeParse({ email: "a@b.co", consent: "yes" }).success).toBe(true);
    expect(newsletterSchema.safeParse({ email: "a@b.co", consent: "" }).success).toBe(false);
    expect(newsletterSchema.safeParse({ email: "nope", consent: "yes" }).success).toBe(false);
  });
});

describe("WhatsApp link", () => {
  it("uses the international wa.me format with a prefilled message", () => {
    const url = whatsappLink("+1 (951) 469-2722", "Hello there");
    expect(url).toBe("https://wa.me/19514692722?text=Hello%20there");
  });
});
