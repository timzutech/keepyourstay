import "server-only";
import { publicClient } from "./public";

/**
 * Client for the public form handlers. It uses the ordinary anon key plus a
 * server-only shared secret (FORMS_SECRET) that the database functions
 * submit_enquiry, subscribe_newsletter, … require. Returns null when either
 * part is missing, so callers can tell the visitor honestly that nothing was saved.
 */
export function formsClient() {
  const secret = process.env.FORMS_SECRET;
  const db = publicClient();
  if (!db || !secret) return null;
  return { db, secret };
}
