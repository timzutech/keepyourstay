import Link from "next/link";
import { formatDate, readingMinutes } from "@/lib/data";
import type { Post, Project } from "@/lib/types";
import { Photo } from "./Photo";

export function KindLabel({ kind }: { kind: Project["kind"] }) {
  return kind === "concept" ? (
    <span className="chip chip-solid">Concept Project — Illustrative Design</span>
  ) : (
    <span className="chip chip-forest">Completed client project</span>
  );
}

export function ProjectCard({ project, ratio = "4 / 3", sizes }: { project: Project; ratio?: string; sizes?: string }) {
  return (
    <article className="group relative">
      {project.cover_image ? (
        <Photo src={project.cover_image} alt={project.cover_alt ?? ""} ratio={ratio} sizes={sizes} />
      ) : (
        <div className="photo" style={{ aspectRatio: ratio }} />
      )}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <KindLabel kind={project.kind} />
        {project.category && <span className="chip">{project.category.name}</span>}
      </div>
      <h3 className="heading mt-3">
        <Link href={`/portfolio/${project.slug}`} className="after:absolute after:inset-0 group-hover:underline decoration-2 underline-offset-4">
          {project.name}
        </Link>
      </h3>
      <p className="reading-sm mt-2 max-w-[34em] muted">{project.summary}</p>
    </article>
  );
}

export function PostCard({ post, large = false }: { post: Post; large?: boolean }) {
  return (
    <article className="group relative">
      {post.cover_image && (
        <Photo
          src={post.cover_image}
          alt={post.cover_alt ?? ""}
          ratio={large ? "16 / 10" : "3 / 2"}
          sizes={large ? "(min-width: 64rem) 60vw, 100vw" : "(min-width: 64rem) 33vw, 100vw"}
        />
      )}
      <p className="mt-4 text-sm muted">
        {post.category && <span className="font-semibold text-ink">{post.category.name}</span>}
        {post.category && <span aria-hidden="true"> / </span>}
        <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
        <span aria-hidden="true"> / </span>
        {readingMinutes(post.content)} min read
      </p>
      <h3 className={`${large ? "heading" : "subheading font-bold"} mt-2`}>
        <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 group-hover:underline decoration-2 underline-offset-4">
          {post.title}
        </Link>
      </h3>
      <p className="reading-sm mt-2 muted">{post.excerpt}</p>
    </article>
  );
}
