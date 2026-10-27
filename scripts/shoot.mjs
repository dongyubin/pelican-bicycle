import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright-core";

const ROOT = path.resolve(import.meta.dirname, "..");
const SHOTS = path.join(ROOT, "shots");
const POSTERS = path.join(ROOT, "assets", "posters");
const OG = path.join(ROOT, "assets", "og");
const FONTS = path.join(ROOT, "assets", "fonts");

const data = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "models.json"), "utf8"));
const models = data.models;
const totalOf = (model) => Object.values(model.scores).reduce((sum, value) => sum + value, 0);
const ranked = [...models].sort((a, b) => totalOf(b) - totalOf(a) || a.bib.localeCompare(b.bib));
const rankOf = new Map(ranked.map((model, index) => [model.slug, index + 1]));

const still = {
  "deepseek-flash": { time: 900 },
  "kimi-k3-1-pro": { button: "#toggle", time: 1050 },
  "doubao-2-1-pro": { button: "#pauseBtn", time: 1400 },
  "gpt-6-1-sol": { button: "#toggle", time: 1150 },
  "agnes-3-0-flash": { time: 900 },
  "gpt-5-6-sol": { time: 900, cancel: [".wheel"] },
  "gpt-6-0-luna": { time: 900 },
  hy3: { time: 350 },
};

function firstExisting(candidates) {
  for (const candidate of candidates) {
    if (candidate && fs.existsSync(candidate)) return candidate;
  }
  return null;
}

const CHROME = firstExisting([
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
]);
if (!CHROME) {
  console.error("Chrome not found. Set CHROME_PATH to a Chrome/Chromium executable.");
  process.exit(1);
}

const MAGICK =
  firstExisting([
    process.env.MAGICK,
    "D:/Software/ImageMagick-7.1.2-Q16-HDRI/magick.exe",
    "C:/Program Files/ImageMagick-7.1.2-Q16-HDRI/magick.exe",
  ]) || "magick";

function ensure(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function runMagick(args) {
  execFileSync(MAGICK, args, { stdio: "inherit" });
}

async function pauseScene(page, config) {
  if (config.cancel?.length) {
    await page.evaluate((selectors) => {
      for (const selector of selectors) {
        for (const el of document.querySelectorAll(selector)) {
          for (const animation of el.getAnimations()) {
            try {
              animation.cancel();
            } catch {
              /* ignore */
            }
          }
        }
      }
    }, config.cancel);
  }

  if (config.button) {
    await page.evaluate((selector) => {
      const button = document.querySelector(selector);
      if (button) button.click();
    }, config.button);
  }

  await page.evaluate((time) => {
    const svg = document.querySelector("svg");
    if (svg && typeof svg.pauseAnimations === "function") {
      try {
        svg.pauseAnimations();
        svg.setCurrentTime(time / 1000);
      } catch {
        /* ignore */
      }
    }
    for (const animation of document.getAnimations()) {
      try {
        animation.pause();
        animation.currentTime = time;
      } catch {
        /* ignore */
      }
    }
  }, config.time ?? 900);
}

async function capturePosters(browser) {
  ensure(SHOTS + path.sep + "posters");
  ensure(POSTERS);
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
  });

  for (const model of models) {
    const source = path.join(ROOT, model.source);
    if (!fs.existsSync(source)) {
      console.warn(`skip poster, artifact missing: ${model.source}`);
      continue;
    }
    const page = await context.newPage();
    try {
      await page.goto(pathToFileURL(source).href, { waitUntil: "load" });
      await page.addStyleTag({
        content:
          ".title,.control,.hint,.badge,.controls{visibility:hidden!important}*{border-radius:0!important}",
      });
      await page.waitForTimeout(1100);
      await pauseScene(page, still[model.slug] || {});
      await page.waitForTimeout(180);

      const svg = page.locator("svg").first();
      const png = path.join(SHOTS, "posters", `${model.slug}.png`);
      await svg.screenshot({ path: png });

      const webp = path.join(POSTERS, `${model.slug}.webp`);
      runMagick([
        png,
        "-resize",
        "1200x750^",
        "-gravity",
        "center",
        "-extent",
        "1200x750",
        "-strip",
        "-quality",
        "82",
        webp,
      ]);
      console.log(`poster ${model.slug} → ${path.relative(ROOT, webp)}`);
    } finally {
      await page.close();
    }
  }

  await context.close();
}

function fontFace(family, file, { weight = 400, style = "normal" } = {}) {
  const base64 = fs.readFileSync(path.join(FONTS, file)).toString("base64");
  return `@font-face{font-family:'${family}';font-style:${style};font-weight:${weight};src:url(data:font/woff2;base64,${base64}) format('woff2')}`;
}

function fontCss() {
  return [
    fontFace("Anton", "anton-400.woff2"),
    fontFace("Archivo", "archivo-var.woff2", { weight: "400 700" }),
    fontFace("IBM Plex Mono", "ibm-plex-mono-500.woff2", { weight: 500 }),
    fontFace("IBM Plex Mono", "ibm-plex-mono-600.woff2", { weight: 600 }),
    fontFace("Instrument Serif", "instrument-serif-400-italic.woff2", { style: "italic" }),
    fontFace("Instrument Serif", "instrument-serif-400.woff2"),
  ].join("\n");
}

function posterData(slug) {
  const file = path.join(POSTERS, `${slug}.webp`);
  return `data:image/webp;base64,${fs.readFileSync(file).toString("base64")}`;
}

function baseCss() {
  return `${fontCss()}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1200px;height:630px;overflow:hidden}
body{
  background:#0b3b3b;color:#f5f0e6;font-family:'Archivo',sans-serif;
  position:relative;
}
body::before{
  content:"";position:absolute;inset:0;
  background:
    radial-gradient(circle at 84% 16%, rgba(228,87,46,.24), transparent 44%),
    radial-gradient(circle at 12% 92%, rgba(233,185,73,.10), transparent 38%),
    repeating-linear-gradient(90deg, rgba(245,240,230,.045) 0 1px, transparent 1px 78px),
    repeating-linear-gradient(0deg, rgba(245,240,230,.045) 0 1px, transparent 1px 78px);
}
.frame{position:absolute;inset:0;padding:52px 56px 46px}
.eyebrow{
  display:flex;align-items:center;gap:12px;
  font-family:'IBM Plex Mono',monospace;font-size:13px;font-weight:600;
  letter-spacing:.18em;text-transform:uppercase;color:#e9b949;
}
.eyebrow::before{content:"";width:34px;height:3px;background:#e4572e;flex:none}
h1{
  font-family:'Anton',sans-serif;font-weight:400;text-transform:uppercase;
  color:#f5f0e6;line-height:.92;letter-spacing:.005em;
}
.tagline{
  font-family:'Instrument Serif',serif;font-style:italic;font-size:33px;
  line-height:1.2;color:#f0c96f;max-width:590px;
}
.stats{display:flex;align-items:flex-end;gap:34px;margin-top:auto}
.score{font-family:'Anton',sans-serif;font-size:100px;line-height:.78;color:#e4572e}
.score small{font-family:'IBM Plex Mono',monospace;font-size:18px;font-weight:500;color:rgba(245,240,230,.64);margin-left:10px;letter-spacing:.06em}
.rank{border-left:1px solid rgba(245,240,230,.24);padding-left:30px;padding-bottom:4px}
.rank b{display:block;font-family:'Anton',sans-serif;font-weight:400;font-size:40px;line-height:1;color:#f5f0e6}
.rank small{display:block;margin-top:8px;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.16em;color:rgba(245,240,230,.55)}
.rule{height:2px;background:rgba(245,240,230,.18);margin:26px 0 22px;width:640px}
.meta{font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:.13em;text-transform:uppercase;color:rgba(245,240,230,.56)}
.checker{
  position:absolute;left:0;right:0;bottom:0;height:20px;
  background:
    repeating-conic-gradient(#f5f0e6 0 25%, #102a32 0 50%) 0 0 / 20px 20px;
  opacity:.9;
}
.right{position:absolute;right:58px;top:82px;width:424px}
.right .label{
  font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.16em;
  text-transform:uppercase;color:rgba(245,240,230,.55);margin-bottom:12px;text-align:right;
}
.poster{
  border:8px solid #f5f0e6;background:#f5f0e6;
  box-shadow:14px 14px 0 rgba(0,0,0,.3);
  transform:rotate(-2.1deg);
}
.poster img{display:block;width:100%;aspect-ratio:16/10;object-fit:cover}
.bib{
  position:absolute;left:-46px;bottom:-42px;width:106px;height:106px;border-radius:50%;
  display:grid;place-items:center;background:#e9b949;color:#102a32;
  border:4px solid #102a32;box-shadow:7px 7px 0 rgba(0,0,0,.32);
  font-family:'Anton',sans-serif;font-size:46px;transform:rotate(5deg);
}`;
}

function modelCard(model) {
  const total = totalOf(model);
  const rank = rankOf.get(model.slug);
  const nameSize = model.name.length <= 4 ? 132 : model.name.length <= 12 ? 84 : 70;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss()}
.left{position:absolute;left:56px;top:52px;bottom:46px;width:640px;display:flex;flex-direction:column}
h1{font-size:${nameSize}px;margin-top:26px;max-width:640px}
.tagline{margin-top:22px}
.stats{margin-top:auto}
</style></head><body>
<div class="frame"></div>
<div class="left">
  <div class="eyebrow">Pelican Bicycle Benchmark · Run ${model.bib} / 08</div>
  <h1>${model.name}</h1>
  <p class="tagline">&ldquo;${model.tagline.en}&rdquo;</p>
  <div class="stats">
    <div class="score">${total.toFixed(1)}<small>/ 25</small></div>
    <div class="rank"><b>P${rank}</b><small>Overall rank</small></div>
  </div>
  <div class="rule"></div>
  <div class="meta">${model.vendor === "Not stated" ? "" : `${model.vendor} · `}zero-shot · animated SVG · 27 Oct 2026</div>
</div>
<div class="right">
  <div class="label">Still frame · original output</div>
  <div class="poster"><img src="${posterData(model.slug)}" alt=""></div>
  <div class="bib">${model.bib}</div>
</div>
<div class="checker"></div>
</body></html>`;
}

function homeCard() {
  const winner = ranked[0];
  return `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss()}
.left{position:absolute;left:56px;top:52px;bottom:46px;width:660px;display:flex;flex-direction:column}
h1{font-size:94px;margin-top:26px}
h1 em{display:block;font-family:'Instrument Serif',serif;font-style:italic;font-weight:400;text-transform:none;font-size:88px;color:#e4572e;letter-spacing:0}
.sub{margin-top:24px;max-width:560px;font-size:19px;line-height:1.5;color:rgba(245,240,230,.74)}
.stats{margin-top:auto;display:flex;align-items:center;gap:16px}
.tag{
  display:flex;align-items:center;gap:12px;padding:12px 18px;border:1px solid rgba(245,240,230,.28);
  font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:.12em;text-transform:uppercase;
  color:#f5f0e6;
}
.tag b{font-family:'Anton',sans-serif;font-weight:400;font-size:28px;line-height:1;color:#e9b949}
.tag span{line-height:1.45}
.winner{position:absolute;right:58px;top:66px;width:420px}
.winner .poster{transform:rotate(2deg)}
.winner .ribbon{
  position:absolute;left:-30px;bottom:-34px;background:#e4572e;color:#102a32;
  border:3px solid #102a32;box-shadow:7px 7px 0 rgba(0,0,0,.32);
  padding:12px 18px 10px;transform:rotate(-4deg);
  font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;
}
.winner .ribbon b{display:block;font-family:'Anton',sans-serif;font-size:30px;font-weight:400;letter-spacing:0;line-height:1}
.winner .label{
  font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.16em;
  text-transform:uppercase;color:rgba(245,240,230,.55);margin-bottom:12px;text-align:right;
}
</style></head><body>
<div class="frame"></div>
<div class="left">
  <div class="eyebrow">The animated LLM benchmark · 08 runs · 27 Oct 2026</div>
  <h1>Eight AIs.<br>One pelican.<em>One bicycle.</em></h1>
  <p class="sub">Eight consumer models. One prompt. A 25-point rubric for anatomy, bicycle structure and motion.</p>
  <div class="stats">
    <div class="tag"><b>08</b><span>runs</span></div>
    <div class="tag"><b>25</b><span>points</span></div>
    <div class="tag"><b>01</b><span>prompt</span></div>
    <div class="tag"><b>00</b><span>fixes</span></div>
  </div>
</div>
<div class="winner">
  <div class="label">Winner · ${winner.name}</div>
  <div class="poster"><img src="${posterData(winner.slug)}" alt=""></div>
  <div class="ribbon"><b>${totalOf(winner).toFixed(1)} / 25</b>Fastest pelican on the grid</div>
</div>
<div class="checker"></div>
</body></html>`;
}

async function captureOg(browser) {
  ensure(OG);
  ensure(path.join(SHOTS, "og"));
  const context = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();

  const shots = [
    { name: "home", html: homeCard() },
    ...models.map((model) => ({ name: model.slug, html: modelCard(model) })),
  ];

  for (const shot of shots) {
    await page.setContent(shot.html, { waitUntil: "load" });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        Array.from(document.images).map((img) =>
          img.decode().catch(() => {})
        )
      );
    });
    await page.waitForTimeout(120);
    const png = path.join(SHOTS, "og", `${shot.name}.png`);
    await page.screenshot({ path: png });
    const out = path.join(OG, `${shot.name}.png`);
    runMagick([png, "-resize", "1200x630", "-strip", out]);
    console.log(`og ${shot.name} → ${path.relative(ROOT, out)}`);
  }

  await context.close();
}

const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars", "--force-color-profile=srgb"],
});

try {
  await capturePosters(browser);
  await captureOg(browser);
} finally {
  await browser.close();
}

console.log("Posters and OG images written. Run `npm run build` to copy them into dist/.");
