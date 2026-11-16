import { Logo } from "@/components/Logo";
import { AdminForm } from "@/components/admin/AdminForm";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { signIn } from "../actions";

export const metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

const messages: Record<string, string> = {
  "not-configured": "Supabase isn't connected yet. Add the Supabase environment variables (see the README), then reload this page.",
  "not-authorized": "That account is signed in but doesn't have admin access.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const notice = !isSupabaseConfigured ? messages["not-configured"] : error ? messages[error] : null;
  return (
    <main className="grid min-h-screen place-items-center px-5 py-12">
      <div className="w-full max-w-md">
        <Logo />
        <div className="mt-8 rounded-xl border-2 border-ink bg-paper p-6 sm:p-8">
          <h1 className="heading">Admin sign in</h1>
          {notice && <p role="alert" className="mt-4 rounded-lg border-2 border-alert p-3 font-semibold text-alert">{notice}</p>}
          <AdminForm action={signIn} submitLabel="Sign in" pendingLabel="Signing in…" className="mt-6">
            <div className="grid gap-5">
              <div>
                <label htmlFor="email" className="label">Email</label>
                <input id="email" name="email" type="email" autoComplete="username" className="input" />
              </div>
              <div>
                <label htmlFor="password" className="label">Password</label>
                <input id="password" name="password" type="password" autoComplete="current-password" className="input" />
              </div>
            </div>
          </AdminForm>
        </div>
        <p className="mt-6 text-sm muted">Accounts are created in Supabase by the site owner. There is no public sign-up.</p>
      </div>
    </main>
  );
}
