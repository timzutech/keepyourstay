import Link from "next/link";
import { AdminForm } from "@/components/admin/AdminForm";
import { AdminHeading, Panel } from "@/components/admin/Fields";
import { requireAdmin } from "@/lib/supabase/server";
import { addCategory } from "../../actions";

export const metadata = { title: "Portfolio" };

export default async function AdminPortfolio() {
  const { supabase } = await requireAdmin();
  const [{ data: projects }, { data: categories }] = await Promise.all([
    supabase.from("portfolio_projects").select("id, name, slug, kind, published, featured, sort_order, category:portfolio_categories(name)").order("sort_order").order("created_at", { ascending: false }),
    supabase.from("portfolio_categories").select("id, name").order("sort_order"),
  ]);

  return (
    <>
      <AdminHeading title="Portfolio">
        <Link href="/admin/portfolio/new" className="btn btn-primary btn-sm">Add project</Link>
      </AdminHeading>

      {projects?.length ? (
        <div className="mt-6 overflow-x-auto rounded-xl border-2 border-ink bg-paper">
          <table className="w-full min-w-[40rem] text-left text-[0.95rem]">
            <thead className="bg-sand text-sm">
              <tr>
                <th scope="col" className="p-3">Project</th>
                <th scope="col" className="p-3">Type</th>
                <th scope="col" className="p-3">Category</th>
                <th scope="col" className="p-3">Visibility</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-t border-ink/20 hover:bg-sand/50">
                  <td className="p-3">
                    <Link href={`/admin/portfolio/${p.id}`} className="font-bold underline decoration-olive underline-offset-4">{p.name}</Link>
                    {p.featured && <span className="chip ml-2">Featured</span>}
                  </td>
                  <td className="p-3">{p.kind === "concept" ? "Concept" : "Completed client project"}</td>
                  <td className="p-3">{(p.category as unknown as { name: string } | null)?.name ?? "—"}</td>
                  <td className="p-3">
                    <span className={`chip ${p.published ? "chip-forest" : ""}`}>{p.published ? "Published" : "Unpublished"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-6 rounded-xl border-2 border-dashed border-ink/40 p-8">
          No projects yet. Add one, or import the starter content from the overview page.
        </p>
      )}

      <div className="mt-8 max-w-xl">
        <Panel title="Project categories">
          <ul className="flex flex-wrap gap-2">
            {categories?.map((c) => <li key={c.id} className="chip">{c.name}</li>)}
          </ul>
          <AdminForm action={addCategory} submitLabel="Add category" resetOnSuccess>
            <input type="hidden" name="table" value="portfolio" />
            <label htmlFor="cat-name" className="label">New category name</label>
            <input id="cat-name" name="name" className="input" />
          </AdminForm>
        </Panel>
      </div>
    </>
  );
}
