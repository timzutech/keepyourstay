"use client";

// Reports conversions to whichever ad/analytics tools the visitor agreed to.
// The tools are only loaded after consent (see CookieConsent), so when a visitor
// rejected tracking, window.gtag and window.fbq don't exist and nothing is sent.

type Gtag = (...args: unknown[]) => void;
type Fbq = (...args: unknown[]) => void;

const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const adsLeadLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL;

function tools() {
  const w = window as unknown as { gtag?: Gtag; fbq?: Fbq };
  return { gtag: typeof w.gtag === "function" ? w.gtag : undefined, fbq: typeof w.fbq === "function" ? w.fbq : undefined };
}

/** A form that asks for contact was saved successfully. */
export function trackLead(form: string) {
  try {
    const { gtag, fbq } = tools();
    gtag?.("event", "generate_lead", { form_name: form });
    if (gtag && adsId && adsLeadLabel) gtag("event", "conversion", { send_to: `${adsId}/${adsLeadLabel}` });
    fbq?.("track", "Lead", { content_name: form });
  } catch {
    // Tracking must never break the form.
  }
}

/** Someone subscribed to the newsletter. */
export function trackSignup() {
  try {
    const { gtag, fbq } = tools();
    gtag?.("event", "sign_up", { method: "newsletter" });
    fbq?.("track", "CompleteRegistration", { content_name: "newsletter" });
  } catch {
    // ignore
  }
}
