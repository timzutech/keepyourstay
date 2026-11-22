import { Calculator } from "@/components/Calculator";
import { PageHeader } from "@/components/PageHeader";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Potential Savings Calculator for Vacation Rentals",
  description:
    "Enter your monthly revenue and platform fee to see what you pay in booking fees, and how much you could save when guests book on your own website. USD or GBP.",
  path: "/savings-calculator",
});

export default function SavingsCalculatorPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Savings calculator", path: "/savings-calculator" }]}
        title="Calculate your potential savings"
        lede="Enter your monthly booking revenue and the percentage your booking platform takes. See what you pay in fees now, and how much you could save each month when some guests book on your own website."
      >
        <p className="mt-4 max-w-[46em] text-sm muted">
          Your own website works alongside the platforms. The saving comes from guests who find and book with you
          directly, such as returning guests and referrals, not from moving bookings that start on a platform.
        </p>
      </PageHeader>

      <section className="wrap pb-20 lg:pb-28">
        <Calculator />
      </section>

      <section className="bg-sand">
        <div className="wrap band-tight grid gap-8 lg:grid-cols-12">
          <h2 className="heading lg:col-span-4">How the estimate is worked out</h2>
          <ol className="rule-t reading-sm text-[1.05rem] lg:col-span-7 lg:col-start-6">
            <li className="rule-b py-3.5"><strong>Platform fees you pay now</strong> = monthly revenue × the platform percentage.</li>
            <li className="rule-b py-3.5"><strong>Direct booking revenue</strong> = monthly revenue × the share booked on your own website.</li>
            <li className="rule-b py-3.5"><strong>Fees you'd keep</strong> = direct booking revenue × the platform percentage.</li>
            <li className="rule-b py-3.5"><strong>Monthly saving</strong> = fees you'd keep − the 3% card payment fee on those direct bookings.</li>
            <li className="rule-b py-3.5"><strong>Yearly saving</strong> = monthly saving × 12.</li>
          </ol>
        </div>
      </section>
    </>
  );
}
