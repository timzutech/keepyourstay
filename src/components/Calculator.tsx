"use client";

import { useEffect, useMemo, useState } from "react";
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
type FieldDef = { key: NumericKey; label: string; hint: string; kind: "money" | "percent"; step: number; optional?: boolean };

const step1: FieldDef[] = [
  {
    key: "monthlyRevenue",
    label: "Your monthly booking revenue",
    hint: "Roughly what guests pay you in a typical month, across all platforms.",
    kind: "money",
    step: 100,
  },
  {
    key: "platformFeePct",
    label: "Percentage the booking platform takes",
    hint: "Find it on your payout statement. It depends on your platform and fee plan.",
    kind: "percent",
    step: 0.5,
  },
];

const costFields: FieldDef[] = [
  { key: "paymentFeePct", label: "Card payment fee", hint: "Charged by your payment provider on direct bookings.", kind: "percent", step: 0.1 },
  { key: "softwareCost", label: "Website and booking software per month", hint: "Hosting, booking tool and upkeep.", kind: "money", step: 10 },
  { key: "marketingCost", label: "Marketing per month", hint: "Ads, email tools and so on. Leave at 0 if none.", kind: "money", step: 10, optional: true },
];

const allFields = [...step1, { key: "independentSharePct", kind: "percent" } as FieldDef, ...costFields];
const SHARE_PRESETS = [10, 25, 50];

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
  const [nextYear, setNextYear] = useState<string | null>(null);
  useEffect(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    setNextYear(d.toLocaleDateString("en-US", { month: "long", year: "numeric" }));
  }, []);
  const set = (key: NumericKey, value: string) => setRaw((r) => ({ ...r, [key]: value }));

  const errors = useMemo(() => {
    const e: Partial<Record<NumericKey, string>> = {};
    for (const f of allFields) {
      const text = raw[f.key].trim();
      const n = Number(text);
      const { min, max } = calculatorLimits[f.key];
      if (text === "" && f.optional) continue;
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
  const r = inputs ? calculate(inputs) : null;
  const money = (n: number) => formatMoney(n, currency);
  const signed = (n: number) => `${n < 0 ? "−" : ""}${money(Math.abs(n))}`;
  const symbol = currency === "GBP" ? "£" : "$";

  const field = (f: FieldDef) => (
    <div key={f.key}>
      <label htmlFor={`calc-${f.key}`} className="label">{f.label}</label>
      <div className="relative">
        {f.kind === "money" && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold" aria-hidden="true">{symbol}</span>
        )}
        <input
          id={`calc-${f.key}`}
          type="number"
          inputMode="decimal"
          min={calculatorLimits[f.key].min}
          max={calculatorLimits[f.key].max}
          step={f.step}
          value={raw[f.key]}
          onChange={(e) => set(f.key, e.target.value)}
          className={`input ${f.kind === "money" ? "pl-8" : "pr-10"}`}
          aria-invalid={errors[f.key] ? true : undefined}
          aria-describedby={`calc-${f.key}-hint${errors[f.key] ? ` calc-${f.key}-error` : ""}`}
        />
        {f.kind === "percent" && (
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 font-semibold" aria-hidden="true">%</span>
        )}
      </div>
      <p id={`calc-${f.key}-hint`} className="hint">{f.hint}</p>
      {errors[f.key] && <p id={`calc-${f.key}-error`} className="field-error">{errors[f.key]}</p>}
    </div>
  );

  const share = Number(raw.independentSharePct);

  return (
    <div>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <form className="lg:col-span-6" noValidate onSubmit={(e) => e.preventDefault()} aria-label="Savings calculator">
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

          <h2 className="subheading mt-10 font-bold"><span className="text-forest">Step 1.</span> What you pay the platforms now</h2>
          <div className="mt-4 grid gap-5">{step1.map(field)}</div>

          <h2 className="subheading mt-10 font-bold"><span className="text-forest">Step 2.</span> If some guests booked on your own website</h2>
          <fieldset className="mt-4" aria-describedby="share-hint">
            <legend className="label">Share of your bookings made on your own website</legend>
            <div className="flex flex-wrap items-center gap-2">
              {SHARE_PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => set("independentSharePct", String(p))}
                  aria-pressed={share === p}
                  className={`rounded-full border-2 border-ink px-4 py-2 text-sm font-bold ${share === p ? "bg-ink text-cream" : ""}`}
                >
                  {p}%
                </button>
              ))}
              <div className="relative w-28">
                <label htmlFor="calc-independentSharePct" className="sr-only">Custom percentage</label>
                <input
                  id="calc-independentSharePct"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={100}
                  step={1}
                  value={raw.independentSharePct}
                  onChange={(e) => set("independentSharePct", e.target.value)}
                  className="input pr-9"
                  aria-invalid={errors.independentSharePct ? true : undefined}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-semibold" aria-hidden="true">%</span>
              </div>
            </div>
            <p id="share-hint" className="hint">
              Guests who find you directly: returning guests, referrals, Google and social media. Start small; most
              owners build this up over time.
            </p>
            {errors.independentSharePct && <p className="field-error">{errors.independentSharePct}</p>}
          </fieldset>

        </form>

        <div className="lg:col-span-6">
          <div className="on-dark rounded-xl bg-forest p-6 text-cream sm:p-8 lg:sticky lg:top-24" aria-live="polite">
            {r && inputs ? (
              <>
                <p className="font-semibold">Platform fees you pay now</p>
                <p className="mt-1 text-[clamp(2rem,5vw,2.8rem)] font-bold leading-none tracking-tight tabular-nums [font-stretch:85%]">
                  {money(r.totalPlatformFees)}
                  <span className="text-lg font-semibold"> a month</span>
                </p>
                <p className="mt-1 text-cream/85">{money(r.totalPlatformFees * 12)} a year</p>

                <h2 className="heading mt-8 border-t border-cream/35 pt-6">If {inputs.independentSharePct}% booked on your website</h2>
                <dl className="mt-4">
                  <div className="rule-t flex items-baseline justify-between gap-4 py-3">
                    <dt>Platform fees you'd keep</dt>
                    <dd className="text-xl font-bold tabular-nums">{money(r.platformFees)}</dd>
                  </div>
                  <div className="rule-t flex items-baseline justify-between gap-4 py-3">
                    <dt>Card payment fees ({inputs.paymentFeePct}%)</dt>
                    <dd className="text-xl font-bold tabular-nums">−{money(r.paymentCosts)}</dd>
                  </div>
                  <div className="rule-t py-4">
                    <dt className="font-semibold">You could save about</dt>
                    <dd className="mt-1 text-[clamp(2.6rem,7vw,4rem)] font-bold leading-none tracking-tight tabular-nums [font-stretch:85%]">
                      {signed(r.monthlyDifference)}
                      <span className="text-xl font-semibold"> a month</span>
                    </dd>
                  </div>
                </dl>

                {r.monthlyDifference > 0 && (
                  <div className="mt-2 rounded-lg bg-cream p-5 text-ink sm:p-6">
                    <p className="font-semibold">{nextYear ? `By ${nextYear}, you could keep about` : "Over the next 12 months, you could keep about"}</p>
                    <p className="mt-1 text-[clamp(2.6rem,7vw,4rem)] font-bold leading-none tracking-tight text-forest tabular-nums [font-stretch:85%]">
                      {money(r.annualDifference)}
                    </p>
                    <div className="mt-5 flex h-20 items-end gap-1" role="img" aria-label={`Savings building up month by month to ${money(r.annualDifference)} after 12 months`}>
                      {Array.from({ length: 12 }, (_, m) => (
                        <div key={m} className="flex-1 rounded-t-sm bg-forest/80" style={{ height: `${((m + 1) / 12) * 100}%` }} />
                      ))}
                    </div>
                    <p className="mt-2 flex justify-between text-xs text-stone">
                      <span>Month 1: {money(r.monthlyDifference)}</span>
                      <span>Month 12: {money(r.annualDifference)}</span>
                    </p>
                    <a href="#send" className="btn mt-5 w-full justify-center border-ink bg-ink text-cream hover:bg-forest hover:border-forest">Get my own booking website</a>
                  </div>
                )}

                <p className="mt-4 text-sm text-cream/80">
                  Includes the {inputs.paymentFeePct}% card payment fee your payment provider charges on direct bookings.
                </p>

                {r.monthlyDifference <= 0 && (
                  <p className="mt-6 rounded-lg border-2 border-cream/60 p-4 text-sm">
                    With a platform fee this low, card payment fees on direct bookings would cost about the same as, or
                    more than, the fees you'd keep.
                  </p>
                )}
              </>
            ) : (
              <p className="reading-sm">Correct the highlighted fields to see your numbers.</p>
            )}

            <p className="mt-6 border-t border-cream/35 pt-4 text-sm leading-relaxed text-cream/90">
              This is an estimate based on the figures you enter, not a promise. Your real savings depend on how many
              guests book with you directly, your platform's fees, your payment provider and your other costs. A
              website does not guarantee extra bookings.
            </p>
          </div>
        </div>
      </div>

      <section id="send" className="mt-16 rule-t pt-12 scroll-mt-24 lg:mt-24">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="heading">Talk through your numbers with us</h2>
            <p className="reading mt-4">
              Send your estimate and we'll use it as the starting point for a consultation. We'll tell you honestly
              whether a direct booking website looks worthwhile for your business.
            </p>
            {r && <p className="mt-4 text-sm muted">We'll receive the figures you entered above, in {currency}.</p>}
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
