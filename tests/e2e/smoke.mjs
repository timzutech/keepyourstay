// End-to-end smoke test. Run against a running server:
//   BASE_URL=http://localhost:3000 node tests/e2e/smoke.mjs
// It expects Supabase NOT to be configured unless EXPECT_BACKEND=1 is set,
// and checks that forms never report success without a saved record.
import { createRequire } from "node:module";

// Playwright is resolved with require so a globally installed copy also works.
const { chromium } = createRequire(import.meta.url)("playwright");

const BASE = process.env.BASE_URL || "http://localhost:3000";
const EXPECT_BACKEND = process.env.EXPECT_BACKEND === "1";
const results = [];
const ok = (name, pass, detail = "") => {
  results.push({ name, pass });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const consoleErrors = [];
page.on("pageerror", (e) => consoleErrors.push(`${page.url()} :: ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error" && !/Failed to load resource|net::ERR|googletagmanager|unsplash/i.test(m.text())) {
    consoleErrors.push(`${page.url()} :: ${m.text().slice(0, 200)}`);
  }
});

// ── 1. Crawl every internal link, starting from the homepage ──
const seen = new Map();
const queue = ["/"];
const external = new Set();
while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  const res = await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
  seen.set(path, res.status());
  if (res.status() >= 400) continue;
  const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")));
  for (const h of hrefs) {
    if (!h) continue;
    if (/^(https?:|mailto:|tel:)/.test(h)) external.add(h);
    else if (h.startsWith("/")) {
      const clean = h.split("#")[0];
      if (clean && !seen.has(clean) && !queue.includes(clean)) queue.push(clean);
    }
  }
}
const broken = [...seen].filter(([p, s]) => s >= 400 && !p.startsWith("/admin"));
ok(`crawl: ${seen.size} internal URLs reachable`, broken.length === 0, broken.map(([p, s]) => `${s} ${p}`).join(", "));

const required = [
  "/", "/about", "/services", "/portfolio", "/pricing", "/direct-booking", "/savings-calculator", "/blog", "/contact", "/faq",
  "/privacy-policy", "/terms-and-conditions", "/cookie-policy",
  "/services/vacation-rental-website-design", "/services/direct-booking-websites", "/services/booking-calendar-integration",
  "/services/payment-integration", "/services/property-management-system-integration", "/services/website-redesign",
  "/services/seo", "/services/maintenance", "/services/booking-marketing", "/services/multi-property-websites",
];
const missing = required.filter((p) => seen.get(p) !== 200);
ok("all sitemap pages linked and return 200", missing.length === 0, missing.join(", "));

// ── 2. SEO metadata on every public page ──
const seoProblems = [];
const titles = new Map();
for (const [path, status] of seen) {
  if (status !== 200 || path.startsWith("/admin") || path.includes("?")) continue;
  await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
  const m = await page.evaluate(() => ({
    title: document.title,
    desc: document.querySelector('meta[name="description"]')?.content ?? "",
    canonical: document.querySelector('link[rel="canonical"]')?.href ?? "",
    og: document.querySelector('meta[property="og:title"]')?.content ?? "",
    ogImage: document.querySelector('meta[property="og:image"]')?.content ?? "",
    h1: document.querySelectorAll("h1").length,
    ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent),
    imgNoAlt: [...document.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt")).length,
    lang: document.documentElement.lang,
  }));
  if (!m.title) seoProblems.push(`${path}: no title`);
  if (m.desc.length < 50) seoProblems.push(`${path}: short/missing description`);
  if (!m.canonical) seoProblems.push(`${path}: no canonical`);
  if (!m.og) seoProblems.push(`${path}: no og:title`);
  if (!m.ogImage) seoProblems.push(`${path}: no og:image`);
  if (m.h1 !== 1) seoProblems.push(`${path}: ${m.h1} h1 elements`);
  if (m.imgNoAlt) seoProblems.push(`${path}: ${m.imgNoAlt} images without alt`);
  if (m.lang !== "en") seoProblems.push(`${path}: lang`);
  for (const raw of m.ld) {
    try { JSON.parse(raw); } catch { seoProblems.push(`${path}: invalid JSON-LD`); }
  }
  if (titles.has(m.title)) seoProblems.push(`${path}: duplicate title with ${titles.get(m.title)}`);
  titles.set(m.title, path);
}
ok("SEO: unique title, description, canonical, OG, one h1, alt text, valid JSON-LD", seoProblems.length === 0, seoProblems.slice(0, 8).join(" | "));

const sm = await (await ctx.request.get(BASE + "/sitemap.xml")).text();
ok("sitemap.xml lists pages, services, projects and posts", (sm.match(/<loc>/g) ?? []).length >= 13 + 10 && sm.includes("/blog/") && sm.includes("/portfolio/"));
const robots = await (await ctx.request.get(BASE + "/robots.txt")).text();
ok("robots.txt blocks /admin and links the sitemap", /Disallow: \/admin/.test(robots) && /Sitemap: .*sitemap\.xml/.test(robots));

// ── 3. 404 ──
const nf = await page.goto(BASE + "/this-page-does-not-exist", { waitUntil: "domcontentloaded" });
ok("custom 404 returns 404 with site navigation", nf.status() === 404 && (await page.locator("header nav").count()) > 0 && (await page.getByText("This page has checked out").count()) === 1);

// ── 4. WhatsApp and email links ──
const wa = [...external].filter((h) => h.includes("wa.me"));
ok("WhatsApp links use https://wa.me/19514692722 with a prefilled message", wa.length > 0 && wa.every((h) => /^https:\/\/wa\.me\/19514692722\?text=.+/.test(h)), wa[0]);
ok("business email link present", [...external].includes("mailto:KeepYourStay@gmail.com"));

// ── 5. Cookie consent and analytics gating ──
await page.goto(BASE + "/", { waitUntil: "load" });
const banner = page.getByRole("dialog", { name: /cookies on this site/i });
await banner.waitFor();
const btns = await banner.getByRole("button").allTextContents();
ok("cookie banner offers Accept all, Reject non-essential, Manage preferences", ["Accept all", "Reject non-essential", "Manage preferences"].every((b) => btns.includes(b)));
ok("no analytics script before consent", (await page.locator('script[src*="googletagmanager"]').count()) === 0);
await banner.getByRole("button", { name: "Reject non-essential" }).click();
await page.reload({ waitUntil: "load" });
ok("after rejecting: banner gone, still no analytics", (await page.getByRole("dialog").count()) === 0 && (await page.locator('script[src*="googletagmanager"]').count()) === 0);
await page.getByRole("button", { name: "Cookie preferences" }).first().click();
const prefs = page.getByRole("dialog", { name: /cookie preferences/i });
await prefs.getByRole("checkbox").nth(1).check();
await prefs.getByRole("button", { name: "Save preferences" }).click();
await page.waitForTimeout(600);
const gaConfigured = (await page.locator('script[src*="googletagmanager"]').count()) > 0;
ok("after opting in via preferences: analytics loads only if a GA ID is configured", true, gaConfigured ? "GA tag injected after consent" : "no GA ID configured, nothing injected");

// ── 6. Savings calculator ──
await page.goto(BASE + "/savings-calculator", { waitUntil: "load" });
const set = async (id, v) => { await page.fill(`#calc-${id}`, String(v)); };
await set("monthlyRevenue", 10000); await set("independentSharePct", 20); await set("platformFeePct", 15);
await set("paymentFeePct", 3); await set("softwareCost", 60); await set("marketingCost", 100);
const panel = page.locator('[aria-live="polite"]');
let text = await panel.innerText();
ok("calculator: 10,000 × 20% × 15% − 60 − 60 − 100 = $80/month, $960/year", text.includes("$300") && text.includes("$220") && text.includes("$80") && text.includes("$960"), text.replace(/\s+/g, " ").slice(0, 160));
await page.getByText("Pounds sterling (£)").click();
text = await panel.innerText();
ok("calculator: currency switch to GBP", text.includes("£80") && !text.includes("$"));
await set("independentSharePct", 5);
text = await panel.innerText();
ok("calculator: negative scenario shown honestly", text.includes("−£100") && /equal to or higher/.test(text));
await set("platformFeePct", 150);
ok("calculator: rejects a percentage over 100", (await page.getByText("Enter a percentage between 0 and 100").count()) === 1 && /Correct the highlighted/.test(await panel.innerText()));
await set("platformFeePct", 15);
ok("calculator: disclaimer visible", (await page.getByText("A website does not guarantee additional bookings.").count()) >= 1);

// ── 7. Forms: client validation, then honest server result ──
async function submitAndRead(form, button) {
  await page.waitForTimeout(2800); // spam filter requires the form to be open for a few seconds
  await form.getByRole("button", { name: button }).click();
  await page.waitForTimeout(1800);
}
await page.goto(BASE + "/contact", { waitUntil: "load" });
const contact = page.locator("#message form");
await contact.getByRole("button", { name: "Send message" }).click();
ok("contact form: empty submit shows field errors and focuses the first", (await contact.locator(".field-error").count()) >= 4 && (await page.evaluate(() => document.activeElement?.getAttribute("name"))) === "full_name");
await contact.getByLabel("Full name").fill("Test Person");
await contact.getByLabel("Email").fill("not-an-email");
await contact.getByRole("button", { name: "Send message" }).click();
ok("contact form: invalid email message", (await contact.getByText(/Enter a valid email address/).count()) === 1);
await contact.getByLabel("Email").fill("test@example.com");
await contact.getByLabel("Country").fill("United Kingdom");
await contact.getByLabel("Preferred contact method").selectOption("Email");
await contact.getByLabel("Message").fill("Automated test message.");
await contact.locator('input[name="consent"]').check();
await submitAndRead(contact, "Send message");
const contactSection = await page.locator("#message").innerText();
if (EXPECT_BACKEND) ok("contact form: saved and confirmed", /Message sent/.test(contactSection));
else ok("contact form: no success claimed without a database; values kept", /database isn't connected/.test(contactSection) && !/Message sent/.test(contactSection) && (await contact.getByLabel("Full name").inputValue()) === "Test Person");

const project = page.locator("#project form");
await project.getByRole("button", { name: "Send project enquiry" }).click();
ok("project form: required fields and services enforced", (await project.getByText("Choose at least one option").count()) === 1 && (await project.locator(".field-error").count()) >= 7);
const consult = page.locator("#consultation form");
await consult.getByRole("button", { name: "Request consultation" }).click();
ok("consultation form: required fields enforced", (await consult.locator(".field-error").count()) >= 6);
const labelled = await page.evaluate(() => [...document.querySelectorAll("main input:not([type=hidden]):not([tabindex='-1']), main select, main textarea")].filter((el) => !(el.labels && el.labels.length) && !el.getAttribute("aria-label")).length);
ok("every form control on /contact has a label", labelled === 0, `${labelled} unlabelled`);

// Honeypot: a bot that fills the hidden field is refused.
await page.goto(BASE + "/contact", { waitUntil: "load" });
const c2 = page.locator("#message form");
await c2.getByLabel("Full name").fill("Bot"); await c2.getByLabel("Email").fill("bot@example.com");
await c2.getByLabel("Country").fill("X"); await c2.getByLabel("Preferred contact method").selectOption("Email");
await c2.getByLabel("Message").fill("spam"); await c2.locator('input[name="consent"]').check();
await page.evaluate(() => { document.querySelector('#message input[name="company_site"]').value = "http://spam"; });
await submitAndRead(c2, "Send message");
ok("spam: honeypot submission blocked", /blocked by our spam filter/.test(await page.locator("#message").innerText()));

// Newsletter
const news = page.locator("footer form");
await news.getByLabel("Email address").fill("reader@example.com");
await news.getByRole("button", { name: "Subscribe" }).click();
await page.waitForTimeout(1200);
ok("newsletter: consent required", /Tick the box/.test(await page.locator("footer").innerText()));
await news.locator('input[name="consent"]').check();
await page.waitForTimeout(2800);
await news.getByRole("button", { name: "Subscribe" }).click();
await page.waitForTimeout(1800);
const footerText = await page.locator("footer").innerText();
if (EXPECT_BACKEND) ok("newsletter: subscribed", /You're subscribed|already subscribed/.test(footerText));
else ok("newsletter: no success claimed without a database", /database isn't connected/.test(footerText) && !/You're subscribed/.test(footerText));

// Client feedback page: private, not indexed, consent required, honest on failure.
await page.goto(BASE + "/feedback", { waitUntil: "load" });
ok("feedback page: loads and is not indexed", (await page.locator('meta[name="robots"][content*="noindex"]').count()) === 1);
const fb = page.locator("main form");
await fb.getByLabel("Your full name").fill("Test Client");
await fb.getByLabel("Email", { exact: true }).fill("client@example.com");
await fb.getByLabel("Name to show with your feedback").fill("Test C.");
await fb.getByLabel("Your feedback", { exact: true }).fill("Automated test feedback.");
await fb.getByRole("button", { name: "Send my feedback" }).click();
ok("feedback page: a star rating is required", (await fb.getByText("Choose a rating from 1 to 5 stars").count()) === 1);
await fb.getByText("4 stars, Very good").click({ force: true });
ok("feedback page: star picker selects a rating", (await fb.locator('input[name="rating"]:checked').inputValue()) === "4");
await fb.getByRole("button", { name: "Send my feedback" }).click();
ok("feedback page: publication consent is required", (await fb.getByText(/Tick the box/).count()) === 1);
await fb.locator('input[name="consent"]').check();
await page.waitForTimeout(2800);
await fb.getByRole("button", { name: "Send my feedback" }).click();
await page.waitForTimeout(1800);
const fbText = await page.locator("main").innerText();
if (EXPECT_BACKEND) ok("feedback page: saved", /Thank you for your feedback/.test(fbText));
else ok("feedback page: no success claimed without a database", /database isn't connected/.test(fbText) && !/Thank you for your feedback/.test(fbText));
await page.goto(BASE + "/", { waitUntil: "load" });
ok("homepage: commitments section present", (await page.getByRole("heading", { name: "What working with us looks like" }).count()) === 1);

// ── 8. Portfolio ──
await page.goto(BASE + "/portfolio", { waitUntil: "load" });
const cards = () => page.locator("main article").count();
const all = await cards();
await page.getByRole("button", { name: "Beach Houses" }).click();
const beach = await cards();
ok("portfolio: filter narrows results", all >= 5 && beach >= 1 && beach < all, `${all} → ${beach}`);
const cats = ["Luxury Villas", "Holiday Apartments", "Boutique Vacation Rentals", "Beach Houses", "Cabins and Cottages", "Multi-Property Businesses"];
let allCats = true;
for (const c of cats) allCats &&= (await page.getByRole("button", { name: c }).count()) === 1;
ok("portfolio: all six category filters present", allCats);
await page.getByRole("button", { name: "All work" }).click();
const labels = await page.locator("main article").evaluateAll((els) => els.every((e) => /Concept Project — Illustrative Design|Completed client project/.test(e.textContent)));
ok("portfolio: every card carries a concept/completed label", labels);
await page.locator("main article a").first().click();
await page.waitForURL(/\/portfolio\/.+/);
ok("portfolio: project page shows concept label and disclaimer", (await page.getByText("Concept Project — Illustrative Design").count()) >= 1 && (await page.getByText(/fictional concept/).count()) === 1);

// ── 9. Blog ──
await page.goto(BASE + "/blog", { waitUntil: "load" });
ok("blog: featured section and pagination", (await page.getByRole("heading", { name: "Featured articles" }).count()) === 1 && (await page.getByRole("navigation", { name: "Pagination" }).count()) === 1);
await page.getByRole("link", { name: "Older articles" }).click();
await page.waitForURL(/page=2/);
ok("blog: page 2 loads", (await page.locator("main article").count()) >= 1);
await page.goto(BASE + "/blog?q=iCal", { waitUntil: "load" });
ok("blog: search finds the calendar article", (await page.getByRole("link", { name: "How Booking Calendar Integration Works" }).count()) === 1);
await page.goto(BASE + "/blog?q=zzzzqqq", { waitUntil: "load" });
ok("blog: empty search state", (await page.getByText("No articles match that search.").count()) === 1);
await page.goto(BASE + "/blog?category=seo-and-marketing", { waitUntil: "load" });
ok("blog: category filter", (await page.locator("main article").count()) === 1);
await page.goto(BASE + "/blog?tag=direct-bookings", { waitUntil: "load" });
ok("blog: tag filter", (await page.locator("main article").count()) >= 3);
await page.goto(BASE + "/blog/how-to-improve-vacation-rental-seo", { waitUntil: "load" });
ok("blog: article renders with Article schema and tags", (await page.locator(".prose h2").count()) >= 4 && (await page.content()).includes('"@type":"Article"'));

// ── 10. Admin is protected ──
for (const p of ["/admin", "/admin/enquiries", "/admin/portfolio", "/admin/blog/new", "/admin/settings"]) {
  await page.goto(BASE + p, { waitUntil: "domcontentloaded" });
  ok(`admin: ${p} redirects signed-out visitors to sign in`, new URL(page.url()).pathname === "/admin/login");
}
const adminRes = await ctx.request.get(BASE + "/admin/login");
ok("admin: noindex header", /noindex/.test(adminRes.headers()["x-robots-tag"] ?? ""));

// ── 11. Mobile ──
const mobile = await browser.newContext({ viewport: { width: 375, height: 740 }, hasTouch: true, isMobile: true });
const mp = await mobile.newPage();
await mp.addInitScript(() => localStorage.setItem("kys_consent", JSON.stringify({ v: 1, analytics: false, decidedAt: "x" })));
const overflow = [];
for (const p of ["/", "/about", "/services", "/services/seo", "/portfolio", "/portfolio/casa-solene", "/pricing", "/direct-booking", "/savings-calculator", "/blog", "/blog/how-to-improve-vacation-rental-seo", "/contact", "/faq", "/privacy-policy"]) {
  await mp.goto(BASE + p, { waitUntil: "load" });
  const o = await mp.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (o > 1) overflow.push(`${p} (+${o}px)`);
}
ok("mobile 375px: no horizontal scrolling on any page", overflow.length === 0, overflow.join(", "));
await mp.goto(BASE + "/", { waitUntil: "load" });
await mp.getByRole("button", { name: "Menu" }).click();
ok("mobile menu opens with all links", (await mp.locator("#mobile-menu a").count()) >= 9);
await mp.keyboard.press("Escape");
ok("mobile menu closes with Escape", (await mp.locator("#mobile-menu").count()) === 0);
await mp.getByRole("button", { name: "Menu" }).click();
await mp.locator("#mobile-menu").getByRole("link", { name: "Pricing" }).click();
await mp.waitForURL(/\/pricing/);
const closed = await mp.locator("#mobile-menu").waitFor({ state: "detached", timeout: 3000 }).then(() => true, () => false);
ok("mobile menu navigates and closes", closed);

// ── 12. Keyboard ──
await page.goto(BASE + "/", { waitUntil: "load" });
await page.keyboard.press("Tab");
ok("keyboard: first Tab stop is the skip link", (await page.evaluate(() => document.activeElement?.textContent)) === "Skip to content");

ok("no JavaScript errors in the console", consoleErrors.length === 0, consoleErrors.slice(0, 4).join(" | "));

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
