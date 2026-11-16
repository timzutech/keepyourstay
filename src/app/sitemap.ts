import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { getPosts, getProjects } from "@/lib/data";
import { siteUrl } from "@/lib/site";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  const staticPaths = [
    "", "/about", "/services", "/portfolio", "/pricing", "/direct-booking", "/savings-calculator",
    "/blog", "/contact", "/faq", "/privacy-policy", "/terms-and-conditions", "/cookie-policy",
  ];
  return [
    ...staticPaths.map((p) => ({
      url: `${siteUrl}${p}`,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : p === "/savings-calculator" || p === "/services" ? 0.9 : 0.7,
    })),
    ...services.map((s) => ({ url: `${siteUrl}/services/${s.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...projects.map((p) => ({ url: `${siteUrl}/portfolio/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...posts.map((p) => ({
      url: `${siteUrl}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at ?? p.published_at),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
