import type { Metadata } from "next";
import { siteUrl } from "./site";

const SITE_NAME = "KeepYourStay";

export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string;
  noindex?: boolean;
}): Metadata {
  const url = `${siteUrl}${opts.path === "/" ? "" : opts.path}` || siteUrl;
  // Pages without a photograph of their own share the default branded card.
  const images = [{ url: opts.image || `${siteUrl}/opengraph-image`, ...(opts.image ? {} : { width: 1200, height: 630 }) }];
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    robots: opts.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE_NAME,
      type: opts.type ?? "website",
      locale: "en_US",
      ...(opts.publishedTime ? { publishedTime: opts.publishedTime } : {}),
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: images.map((i) => i.url),
    },
  };
}

export type Crumb = { name: string; path: string };

export const breadcrumbLd = (crumbs: Crumb[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [{ name: "Home", path: "/" }, ...crumbs].map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.name,
    item: `${siteUrl}${c.path === "/" ? "" : c.path}`,
  })),
});

export const organizationLd = (s: { business_email: string; seo_description: string; social_links: Record<string, string> }) => ({
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  "@id": `${siteUrl}/#organization`,
  name: SITE_NAME,
  url: siteUrl,
  description: s.seo_description,
  slogan: "Your property. Your website. Your bookings.",
  email: s.business_email,
  areaServed: ["US", "GB", "CA", "AU", "Worldwide"],
  ...(Object.values(s.social_links).filter(Boolean).length
    ? { sameAs: Object.values(s.social_links).filter(Boolean) }
    : {}),
});

export const websiteLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: SITE_NAME,
  url: siteUrl,
  publisher: { "@id": `${siteUrl}/#organization` },
});

export const serviceLd = (s: { name: string; description: string; path: string }) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: s.name,
  description: s.description,
  url: `${siteUrl}${s.path}`,
  provider: { "@id": `${siteUrl}/#organization` },
  areaServed: "Worldwide",
});

export const articleLd = (a: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  publishedAt: string;
  updatedAt?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: a.title,
  description: a.description,
  mainEntityOfPage: `${siteUrl}${a.path}`,
  datePublished: a.publishedAt,
  dateModified: a.updatedAt ?? a.publishedAt,
  ...(a.image ? { image: [a.image] } : {}),
  author: { "@id": `${siteUrl}/#organization` },
  publisher: { "@id": `${siteUrl}/#organization` },
});

export const faqLd = (items: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});
