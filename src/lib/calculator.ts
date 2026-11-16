export type Currency = "USD" | "GBP";

export type CalculatorInputs = {
  monthlyRevenue: number;        // total monthly booking revenue
  independentSharePct: number;   // % that could realistically be acquired independently
  platformFeePct: number;        // platform fee rate the owner currently pays
  paymentFeePct: number;         // payment processing rate on direct bookings
  softwareCost: number;          // booking software / website cost per month
  marketingCost: number;         // optional monthly marketing cost
  currency: Currency;
};

export type CalculatorResult = {
  independentRevenue: number;
  platformFees: number;
  paymentCosts: number;
  fixedCosts: number;
  alternativeCosts: number;
  monthlyDifference: number;
  annualDifference: number;
};

export const calculatorDefaults: CalculatorInputs = {
  monthlyRevenue: 8000,
  independentSharePct: 20,
  platformFeePct: 15,
  paymentFeePct: 3,
  softwareCost: 60,
  marketingCost: 100,
  currency: "USD",
};

export const calculatorLimits = {
  monthlyRevenue: { min: 0, max: 10_000_000 },
  independentSharePct: { min: 0, max: 100 },
  platformFeePct: { min: 0, max: 100 },
  paymentFeePct: { min: 0, max: 100 },
  softwareCost: { min: 0, max: 1_000_000 },
  marketingCost: { min: 0, max: 1_000_000 },
} as const;

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

/**
 * Illustrative scenario only — not a forecast.
 *
 *   independent revenue = monthly revenue × independent share
 *   platform fees       = independent revenue × platform fee rate
 *   payment costs       = independent revenue × payment processing rate
 *   monthly difference  = platform fees − payment costs − software − marketing
 */
export function calculate(i: CalculatorInputs): CalculatorResult {
  const independentRevenue = i.monthlyRevenue * (i.independentSharePct / 100);
  const platformFees = independentRevenue * (i.platformFeePct / 100);
  const paymentCosts = independentRevenue * (i.paymentFeePct / 100);
  const fixedCosts = i.softwareCost + i.marketingCost;
  const alternativeCosts = paymentCosts + fixedCosts;
  const monthlyDifference = platformFees - alternativeCosts;
  return {
    independentRevenue: round2(independentRevenue),
    platformFees: round2(platformFees),
    paymentCosts: round2(paymentCosts),
    fixedCosts: round2(fixedCosts),
    alternativeCosts: round2(alternativeCosts),
    monthlyDifference: round2(monthlyDifference),
    annualDifference: round2(monthlyDifference * 12),
  };
}

export function formatMoney(amount: number, currency: Currency) {
  return new Intl.NumberFormat(currency === "GBP" ? "en-GB" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
