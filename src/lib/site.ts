// Central, env-driven defaults. Anything here can be overridden per-deployment
// with environment variables, and most of it again in Admin → Settings.

/** The live site's address. Used for production when no custom-domain address is configured. */
export const PRODUCTION_URL = "https://www.keepyourstay.com";

/**
 * Picks the site's public address (used for canonical links, the sitemap,
 * social previews and email links).
 * - Production on Vercel: NEXT_PUBLIC_SITE_URL if it is set to a custom domain,
 *   otherwise PRODUCTION_URL. A *.vercel.app value is ignored there, so a stale
 *   setting can never point search engines at the wrong host.
 * - Everywhere else (previews, local): NEXT_PUBLIC_SITE_URL, or localhost.
 */
export function resolveSiteUrl(env: { configured?: string; vercelEnv?: string }) {
  const configured = env.configured?.trim().replace(/\/$/, "");
  if (env.vercelEnv === "production") {
    if (configured && !/\.vercel\.app$/i.test(new URL(configured).hostname)) return configured;
    return PRODUCTION_URL;
  }
  return configured || "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl({
  configured: process.env.NEXT_PUBLIC_SITE_URL,
  vercelEnv: process.env.VERCEL_ENV,
});

export type SiteSettings = {
  site_title: string;
  tagline: string;
  seo_description: string;
  business_email: string;
  whatsapp_number: string;
  brand_blurb: string;
  footer_note: string;
  social_links: Record<string, string>;
};

export const defaultSettings: SiteSettings = {
  site_title: "KeepYourStay",
  tagline: "Your property. Your website. Your bookings.",
  seo_description:
    "Vacation rental website design and direct booking websites, with calendars, payments and search basics, so your property has its own booking channel.",
  business_email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "KeepYourStay@gmail.com",
  whatsapp_number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "19514692722",
  brand_blurb:
    "Vacation rental website design and direct-booking solutions for short-term rental businesses worldwide.",
  footer_note: "",
  social_links: {},
};

export function whatsappLink(number: string, message?: string) {
  const digits = number.replace(/\D/g, "");
  const text =
    message ?? "Hello KeepYourStay, I'd like to talk about a website for my rental property.";
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function formatWhatsapp(number: string) {
  const d = number.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) {
    return `+1 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
  }
  return `+${d}`;
}

export const mainNav = [
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Our work" },
  { href: "/direct-booking", label: "Direct booking guide" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const photo = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

// Unsplash photographs, used under the Unsplash licence.
export const photos = {
  villaBay: "photo-1543489822-c49534f3271f",
  villaPool: "photo-1596178067639-5c6e68aea6dc",
  poolTerrace: "photo-1692736933760-8a8a9b8c1b6f",
  villaWhite: "photo-1582610116397-edb318620f90",
  poolLoungers: "photo-1721989518229-3e84837fc398",
  beachHouse: "photo-1511840831832-3efd661c1d0f",
  blueHouse: "photo-1562925246-25f01be5471c",
  cabinMeadow: "photo-1702959638073-3fa29ddb6a98",
  cabinSmoke: "photo-1568729937315-2ef5ee9cf4f2",
  livingRoom: "photo-1628592102751-ba83b0314276",
  sunlitRoom: "photo-1613575831056-0acd5da8f085",
  bedroom: "photo-1590490360182-c33d57733427",
  cotswoldCottage: "photo-1579627559241-aa855a66df15",
  scottishCottage: "photo-1622908382850-34730895ccbb",
};
