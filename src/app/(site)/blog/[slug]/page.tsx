import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PostCard } from "@/components/Cards";
import { Cta } from "@/components/Cta";
import { JsonLd } from "@/components/JsonLd";
import { Photo } from "@/components/Photo";
import { servicesForArticle } from "@/content/related";
import { getService } from "@/content/services";
import { formatDate, getPost, getPosts, readingMinutes } from "@/lib/data";
import { articleLd, pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return pageMeta({
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.cover_image,
    type: "article",
    publishedTime: post.published_at,
  });
}

export default async function PostPage({ params }: Props) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const path = `/blog/${post.slug}`;
  const all = await getPosts();
  const related = all
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => Number(b.category?.slug === post.category?.slug) - Number(a.category?.slug === post.category?.slug))
    .slice(0, 3);
  const relatedServices = servicesForArticle(post.slug)
    .map(getService)
    .filter((s) => s !== undefined);

  return (
    <>
      <JsonLd
        data={articleLd({
          title: post.title,
          description: post.seo_description || post.excerpt,
          path,
          image: post.cover_image,
          publishedAt: post.published_at,
          updatedAt: post.updated_at,
        })}
      />
      <article>
        <header className="wrap pt-8 lg:pt-10">
          <Breadcrumbs crumbs={[{ name: "Blog", path: "/blog" }, { name: post.title, path }]} />
          <p className="mt-8 text-sm lg:mt-12">
            {post.category && (
              <>
                <Link href={`/blog?category=${post.category.slug}`} className="font-bold underline decoration-olive underline-offset-4">
                  {post.category.name}
                </Link>
                <span aria-hidden="true" className="muted"> / </span>
              </>
            )}
            <time dateTime={post.published_at} className="muted">{formatDate(post.published_at)}</time>
            <span aria-hidden="true" className="muted"> / </span>
            <span className="muted">{readingMinutes(post.content)} min read</span>
          </p>
          <h1 className="title mt-4 max-w-[20ch]">{post.title}</h1>
          <p className="lede mt-6">{post.excerpt}</p>
        </header>

        {post.cover_image && (
          <div className="wrap mt-10">
            <Photo src={post.cover_image} alt={post.cover_alt ?? ""} ratio="21 / 10" sizes="100vw" priority />
          </div>
        )}

        <div className="wrap grid gap-10 py-14 lg:grid-cols-12 lg:py-20">
          <div className="prose lg:col-span-8 lg:col-start-3 [&>h2:first-child]:mt-0">
            <Markdown
              components={{
                a: ({ href = "", children }) =>
                  href.startsWith("/") ? (
                    <Link href={href}>{children}</Link>
                  ) : (
                    <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
                  ),
                h1: ({ children }) => <h2>{children}</h2>,
              }}
            >
              {post.content}
            </Markdown>

            {relatedServices.length > 0 && (
              <aside className="!mt-12 rounded-lg border-2 border-ink bg-paper p-6 not-prose" aria-labelledby="related-services">
                <h2 id="related-services" className="subheading !mt-0 font-bold">How we can help</h2>
                <ul className="mt-3 grid gap-2">
                  {relatedServices.map((s) => (
                    <li key={s.slug}>
                      <Link href={`/services/${s.slug}`} className="link">{s.name}</Link>
                    </li>
                  ))}
                </ul>
              </aside>
            )}

            {post.tags.length > 0 && (
              <ul className="!mt-12 flex list-none flex-wrap gap-2 !pl-0 font-display" aria-label="Tags">
                {post.tags.map((t) => (
                  <li key={t.slug} className="!mt-0">
                    <Link href={`/blog?tag=${t.slug}`} className="chip !no-underline hover:bg-ink hover:text-cream">{t.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-paper">
          <div className="wrap band-tight">
            <h2 className="heading">Keep reading</h2>
            <div className="mt-8 grid gap-x-8 gap-y-12 md:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Cta preset="calculator" />
    </>
  );
}
