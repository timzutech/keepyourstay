import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./env";

/**
 * Cookie-less anon client for reading published content.
 * Subject to Row Level Security, so it only ever sees public rows.
 */
export function publicClient() {
  if (!isSupabaseConfigured) return null;
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
