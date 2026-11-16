"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { seedPosts } from "@/content/blog";
import { conceptProjects, realProjectPlaceholders } from "@/content/portfolio";
import { services } from "@/content/services";
import { requireAdmin, sessionClient } from "@/lib/supabase/server";
import { ENQUIRY_STATUSES } from "@/lib/types";

// Every action below starts with requireAdmin(): it verifies the session with
// Supabase Auth and checks admin_profiles. Writes then go through the admin's
// own session, so Row Level Security enforces the same rule in the database.

export type AdminState = { ok: boolean; message: string } | null;

const fail = (message: string): AdminState => ({ ok: false, message });
const done = (message: string): AdminState => ({ ok: true, message });

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

const lines = (v: FormDataEntryValue | null) =>
  String(v ?? "").split("\n").map((l) => l.trim()).filter(Boolean);

const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const checked = (fd: FormData, key: string) => fd.get(key) === "on";
const optionalUrl = z.union([z.literal(""), z.url({ protocol: /^https?$/, error: "Enter a full web address starting with https://" })]);

function refreshSite() {
  revalidatePath("/", "layout");
}

// ───────────── Auth ─────────────

export async function signIn(_prev: AdminState, fd: FormData): Promise<AdminState> {
  const supabase = await sessionClient();
  if (!supabase) return fail("Supabase isn't configured. Add the Supabase environment variables, then try again.");
  const parsed = z.object({ email: z.email(), password: z.string().min(1) }).safeParse({
    email: text(fd, "email"),
    password: String(fd.get("password") ?? ""),
  });
  if (!parsed.success) return fail("Enter your email address and password.");

  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) return fail("That email and password don't match an account.");

  const { data: profile } = await supabase.from("admin_profiles").select("id").eq("id", data.user.id).maybeSingle();
  if (!profile) {
    await supabase.auth.signOut();
    return fail("This account doesn't have admin access.");
  }
  redirect("/admin");
}

export async function signOut() {
  const supabase = await sessionClient();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}

// ───────────── Enquiries ─────────────

export async function updateEnquiryStatus(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(fd, "id");
  const status = text(fd, "status");
  if (!ENQUIRY_STATUSES.some((s) => s.value === status)) return;
  await supabase.from("enquiries").update({ status }).eq("id", id);
  revalidatePath("/admin", "layout");
}

export async function addEnquiryNote(_prev: AdminState, fd: FormData): Promise<AdminState> {
  const { supabase, user } = await requireAdmin();
  const body = text(fd, "body");
  if (!body) return fail("Write a note before saving.");
  if (body.length > 5000) return fail("Keep notes under 5,000 characters.");
  const { error } = await supabase.from("enquiry_notes").insert({
    enquiry_id: text(fd, "enquiry_id"),
    author_id: user.id,
    author_email: user.email,
    body,
  });
  if (error) return fail("The note couldn't be saved. Try again.");
  revalidatePath("/admin", "layout");
  return done("Note saved.");
}

export async function deleteEnquiry(fd: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("enquiries").delete().eq("id", text(fd, "id"));
  revalidatePath("/admin", "layout");
  redirect("/admin/enquiries");
}

// ───────────── Portfolio ─────────────

const projectSchema = z.object({
  name: z.string().min(1, "Give the project a name.").max(120),
  slug: z.string().min(1).max(80),
  kind: z.enum(["concept", "completed"]),
  summary: z.string().max(400),
  website_url: optionalUrl,
  cover_image: optionalUrl,
  sort_order: z.coerce.number().int().min(0).max(9999),
});

export async function saveProject(_prev: AdminState, fd: FormData): Promise<AdminState> {
  const { supabase } = await requireAdmin();
  const id = text(fd, "id");
  const name = text(fd, "name");
  const parsed = projectSchema.safeParse({
    name,
    slug: slugify(text(fd, "slug") || name),
    kind: text(fd, "kind"),
    summary: text(fd, "summary"),
    website_url: text(fd, "website_url"),
    cover_image: text(fd, "cover_image"),
    sort_order: text(fd, "sort_order") || "0",
  });
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  const published = checked(fd, "published");
  const clientPermission = checked(fd, "client_permission");
  const outcomes = lines(fd.get("outcomes"));
  const outcomesVerified = checked(fd, "outcomes_verified");
  if (parsed.data.kind === "completed" && published && !clientPermission) {
    return fail("A completed client project can only be published once you've confirmed the client's permission to display it.");
  }
  if (parsed.data.kind === "concept" && parsed.data.website_url) {
    return fail("Concept projects are fictional, so they can't have a live website URL. Remove the URL or mark the project as completed.");
  }
  if (outcomes.length && !outcomesVerified) {
    return fail("Tick “These outcomes are verified” or remove the outcomes. Unverified results are never published.");
  }
  if (outcomes.length && parsed.data.kind === "concept") {
    return fail("Concept projects are fictional and can't have outcomes. Remove them or mark the project as completed.");
  }

  const row = {
    ...parsed.data,
    website_url: parsed.data.website_url || null,
    cover_image: parsed.data.cover_image || null,
    cover_alt: text(fd, "cover_alt") || null,
    category_id: text(fd, "category_id") || null,
    overview: text(fd, "overview"),
    design_approach: text(fd, "design_approach"),
    objectives: lines(fd.get("objectives")),
    features: lines(fd.get("features")),
    technologies: lines(fd.get("technologies")),
    services: fd.getAll("services").map(String).filter((s) => services.some((x) => x.slug === s)),
    outcomes,
    outcomes_verified: outcomesVerified,
    client_permission: clientPermission,
    featured: checked(fd, "featured"),
    published,
  };

  const query = id
    ? supabase.from("portfolio_projects").update(row).eq("id", id).select("id").single()
    : supabase.from("portfolio_projects").insert(row).select("id").single();
  const { data, error } = await query;
  if (error || !data) {
    return fail(error?.code === "23505" ? "Another project already uses that URL slug. Choose a different one." : "The project couldn't be saved. Try again.");
  }

  // Gallery: one image per line, "url | alt text".
  const gallery = lines(fd.get("gallery")).map((line, i) => {
    const [url, ...alt] = line.split("|");
    return { project_id: data.id, url: url.trim(), alt: alt.join("|").trim(), sort_order: i };
  });
  if (gallery.some((g) => !/^https:\/\//.test(g.url))) {
    return fail("Each gallery line must start with a full https:// image address.");
  }
  await supabase.from("portfolio_images").delete().eq("project_id", data.id);
  if (gallery.length) {
    const { error: imgError } = await supabase.from("portfolio_images").insert(gallery);
    if (imgError) return fail("The project was saved, but its gallery images couldn't be. Try saving again.");
  }

  refreshSite();
  redirect(`/admin/portfolio/${data.id}?saved=1`);
}

export async function deleteProject(fd: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("portfolio_projects").delete().eq("id", text(fd, "id"));
  refreshSite();
  redirect("/admin/portfolio");
}

export async function addCategory(_prev: AdminState, fd: FormData): Promise<AdminState> {
  const { supabase } = await requireAdmin();
  const table = text(fd, "table") === "blog" ? "blog_categories" : "portfolio_categories";
  const name = text(fd, "name");
  if (!name) return fail("Enter a category name.");
  const { error } = await supabase.from(table).insert({ name, slug: slugify(name) });
  if (error) return fail(error.code === "23505" ? "That category already exists." : "The category couldn't be added.");
  refreshSite();
  return done(`Added “${name}”.`);
}

// ───────────── Blog ─────────────

const postSchema = z.object({
  title: z.string().min(1, "Give the article a title.").max(160),
  slug: z.string().min(1).max(80),
  excerpt: z.string().max(400),
  status: z.enum(["draft", "published"]),
  cover_image: optionalUrl,
  seo_title: z.string().max(70, "Keep the SEO title under 70 characters."),
  seo_description: z.string().max(170, "Keep the SEO description under 170 characters."),
});

export async function savePost(_prev: AdminState, fd: FormData): Promise<AdminState> {
  const { supabase } = await requireAdmin();
  const id = text(fd, "id");
  const title = text(fd, "title");
  const parsed = postSchema.safeParse({
    title,
    slug: slugify(text(fd, "slug") || title),
    excerpt: text(fd, "excerpt"),
    status: text(fd, "status"),
    cover_image: text(fd, "cover_image"),
    seo_title: text(fd, "seo_title"),
    seo_description: text(fd, "seo_description"),
  });
  if (!parsed.success) return fail(parsed.error.issues[0].message);
  const content = String(fd.get("content") ?? "");
  if (parsed.data.status === "published" && !content.trim()) return fail("Write the article before publishing it.");

  const publishedInput = text(fd, "published_at");
  const publishedAt = publishedInput ? new Date(publishedInput) : null;
  if (publishedAt && Number.isNaN(publishedAt.getTime())) return fail("Enter a valid publish date.");

  const row = {
    ...parsed.data,
    content,
    cover_image: parsed.data.cover_image || null,
    cover_alt: text(fd, "cover_alt") || null,
    category_id: text(fd, "category_id") || null,
    featured: checked(fd, "featured"),
    seo_title: parsed.data.seo_title || null,
    seo_description: parsed.data.seo_description || null,
    published_at:
      parsed.data.status === "published" ? (publishedAt ?? new Date()).toISOString() : publishedAt?.toISOString() ?? null,
  };

  const query = id
    ? supabase.from("blog_posts").update(row).eq("id", id).select("id").single()
    : supabase.from("blog_posts").insert(row).select("id").single();
  const { data, error } = await query;
  if (error || !data) {
    return fail(error?.code === "23505" ? "Another article already uses that URL slug. Choose a different one." : "The article couldn't be saved. Try again.");
  }

  // Tags: comma-separated names. New ones are created on the fly.
  const names = Array.from(new Set(text(fd, "tags").split(",").map((t) => t.trim()).filter(Boolean))).slice(0, 12);
  await supabase.from("blog_post_tags").delete().eq("post_id", data.id);
  if (names.length) {
    const tagRows = names.map((name) => ({ name, slug: slugify(name) })).filter((t) => t.slug);
    await supabase.from("blog_tags").upsert(tagRows, { onConflict: "slug", ignoreDuplicates: true });
    const { data: tags } = await supabase.from("blog_tags").select("id, slug").in("slug", tagRows.map((t) => t.slug));
    if (tags?.length) {
      await supabase.from("blog_post_tags").insert(tags.map((t) => ({ post_id: data.id, tag_id: t.id })));
    }
  }

  refreshSite();
  redirect(`/admin/blog/${data.id}?saved=1`);
}

export async function deletePost(fd: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("blog_posts").delete().eq("id", text(fd, "id"));
  refreshSite();
  redirect("/admin/blog");
}

// ───────────── Testimonials ─────────────

export async function saveTestimonial(_prev: AdminState, fd: FormData): Promise<AdminState> {
  const { supabase } = await requireAdmin();
  const id = text(fd, "id");
  const row = {
    quote: text(fd, "quote"),
    author_name: text(fd, "author_name"),
    author_role: text(fd, "author_role") || null,
    business_name: text(fd, "business_name") || null,
    verified: checked(fd, "verified"),
    client_approved: checked(fd, "client_approved"),
    published: checked(fd, "published"),
    sort_order: Number(text(fd, "sort_order") || 0) || 0,
  };
  if (!row.quote || !row.author_name) return fail("Enter the testimonial and the name of the person who gave it.");
  if (row.published && !(row.verified && row.client_approved)) {
    return fail("A testimonial can only be published once you've confirmed it is genuine and that the client approved its use.");
  }
  const { error } = id
    ? await supabase.from("testimonials").update(row).eq("id", id)
    : await supabase.from("testimonials").insert(row);
  if (error) return fail("The testimonial couldn't be saved. Try again.");
  refreshSite();
  redirect("/admin/testimonials?saved=1");
}

export async function deleteTestimonial(fd: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("testimonials").delete().eq("id", text(fd, "id"));
  refreshSite();
  redirect("/admin/testimonials");
}

// ───────────── Site settings ─────────────

const SOCIAL_KEYS = ["instagram", "facebook", "linkedin", "x", "youtube", "tiktok"] as const;

const settingsSchema = z.object({
  site_title: z.string().min(1, "Enter a site title.").max(80),
  tagline: z.string().max(120),
  seo_description: z.string().min(1, "Enter a default SEO description.").max(200, "Keep the SEO description under 200 characters."),
  business_email: z.email("Enter a valid business email address."),
  whatsapp_number: z.string().regex(/^\d{8,15}$/, "Enter the WhatsApp number as digits only, with country code and no “+” (for example 19514692722)."),
  brand_blurb: z.string().max(400),
  footer_note: z.string().max(400),
});

export async function saveSettings(_prev: AdminState, fd: FormData): Promise<AdminState> {
  const { supabase } = await requireAdmin();
  const parsed = settingsSchema.safeParse({
    site_title: text(fd, "site_title"),
    tagline: text(fd, "tagline"),
    seo_description: text(fd, "seo_description"),
    business_email: text(fd, "business_email"),
    whatsapp_number: text(fd, "whatsapp_number").replace(/[\s+()-]/g, ""),
    brand_blurb: text(fd, "brand_blurb"),
    footer_note: text(fd, "footer_note"),
  });
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  const social: Record<string, string> = {};
  for (const key of SOCIAL_KEYS) {
    const url = text(fd, `social_${key}`);
    if (!url) continue;
    if (!optionalUrl.safeParse(url).success) return fail(`Enter the full ${key} address, starting with https://`);
    social[key] = url;
  }

  const { error } = await supabase.from("site_settings").update({ ...parsed.data, social_links: social }).eq("id", 1);
  if (error) return fail("Settings couldn't be saved. Try again.");
  refreshSite();
  return done("Settings saved. The public site has been refreshed.");
}

// ───────────── Starter content ─────────────

/**
 * Copies the bundled concept projects and articles into the database, and adds
 * unpublished placeholders for real client projects. Existing slugs are skipped,
 * so it is safe to run more than once.
 */
export async function importStarterContent(_prev: AdminState, _fd: FormData): Promise<AdminState> {
  void _fd;
  const { supabase } = await requireAdmin();

  const { data: pCats } = await supabase.from("portfolio_categories").select("id, slug");
  const { data: bCats } = await supabase.from("blog_categories").select("id, slug");
  const pCat = (slug?: string) => pCats?.find((c) => c.slug === slug)?.id ?? null;
  const bCat = (slug?: string) => bCats?.find((c) => c.slug === slug)?.id ?? null;

  const { data: existingProjects } = await supabase.from("portfolio_projects").select("slug");
  const haveProject = new Set(existingProjects?.map((p) => p.slug));
  let projectsAdded = 0;

  for (const [i, p] of conceptProjects.entries()) {
    if (haveProject.has(p.slug)) continue;
    const { images, category, ...rest } = p;
    const { data, error } = await supabase
      .from("portfolio_projects")
      .insert({ ...rest, category_id: pCat(category?.slug), published: true, sort_order: i + 1 })
      .select("id")
      .single();
    if (error || !data) return fail(`Import stopped at “${p.name}”: ${error?.message ?? "unknown error"}`);
    if (images.length) {
      await supabase.from("portfolio_images").insert(images.map((img, n) => ({ ...img, project_id: data.id, sort_order: n })));
    }
    projectsAdded++;
  }

  for (const ph of realProjectPlaceholders) {
    if (haveProject.has(ph.slug)) continue;
    const { error } = await supabase.from("portfolio_projects").insert({
      ...ph,
      kind: "completed",
      published: false,
      client_permission: false,
      summary: "",
      sort_order: 0,
    });
    if (!error) projectsAdded++;
  }

  const { data: existingPosts } = await supabase.from("blog_posts").select("slug");
  const havePost = new Set(existingPosts?.map((p) => p.slug));
  let postsAdded = 0;

  const allTags = Array.from(new Map(seedPosts.flatMap((p) => p.tags).map((t) => [t.slug, t])).values());
  await supabase.from("blog_tags").upsert(allTags, { onConflict: "slug", ignoreDuplicates: true });
  const { data: tags } = await supabase.from("blog_tags").select("id, slug");

  for (const post of seedPosts) {
    if (havePost.has(post.slug)) continue;
    const { tags: postTags, category, ...rest } = post;
    const { data, error } = await supabase
      .from("blog_posts")
      .insert({ ...rest, category_id: bCat(category?.slug), status: "published" })
      .select("id")
      .single();
    if (error || !data) return fail(`Import stopped at “${post.title}”: ${error?.message ?? "unknown error"}`);
    const links = postTags
      .map((t) => tags?.find((x) => x.slug === t.slug)?.id)
      .filter(Boolean)
      .map((tag_id) => ({ post_id: data.id, tag_id }));
    if (links.length) await supabase.from("blog_post_tags").insert(links);
    postsAdded++;
  }

  refreshSite();
  revalidatePath("/admin", "layout");
  return done(
    projectsAdded || postsAdded
      ? `Imported ${projectsAdded} portfolio entries and ${postsAdded} articles.`
      : "Nothing to import. The starter content is already in the database.",
  );
}
