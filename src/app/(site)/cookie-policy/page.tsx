import Link from "next/link";
import { CookiePreferencesButton } from "@/components/CookieConsent";
import { LegalPage } from "@/components/LegalPage";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Cookie Policy",
  description: "What this website stores on your device, why, and how to change your cookie preferences.",
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  return (
    <LegalPage crumb={{ name: "Cookie policy", path: "/cookie-policy" }} title="Cookie policy" updated="[date]">
      <h2>Your choice</h2>
      <p>
        When you first visit, we ask whether you accept analytics cookies. You can accept, reject, or choose in
        detail. Nothing non-essential is set until you accept, and you can change your mind at any time.
      </p>
      <p>
        <CookiePreferencesButton className="btn btn-outline font-display" />
      </p>

      <h2>Essential storage</h2>
      <p>These are needed for the site to work and are always on:</p>
      <ul>
        <li><strong>kys_consent</strong> (local storage). Remembers your cookie choice so we don't ask on every page.</li>
        <li><strong>Sign-in cookies</strong>. Set only for site administrators who sign in to the dashboard. Visitors never receive them.</li>
      </ul>

      <h2>Analytics cookies</h2>
      <p>
        Only if you accept analytics: Google Analytics 4 sets cookies such as <code>_ga</code> and{" "}
        <code>_ga_*</code> to measure visits and page views. If analytics is not configured on this site, no
        analytics cookies are set whatever you choose.
      </p>

      <h2>Advertising cookies</h2>
      <p>
        Only if you accept advertising: we use the Google Ads tag (cookies such as <code>_gcl_au</code>) and the Meta
        Pixel (cookies such as <code>_fbp</code>) to learn whether someone who clicked one of our ads went on to send
        an enquiry or subscribe. We don't use them to build profiles of visitors ourselves, but Google and Meta
        process this data under their own policies. If these tools are not configured, nothing is set.
      </p>
      <p>[Confirm cookie names and durations once the accounts are set up.]</p>

      <h2>Third-party links</h2>
      <p>
        Links to WhatsApp and other websites take you to services with their own cookie practices, which this policy
        does not cover.
      </p>

      <h2>More information</h2>
      <p>
        See the <Link href="/privacy-policy">privacy policy</Link> for how we handle personal information.
      </p>
    </LegalPage>
  );
}
