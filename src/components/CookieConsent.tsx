"use client";

import Link from "next/link";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

const KEY = "kys_consent";
// Bumped from 1 when the Advertising category was added, so returning
// visitors are asked again rather than assumed to have agreed to it.
const VERSION = 2;
type Consent = { v: number; analytics: boolean; marketing: boolean; decidedAt: string };

export type TrackingIds = {
  /** Google Analytics 4 measurement ID, G-XXXXXXX. */
  ga?: string;
  /** Google Ads tag ID, AW-XXXXXXXXX. */
  googleAds?: string;
  /** Meta (Facebook/Instagram) Pixel ID, digits only. */
  metaPixel?: string;
};

function read(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Consent;
    return c.v === VERSION ? c : null;
  } catch {
    return null;
  }
}

/** Opens the preferences panel from anywhere, e.g. the footer link. */
export function CookiePreferencesButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event("kys:cookie-preferences"))}>
      Cookie preferences
    </button>
  );
}

const safeId = (id?: string) => (id && /^[A-Za-z0-9-]+$/.test(id) ? id : undefined);

export function CookieConsent({ ids }: { ids: TrackingIds }) {
  const ga = safeId(ids.ga);
  const ads = safeId(ids.googleAds);
  const pixel = safeId(ids.metaPixel);

  const [consent, setConsent] = useState<Consent | null>(null);
  const [ready, setReady] = useState(false);
  const [managing, setManaging] = useState(false);
  const [analyticsChoice, setAnalyticsChoice] = useState(false);
  const [marketingChoice, setMarketingChoice] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const c = read();
    setConsent(c);
    setAnalyticsChoice(c?.analytics ?? false);
    setMarketingChoice(c?.marketing ?? false);
    setReady(true);
    const open = () => {
      const now = read();
      setAnalyticsChoice(now?.analytics ?? false);
      setMarketingChoice(now?.marketing ?? false);
      setManaging(true);
    };
    window.addEventListener("kys:cookie-preferences", open);
    return () => window.removeEventListener("kys:cookie-preferences", open);
  }, []);

  useEffect(() => {
    if (managing) panelRef.current?.focus();
  }, [managing]);

  const save = useCallback(
    (analytics: boolean, marketing: boolean) => {
      const c: Consent = { v: VERSION, analytics, marketing, decidedAt: new Date().toISOString() };
      try {
        localStorage.setItem(KEY, JSON.stringify(c));
      } catch {}
      // If tracking was running and consent is withdrawn, reload so it stops.
      const withdrew = (consent?.analytics && !analytics) || (consent?.marketing && !marketing);
      setConsent(c);
      setManaging(false);
      if (withdrew) window.location.reload();
    },
    [consent],
  );

  const showBanner = ready && (!consent || managing);

  // Tracking loads only after an explicit "yes" for its category.
  const loadGa = Boolean(ga && consent?.analytics);
  const loadAds = Boolean(ads && consent?.marketing);
  const loadPixel = Boolean(pixel && consent?.marketing);
  const gtagId = loadGa ? ga : loadAds ? ads : undefined;

  return (
    <>
      {gtagId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`} strategy="afterInteractive" />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());` +
              (loadGa ? `gtag('config','${ga}');` : "") +
              (loadAds ? `gtag('config','${ads}');` : "")}
          </Script>
        </>
      )}
      {loadPixel && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');fbq('track','PageView');`}
        </Script>
      )}

      {showBanner && (
        <div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-title"
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-xl border-2 border-ink bg-paper p-5 shadow-[6px_6px_0_0_#000] sm:p-6"
        >
          <h2 id="cookie-title" className="text-lg font-bold tracking-tight">
            {managing ? "Cookie preferences" : "Cookies on this site"}
          </h2>
          <p className="mt-2 text-sm leading-relaxed">
            We use essential storage to remember this choice and keep the site working. With your permission, we'd
            also use analytics cookies to understand how the site is used, and advertising cookies to measure which of
            our ads lead to enquiries. Read the{" "}
            <Link href="/cookie-policy" className="underline underline-offset-4">cookie policy</Link>.
          </p>

          {managing && (
            <div className="mt-4 grid gap-3 text-sm">
              <label className="flex items-start gap-2.5">
                <input type="checkbox" className="check" checked disabled />
                <span><strong>Essential.</strong> Always on. Remembers your cookie choice and keeps forms secure.</span>
              </label>
              <label className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  className="check"
                  checked={analyticsChoice}
                  onChange={(e) => setAnalyticsChoice(e.target.checked)}
                />
                <span><strong>Analytics.</strong> Helps us see which pages are visited. Off unless you turn it on.</span>
              </label>
              <label className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  className="check"
                  checked={marketingChoice}
                  onChange={(e) => setMarketingChoice(e.target.checked)}
                />
                <span>
                  <strong>Advertising.</strong> Lets Google and Meta tell us when someone who clicked one of our ads sends
                  an enquiry. Off unless you turn it on.
                </span>
              </label>
            </div>
          )}

          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            {managing ? (
              <button type="button" className="btn btn-primary btn-sm" onClick={() => save(analyticsChoice, marketingChoice)}>
                Save preferences
              </button>
            ) : (
              <button type="button" className="btn btn-primary btn-sm" onClick={() => save(true, true)}>
                Accept all
              </button>
            )}
            <button type="button" className="btn btn-primary btn-sm" onClick={() => save(false, false)}>
              Reject non-essential
            </button>
            {!managing && (
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setManaging(true)}>
                Manage preferences
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
