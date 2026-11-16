"use server";

import { leadInbox, newsletterNotification, newsletterWelcome, sendEmail } from "@/lib/email";
import { issuesToErrors, newsletterSchema } from "@/lib/forms";
import { siteUrl } from "@/lib/site";
import { looksAutomated, visitorHash } from "@/lib/spam";
import { serviceClient } from "@/lib/supabase/admin";
import type { FormState } from "./enquiries";

export async function subscribe(_prev: FormState, fd: FormData): Promise<FormState> {
  const values = { email: String(fd.get("email") ?? ""), consent: String(fd.get("consent") ?? "") };
  const fail = (message: string, errors?: Record<string, string>): FormState => ({ status: "error", message, errors, values });

  if (looksAutomated(fd)) return fail("This was blocked by our spam filter. Wait a few seconds and try again.");

  const parsed = newsletterSchema.safeParse(values);
  if (!parsed.success) {
    const errors = issuesToErrors(parsed.error.issues);
    return fail(errors.email ?? errors.consent ?? "Check your details and try again.", errors);
  }
  const email = parsed.data.email.toLowerCase();

  const db = serviceClient();
  if (!db) {
    console.error("[newsletter] Supabase is not configured; subscriber was NOT saved.");
    return fail("We couldn't subscribe you because the site's database isn't connected yet.");
  }

  const { data: existing, error: readError } = await db
    .from("newsletter_subscribers")
    .select("id, status, unsubscribe_token")
    .eq("email", email)
    .maybeSingle();
  if (readError) {
    console.error("[newsletter] lookup failed", readError);
    return fail("We couldn't subscribe you just now. Try again in a moment.");
  }

  if (existing?.status === "subscribed") {
    return { status: "success", message: "This address is already subscribed. Nothing else to do." };
  }

  let token: string;
  if (existing) {
    const { error } = await db
      .from("newsletter_subscribers")
      .update({ status: "subscribed", consent: true, unsubscribed_at: null })
      .eq("id", existing.id);
    if (error) return fail("We couldn't subscribe you just now. Try again in a moment.");
    token = existing.unsubscribe_token;
  } else {
    const { data, error } = await db
      .from("newsletter_subscribers")
      .insert({ email, consent: true, ip_hash: await visitorHash() })
      .select("unsubscribe_token")
      .single();
    if (error || !data) {
      console.error("[newsletter] insert failed", error);
      return fail("We couldn't subscribe you just now. Try again in a moment.");
    }
    token = data.unsubscribe_token;
  }

  const unsubscribeUrl = `${siteUrl}/unsubscribe?token=${token}`;
  await Promise.all([
    sendEmail({
      to: email,
      ...newsletterWelcome(unsubscribeUrl),
      headers: { "List-Unsubscribe": `<${unsubscribeUrl}>` },
    }),
    sendEmail({ to: leadInbox(), ...newsletterNotification(email) }),
  ]);

  return { status: "success", message: "You're subscribed. You can unsubscribe at any time from any email we send." };
}

export async function unsubscribe(_prev: FormState, fd: FormData): Promise<FormState> {
  const token = String(fd.get("token") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(token)) {
    return { status: "error", message: "This unsubscribe link isn't valid. Use the link from your most recent email." };
  }
  const db = serviceClient();
  if (!db) return { status: "error", message: "We couldn't process this because the site's database isn't connected." };
  const { data, error } = await db
    .from("newsletter_subscribers")
    .update({ status: "unsubscribed", unsubscribed_at: new Date().toISOString() })
    .eq("unsubscribe_token", token)
    .select("id");
  if (error) return { status: "error", message: "We couldn't unsubscribe you just now. Try again in a moment." };
  if (!data?.length) {
    return { status: "error", message: "We couldn't find a subscription for this link. It may already have been removed." };
  }
  return { status: "success", message: "You've been unsubscribed. You won't receive further newsletter emails." };
}
