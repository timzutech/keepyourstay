import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./env";

// If the database can't be reached, give up quickly so pages fall back to the
// starter content (and forms report the failure) instead of hanging.
const TIMEOUT_MS = 6000;

const fetchWithTimeout: typeof fetch = (input, init) =>
  fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(TIMEOUT_MS) });

/**
 * Cookie-less anon client for reading published content.
 * Subject to Row Level Security, so it only ever sees public rows.
 */
export function publicClient() {
  if (!isSupabaseConfigured) return null;
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: fetchWithTimeout },
  });
}
