import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { getSettings } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Privacy Policy",
  description: "How KeepYourStay collects, uses and protects personal information submitted through this website.",
  path: "/privacy-policy",
});

export default async function PrivacyPolicyPage() {
  const { business_email } = await getSettings();
  return (
    <LegalPage crumb={{ name: "Privacy policy", path: "/privacy-policy" }} title="Privacy policy" updated="[date]">
      <h2>Who we are</h2>
      <p>
        This website is operated by KeepYourStay ([legal entity name and registered address]). For any privacy
        question, contact <a href={`mailto:${business_email}`}>{business_email}</a>.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li><strong>Enquiry forms.</strong> Your name, email address, business name, country, and the details you choose to give about your property and project. The consultation form can include a WhatsApp number if you provide one.</li>
        <li><strong>Savings calculator.</strong> If you send us your estimate, the figures you entered and the calculated results.</li>
        <li><strong>Newsletter.</strong> Your email address and a record of your consent.</li>
        <li><strong>Spam prevention.</strong> A one-way hash of your IP address, stored with a submission so we can limit repeated automated submissions. We do not store the IP address itself.</li>
        <li><strong>Analytics.</strong> Only if you accept analytics cookies: information about pages visited and approximate location, collected by [analytics provider].</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To reply to your enquiry and prepare a quotation or consultation</li>
        <li>To send the newsletter, if you subscribed</li>
        <li>To protect the website from spam and abuse</li>
        <li>To understand how the website is used, if you consented to analytics</li>
      </ul>
      <p>We do not sell personal information.</p>

      <h2>Legal bases</h2>
      <p>
        [To be confirmed in legal review. Typically: consent for newsletter and analytics; steps prior to entering a
        contract, or legitimate interests, for responding to enquiries; legitimate interests for spam prevention.]
      </p>

      <h2>Who processes data for us</h2>
      <p>We use service providers to run this website. They process data on our instructions:</p>
      <ul>
        <li>Supabase (database and authentication)</li>
        <li>Vercel (website hosting)</li>
        <li>Resend (transactional email)</li>
        <li>[Analytics provider, if enabled]</li>
      </ul>
      <p>[Describe international data transfers and safeguards.]</p>

      <h2>How long we keep it</h2>
      <p>[Retention periods for enquiries, newsletter subscribers and analytics data.]</p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live, you may have the right to access, correct, delete or restrict the use of your
        personal information, to object to its use, and to withdraw consent. To exercise any of these, email{" "}
        <a href={`mailto:${business_email}`}>{business_email}</a>. You can unsubscribe from the newsletter using the
        link in any newsletter email. [Add regulator complaint details for the relevant jurisdictions.]
      </p>

      <h2>Cookies</h2>
      <p>
        See the <Link href="/cookie-policy">cookie policy</Link> for what is stored on your device and how to change
        your choice.
      </p>

      <h2>Changes to this policy</h2>
      <p>We will update this page when our practices change and revise the date at the top.</p>
    </LegalPage>
  );
}
