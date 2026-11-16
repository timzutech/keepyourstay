import Link from "next/link";
import { AdminForm } from "@/components/admin/AdminForm";
import { AdminHeading, Panel } from "@/components/admin/Fields";
import { formatDate } from "@/lib/data";
import { requireAdmin } from "@/lib/supabase/server";
import { addCategory } from "../../actions";

export const metadata = { title: "Blog" };

export default async function AdminBlog() {
  const { supabase } = await requireAdmin();
  const [{ data: posts }, { data: categories }] = await Promise.all([
    supabase.from("blog_posts").select("id, title, status, featured, published_at, updated_at, category:blog_categories(name)").order("updated_at", { ascending: false }),
    supabase.from("blog_categories").select("id, name").order("name"),
  ]);

  return (
    <>
      <AdminHeading title="Blog">
        <Link href="/admin/blog/new" className="btn btn-primary btn-sm">Write article</Link>
      </AdminHeading>

      {posts?.length ? (
        <div className="mt-6 overflow-x-auto rounded-xl border-2 border-ink bg-paper">
          <table className="w-full min-w-[40rem] text-left text-[0.95rem]">
            <thead className="bg-sand text-sm">
              <tr>
                <th scope="col" className="p-3">Article</th>
                <th scope="col" className="p-3">Category</th>
                <th scope="col" className="p-3">Status</th>
                <th scope="col" className="p-3">Published</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-t border-ink/20 hover:bg-sand/50">
                  <td className="p-3">
                    <Link href={`/admin/blog/${p.id}`} className="font-bold underline decoration-olive underline-offset-4">{p.title}</Link>
                    {p.featured && <span className="chip ml-2">Featured</span>}
                  </td>
                  <td className="p-3">{(p.category as unknown as { name: string } | null)?.name ?? "—"}</td>
                  <td className="p-3"><span className={`chip ${p.status === "published" ? "chip-forest" : ""}`}>{p.status === "published" ? "Published" : "Draft"}</span></td>
                  <td className="p-3 whitespace-nowrap">{p.published_at ? formatDate(p.published_at) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-6 rounded-xl border-2 border-dashed border-ink/40 p-8">
          No articles yet. Write one, or import the starter content from the overview page.
        </p>
      )}

      <div className="mt-8 max-w-xl">
        <Panel title="Article categories">
          <ul className="flex flex-wrap gap-2">
            {categories?.map((c) => <li key={c.id} className="chip">{c.name}</li>)}
          </ul>
          <AdminForm action={addCategory} submitLabel="Add category" resetOnSuccess>
            <input type="hidden" name="table" value="blog" />
            <label htmlFor="cat-name" className="label">New category name</label>
            <input id="cat-name" name="name" className="input" />
          </AdminForm>
        </Panel>
      </div>
    </>
  );
}
