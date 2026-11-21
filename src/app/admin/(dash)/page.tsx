import Link from "next/link";
import { AdminForm } from "@/components/admin/AdminForm";
import { AdminHeading, Panel } from "@/components/admin/Fields";
import { formatDate } from "@/lib/data";
import { isEmailConfigured, missingEmailSettings } from "@/lib/email";
import { requireAdmin } from "@/lib/supabase/server";
import { importStarterContent } from "../actions";

export const metadata = { title: "Overview" };

export default async function AdminOverview() {
  const { supabase } = await requireAdmin();
  const count = (table: string, filter?: [string, string]) => {
    let q = supabase.from(table).select("id", { count: "exact", head: true });
    if (filter) q = q.eq(filter[0], filter[1]);
    return q.then((r) => r.count ?? 0);
  };

  const [total, fresh, contact, project, consultation, projects, posts, subscribers, recentEnquiries, recentProjects, recentPosts] =
    await Promise.all([
      count("enquiries"),
      count("enquiries", ["status", "new"]),
      count("enquiries", ["type", "contact"]),
      count("enquiries", ["type", "project"]),
      count("enquiries", ["type", "consultation"]),
      count("portfolio_projects"),
      count("blog_posts"),
      count("newsletter_subscribers", ["status", "subscribed"]),
      supabase.from("enquiries").select("id, full_name, type, created_at").order("created_at", { ascending: false }).limit(6),
      supabase.from("portfolio_projects").select("id, name, updated_at").order("updated_at", { ascending: false }).limit(4),
      supabase.from("blog_posts").select("id, title, updated_at").order("updated_at", { ascending: false }).limit(4),
    ]);

  const activity = [
    ...(recentEnquiries.data ?? []).map((e) => ({ at: e.created_at, text: `New ${e.type} enquiry from ${e.full_name}`, href: `/admin/enquiries/${e.id}` })),
    ...(recentProjects.data ?? []).map((p) => ({ at: p.updated_at, text: `Portfolio project updated: ${p.name}`, href: `/admin/portfolio/${p.id}` })),
    ...(recentPosts.data ?? []).map((p) => ({ at: p.updated_at, text: `Article updated: ${p.title}`, href: `/admin/blog/${p.id}` })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 10);

  const stats = [
    { label: "Total enquiries", value: total, href: "/admin/enquiries" },
    { label: "New enquiries", value: fresh, href: "/admin/enquiries?status=new" },
    { label: "Contact requests", value: contact, href: "/admin/enquiries?type=contact" },
    { label: "Project enquiries", value: project, href: "/admin/enquiries?type=project" },
    { label: "Consultation requests", value: consultation, href: "/admin/enquiries?type=consultation" },
    { label: "Portfolio projects", value: projects, href: "/admin/portfolio" },
    { label: "Blog posts", value: posts, href: "/admin/blog" },
    { label: "Newsletter subscribers", value: subscribers, href: "/admin/subscribers" },
  ];

  return (
    <>
      <AdminHeading title="Overview" />

      {!isEmailConfigured() && (
        <div role="note" className="mt-6 rounded-lg border-2 border-alert bg-paper p-4 text-alert">
          <p className="font-semibold">
            Email notifications are off. Enquiries are being saved here, but nothing is emailed yet.
          </p>
          <p className="mt-2 text-sm">
            Missing on this deployment: <strong>{missingEmailSettings().join(" and ")}</strong>. In Vercel, add{" "}
            {missingEmailSettings().length > 1 ? "them" : "it"} under Settings → Environment Variables with
            &ldquo;Production&rdquo; ticked, then redeploy. Settings only take effect on deployments made after you
            save them.
          </p>
        </div>
      )}

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <li key={s.label}>
            <Link href={s.href} className="block rounded-xl border-2 border-ink bg-paper p-5 hover:bg-sand">
              <p className="text-[2.6rem] font-bold leading-none tabular-nums [font-stretch:85%]">{s.value}</p>
              <p className="mt-2 text-sm font-semibold">{s.label}</p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <Panel title="Recent activity">
          {activity.length ? (
            <ul className="rule-t -mt-1">
              {activity.map((a) => (
                <li key={a.href + a.at} className="rule-b flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <Link href={a.href} className="font-semibold hover:underline underline-offset-4">{a.text}</Link>
                  <time dateTime={a.at} className="flex-none text-sm muted">{formatDate(a.at)}</time>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nothing yet. Enquiries and content changes will show up here.</p>
          )}
        </Panel>

        {(projects === 0 || posts === 0) && (
          <Panel title="Import starter content">
            <p>
              Add the six concept portfolio projects, three unpublished placeholders for your real client projects,
              and nine articles. Anything that already exists is skipped.
            </p>
            <AdminForm action={importStarterContent} submitLabel="Import starter content" pendingLabel="Importing…">
              <span />
            </AdminForm>
          </Panel>
        )}
      </div>
    </>
  );
}
