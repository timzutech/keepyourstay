import { AdminForm } from "@/components/admin/AdminForm";
import { AdminHeading, Panel, TextField } from "@/components/admin/Fields";
import { defaultSettings } from "@/lib/site";
import { requireAdmin } from "@/lib/supabase/server";
import { saveSettings } from "../../actions";

export const metadata = { title: "Site settings" };

const socials = ["instagram", "facebook", "linkedin", "x", "youtube", "tiktok"];

export default async function SettingsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  const s = { ...defaultSettings, ...(data ?? {}) };
  const social = (s.social_links ?? {}) as Record<string, string>;

  return (
    <>
      <AdminHeading title="Site settings" />
      <AdminForm action={saveSettings} submitLabel="Save settings" className="mt-6 max-w-3xl">
        <div className="grid gap-6">
          <Panel title="Contact details">
            <TextField name="business_email" label="Business email" type="email" defaultValue={s.business_email} hint="Shown on the site. Lead notifications go to LEAD_NOTIFICATION_EMAIL in your environment settings." />
            <TextField name="whatsapp_number" label="WhatsApp number" defaultValue={s.whatsapp_number} hint="Digits only with country code, for example 19514692722." />
          </Panel>
          <Panel title="Brand and SEO">
            <TextField name="site_title" label="Site title" defaultValue={s.site_title} />
            <TextField name="tagline" label="Tagline" defaultValue={s.tagline} />
            <TextField name="seo_description" label="Default SEO description" defaultValue={s.seo_description} rows={3} hint="Up to 200 characters. Used for the homepage and as a fallback." />
            <TextField name="brand_blurb" label="Brand description" defaultValue={s.brand_blurb} rows={3} hint="Shown in the footer." />
            <TextField name="footer_note" label="Footer note (optional)" defaultValue={s.footer_note} rows={2} hint="For example a company registration line. Don't add an address you don't have." />
          </Panel>
          <Panel title="Social media links">
            {socials.map((k) => (
              <TextField key={k} name={`social_${k}`} label={k === "x" ? "X (Twitter)" : k[0].toUpperCase() + k.slice(1)} defaultValue={social[k] ?? ""} hint={k === "instagram" ? "Full address starting with https://. Leave blank to hide." : undefined} />
            ))}
          </Panel>
        </div>
      </AdminForm>
    </>
  );
}
