import { CookieConsent } from "@/components/CookieConsent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppIcon } from "@/components/WhatsApp";
import { getSettings } from "@/lib/data";
import { organizationLd, websiteLd } from "@/lib/seo";
import { whatsappLink } from "@/lib/site";

// Published content is cached and refreshed every five minutes; saving anything
// in the admin dashboard also refreshes it immediately.
export const revalidate = 300;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <JsonLd data={[organizationLd(settings), websiteLd()]} />
      <Header />
      <main id="main">{children}</main>
      <Footer settings={settings} />
      <a
        href={whatsappLink(settings.whatsapp_number)}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 z-30 inline-flex h-12 items-center gap-2 rounded-full border-2 border-ink bg-forest px-4 text-sm font-bold text-cream shadow-[3px_3px_0_0_#000] hover:bg-forest-deep"
      >
        <WhatsAppIcon />
        <span>WhatsApp us</span>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      <CookieConsent gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || undefined} />
    </>
  );
}
