"use server";

import { leadInbox, sendEmail, testimonialNotification } from "@/lib/email";
import { issuesToErrors, readForm, schemaFor } from "@/lib/forms";
import { looksAutomated, visitorHash } from "@/lib/spam";
import { formsClient } from "@/lib/supabase/admin";
import type { FormState } from "./enquiries";

/**
 * Saves feedback sent through /feedback. It is stored with the client's
 * consent recorded, but unverified and unpublished until the admin approves it.
 */
export async function submitTestimonial(_prev: FormState, fd: FormData): Promise<FormState> {
  const values = readForm("testimonial", fd);
  const fail = (message: string, errors?: Record<string, string>): FormState => ({ status: "error", message, errors, values });

  if (looksAutomated(fd)) {
    return fail("This was blocked by our spam filter. Wait a few seconds and send it again, or email us your feedback.");
  }

  const parsed = schemaFor("testimonial").safeParse(values);
  if (!parsed.success) {
    return fail("Some fields need your attention. Check the messages below.", issuesToErrors(parsed.error.issues));
  }
  const data = parsed.data as Record<string, string>;

  const forms = formsClient();
  if (!forms) {
    console.error("[testimonial] Supabase or FORMS_SECRET is not configured; feedback was NOT saved.");
    return fail("We couldn't save your feedback because the site's database isn't connected yet. Please email it to us instead.");
  }

  const { data: savedId, error } = await forms.db.rpc("submit_testimonial", {
    p_secret: forms.secret,
    p_row: { ...data, consent: true, ip_hash: await visitorHash() },
  });
  if (error || !savedId) {
    if (error?.message?.includes("rate_limited")) {
      return fail("You've sent feedback several times in a short while. Wait a few minutes before sending more.");
    }
    console.error("[testimonial] insert failed", error);
    return fail("We couldn't save your feedback. Nothing was sent. Try again in a moment, or email it to us.");
  }

  const mail = testimonialNotification({
    id: String(savedId),
    rows: [
      ["Name", data.full_name],
      ["Email", data.email],
      ["Rating", `${data.rating} out of 5`],
      ["Shown as", [data.display_name, data.author_role, data.business_name].filter(Boolean).join(", ")],
      ["Website", data.website_url],
      ["Feedback", data.message],
    ],
  });
  const sent = await sendEmail({ to: leadInbox(), replyTo: data.email, ...mail });
  if (!sent.sent) console.warn("[testimonial] saved but notification email not sent:", sent.reason);

  return {
    status: "success",
    message:
      "We've received your feedback. Thank you for taking the time. We'll check the details and let you know if we publish it.",
  };
}
