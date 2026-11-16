import Link from "next/link";
import { PostCard } from "@/components/Cards";
import { PageHeader } from "@/components/PageHeader";
import { getBlogCategories, getPosts } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

const PAGE_SIZE = 6;

type Search = { q?: string; category?: string; tag?: string; page?: string };
type Props = { searchParams: Promise<Search> };

export async function generateMetadata({ searchParams }: Props) {
  const sp = await searchParams;
  const filtered = Boolean(sp.q || sp.category || sp.tag || (sp.page && sp.page !== "1"));
  return pageMeta({
    title: "Blog — Vacation Rental Websites and Direct Bookings",
    description:
      "Practical articles for short-term rental owners on direct bookings, website design, booking calendars, SEO and guest trust.",
    path: "/blog",
    // Filtered and paginated views point to the main listing and stay out of the index.
    noindex: filtered,
  });
}

function href(base: Search, patch: Search) {
  const merged = { ...base, ...patch };
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(merged)) if (v && !(k === "page" && v === "1")) params.set(k, v);
  const qs = params.toString();
  return qs ? `/blog?${qs}` : "/blog";
}

export default async function BlogPage({ searchParams }: Props) {
  const sp = await searchParams;
  const [posts, categories] = await Promise.all([getPosts(), getBlogCategories()]);
  const q = (sp.q ?? "").trim().slice(0, 80);
  const needle = q.toLowerCase();

  const tags = Array.from(new Map(posts.flatMap((p) => p.tags).map((t) => [t.slug, t])).values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const activeCategory = categories.find((c) => c.slug === sp.category);
  const activeTag = tags.find((t) => t.slug === sp.tag);
  const isFiltered = Boolean(q || activeCategory || activeTag);

  const matches = posts.filter(
    (p) =>
      (!activeCategory || p.category?.slug === activeCategory.slug) &&
      (!activeTag || p.tags.some((t) => t.slug === activeTag.slug)) &&
      (!needle || `${p.title} ${p.excerpt} ${p.content}`.toLowerCase().includes(needle)),
  );

  const featured = isFiltered ? [] : posts.filter((p) => p.featured).slice(0, 2);
  const rest = isFiltered ? matches : matches.filter((p) => !featured.includes(p));
  const pageCount = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));
  const page = Math.min(pageCount, Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1));
  const visible = rest.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const base: Search = { q: q || undefined, category: activeCategory?.slug, tag: activeTag?.slug };

  return (
    <>
      <PageHeader
        crumbs={[{ name: "Blog", path: "/blog" }]}
        title="Notes for rental owners building a channel of their own"
        lede="Practical writing on direct bookings, websites, calendars and search. No invented statistics."
      />

      <div className="wrap pb-20 lg:pb-28">
        <div className="rule-t rule-b grid gap-5 py-6 lg:grid-cols-12 lg:items-end">
          <form action="/blog" method="get" role="search" className="lg:col-span-5">
            <label htmlFor="blog-search" className="label">Search articles</label>
            <div className="flex gap-2">
              <input id="blog-search" name="q" type="search" defaultValue={q} className="input" maxLength={80} />
              {activeCategory && <input type="hidden" name="category" value={activeCategory.slug} />}
              <button type="submit" className="btn btn-primary">Search</button>
            </div>
          </form>
          <nav aria-label="Article categories" className="lg:col-span-7">
            <p className="label">Categories</p>
            <ul className="flex flex-wrap gap-2">
              <li>
                <Link href={href(base, { category: undefined, page: undefined })} className={`btn btn-sm ${activeCategory ? "btn-outline" : "btn-primary"}`} aria-current={activeCategory ? undefined : "true"}>
                  All
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={href(base, { category: c.slug, page: undefined })}
                    className={`btn btn-sm ${activeCategory?.slug === c.slug ? "btn-primary" : "btn-outline"}`}
                    aria-current={activeCategory?.slug === c.slug ? "true" : undefined}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {isFiltered && (
          <p className="mt-6" role="status">
            {matches.length} {matches.length === 1 ? "article" : "articles"}
            {q && <> matching “{q}”</>}
            {activeCategory && <> in {activeCategory.name}</>}
            {activeTag && <> tagged {activeTag.name}</>}.{" "}
            <Link href="/blog" className="link">Clear filters</Link>
          </p>
        )}

        {featured.length > 0 && page === 1 && (
          <section aria-labelledby="featured-heading" className="mt-12">
            <h2 id="featured-heading" className="heading">Featured articles</h2>
            <div className="mt-8 grid gap-x-8 gap-y-12 lg:grid-cols-2">
              {featured.map((p) => (
                <PostCard key={p.slug} post={p} large />
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="all-heading" className="mt-16">
          <h2 id="all-heading" className="heading">{isFiltered ? "Results" : "Latest articles"}</h2>
          {visible.length ? (
            <div className="mt-8 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {visible.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-lg border-2 border-dashed border-ink/40 p-8">
              <p className="subheading font-bold">No articles match that search.</p>
              <p className="reading-sm mt-2 muted">Try a different word, or browse everything.</p>
              <Link href="/blog" className="btn btn-outline btn-sm mt-4">Show all articles</Link>
            </div>
          )}
        </section>

        {pageCount > 1 && (
          <nav aria-label="Pagination" className="mt-14 flex items-center justify-between gap-4 rule-t pt-6">
            {page > 1 ? (
              <Link href={href(base, { page: String(page - 1) })} className="btn btn-outline btn-sm" rel="prev">Newer articles</Link>
            ) : <span />}
            <p className="text-sm font-semibold">Page {page} of {pageCount}</p>
            {page < pageCount ? (
              <Link href={href(base, { page: String(page + 1) })} className="btn btn-outline btn-sm" rel="next">Older articles</Link>
            ) : <span />}
          </nav>
        )}

        {tags.length > 0 && (
          <nav aria-label="Article tags" className="mt-16">
            <h2 className="subheading font-bold">Browse by tag</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {tags.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={href({}, { tag: t.slug })}
                    className={`chip hover:bg-ink hover:text-cream ${activeTag?.slug === t.slug ? "chip-solid" : ""}`}
                    aria-current={activeTag?.slug === t.slug ? "true" : undefined}
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </>
  );
}
