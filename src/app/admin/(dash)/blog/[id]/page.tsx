import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminForm } from "@/components/admin/AdminForm";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { AdminHeading, CheckField, Panel, Saved, SelectField, TextField } from "@/components/admin/Fields";
import { ImageField } from "@/components/admin/ImageFields";
import { requireAdmin } from "@/lib/supabase/server";
import { deletePost, savePost } from "../../../actions";

export const metadata = { title: "Edit article" };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> };

export default async function PostEditor({ params, searchParams }: Props) {
  const { id } = await params;
  const { saved } = await searchParams;
  const isNew = id === "new";
  if (!isNew && !/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { supabase } = await requireAdmin();

  const { data: categories } = await supabase.from("blog_categories").select("id, name").order("name");
  const { data: p } = isNew
    ? { data: null }
    : await supabase.from("blog_posts").select("*, tags:blog_tags(name)").eq("id", id).maybeSingle();
  if (!isNew && !p) notFound();

  const tags = ((p?.tags as { name: string }[] | undefined) ?? []).map((t) => t.name).join(", ");
  const publishedLocal = p?.published_at ? new Date(p.published_at).toISOString().slice(0, 16) : "";

  return (
    <>
      <p className="text-sm"><Link href="/admin/blog" className="link">All articles</Link></p>
      <div className="mt-4">
        <AdminHeading title={isNew ? "Write article" : p!.title}>
          {p?.status === "published" && <Link href={`/blog/${p.slug}`} className="btn btn-outline btn-sm" target="_blank">View on site</Link>}
        </AdminHeading>
      </div>
      <Saved show={saved === "1"} />

      <AdminForm action={savePost} submitLabel={isNew ? "Create article" : "Save article"} className="mt-6">
        <input type="hidden" name="id" value={p?.id ?? ""} />
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="grid content-start gap-6 xl:col-span-2">
            <Panel title="Article">
              <TextField name="title" label="Title" defaultValue={p?.title} required />
              <TextField name="slug" label="URL slug" defaultValue={p?.slug} hint="Leave blank to generate from the title." />
              <TextField name="excerpt" label="Excerpt" defaultValue={p?.excerpt} rows={2} hint="One or two sentences shown on the blog listing." />
              <div>
                <label htmlFor="f-content" className="label">Content</label>
                <textarea id="f-content" name="content" rows={24} className="input font-mono !text-[0.95rem]" defaultValue={p?.content ?? ""} aria-describedby="f-content-hint" />
                <p id="f-content-hint" className="hint">
                  Written in Markdown: “## Heading”, “**bold**”, “- list item”, “[link text](https://…)”. Don't include statistics you can't source.
                </p>
              </div>
            </Panel>
            <Panel title="Search and sharing">
              <TextField name="seo_title" label="SEO title" defaultValue={p?.seo_title} hint="Up to 70 characters. Leave blank to use the article title." />
              <TextField name="seo_description" label="SEO description" defaultValue={p?.seo_description} rows={2} hint="Up to 170 characters. Leave blank to use the excerpt." />
            </Panel>
          </div>

          <div className="grid content-start gap-6">
            <Panel title="Publishing">
              <SelectField
                name="status"
                label="Status"
                defaultValue={p?.status ?? "draft"}
                options={[{ value: "draft", label: "Draft (not public)" }, { value: "published", label: "Published" }]}
              />
              <TextField name="published_at" label="Publish date (UTC)" type="datetime-local" defaultValue={publishedLocal} hint="Leave blank to use the time you publish. A future date schedules the article." />
              <CheckField name="featured" label="Featured" defaultChecked={p?.featured} hint="Shown at the top of the blog." />
            </Panel>
            <Panel title="Organisation">
              <SelectField
                name="category_id"
                label="Category"
                defaultValue={p?.category_id ?? ""}
                options={[{ value: "", label: "No category" }, ...(categories ?? []).map((c) => ({ value: c.id, label: c.name }))]}
              />
              <TextField name="tags" label="Tags" defaultValue={tags} hint="Separate with commas. New tags are created automatically." />
            </Panel>
            <Panel title="Featured image">
              <ImageField name="cover_image" label="Image" folder="blog" defaultValue={p?.cover_image ?? ""} />
              <TextField name="cover_alt" label="Image description" defaultValue={p?.cover_alt} />
            </Panel>
          </div>
        </div>
      </AdminForm>

      {!isNew && (
        <form action={deletePost} className="mt-10 border-t-2 border-ink pt-6">
          <input type="hidden" name="id" value={p!.id} />
          <ConfirmButton label="Delete article" confirm={`Delete “${p!.title}”? This can't be undone.`} />
        </form>
      )}
    </>
  );
}
