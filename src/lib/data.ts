import { cache } from "react";
import { blogCategories as seedBlogCategories, seedPosts } from "@/content/blog";
import { conceptProjects, portfolioCategories as seedCategories } from "@/content/portfolio";
import { defaultSettings, type SiteSettings } from "./site";
import { publicClient } from "./supabase/public";
import type { BlogCategory, PortfolioCategory, Post, Project, Testimonial } from "./types";

// Public content readers. Each reads published rows from Supabase through the
// anon key (Row Level Security applies). When Supabase is not connected yet, or
// a read fails, they fall back to the bundled starter content so the site still
// renders. Testimonials never fall back: none are shown unless they are real.

function warn(what: string, error: unknown) {
  console.error(`[data] Could not load ${what} from Supabase; using starter content.`, error);
}

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const db = publicClient();
  if (!db) return defaultSettings;
  const { data, error } = await db.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error || !data) {
    if (error) warn("site settings", error);
    return defaultSettings;
  }
  return { ...defaultSettings, ...data, social_links: data.social_links ?? {} };
});

export const getPortfolioCategories = cache(async (): Promise<PortfolioCategory[]> => {
  const db = publicClient();
  if (!db) return seedCategories;
  const { data, error } = await db.from("portfolio_categories").select("slug, name").order("sort_order");
  if (error) {
    warn("portfolio categories", error);
    return seedCategories;
  }
  return data;
});

export const getProjects = cache(async (): Promise<Project[]> => {
  const db = publicClient();
  if (!db) return conceptProjects;
  const { data, error } = await db
    .from("portfolio_projects")
    .select("*, category:portfolio_categories(slug, name), images:portfolio_images(url, alt, sort_order)")
    .eq("published", true)
    .order("sort_order")
    .order("created_at", { ascending: false });
  if (error) {
    warn("portfolio projects", error);
    return conceptProjects;
  }
  return data.map((p) => ({
    ...p,
    images: [...(p.images ?? [])].sort((a, b) => a.sort_order - b.sort_order),
  })) as Project[];
});

export async function getProject(slug: string) {
  return (await getProjects()).find((p) => p.slug === slug) ?? null;
}

export const getPosts = cache(async (): Promise<Post[]> => {
  const db = publicClient();
  const seeds = [...seedPosts].sort((a, b) => b.published_at.localeCompare(a.published_at));
  if (!db) return seeds;
  const { data, error } = await db
    .from("blog_posts")
    .select("*, category:blog_categories(slug, name), tags:blog_tags(slug, name)")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });
  if (error) {
    warn("blog posts", error);
    return seeds;
  }
  return data as Post[];
});

export async function getPost(slug: string) {
  return (await getPosts()).find((p) => p.slug === slug) ?? null;
}

export const getBlogCategories = cache(async (): Promise<BlogCategory[]> => {
  const db = publicClient();
  if (!db) return seedBlogCategories;
  const { data, error } = await db.from("blog_categories").select("slug, name").order("name");
  if (error) {
    warn("blog categories", error);
    return seedBlogCategories;
  }
  return data;
});

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const db = publicClient();
  if (!db) return [];
  const { data, error } = await db
    .from("testimonials")
    .select("id, quote, author_name, author_role, business_name")
    .eq("published", true)
    .order("sort_order");
  if (error) return [];
  return data;
});

export function readingMinutes(markdown: string) {
  return Math.max(1, Math.round(markdown.split(/\s+/).length / 220));
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(iso),
  );
}
