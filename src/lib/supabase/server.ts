import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./env";

/** Session-aware client for the admin area. Row Level Security applies. */
export async function sessionClient() {
  if (!isSupabaseConfigured) return null;
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component: the middleware refreshes the session instead.
        }
      },
    },
  });
}

/**
 * Gate for every admin page and admin server action.
 * Verifies the session with Supabase Auth, then checks admin_profiles.
 */
export async function requireAdmin() {
  const supabase = await sessionClient();
  if (!supabase) redirect("/admin/login?error=not-configured");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("id, email, full_name")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile) redirect("/admin/login?error=not-authorized");
  return { supabase, user, profile };
}
