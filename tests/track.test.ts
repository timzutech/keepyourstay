import { afterEach, describe, expect, it, vi } from "vitest";

async function load() {
  vi.resetModules();
  return import("@/lib/track");
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("lead tracking", () => {
  it("does nothing, and doesn't throw, when no tracking was consented to", async () => {
    vi.stubGlobal("window", {});
    const { trackLead, trackSignup } = await load();
    expect(() => trackLead("contact")).not.toThrow();
    expect(() => trackSignup()).not.toThrow();
  });

  it("reports a lead to Google Analytics, Google Ads and Meta when they are loaded", async () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_ADS_ID", "AW-111");
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL", "abcLabel");
    const gtag = vi.fn();
    const fbq = vi.fn();
    vi.stubGlobal("window", { gtag, fbq });
    const { trackLead } = await load();
    trackLead("project");
    expect(gtag).toHaveBeenCalledWith("event", "generate_lead", { form_name: "project" });
    expect(gtag).toHaveBeenCalledWith("event", "conversion", { send_to: "AW-111/abcLabel" });
    expect(fbq).toHaveBeenCalledWith("track", "Lead", { content_name: "project" });
  });

  it("skips the Google Ads conversion when no conversion label is set", async () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag });
    const { trackLead } = await load();
    trackLead("contact");
    expect(gtag).toHaveBeenCalledTimes(1);
  });
});
