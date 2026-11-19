import { EnquiryForm } from "@/components/EnquiryForm";
import { PageHeader } from "@/components/PageHeader";
import { submitTestimonial } from "@/app/actions/testimonials";
import { pageMeta } from "@/lib/seo";

// A private page for clients. It is not linked from the menus, not in the
// sitemap and not indexed. Send the link to a client when a project ends.
export const metadata = pageMeta({
  title: "Share your feedback",
  description: "Tell KeepYourStay how your website project went.",
  path: "/feedback",
  noindex: true,
});

export default function FeedbackPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Feedback", path: "/feedback" }]}
        title="How did your project go?"
        lede="Thank you for working with us. A few honest sentences about your experience help other property owners decide whether we're the right fit for them."
      />
      <section className="wrap grid gap-10 pb-20 lg:grid-cols-12 lg:pb-28">
        <div className="lg:col-span-4">
          <h2 className="subheading font-bold">What happens next</h2>
          <ul className="reading-sm mt-4 grid gap-3">
            <li>We read every reply ourselves.</li>
            <li>We only publish feedback from clients we have worked with, and only with your agreement below.</li>
            <li>We publish your words as you wrote them. We won't edit them to sound better.</li>
            <li>Your email address and full name are never published.</li>
            <li>Changed your mind later? Email us and we'll remove it.</li>
          </ul>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <EnquiryForm kind="testimonial" submit={submitTestimonial} />
        </div>
      </section>
    </>
  );
}
