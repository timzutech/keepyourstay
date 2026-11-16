import Link from "next/link";
import { Logo } from "@/components/Logo";
import { requireAdmin } from "@/lib/supabase/server";
import { signOut } from "../actions";

export const metadata = { title: { default: "Admin", template: "%s | KeepYourStay admin" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/portfolio", label: "Portfolio" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/settings", label: "Site settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireAdmin();
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="on-dark bg-ink text-cream lg:min-h-screen">
        <div className="flex items-center justify-between gap-4 p-5 lg:block">
          <Logo />
          <p className="text-xs text-cream/70 lg:mt-2">Admin dashboard</p>
        </div>
        <nav aria-label="Admin" className="px-3 pb-3 lg:pb-6">
          <ul className="flex gap-1 overflow-x-auto lg:block">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="block whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold hover:bg-cream/15">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-cream/25 p-5 text-sm">
          <p className="break-all text-cream/80">{profile.email}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <form action={signOut}>
              <button type="submit" className="btn btn-outline btn-sm">Sign out</button>
            </form>
            <Link href="/" className="btn btn-outline btn-sm">View site</Link>
          </div>
        </div>
      </aside>
      <main className="min-w-0 p-5 sm:p-8 lg:p-10">{children}</main>
    </div>
  );
}
