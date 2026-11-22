import { describe, expect, it } from "vitest";
import { seedPosts } from "@/content/blog";
import { articleServices, articlesForService } from "@/content/related";
import { services } from "@/content/services";

describe("article ↔ service links", () => {
  const serviceSlugs = new Set(services.map((s) => s.slug));
  const postSlugs = new Set(seedPosts.map((p) => p.slug));

  it("only points at services and articles that exist", () => {
    for (const [article, linked] of Object.entries(articleServices)) {
      expect(postSlugs.has(article), article).toBe(true);
      for (const s of linked) expect(serviceSlugs.has(s), `${article} → ${s}`).toBe(true);
    }
  });

  it("gives every article and every service at least one link", () => {
    for (const p of seedPosts) expect(articleServices[p.slug]?.length, p.slug).toBeGreaterThan(0);
    for (const s of services) expect(articlesForService(s.slug).length, s.slug).toBeGreaterThan(0);
  });

  it("dates no article before the site launched", () => {
    for (const p of seedPosts) expect(p.published_at >= "2026-11-18", p.slug).toBe(true);
  });
});
