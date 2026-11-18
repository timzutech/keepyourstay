import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminForm } from "@/components/admin/AdminForm";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { AdminHeading, CheckField, Panel, Saved, SelectField, TextField } from "@/components/admin/Fields";
import { GalleryField, ImageField } from "@/components/admin/ImageFields";
import { services } from "@/content/services";
import { requireAdmin } from "@/lib/supabase/server";
import { deleteProject, saveProject } from "../../../actions";

export const metadata = { title: "Edit project" };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> };

export default async function ProjectEditor({ params, searchParams }: Props) {
  const { id } = await params;
  const { saved } = await searchParams;
  const isNew = id === "new";
  if (!isNew && !/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { supabase } = await requireAdmin();

  const { data: categories } = await supabase.from("portfolio_categories").select("id, name").order("sort_order");
  const { data: p } = isNew
    ? { data: null }
    : await supabase.from("portfolio_projects").select("*, images:portfolio_images(url, alt, sort_order)").eq("id", id).maybeSingle();
  if (!isNew && !p) notFound();

  const join = (a?: string[] | null) => (a ?? []).join("\n");
  const gallery = [...((p?.images as { url: string; alt: string; sort_order: number }[] | undefined) ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => `${i.url} | ${i.alt}`)
    .join("\n");

  return (
    <>
      <p className="text-sm"><Link href="/admin/portfolio" className="link">All projects</Link></p>
      <div className="mt-4">
        <AdminHeading title={isNew ? "Add project" : p!.name}>
          {p?.published && <Link href={`/portfolio/${p.slug}`} className="btn btn-outline btn-sm" target="_blank">View on site</Link>}
        </AdminHeading>
      </div>
      <Saved show={saved === "1"} />

      <AdminForm action={saveProject} submitLabel={isNew ? "Create project" : "Save project"} className="mt-6">
        <input type="hidden" name="id" value={p?.id ?? ""} />
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="grid content-start gap-6 xl:col-span-2">
            <Panel title="Project">
              <TextField name="name" label="Client or project name" defaultValue={p?.name} required />
              <TextField name="slug" label="URL slug" defaultValue={p?.slug} hint="Lowercase words joined by hyphens. Leave blank to generate from the name." />
              <TextField name="summary" label="Short summary" defaultValue={p?.summary} rows={2} hint="One or two sentences. Shown on cards and in search results." />
              <TextField name="overview" label="Property and business overview" defaultValue={p?.overview} rows={5} />
              <TextField name="design_approach" label="Design approach" defaultValue={p?.design_approach} rows={5} />
            </Panel>
            <Panel title="Lists">
              <TextField name="objectives" label="Project objectives" defaultValue={join(p?.objectives)} rows={4} hint="One per line." />
              <TextField name="features" label="Features implemented" defaultValue={join(p?.features)} rows={5} hint="One per line." />
              <TextField name="technologies" label="Technologies and integrations" defaultValue={join(p?.technologies)} rows={3} hint="One per line." />
              <fieldset>
                <legend className="label">Services delivered</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {services.map((s) => (
                    <label key={s.slug} className="flex items-start gap-2.5 text-[0.95rem]">
                      <input type="checkbox" name="services" value={s.slug} className="check" defaultChecked={p?.services?.includes(s.slug)} />
                      {s.short}
                    </label>
                  ))}
                </div>
              </fieldset>
            </Panel>
            <Panel title="Images">
              <ImageField name="cover_image" label="Cover image or main screenshot" folder="portfolio" defaultValue={p?.cover_image ?? ""} />
              <TextField name="cover_alt" label="Cover image description" defaultValue={p?.cover_alt} hint="Describe the image for people using screen readers." />
              <GalleryField name="gallery" folder="portfolio" defaultValue={gallery} />
            </Panel>
            <Panel title="Verified outcomes">
              <p className="text-sm">
                Only add results the client has confirmed and agreed to share. Outcomes appear only on completed
                client projects, and only when marked as verified.
              </p>
              <TextField name="outcomes" label="Outcomes" defaultValue={join(p?.outcomes)} rows={3} hint="One per line. Leave empty if there are none." />
              <CheckField name="outcomes_verified" label="These outcomes are verified by the client" defaultChecked={p?.outcomes_verified} />
            </Panel>
          </div>

          <div className="grid content-start gap-6">
            <Panel title="Type and visibility">
              <SelectField
                name="kind"
                label="Project type"
                defaultValue={p?.kind ?? "completed"}
                options={[
                  { value: "completed", label: "Completed client project" },
                  { value: "concept", label: "Concept project (fictional)" },
                ]}
                hint="Concept projects are always labelled “Concept Project — Illustrative Design”."
              />
              <SelectField
                name="category_id"
                label="Category"
                defaultValue={p?.category_id ?? ""}
                options={[{ value: "", label: "No category" }, ...(categories ?? []).map((c) => ({ value: c.id, label: c.name }))]}
              />
              <TextField name="website_url" label="Live website or demo URL" defaultValue={p?.website_url} hint="For a concept, a working demo site. For a completed project, the client's live site." />
              <CheckField name="client_permission" label="The client has given permission to display this work" defaultChecked={p?.client_permission} hint="Required before a completed project can be published." />
              <CheckField name="published" label="Published" defaultChecked={p?.published} hint="Visible on the public site." />
              <CheckField name="featured" label="Featured" defaultChecked={p?.featured} hint="Shown on the homepage." />
              <TextField name="sort_order" label="Sort order" type="number" defaultValue={p?.sort_order ?? 0} hint="Lower numbers appear first." />
            </Panel>
          </div>
        </div>
      </AdminForm>

      {!isNew && (
        <form action={deleteProject} className="mt-10 border-t-2 border-ink pt-6">
          <input type="hidden" name="id" value={p!.id} />
          <ConfirmButton label="Delete project" confirm={`Delete “${p!.name}”? This can't be undone.`} />
        </form>
      )}
    </>
  );
}
