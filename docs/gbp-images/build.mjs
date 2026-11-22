// Builds the Google Business Profile images from brand fonts and live-site screenshots.
// Run: node docs/gbp-images/build.mjs   (screenshots live in docs/gbp-images/raw)
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const out = path.join(root, "docs/gbp-images");
const raw = path.join(out, "raw");
const fonts = path.join(root, "node_modules/@fontsource-variable");
const tmp = path.join(out, ".html");
fs.mkdirSync(tmp, { recursive: true });

const C = { cream: "#f4ecdd", paper: "#fbf7ee", sand: "#e6dac3", ink: "#000", forest: "#2e4a3b", deep: "#223829", moss: "#c9cda6", stone: "#5a5244" };

const head = `<meta charset="utf-8"><style>
@font-face{font-family:B;src:url("file://${fonts}/bricolage-grotesque/files/bricolage-grotesque-latin-standard-normal.woff2") format("woff2-variations");font-weight:200 800;font-stretch:75% 100%}
@font-face{font-family:S;src:url("file://${fonts}/source-serif-4/files/source-serif-4-latin-wght-normal.woff2") format("woff2-variations");font-weight:200 900}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%}
body{font-family:B,sans-serif;color:${C.ink};-webkit-font-smoothing:antialiased}
.mark{display:block}
.browser{background:${C.paper};border:4px solid ${C.ink};border-radius:22px;overflow:hidden;box-shadow:18px 18px 0 0 ${C.ink}}
.bar{display:flex;align-items:center;gap:14px;padding:16px 22px;border-bottom:4px solid ${C.ink};background:${C.sand}}
.dot{width:16px;height:16px;border-radius:50%;background:${C.ink}}
.dot+.dot{opacity:.45}.dot+.dot+.dot{opacity:.25}
.url{flex:1;margin-left:14px;background:${C.paper};border:3px solid ${C.ink};border-radius:999px;padding:8px 22px;font-weight:600;font-size:24px}
.shot{display:block;width:100%}
.label{display:inline-block;background:${C.ink};color:${C.cream};font-weight:700;border-radius:999px}
</style>`;

const mark = (size, fg = C.ink, bg = C.cream) =>
  `<svg class="mark" width="${size}" height="${size}" viewBox="0 0 26 26"><rect x="1" y="1" width="24" height="24" rx="7" fill="${fg}"/><path d="M13 6.2 6.6 11.6v8.2h4.3v-4.6h4.2v4.6h4.3v-8.2L13 6.2Z" fill="${bg}"/></svg>`;

const wordmark = (h) =>
  `<div style="display:flex;align-items:center;gap:${h * 0.34}px">${mark(h)}<span style="font-size:${h * 0.9}px;font-weight:700;letter-spacing:-.02em;font-stretch:88%">KeepYourStay</span></div>`;

const img = (f) => `file://${raw}/${f}`;

const designs = [
  {
    name: "01-logo.png",
    w: 1080, h: 1080,
    html: `<body style="background:${C.cream};display:grid;place-items:center">${mark(640)}</body>`,
  },
  {
    name: "02-cover.png",
    w: 1080, h: 608,
    html: `<body style="background:${C.cream};display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:34px">
      ${wordmark(46)}
      <div style="font-size:84px;font-weight:700;line-height:.98;letter-spacing:-.035em;font-stretch:85%">Your property.<br>Your website.<br><span style="color:${C.forest}">Your bookings.</span></div>
      <div style="font-family:S,serif;font-size:27px;color:${C.stone}">Vacation rental websites and direct booking</div>
    </body>`,
  },
  {
    name: "03-homepage.png",
    w: 1600, h: 1200,
    html: `<body style="background:${C.forest};display:grid;place-items:center">
      <div class="browser" style="width:1400px"><div class="bar"><i class="dot"></i><i class="dot"></i><i class="dot"></i><div class="url">keepyourstay.com</div></div>
      <div style="height:880px;overflow:hidden"><img class="shot" src="${img("home-tall.png")}" style="margin-top:-0px"></div></div></body>`,
  },
  {
    name: "04-demo-site-desktop-and-phone.png",
    w: 1600, h: 1200,
    html: `<body style="background:${C.sand};position:relative;overflow:hidden">
      <div style="position:absolute;left:70px;top:70px"><span class="label" style="font-size:28px;padding:12px 26px">Concept demo site · illustrative design</span></div>
      <div class="browser" style="position:absolute;left:70px;top:160px;width:1180px"><div class="bar"><i class="dot"></i><i class="dot"></i><i class="dot"></i><div class="url">Juniper &amp; Tide demo</div></div>
        <img class="shot" src="${img("demo-desktop.png")}" style="height:740px;object-fit:cover;object-position:top"></div>
      <div style="position:absolute;right:80px;top:300px;width:380px;border:14px solid ${C.ink};border-radius:56px;overflow:hidden;background:${C.ink};box-shadow:18px 18px 0 0 ${C.forest}">
        <img class="shot" src="${img("demo-mobile.png")}" style="border-radius:40px"></div>
    </body>`,
  },
  {
    name: "05-juniper-case-study.png",
    w: 1600, h: 1200,
    html: `<body style="background:${C.forest};display:grid;place-items:center">
      <div class="browser" style="width:1400px"><div class="bar"><i class="dot"></i><i class="dot"></i><i class="dot"></i><div class="url">keepyourstay.com/portfolio/juniper-and-tide</div></div>
      <div style="height:940px;overflow:hidden"><img class="shot" src="${img("juniper-page.png")}" style="margin-top:-70px"></div></div></body>`,
  },
  {
    name: "06-savings-calculator.png",
    w: 1600, h: 1200,
    html: `<body style="background:${C.moss};display:grid;place-items:center">
      <div class="browser" style="width:1400px"><div class="bar"><i class="dot"></i><i class="dot"></i><i class="dot"></i><div class="url">keepyourstay.com/savings-calculator</div></div>
      <div style="height:940px;overflow:hidden"><img class="shot" src="${img("calculator.png")}" style="margin-top:-150px"></div></div></body>`,
  },
];

const browser = await chromium.launch();
for (const d of designs) {
  const file = path.join(tmp, d.name + ".html");
  fs.writeFileSync(file, `<!doctype html><html><head>${head}</head>${d.html}</html>`);
  const page = await browser.newPage({ viewport: { width: d.w, height: d.h }, deviceScaleFactor: d.w < 1200 ? 2 : 1 });
  await page.goto("file://" + file);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(out, d.name) });
  await page.close();
  console.log("wrote", d.name);
}
await browser.close();
fs.rmSync(tmp, { recursive: true });
