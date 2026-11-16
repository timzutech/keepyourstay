"use client";
import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "./env";

/** Browser client, used only in the admin area for image uploads. */
export function browserClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
