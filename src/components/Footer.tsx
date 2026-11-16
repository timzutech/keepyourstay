import Link from "next/link";
import { services } from "@/content/services";
import { formatWhatsapp, whatsappLink, type SiteSettings } from "@/lib/site";
import { CookiePreferencesButton } from "./CookieConsent";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";

const company = [
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Our work" },
  { href: "/pricing", label: "Pricing and quotes" },
  { href: "/direct-booking", label: "Direct booking guide" },
  { href: "/savings-calculator", label: "Savings calculator" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Footer({ settings }: { settings: SiteSettings }) {
  const social = Object.entries(settings.social_links).filter(([, url]) => url);
  return (
    <footer className="bg-sand">
      <div className="wrap rule-b grid gap-8 py-12 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5">
          <h2 className="heading">Practical notes on direct bookings, a few times a year.</h2>
          <p className="reading-sm mt-3 max-w-[32em] muted">
            Articles on vacation rental websites, calendars and search visibility. Unsubscribe whenever you like.
          </p>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <NewsletterForm />
        </div>
      </div>

      <div className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
        <div className="sm:col-span-2 lg:col-span-4">
          <Logo />
          <p className="mt-4 text-lg font-semibold tracking-tight">{settings.tagline}</p>
          <p className="reading-sm mt-3 max-w-[30em] muted">{settings.brand_blurb}</p>
          {settings.footer_note && <p className="reading-sm mt-3 max-w-[30em] muted">{settings.footer_note}</p>}
        </div>

        <nav aria-label="Services" className="lg:col-span-3">
          <h2 className="text-sm font-bold">Services</h2>
          <ul className="mt-4 grid gap-2.5 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="hover:underline underline-offset-4">{s.short}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company" className="lg:col-span-2">
          <h2 className="text-sm font-bold">Company</h2>
          <ul className="mt-4 grid gap-2.5 text-sm">
            {company.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:underline underline-offset-4">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="text-sm font-bold">Contact</h2>
          <ul className="mt-4 grid gap-2.5 text-sm">
            <li>
              <a href={`mailto:${settings.business_email}`} className="break-all hover:underline underline-offset-4">
                {settings.business_email}
              </a>
            </li>
            <li>
              <a href={whatsappLink(settings.whatsapp_number)} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">
                WhatsApp {formatWhatsapp(settings.whatsapp_number)}
              </a>
            </li>
            {social.map(([name, url]) => (
              <li key={name}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="capitalize hover:underline underline-offset-4">
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="wrap rule-t flex flex-col gap-4 py-6 text-sm lg:flex-row lg:items-center lg:justify-between">
        <p>© {new Date().getFullYear()} {settings.site_title}. All rights reserved.</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li><Link href="/privacy-policy" className="hover:underline underline-offset-4">Privacy policy</Link></li>
          <li><Link href="/terms-and-conditions" className="hover:underline underline-offset-4">Terms and conditions</Link></li>
          <li><Link href="/cookie-policy" className="hover:underline underline-offset-4">Cookie policy</Link></li>
          <li><CookiePreferencesButton className="cursor-pointer hover:underline underline-offset-4" /></li>
        </ul>
      </div>
    </footer>
  );
}
