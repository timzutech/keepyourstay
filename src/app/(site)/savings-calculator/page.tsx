import { Calculator } from "@/components/Calculator";
import { PageHeader } from "@/components/PageHeader";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Potential Savings Calculator for Vacation Rentals",
  description:
    "Estimate how platform fees on independently sourced bookings compare with the costs of your own booking channel. Enter your own assumptions, in USD or GBP.",
  path: "/savings-calculator",
});

export default function SavingsCalculatorPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Savings calculator", path: "/savings-calculator" }]}
        title="Calculate your potential savings"
        lede="Compare the platform fees on bookings you could realistically win independently with the costs of running your own booking channel. Every figure is yours to change."
      >
        <p className="mt-4 max-w-[46em] text-sm muted">
          This models only the share of bookings you might attract independently, for example through search,
          referrals and returning guests. It does not assume existing platform bookings can or should be moved.
        </p>
      </PageHeader>

      <section className="wrap pb-20 lg:pb-28">
        <Calculator />
      </section>

      <section className="bg-sand">
        <div className="wrap band-tight grid gap-8 lg:grid-cols-12">
          <h2 className="heading lg:col-span-4">How the estimate is worked out</h2>
          <ol className="rule-t reading-sm text-[1.05rem] lg:col-span-7 lg:col-start-6">
            <li className="rule-b py-3.5"><strong>Independent booking revenue</strong> = monthly booking revenue × the independent share you entered.</li>
            <li className="rule-b py-3.5"><strong>Illustrative platform fees</strong> = that revenue × the platform fee rate you entered.</li>
            <li className="rule-b py-3.5"><strong>Payment costs</strong> = that revenue × the payment processing rate you entered.</li>
            <li className="rule-b py-3.5"><strong>Net difference</strong> = platform fees − payment costs − software costs − marketing costs.</li>
            <li className="rule-b py-3.5"><strong>Annualised difference</strong> = the monthly net difference × 12.</li>
          </ol>
        </div>
      </section>
    </>
  );
}
