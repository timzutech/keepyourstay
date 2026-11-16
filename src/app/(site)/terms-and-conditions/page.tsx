import { LegalPage } from "@/components/LegalPage";
import { getSettings } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Terms and Conditions",
  description: "The terms that apply to using the KeepYourStay website.",
  path: "/terms-and-conditions",
});

export default async function TermsPage() {
  const { business_email } = await getSettings();
  return (
    <LegalPage crumb={{ name: "Terms and conditions", path: "/terms-and-conditions" }} title="Terms and conditions" updated="[date]">
      <h2>About these terms</h2>
      <p>
        These terms apply to your use of this website, operated by KeepYourStay ([legal entity name and registered
        address]). By using the website you agree to them. Services we provide to clients are governed by a separate
        written agreement.
      </p>

      <h2>Information on this website</h2>
      <p>
        Content on this website is general information about vacation rental websites and direct bookings. It is not
        legal, tax or financial advice. We try to keep it accurate but do not guarantee that it is complete or
        current.
      </p>

      <h2>Savings calculator</h2>
      <p>
        The calculator provides estimates based on the assumptions you enter. It is illustrative only. It is not a
        forecast, quotation or guarantee of savings, bookings or revenue.
      </p>

      <h2>No guarantee of results</h2>
      <p>
        A website is one part of a direct-booking strategy. We do not guarantee bookings, revenue, savings or search
        rankings.
      </p>

      <h2>Quotations</h2>
      <p>
        Prices are provided by individual written quotation. Nothing on this website is an offer capable of
        acceptance. A contract is formed only when both parties agree a written scope and quotation.
      </p>

      <h2>Portfolio and concept projects</h2>
      <p>
        Projects labelled “Concept Project — Illustrative Design” are fictional and do not represent client work or
        real businesses.
      </p>

      <h2>Intellectual property</h2>
      <p>
        Unless stated otherwise, the content and design of this website belong to KeepYourStay or its licensors.
        Photographs are used under licence. You may not reproduce them without permission.
      </p>

      <h2>Third-party platforms</h2>
      <p>
        References to booking platforms and other third-party services are for explanation only. We are not
        affiliated with or endorsed by them. Their names and trademarks belong to their owners. You are responsible
        for complying with the terms of any platform you use.
      </p>

      <h2>Liability</h2>
      <p>[Limitation of liability wording, to be drafted in legal review for the relevant jurisdictions.]</p>

      <h2>Governing law</h2>
      <p>[Governing law and jurisdiction.]</p>

      <h2>Contact</h2>
      <p>Questions about these terms: <a href={`mailto:${business_email}`}>{business_email}</a>.</p>
    </LegalPage>
  );
}
