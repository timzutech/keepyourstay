import "server-only";
import { siteUrl } from "./site";

export type SendResult = { sent: true } | { sent: false; reason: string };

export const isEmailConfigured = () => Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);

/** Names of the email settings that are missing on this deployment. */
export const missingEmailSettings = () =>
  (["RESEND_API_KEY", "EMAIL_FROM"] as const).filter((k) => !process.env[k]?.trim());

export const leadInbox = () =>
  process.env.LEAD_NOTIFICATION_EMAIL || process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "KeepYourStay@gmail.com";

/** Sends one email through Resend's REST API. Never throws. */
export async function sendEmail(msg: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  headers?: Record<string, string>;
}): Promise<SendResult> {
  if (!isEmailConfigured()) return { sent: false, reason: "Email is not configured (RESEND_API_KEY / EMAIL_FROM)." };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [msg.to],
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
        reply_to: msg.replyTo,
        headers: msg.headers,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[email] Resend rejected the message", res.status, body.slice(0, 300));
      return { sent: false, reason: `Email provider responded with ${res.status}.` };
    }
    return { sent: true };
  } catch (err) {
    console.error("[email] send failed", err);
    return { sent: false, reason: "Could not reach the email provider." };
  }
}

export const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** Shared branded wrapper: cream page, black masthead, forest-green action. */
function layout(opts: { heading: string; intro?: string; body: string; footer?: string }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(opts.heading)}</title></head>
<body style="margin:0;background:#F4ECDD;font-family:Helvetica,Arial,sans-serif;color:#000;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4ECDD;padding:32px 16px;"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FBF7EE;border:1px solid #D8C9AC;">
<tr><td style="background:#000;padding:20px 28px;color:#F4ECDD;font-size:18px;font-weight:700;letter-spacing:-0.01em;">KeepYourStay</td></tr>
<tr><td style="padding:28px;">
<h1 style="margin:0 0 12px;font-size:22px;line-height:1.25;">${escapeHtml(opts.heading)}</h1>
${opts.intro ? `<p style="margin:0 0 20px;font-size:15px;line-height:1.55;color:#3D372E;">${opts.intro}</p>` : ""}
${opts.body}
</td></tr>
<tr><td style="padding:18px 28px;border-top:1px solid #D8C9AC;font-size:12px;line-height:1.5;color:#6B6252;">
${opts.footer ?? "Your property. Your website. Your bookings."}
</td></tr>
</table></td></tr></table></body></html>`;
}

const button = (href: string, label: string) =>
  `<p style="margin:24px 0 0;"><a href="${href}" style="display:inline-block;background:#2E4A3B;color:#F4ECDD;text-decoration:none;font-weight:700;font-size:14px;padding:12px 20px;">${escapeHtml(label)}</a></p>`;

export type Row = [label: string, value: string];

export function enquiryNotification(opts: { typeLabel: string; id: string; rows: Row[] }) {
  const rows = opts.rows.filter(([, v]) => v.trim() !== "");
  const table = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.5;">${rows
    .map(
      ([l, v]) =>
        `<tr><td style="padding:8px 12px 8px 0;border-top:1px solid #E6DAC3;color:#6B6252;width:38%;vertical-align:top;">${escapeHtml(l)}</td><td style="padding:8px 0;border-top:1px solid #E6DAC3;vertical-align:top;white-space:pre-wrap;">${escapeHtml(v)}</td></tr>`,
    )
    .join("")}</table>`;
  const adminUrl = `${siteUrl}/admin/enquiries/${opts.id}`;
  return {
    subject: `New ${opts.typeLabel.toLowerCase()} from ${rows.find(([l]) => l === "Name")?.[1] ?? "the website"}`,
    html: layout({
      heading: `New ${opts.typeLabel.toLowerCase()}`,
      intro: "Someone has submitted a form on the KeepYourStay website. Reply to this email to answer them directly.",
      body: table + button(adminUrl, "Open in admin dashboard"),
    }),
    text: `New ${opts.typeLabel.toLowerCase()}\n\n${rows.map(([l, v]) => `${l}: ${v}`).join("\n")}\n\nOpen in admin: ${adminUrl}`,
  };
}

export function newsletterWelcome(unsubscribeUrl: string) {
  return {
    subject: "You're subscribed to KeepYourStay",
    html: layout({
      heading: "You're subscribed",
      intro:
        "Thanks for subscribing. We'll send occasional, practical notes on vacation rental websites and direct bookings. No daily emails.",
      body: `<p style="margin:0;font-size:15px;line-height:1.55;">In the meantime, the <a href="${siteUrl}/direct-booking" style="color:#2E4A3B;">direct booking guide</a> is a good place to start.</p>`,
      footer: `You're receiving this because you subscribed at ${escapeHtml(siteUrl.replace(/^https?:\/\//, ""))}. <a href="${unsubscribeUrl}" style="color:#6B6252;">Unsubscribe</a>.`,
    }),
    text: `You're subscribed to KeepYourStay.\n\nWe'll send occasional, practical notes on vacation rental websites and direct bookings.\n\nUnsubscribe: ${unsubscribeUrl}`,
  };
}

export function newsletterNotification(email: string) {
  return {
    subject: "New newsletter subscriber",
    html: layout({
      heading: "New newsletter subscriber",
      body: `<p style="margin:0;font-size:15px;line-height:1.55;">${escapeHtml(email)} subscribed to the newsletter.</p>`,
    }),
    text: `${email} subscribed to the newsletter.`,
  };
}

export function testimonialNotification(opts: { id: string; rows: Row[] }) {
  const rows = opts.rows.filter(([, v]) => v && v.trim() !== "");
  const table = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.5;">${rows
    .map(
      ([l, v]) =>
        `<tr><td style="padding:8px 12px 8px 0;border-top:1px solid #E6DAC3;color:#6B6252;width:30%;vertical-align:top;">${escapeHtml(l)}</td><td style="padding:8px 0;border-top:1px solid #E6DAC3;vertical-align:top;white-space:pre-wrap;">${escapeHtml(v)}</td></tr>`,
    )
    .join("")}</table>`;
  const adminUrl = `${siteUrl}/admin/testimonials/${opts.id}`;
  return {
    subject: "New client feedback to review",
    html: layout({
      heading: "New client feedback",
      intro:
        "A client sent feedback through the website and agreed to it being published. It stays hidden until you check it came from a real client, tick \"verified\" and publish it.",
      body: table + button(adminUrl, "Review in admin dashboard"),
    }),
    text: `New client feedback to review\n\n${rows.map(([l, v]) => `${l}: ${v}`).join("\n")}\n\nReview: ${adminUrl}`,
  };
}
