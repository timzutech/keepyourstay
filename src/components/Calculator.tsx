"use client";

import { useMemo, useState } from "react";
import {
  calculate,
  calculatorDefaults,
  calculatorLimits,
  formatMoney,
  type CalculatorInputs,
  type Currency,
} from "@/lib/calculator";
import { EnquiryForm } from "./EnquiryForm";

type NumericKey = keyof typeof calculatorLimits;

const fields: { key: NumericKey; label: string; hint: string; kind: "money" | "percent"; step: number }[] = [
  { key: "monthlyRevenue", label: "Monthly booking revenue", hint: "Your typical total across all channels.", kind: "money", step: 100 },
  {
    key: "independentSharePct",
    label: "Share that could realistically come from independent bookings",
    hint: "Guests who find you through search, referrals, social media or a return visit. Be conservative.",
    kind: "percent",
    step: 1,
  },
  { key: "platformFeePct", label: "Platform fee you currently pay", hint: "Check your own statements. Rates differ by platform and plan.", kind: "percent", step: 0.5 },
  { key: "paymentFeePct", label: "Payment processing fee on direct bookings", hint: "Charged by your card payment provider.", kind: "percent", step: 0.1 },
  { key: "softwareCost", label: "Booking software and website cost per month", hint: "Hosting, booking tools and maintenance.", kind: "money", step: 10 },
  { key: "marketingCost", label: "Marketing cost per month (optional)", hint: "Advertising, email tools, content. Enter 0 if none.", kind: "money", step: 10 },
];

export function Calculator() {
  const [raw, setRaw] = useState<Record<NumericKey, string>>(() => ({
    monthlyRevenue: String(calculatorDefaults.monthlyRevenue),
    independentSharePct: String(calculatorDefaults.independentSharePct),
    platformFeePct: String(calculatorDefaults.platformFeePct),
    paymentFeePct: String(calculatorDefaults.paymentFeePct),
    softwareCost: String(calculatorDefaults.softwareCost),
    marketingCost: String(calculatorDefaults.marketingCost),
  }));
  const [currency, setCurrency] = useState<Currency>("USD");

  const errors = useMemo(() => {
    const e: Partial<Record<NumericKey, string>> = {};
    for (const f of fields) {
      const text = raw[f.key].trim();
      const n = Number(text);
      const { min, max } = calculatorLimits[f.key];
      if (text === "" && f.key === "marketingCost") continue;
      if (text === "") e[f.key] = "Enter a number";
      else if (!Number.isFinite(n)) e[f.key] = "Enter a number, using digits only";
      else if (n < min) e[f.key] = "This can't be negative";
      else if (n > max) e[f.key] = f.kind === "percent" ? "Enter a percentage between 0 and 100" : "This figure is too high";
    }
    return e;
  }, [raw]);

  const valid = Object.keys(errors).length === 0;
  const inputs: CalculatorInputs | null = valid
    ? {
        monthlyRevenue: Number(raw.monthlyRevenue),
        independentSharePct: Number(raw.independentSharePct),
        platformFeePct: Number(raw.platformFeePct),
        paymentFeePct: Number(raw.paymentFeePct),
        softwareCost: Number(raw.softwareCost),
        marketingCost: Number(raw.marketingCost || 0),
        currency,
      }
    : null;
  const result = inputs ? calculate(inputs) : null;
  const money = (n: number) => formatMoney(n, currency);
  const symbol = currency === "GBP" ? "£" : "$";

  const scale = result ? Math.max(result.platformFees, result.alternativeCosts, 1) : 1;
  const pct = (n: number) => `${Math.max(0, Math.min(100, (n / scale) * 100))}%`;

  return (
    <div>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <form className="lg:col-span-6" noValidate onSubmit={(e) => e.preventDefault()} aria-label="Savings calculator inputs">
          <fieldset>
            <legend className="label">Currency</legend>
            <div className="inline-flex rounded-full border-2 border-ink p-1">
              {(["USD", "GBP"] as Currency[]).map((c) => (
                <label
                  key={c}
                  className={`cursor-pointer rounded-full px-5 py-2 text-sm font-bold has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-forest has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline ${
                    currency === c ? "bg-ink text-cream" : ""
                  }`}
                >
                  <input type="radio" name="currency" value={c} checked={currency === c} onChange={() => setCurrency(c)} className="sr-only" />
                  {c === "USD" ? "US dollars ($)" : "Pounds sterling (£)"}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 grid gap-5">
            {fields.map((f) => (
              <div key={f.key}>
                <label htmlFor={`calc-${f.key}`} className="label">{f.label}</label>
                <div className="relative">
                  {f.kind === "money" && (
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold" aria-hidden="true">
                      {symbol}
                    </span>
                  )}
                  <input
                    id={`calc-${f.key}`}
                    type="number"
                    inputMode="decimal"
                    min={calculatorLimits[f.key].min}
                    max={calculatorLimits[f.key].max}
                    step={f.step}
                    value={raw[f.key]}
                    onChange={(e) => setRaw((r) => ({ ...r, [f.key]: e.target.value }))}
                    className={`input ${f.kind === "money" ? "pl-8" : "pr-10"}`}
                    aria-invalid={errors[f.key] ? true : undefined}
                    aria-describedby={`calc-${f.key}-hint${errors[f.key] ? ` calc-${f.key}-error` : ""}`}
                  />
                  {f.kind === "percent" && (
                    <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 font-semibold" aria-hidden="true">
                      %
                    </span>
                  )}
                </div>
                <p id={`calc-${f.key}-hint`} className="hint">{f.hint}</p>
                {errors[f.key] && <p id={`calc-${f.key}-error`} className="field-error">{errors[f.key]}</p>}
              </div>
            ))}
          </div>
        </form>

        <div className="lg:col-span-6">
          <div className="on-dark rounded-xl bg-forest p-6 text-cream sm:p-8 lg:sticky lg:top-24" aria-live="polite">
            <h2 className="heading">Your illustrative scenario</h2>
            {result && inputs ? (
              <>
                <p className="reading-sm mt-2 text-cream/85">
                  Based on {money(result.independentRevenue)} a month of independently acquired bookings.
                </p>

                <dl className="mt-6">
                  <div className="rule-t flex items-baseline justify-between gap-4 py-3">
                    <dt>Platform fees associated with that revenue</dt>
                    <dd className="text-xl font-bold tabular-nums">{money(result.platformFees)}</dd>
                  </div>
                  <div className="rule-t flex items-baseline justify-between gap-4 py-3">
                    <dt>
                      Alternative-channel costs
                      <span className="block text-sm text-cream/75">
                        Payment processing {money(result.paymentCosts)}, software and marketing {money(result.fixedCosts)}
                      </span>
                    </dt>
                    <dd className="text-xl font-bold tabular-nums">{money(result.alternativeCosts)}</dd>
                  </div>
                  <div className="rule-t rule-b py-4">
                    <dt className="font-semibold">Estimated net difference per month</dt>
                    <dd className="mt-1 text-[clamp(2.4rem,6vw,3.6rem)] font-bold leading-none tracking-tight tabular-nums [font-stretch:85%]">
                      {result.monthlyDifference < 0 ? "−" : ""}
                      {money(Math.abs(result.monthlyDifference))}
                    </dd>
                    <dd className="mt-2 text-cream/85">
                      Annualised: {result.annualDifference < 0 ? "−" : ""}
                      {money(Math.abs(result.annualDifference))} (illustrative)
                    </dd>
                  </div>
                </dl>

                <div className="mt-6" role="img" aria-label={`Comparison: platform fees ${money(result.platformFees)} versus alternative-channel costs ${money(result.alternativeCosts)} per month`}>
                  <p className="text-sm font-semibold">Monthly comparison</p>
                  <div className="mt-3 grid gap-3 text-sm">
                    <div>
                      <div className="flex justify-between"><span>Platform fees</span><span className="tabular-nums">{money(result.platformFees)}</span></div>
                      <div className="mt-1 h-5 rounded-sm bg-cream/15">
                        <div className="h-full rounded-sm bg-cream transition-[width] duration-300" style={{ width: pct(result.platformFees) }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between"><span>Alternative-channel costs</span><span className="tabular-nums">{money(result.alternativeCosts)}</span></div>
                      <div className="mt-1 flex h-5 overflow-hidden rounded-sm bg-cream/15">
                        <div className="h-full bg-moss transition-[width] duration-300" style={{ width: pct(result.paymentCosts) }} title="Payment processing" />
                        <div className="h-full bg-dune transition-[width] duration-300" style={{ width: pct(result.fixedCosts) }} title="Software and marketing" />
                      </div>
                      <p className="mt-1.5 flex flex-wrap gap-x-4 text-xs text-cream/80">
                        <span><span className="mr-1.5 inline-block h-2.5 w-2.5 bg-moss" aria-hidden="true" />Payment processing</span>
                        <span><span className="mr-1.5 inline-block h-2.5 w-2.5 bg-dune" aria-hidden="true" />Software and marketing</span>
                      </p>
                    </div>
                  </div>
                </div>

                {result.monthlyDifference <= 0 && (
                  <p className="mt-6 rounded-lg border-2 border-cream/60 p-4 text-sm">
                    With these assumptions, the costs of an independent channel are equal to or higher than the platform
                    fees on the same bookings. That can change as independent bookings grow, but it's worth knowing
                    before you invest.
                  </p>
                )}
              </>
            ) : (
              <p className="reading-sm mt-4">Correct the highlighted fields to see your scenario.</p>
            )}

            <p className="mt-6 border-t border-cream/35 pt-4 text-sm leading-relaxed text-cream/90">
              This calculator provides estimates based on the assumptions you enter. Actual results depend on your
              booking mix, platform fee structure, payment provider, marketing costs, software, and other operating
              expenses. A website does not guarantee additional bookings.
            </p>
          </div>
        </div>
      </div>

      <section id="send" className="mt-16 rule-t pt-12 scroll-mt-24 lg:mt-24">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="heading">Talk through your numbers with us</h2>
            <p className="reading mt-4">
              Send your scenario and we'll use it as the starting point for a consultation. We'll tell you honestly
              whether a direct-booking website looks worthwhile for your business.
            </p>
            {result && (
              <p className="mt-4 text-sm muted">
                We'll receive the figures you entered above, in {currency}.
              </p>
            )}
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            {inputs ? (
              <EnquiryForm kind="calculator" calculator={inputs} />
            ) : (
              <p className="rounded-lg border-2 border-alert p-4 font-semibold text-alert" role="alert">
                Correct the highlighted calculator fields before sending your estimate.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
