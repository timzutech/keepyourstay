import { describe, expect, it } from "vitest";
import { calculate, formatMoney } from "@/lib/calculator";

const base = {
  monthlyRevenue: 10000,
  independentSharePct: 20,
  platformFeePct: 15,
  paymentFeePct: 3,
  softwareCost: 60,
  marketingCost: 100,
  currency: "USD" as const,
};

describe("savings calculator", () => {
  it("follows the published formulas", () => {
    const r = calculate(base);
    expect(r.totalPlatformFees).toBe(1500); // 10,000 × 15%
    expect(r.independentRevenue).toBe(2000); // 10,000 × 20%
    expect(r.platformFees).toBe(300); // 2,000 × 15%
    expect(r.paymentCosts).toBe(60); // 2,000 × 3%
    expect(r.fixedCosts).toBe(160);
    expect(r.alternativeCosts).toBe(220);
    expect(r.monthlyDifference).toBe(80); // 300 − 60 − 60 − 100
    expect(r.annualDifference).toBe(960);
  });

  it("reports a negative difference when costs exceed fees", () => {
    const r = calculate({ ...base, independentSharePct: 5 });
    expect(r.platformFees).toBe(75);
    expect(r.monthlyDifference).toBe(-100);
    expect(r.annualDifference).toBe(-1200);
  });

  it("handles zero revenue and zero share", () => {
    expect(calculate({ ...base, monthlyRevenue: 0 }).monthlyDifference).toBe(-160);
    expect(calculate({ ...base, independentSharePct: 0, softwareCost: 0, marketingCost: 0 }).monthlyDifference).toBe(0);
  });

  it("rounds to cents", () => {
    const r = calculate({ ...base, monthlyRevenue: 3333.33, independentSharePct: 33.3, platformFeePct: 15.5 });
    expect(Number.isInteger(Math.round(r.platformFees * 100))).toBe(true);
    expect(r.platformFees).toBeCloseTo(172.05, 2);
  });

  it("formats both currencies", () => {
    expect(formatMoney(1234, "USD")).toBe("$1,234");
    expect(formatMoney(1234, "GBP")).toBe("£1,234");
  });
});
