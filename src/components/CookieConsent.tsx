"use client";

import Link from "next/link";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

const KEY = "kys_consent";
const VERSION = 1;
type Consent = { v: number; analytics: boolean; decidedAt: string };

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

export function CookieConsent({ gaId }: { gaId?: string }) {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [ready, setReady] = useState(false);
  const [managing, setManaging] = useState(false);
  const [analyticsChoice, setAnalyticsChoice] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const c = read();
    setConsent(c);
    setAnalyticsChoice(c?.analytics ?? false);
    setReady(true);
    const open = () => {
      setAnalyticsChoice(read()?.analytics ?? false);
      setManaging(true);
    };
    window.addEventListener("kys:cookie-preferences", open);
    return () => window.removeEventListener("kys:cookie-preferences", open);
  }, []);

  useEffect(() => {
    if (managing) panelRef.current?.focus();
  }, [managing]);

  const save = useCallback((analytics: boolean) => {
    const c: Consent = { v: VERSION, analytics, decidedAt: new Date().toISOString() };
    try {
      localStorage.setItem(KEY, JSON.stringify(c));
    } catch {}
    // If analytics was running and consent is withdrawn, reload so it stops.
    const wasOn = read() && consent?.analytics;
    setConsent(c);
    setManaging(false);
    if (wasOn && !analytics) window.location.reload();
  }, [consent]);

  const showBanner = ready && (!consent || managing);

  return (
    <>
      {/* Analytics loads only after an explicit "yes". Nothing is tracked before that. */}
      {gaId && consent?.analytics && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
          </Script>
        </>
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
            also use analytics cookies to understand how the site is used. Read the{" "}
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
            </div>
          )}

          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            {managing ? (
              <button type="button" className="btn btn-primary btn-sm" onClick={() => save(analyticsChoice)}>
                Save preferences
              </button>
            ) : (
              <button type="button" className="btn btn-primary btn-sm" onClick={() => save(true)}>
                Accept all
              </button>
            )}
            <button type="button" className="btn btn-primary btn-sm" onClick={() => save(false)}>
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
