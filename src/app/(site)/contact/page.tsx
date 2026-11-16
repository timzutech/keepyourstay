import Link from "next/link";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PageHeader } from "@/components/PageHeader";
import { WhatsAppLink } from "@/components/WhatsApp";
import { getSettings } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { formatWhatsapp } from "@/lib/site";

export const metadata = pageMeta({
  title: "Contact KeepYourStay",
  description:
    "Send a message, request a custom quote for your vacation rental website, or book a consultation. Email and WhatsApp also available.",
  path: "/contact",
});

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Contact", path: "/contact" }]}
        title="Tell us about your property"
        lede="Send a quick message, give us the details for a quotation, or ask for a consultation. Whichever you choose, a person reads it and replies."
      >
        <nav aria-label="Contact options" className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href="#message" className="btn btn-outline">Send a message</a>
          <a href="#project" className="btn btn-primary">Request a Custom Quote</a>
          <a href="#consultation" className="btn btn-outline">Book a Website Consultation</a>
        </nav>
      </PageHeader>

      <section className="bg-sand">
        <div className="wrap band-tight grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="subheading font-bold">Email</h2>
            <p className="mt-2">
              <a href={`mailto:${settings.business_email}`} className="break-all text-2xl font-bold tracking-tight underline decoration-olive decoration-2 underline-offset-4 hover:decoration-current">
                {settings.business_email}
              </a>
            </p>
            <p className="reading-sm mt-3 muted">We usually reply within two working days.</p>
          </div>
          <div>
            <h2 className="subheading font-bold">WhatsApp</h2>
            <p className="mt-2 text-2xl font-bold tracking-tight">{formatWhatsapp(settings.whatsapp_number)}</p>
            <WhatsAppLink number={settings.whatsapp_number} className="btn btn-forest mt-4">
              Start a WhatsApp chat
            </WhatsAppLink>
            <p className="reading-sm mt-3 muted">Opens a chat with a message ready to send. You can edit it first.</p>
          </div>
        </div>
      </section>

      <section id="message" className="wrap band scroll-mt-20 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="title">Send a message</h2>
          <p className="reading mt-5">For general questions, or if you're not sure yet what you need.</p>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <EnquiryForm kind="contact" />
        </div>
      </section>

      <section id="project" className="scroll-mt-20 bg-paper">
        <div className="wrap band grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="title">Request a custom quote</h2>
            <p className="reading mt-5">
              Tell us about the property and what you need. The more detail you give, the more accurate the quotation.
            </p>
            <p className="mt-5 text-sm muted">
              Not sure which services you need? Tick your best guess and say so in the details. See{" "}
              <Link href="/services" className="underline underline-offset-4">all services</Link>.
            </p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <EnquiryForm kind="project" />
          </div>
        </div>
      </section>

      <section id="consultation" className="wrap band scroll-mt-20 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="title">Book a website consultation</h2>
          <p className="reading mt-5">
            A conversation about your booking channels and whether a website of your own makes sense. We'll confirm a
            time by email.
          </p>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <EnquiryForm kind="consultation" />
        </div>
      </section>
    </>
  );
}
