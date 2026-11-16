import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminForm } from "@/components/admin/AdminForm";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { AdminHeading, CheckField, Panel, TextField } from "@/components/admin/Fields";
import { requireAdmin } from "@/lib/supabase/server";
import { deleteTestimonial, saveTestimonial } from "../../../actions";

export const metadata = { title: "Edit testimonial" };

export default async function TestimonialEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  if (!isNew && !/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { supabase } = await requireAdmin();
  const { data: t } = isNew ? { data: null } : await supabase.from("testimonials").select("*").eq("id", id).maybeSingle();
  if (!isNew && !t) notFound();

  return (
    <>
      <p className="text-sm"><Link href="/admin/testimonials" className="link">All testimonials</Link></p>
      <div className="mt-4"><AdminHeading title={isNew ? "Add testimonial" : "Edit testimonial"} /></div>

      <AdminForm action={saveTestimonial} submitLabel={isNew ? "Add testimonial" : "Save testimonial"} className="mt-6 max-w-3xl">
        <input type="hidden" name="id" value={t?.id ?? ""} />
        <div className="grid gap-6">
          <Panel title="Testimonial">
            <TextField name="quote" label="What the client said" defaultValue={t?.quote} rows={5} hint="Use their words exactly. Don't edit for effect." required />
            <TextField name="author_name" label="Client name" defaultValue={t?.author_name} required />
            <TextField name="author_role" label="Role (optional)" defaultValue={t?.author_role} hint="For example: Owner." />
            <TextField name="business_name" label="Business or property (optional)" defaultValue={t?.business_name} />
          </Panel>
          <Panel title="Verification and visibility">
            <CheckField name="verified" label="This is a genuine testimonial from a real client" defaultChecked={t?.verified} />
            <CheckField name="client_approved" label="The client approved publishing it with this attribution" defaultChecked={t?.client_approved} />
            <CheckField name="published" label="Published" defaultChecked={t?.published} hint="Both boxes above must be ticked first." />
            <TextField name="sort_order" label="Sort order" type="number" defaultValue={t?.sort_order ?? 0} />
          </Panel>
        </div>
      </AdminForm>

      {!isNew && (
        <form action={deleteTestimonial} className="mt-10 max-w-3xl border-t-2 border-ink pt-6">
          <input type="hidden" name="id" value={t!.id} />
          <ConfirmButton label="Delete testimonial" confirm="Delete this testimonial? This can't be undone." />
        </form>
      )}
    </>
  );
}
