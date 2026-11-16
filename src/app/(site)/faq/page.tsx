import { Cta } from "@/components/Cta";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { faqs } from "@/content/faqs";
import { faqLd, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Frequently Asked Questions",
  description:
    "Answers about KeepYourStay: vacation rental websites, booking calendars, payments, PMS connections, costs, timelines and what a website can and can't do.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqLd(faqs)} />
      <PageHeader
        crumbs={[{ name: "FAQ", path: "/faq" }]}
        title="Frequently asked questions"
        lede="Straight answers to what owners ask before starting a website project."
      />
      <section className="wrap pb-20 lg:pb-28">
        <div className="max-w-4xl">
          <FaqList items={faqs} />
        </div>
      </section>
      <Cta preset="discuss" title="Still have a question? Ask us directly." />
    </>
  );
}
