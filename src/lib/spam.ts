import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";

import { HONEYPOT_FIELD, TIMESTAMP_FIELD } from "./forms";

const MIN_FILL_MS = 2500;
const MAX_FILL_MS = 24 * 60 * 60 * 1000;

/** Hashes the visitor IP with a server-side salt, so raw IPs are never stored. */
export async function visitorHash() {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const salt = process.env.RATE_LIMIT_SALT || "keepyourstay";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

/**
 * Bot heuristics: a hidden field people never see must stay empty, and the form
 * must have been open for a couple of seconds before it was sent.
 */
export function looksAutomated(fd: FormData) {
  if (String(fd.get(HONEYPOT_FIELD) ?? "") !== "") return true;
  const started = Number(fd.get(TIMESTAMP_FIELD));
  if (!Number.isFinite(started) || started <= 0) return true;
  const elapsed = Date.now() - started;
  return elapsed < MIN_FILL_MS || elapsed > MAX_FILL_MS;
}
