import fs from "node:fs";
import path from "node:path";
import {
  siteMeta,
  ui,
  rubric,
  motionChecks,
  contactPoints,
  timeline,
  steps,
  checklist,
  faq,
  disambiguation,
} from "../data/content.mjs";
import { pages } from "../data/pages.mjs";
import { dateLabel, latestTestedAt, numberWord, paddedCount, testedRange } from "../data/counts.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "dist");
const SOURCE = path.join(ROOT, "鹈鹕骑自行车");
const LANGS = ["en", "zh"];
const HTML_LANG = { en: "en", zh: "zh-CN" };
const LOCALE = { en: "en_US", zh: "zh_CN" };
const SITE = siteMeta.url.replace(/\/+$/, "");
const DATE = siteMeta.testedAt;

const data = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "models.json"), "utf8"));
const models = data.models;
const prompt = data.prompt;
const reverse = data.reverse;

const totalOf = (model) => Object.values(model.scores).reduce((sum, value) => sum + value, 0);
const fmt = (value) => Number(value).toFixed(1);

const ranked = [...models].sort((a, b) => totalOf(b) - totalOf(a) || a.bib.localeCompare(b.bib));
const rankOf = new Map(ranked.map((model, index) => [model.slug, index + 1]));
const bySlug = new Map(models.map((model) => [model.slug, model]));
const leaders = ranked.filter((model) => totalOf(model) === totalOf(ranked[0]));
const padRuns = paddedCount(models.length);
const modelDate = (model) => model.testedAt || DATE;
const shortName = (model, lang) =>
  (lang === "zh" ? model.nameZh || model.name : model.name).split(" ")[0];
const leadLabel = (lang) => {
  const score = fmt(totalOf(ranked[0]));
  const names = leaders.map((model) => shortName(model, lang));
  if (lang === "en") return names.length > 1 ? `${names.join(" and ")} tie at ${score}` : `${names[0]} leads at ${score}`;
  return names.length > 1 ? `${names.join("与")} 并列 ${score}` : `${names[0]} ${score} 分领跑`;
};

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const raw = (value) => String(value);

const pageUrl = (lang, route) => {
  const base = route === "/" ? "/" : route;
  if (lang === "en") return base;
  return base === "/" ? "/zh/" : `/zh${base}`;
};

const modelRoute = (slug) => `/models/${slug}/`;

const abs = (route) => `${SITE}${route}`;

const label = (lang) => ui[lang].labels;

const vendorOf = (model, lang) =>
  lang === "zh" && model.vendorZh ? model.vendorZh : model.vendor;

const langName = (lang) => (lang === "en" ? "English" : "中文");

function ensure(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

function write(file, html) {
  ensure(file);
  fs.writeFileSync(file, html);
}

function copyFile(from, to) {
  if (!fs.existsSync(from)) {
    console.warn(`missing: ${from}`);
    return;
  }
  ensure(to);
  fs.copyFileSync(from, to);
}

function copyDir(from, to) {
  if (!fs.existsSync(from)) {
    console.warn(`missing directory: ${from}`);
    return;
  }
  fs.cpSync(from, to, { recursive: true });
}

function jsonLd(objects) {
  return objects
    .filter(Boolean)
    .map((object) => `<script type="application/ld+json">${JSON.stringify(object).replaceAll("<", "\\u003c")}</script>`)
    .join("\n  ");
}

function brandMark() {
  return `<svg class="brand-mark" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="35" r="7.5"/>
        <circle cx="36" cy="35" r="7.5"/>
        <path d="M12 35 L20 23 H30 L36 35"/>
        <path d="M20 23 L25 31 H12"/>
        <path d="M25 31 L30 23"/>
        <path d="M39 15 q4 -2.5 8 0 l-1 3 q-4 1.5 -7 -0.5 Z" fill="#e4572e" stroke="none"/>
        <circle cx="36" cy="13" r="4.5" fill="var(--paper, #f5f0e6)"/>
        <path d="M36 17.5 q1.5 2 3 1.5" stroke-width="1.6"/>
      </svg>`;
}

function head({ lang, route, title, description, image, imageAlt, ogType = "website", jsonld = [], noindex = false }) {
  const canonical = abs(pageUrl(lang, route));
  const enUrl = abs(pageUrl("en", route));
  const zhUrl = abs(pageUrl("zh", route));
  const ogImage = abs(image);
  const alt = imageAlt || title;
  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  ${noindex ? `<meta name="robots" content="noindex, follow">` : `<link rel="canonical" href="${esc(canonical)}">
  <link rel="alternate" hreflang="en" href="${esc(enUrl)}">
  <link rel="alternate" hreflang="zh-CN" href="${esc(zhUrl)}">
  <link rel="alternate" hreflang="x-default" href="${esc(enUrl)}">`}
  <meta property="og:type" content="${ogType}">
  <meta property="og:site_name" content="${esc(siteMeta.name)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:image" content="${esc(ogImage)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(alt)}">
  <meta property="og:locale" content="${LOCALE[lang]}">
  <meta property="og:locale:alternate" content="${LOCALE[lang === "en" ? "zh" : "en"]}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${esc(ogImage)}">
  <meta name="twitter:image:alt" content="${esc(alt)}">
  <meta name="theme-color" content="#f5f0e6">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="/assets/fonts/anton-400.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/archivo-var.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/fonts.css">
  <link rel="stylesheet" href="/assets/site.css">
  ${jsonLd.length ? jsonLd(jsonld) : ""}
  <script src="/assets/site.js" defer></script>
</head>`;
}

function ticker(lang) {
  const items =
    lang === "en"
      ? [
          "Animated LLM benchmark",
          `${padRuns} runs`,
          "25 points",
          "One prompt",
          "Zero fixes",
          leadLabel("en"),
          dateLabel(latestTestedAt, "en"),
          "Consumer clients",
          "Same-second comparison",
        ]
      : [
          "动画版 LLM 基准",
          `${padRuns} 次运行`,
          "25 分制",
          "同一道题",
          "零修图",
          leadLabel("zh"),
          dateLabel(latestTestedAt, "zh"),
          "客户端",
          "同一秒对比",
        ];
  const half = items.map((item) => `<span>${esc(item)}</span>`).join("");
  return `<div class="ticker" aria-hidden="true"><div class="ticker-track">${half}${half}</div></div>`;
}

function header(lang, route, current) {
  const t = ui[lang];
  const home = pageUrl(lang, "/");
  const navItems = [
    ["leaderboard", t.nav.leaderboard],
    ["compare", t.nav.compare],
    ["prompt", t.nav.prompt],
    ["methodology", t.nav.method],
  ];
  const nav = navItems
    .map(([key, text]) => {
      const href = pageUrl(lang, `/${key}/`);
      const active = current === (key === "methodology" ? "method" : key);
      return `<a class="nav-link" href="${href}"${active ? ' aria-current="page"' : ""}>${esc(text)}</a>`;
    })
    .join("\n        ");
  const other = lang === "en" ? "zh" : "en";
  const brandName = lang === "en" ? "Pelican Bicycle" : "鹈鹕骑自行车";
  return `<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="${home}" aria-label="${esc(siteMeta.name)}">
      ${brandMark()}
      <span class="brand-text"><strong>${brandName}</strong><span>${lang === "en" ? "Benchmark · 2026" : "基准 · 2026"}</span></span>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-open-label="${esc(t.footer.menu)}" data-close-label="${esc(lang === "en" ? "Close" : "关闭")}">
      <span class="nav-toggle-bars" aria-hidden="true"><span></span><span></span><span></span></span>
      ${esc(t.footer.menu)}
    </button>
    <nav class="site-nav" id="site-nav" aria-label="${esc(lang === "en" ? "Primary" : "主导航")}">
        ${nav}
        <a class="lang-switch" href="${pageUrl(other, route)}" hreflang="${t.langSwitch.hrefLang}" lang="${HTML_LANG[other]}">${esc(t.langSwitch.label)}</a>
    </nav>
  </div>
</header>`;
}

function footer(lang) {
  const t = ui[lang];
  const brandName = lang === "en" ? "Pelican Bicycle" : "鹈鹕骑自行车";
  const links = [
    ["leaderboard", t.nav.leaderboard],
    ["compare", t.nav.compare],
    ["prompt", t.nav.prompt],
    ["methodology", t.nav.method],
  ]
    .map(([key, text]) => `<li><a href="${pageUrl(lang, `/${key}/`)}">${esc(text)}</a></li>`)
    .join("\n          ");
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="brand" href="${pageUrl(lang, "/")}">
          ${brandMark()}
          <span class="brand-text"><strong>${brandName}</strong><span>${lang === "en" ? "Benchmark · 2026" : "基准 · 2026"}</span></span>
        </a>
        <p class="footer-display">${lang === "en" ? 'Pedal hard.<br><em>Judge harder.</em>' : '使劲蹬，<br><em>仔细看。</em>'}</p>
        <p class="footer-kicker">${esc(t.footer.tagline)}<br>${esc(t.footer.credit)}</p>
      </div>
      <div class="footer-col">
        <h3>${lang === "en" ? "The race" : "比赛"}</h3>
        <ul>
          ${links}
        </ul>
      </div>
      <div class="footer-note">
        <p>${esc(t.footer.note)}</p>
        <p>${esc(t.footer.attribution)}</p>
      </div>
    </div>
    <div class="footer-bottom">
      <span>${esc(t.footer.rights)}</span>
      <span>${lang === "en" ? "Simon Willison’s pelican test, extended to motion." : "把 Simon Willison 的鹈鹕测试，推进到运动。"}</span>
      <span class="footer-plain"><a href="/prompt.txt">prompt.txt</a> · <a href="/llms.txt">llms.txt</a></span>
    </div>
  </div>
</footer>`;
}

function layout({ lang, route, title, description, image, imageAlt, ogType, jsonld, noindex, current, pageKey, content }) {
  return `<!doctype html>
<html lang="${HTML_LANG[lang]}">
${head({ lang, route, title, description, image, imageAlt, ogType, jsonld, noindex })}
<body class="page-${pageKey}">
  <a class="skip-link" href="#main">${esc(ui[lang].footer.skip)}</a>
  ${ticker(lang)}
  ${header(lang, route, current)}
  <main id="main">
${content}
  </main>
  ${footer(lang)}
</body>
</html>
`;
}

function posterFor(model) {
  return `/assets/posters/${model.slug}.webp`;
}

function posterAlt(model, lang) {
  return lang === "en"
    ? `${model.name} — still frame from its animated pelican-on-a-bicycle run`
    : `${model.name} 的鹈鹕骑车动画静帧`;
}

function ogFor(page) {
  return page === "home" ? "/assets/og/home.png" : `/assets/og/${page}.png`;
}

function scoreRow(model, lang) {
  const rank = rankOf.get(model.slug);
  return `<tr>
          <td class="rank-cell${rank === 1 ? " is-first" : ""}">${rank}</td>
          <td class="bib-cell">${esc(model.bib)}</td>
          <td class="model-cell"><a href="${modelRoute(model.slug)}"><strong>${esc(model.name)}</strong><span>${esc(vendorOf(model, lang))}</span></a></td>
          ${rubric[lang].map((item) => `<td>${fmt(model.scores[item.key])}</td>`).join("")}
          <td class="total-cell">${fmt(totalOf(model))}<small>/25</small></td>
        </tr>`;
}

function scoreTable(lang, { caption }) {
  const t = label(lang);
  const swipe = lang === "en" ? "Swipe for scores →" : "左右滑动查看分数 →";
  return `<p class="table-swipe" aria-hidden="true">${swipe}</p>
    <div class="table-scroll">
      <table class="score-table">
        <caption class="sr-only">${esc(caption)}</caption>
        <thead>
          <tr>
            <th scope="col">${esc(t.rank)}</th>
            <th scope="col">${esc(t.bib)}</th>
            <th scope="col">${esc(t.model)}</th>
            ${rubric[lang].map((item) => `<th scope="col">${esc(item.short)}</th>`).join("")}
            <th scope="col">${esc(t.total)}</th>
          </tr>
        </thead>
        <tbody>
        ${ranked.map((model) => scoreRow(model, lang)).join("\n        ")}
        </tbody>
      </table>
    </div>`;
}

function homePage(lang) {
  const p = pages.home[lang];
  const t = ui[lang];
  const L = t.labels;
  const winner = ranked[0];
  const compareUrl = pageUrl(lang, "/compare/");
  const boardUrl = pageUrl(lang, "/leaderboard/");
  const promptUrl = pageUrl(lang, "/prompt/");
  const methodUrl = pageUrl(lang, "/methodology/");
  const winnerUrl = pageUrl(lang, modelRoute(winner.slug));
  const promptText = lang === "en" ? prompt.en : prompt.zh;
  const winnerLabel =
    leaders.length > 1
      ? lang === "en" ? "Joint first" : "并列第一"
      : lang === "en" ? "Winner" : "冠军";
  const isLeader = (model) => totalOf(model) === totalOf(ranked[0]);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: HTML_LANG[lang],
    mainEntity: faq[lang].map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: lang === "en" ? "Animated pelican-on-a-bicycle runs" : "鹈鹕骑车动画运行",
    numberOfItems: ranked.length,
    itemListElement: ranked.map((model, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: model.name,
      url: abs(pageUrl(lang, modelRoute(model.slug))),
    })),
  };
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: lang === "en" ? siteMeta.name : siteMeta.nameZh,
    url: abs(pageUrl(lang, "/")),
    inLanguage: HTML_LANG[lang],
    description: p.metaDescription,
  };

  const content = `    <section class="hero">
      <div class="wrap hero-grid">
        <div class="hero-copy reveal">
          <p class="eyebrow"><span class="eyebrow-dot" aria-hidden="true"></span>${esc(p.eyebrow)}</p>
          <h1>${p.h1}</h1>
          <p class="lede">${esc(p.lede)}</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="${compareUrl}">${esc(t.cta.start)}<span class="arrow" aria-hidden="true">→</span></a>
            <a class="btn btn-ghost" href="${boardUrl}">${esc(t.cta.board)}</a>
          </div>
          <p class="hero-note">${esc(p.heroNote)}</p>
        </div>
        <figure class="hero-figure reveal">
          <a class="poster-card" href="${winnerUrl}">
            <img src="${posterFor(winner)}" width="1200" height="750" alt="${esc(posterAlt(winner, lang))}" fetchpriority="high">
            <span class="poster-bib" aria-hidden="true">${esc(winner.bib)}</span>
            <span class="poster-stamp"><span>${winnerLabel}</span><strong>${fmt(totalOf(winner))}</strong><small>/ 25</small></span>
            <span class="poster-caption"><strong>${esc(winner.name)}</strong><span>${esc(winner.tagline[lang])}</span></span>
          </a>
          <figcaption>${esc(p.heroNote)} · ${esc(vendorOf(winner, lang))}</figcaption>
        </figure>
      </div>
    </section>

    <div class="wrap">
      <ul class="stat-strip reveal">
        ${p.stats.map((stat) => `<li><strong>${esc(stat.n)}</strong><span>${esc(stat.l)}</span></li>`).join("\n        ")}
      </ul>
    </div>

    <section class="prompt-band">
      <div class="wrap prompt-band-grid">
        <div class="reveal">
          <p class="section-label section-label--light">${lang === "en" ? "The exact prompt" : "原始提示词"}</p>
          <p class="prompt-quote" id="prompt-band-text">${esc(promptText)}</p>
          <p class="prompt-note">${esc(p.promptNote)}</p>
        </div>
        <div class="prompt-band-actions reveal">
          <button class="btn btn-light" type="button" data-copy-target="#prompt-band-text" data-copied="${esc(L.copied)}">${esc(L.copyPrompt)}</button>
          <a class="link-arrow" href="${promptUrl}">${lang === "en" ? "Prompt, checklist and how to run it" : "提示词、检查清单与跑法"} <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>

    <section class="section" id="grid">
      <div class="wrap">
        <div class="section-head reveal">
          <div>
            <p class="section-label">${lang === "en" ? "The field" : "参赛名单"}</p>
            <h2>${esc(p.gridTitle)}</h2>
          </div>
          <p class="section-aside">${esc(p.gridIntro)}</p>
        </div>
        <div class="race-grid">
          ${ranked
            .map(
              (model, index) => `<a class="race-card${isLeader(model) ? " race-card--winner" : ""} reveal" href="${pageUrl(lang, modelRoute(model.slug))}" style="--accent:${esc(model.accent)}">
            <div class="race-card-media">
              <img src="${posterFor(model)}" width="1200" height="750" alt="${esc(posterAlt(model, lang))}" loading="${index === 0 ? "eager" : "lazy"}">
              <span class="race-bib" aria-hidden="true">${esc(model.bib)}</span>
              ${isLeader(model) ? `<span class="ribbon">${winnerLabel}</span>` : ""}
              <span class="race-score">${fmt(totalOf(model))}<small>/25</small></span>
            </div>
            <div class="race-card-body">
              <span class="race-vendor">${esc(vendorOf(model, lang))}</span>
              <h3>${esc(model.name)}</h3>
              <p class="race-tagline">${esc(model.tagline[lang])}</p>
              <div class="race-meters">
                <span>${esc(rubric[lang][3].short)} <b>${fmt(model.scores.motion)}</b></span>
                <span>${esc(rubric[lang][1].short)} <b>${fmt(model.scores.anatomy)}</b></span>
              </div>
              <span class="race-cta">${esc(p.gridCta)}<span aria-hidden="true">→</span></span>
            </div>
          </a>`
            )
            .join("\n          ")}
        </div>
      </div>
    </section>

    <section class="scoreboard-section" id="scoreboard">
      <div class="wrap">
        <div class="section-head section-head--light reveal">
          <div>
            <p class="section-label section-label--light">${esc(L.scoreBoard)}</p>
            <h2>${esc(p.leaderTitle)}</h2>
          </div>
          <p class="section-aside">${esc(p.leaderIntro)}</p>
        </div>
        ${scoreTable(lang, { caption: p.leaderTitle })}
        <div class="score-board-foot">
          <p>${esc(p.scoreNote)}</p>
          <a class="link-arrow" href="${boardUrl}">${esc(p.leaderCta)} <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>

    <section class="section" id="rubric">
      <div class="wrap">
        <div class="section-head reveal">
          <div>
            <p class="section-label">${esc(L.rubric)}</p>
            <h2>${esc(p.rubricTitle)}</h2>
          </div>
          <p class="section-aside">${esc(p.rubricIntro)}</p>
        </div>
        <div class="rubric-intro reveal">
          <div class="rubric-total"><strong>25</strong><span>${lang === "en" ? "points<br>per run" : "分<br>每次运行"}</span></div>
          <p class="section-aside">${esc(pages.methodology[lang].rubricNote)}</p>
        </div>
        <div class="rubric-grid">
          ${rubric[lang]
            .map(
              (item, index) => `<article class="rubric-card reveal">
            <span class="rubric-num">${String(index + 1).padStart(2, "0")}</span>
            <h3>${esc(item.label)}</h3>
            <p>${esc(item.desc)}</p>
            <span class="rubric-points">${item.points} ${lang === "en" ? "points" : "分"}</span>
          </article>`
            )
            .join("\n          ")}
        </div>
      </div>
    </section>

    <section class="section" id="why">
      <div class="wrap why-grid">
        <div class="why-body reveal">
          <p class="section-label">${lang === "en" ? "Why motion" : "为什么是运动"}</p>
          <h2>${esc(p.whyTitle)}</h2>
          <p>${esc(p.whyBody)}</p>
          <p class="why-note">${esc(p.whyNote)}</p>
        </div>
        <aside class="contact-card reveal">
          <div class="contact-head">
            <h3>${esc(contactPoints[lang].title)}</h3>
            <p>${esc(contactPoints[lang].intro)}</p>
          </div>
          ${contactPoints[lang].items
            .map(
              (item) => `<div class="contact-row">
            <span class="contact-n" aria-hidden="true">${esc(item.n)}</span>
            <div>
              <p class="contact-join">${esc(item.a)} <i aria-hidden="true">↔</i> ${esc(item.b)}</p>
              <p>${esc(item.note)}</p>
            </div>
            <span class="contact-arrow" aria-hidden="true">→</span>
          </div>`
            )
            .join("")}
        </aside>
      </div>
    </section>

    <section class="section" id="timeline">
      <div class="wrap">
        <div class="section-head reveal">
          <div>
            <p class="section-label">${lang === "en" ? "Timeline" : "时间线"}</p>
            <h2>${esc(p.timelineTitle)}</h2>
          </div>
        </div>
        <div class="timeline">
          ${timeline[lang]
            .map(
              (item) => `<div class="timeline-item reveal">
            <span class="timeline-date">${esc(item.date)}</span>
            <p>${esc(item.text)}</p>
          </div>`
            )
            .join("\n          ")}
        </div>
      </div>
    </section>

    <section class="run-band" id="run-it">
      <div class="wrap">
        <div class="run-head">
          <h2>${esc(p.runTitle)}</h2>
          <p>${esc(p.runBody)}</p>
        </div>
        <div class="steps-grid">
          ${steps[lang]
            .map(
              (step, index) => `<div class="step-card reveal">
            <span class="step-n">${String(index + 1).padStart(2, "0")}</span>
            <p>${esc(step)}</p>
          </div>`
            )
            .join("\n          ")}
        </div>
        <div class="run-actions">
          <a class="btn btn-dark" href="${promptUrl}#checklist">${esc(p.runCta)}<span class="arrow" aria-hidden="true">→</span></a>
          <a class="btn btn-ghost" href="${compareUrl}">${esc(t.cta.compare)}</a>
        </div>
      </div>
    </section>

    <section class="section" id="faq">
      <div class="wrap">
        <div class="section-head reveal">
          <div>
            <p class="section-label">${lang === "en" ? "FAQ" : "常见问题"}</p>
            <h2>${esc(p.faqTitle)}</h2>
          </div>
          <p class="section-aside">${esc(p.faqIntro)}</p>
        </div>
        <div class="faq-grid">
          <div class="faq-list reveal">
            ${faq[lang]
              .map(
                (item, index) => `<details class="faq-item"${index === 0 ? " open" : ""}>
              <summary>${esc(item.q)}<span class="faq-plus" aria-hidden="true"></span></summary>
              <div class="faq-answer"><p>${esc(item.a)}</p></div>
            </details>`
              )
              .join("\n            ")}
          </div>
          <aside class="note-card reveal">
            <h3>${esc(L.wrongPelican)}</h3>
            <p>${esc(disambiguation[lang])}</p>
            <a class="link-arrow" href="${methodUrl}">${esc(t.cta.method)} <span aria-hidden="true">→</span></a>
          </aside>
        </div>
      </div>
    </section>

    <section class="closing">
      <div class="wrap closing-inner">
        <h2>${p.closingTitle}</h2>
        <p>${esc(p.closingBody)}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="${compareUrl}">${esc(p.closingCta)}<span class="arrow" aria-hidden="true">→</span></a>
          <a class="btn btn-ghost" href="${methodUrl}">${esc(t.cta.method)}</a>
        </div>
      </div>
    </section>`;

  return layout({
    lang,
    route: "/",
    title: p.metaTitle,
    description: p.metaDescription,
    image: ogFor("home"),
    imageAlt:
      lang === "en"
        ? `Pelican Bicycle Benchmark — ${models.length} AI models riding a bicycle, animated`
        : `鹈鹕骑自行车基准测试 — ${numberWord("zh", models.length)} 个 AI 模型的动画横评`,
    jsonld: [websiteLd, faqLd, itemListLd],
    current: "home",
    pageKey: "home",
    content,
  });
}

function leaderboardPage(lang) {
  const p = pages.leaderboard[lang];
  const t = ui[lang];
  const L = t.labels;
  const boardUrl = pageUrl(lang, "/leaderboard/");
  const methodUrl = pageUrl(lang, "/methodology/");
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: p.title,
    numberOfItems: ranked.length,
    itemListElement: ranked.map((model, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: model.name,
      url: abs(pageUrl(lang, modelRoute(model.slug))),
    })),
  };

  const content = `    <section class="page-hero">
      <div class="wrap reveal">
        <p class="eyebrow"><span class="eyebrow-dot" aria-hidden="true"></span>${esc(p.eyebrow)}</p>
        <h1>${esc(p.title)}</h1>
        <p class="lede">${esc(p.intro)}</p>
        <div class="page-hero-meta">
          <span>${esc(L.tested)} · ${esc(testedRange(lang))}</span>
          <span>${esc(pages.methodology[lang].accessValue)}</span>
          <span>${ranked.length} ${lang === "en" ? "runs" : "次运行"}</span>
        </div>
      </div>
    </section>

    <div class="wrap">
      <div class="podium">
        ${ranked
          .slice(0, 3)
          .map(
            (model, index) => `<a class="podium-card${index === 0 ? " podium-card--first" : ""} reveal" href="${pageUrl(lang, modelRoute(model.slug))}">
          <div class="podium-media">
            <img src="${posterFor(model)}" width="1200" height="750" alt="${esc(posterAlt(model, lang))}" loading="${index === 0 ? "eager" : "lazy"}">
            <span class="podium-rank" aria-hidden="true">#${index + 1}</span>
          </div>
          <div class="podium-body">
            <div><small>${esc(vendorOf(model, lang))}</small><h3>${esc(model.name)}</h3></div>
            <span class="podium-total">${fmt(totalOf(model))}<small>/25</small></span>
          </div>
        </a>`
          )
          .join("\n        ")}
      </div>

      <section class="board-section">
        ${scoreTable(lang, { caption: p.title })}
        <p class="board-note">${esc(p.note)}</p>
        <div class="board-actions">
          <a class="btn btn-ghost" href="${pageUrl(lang, "/")}#grid">${esc(L.back)}</a>
          <a class="btn" href="${methodUrl}">${esc(p.methodCta)}<span class="arrow" aria-hidden="true">→</span></a>
        </div>
      </section>
    </div>`;

  return layout({
    lang,
    route: "/leaderboard/",
    title: p.metaTitle,
    description: p.metaDescription,
    image: ogFor("home"),
    current: "leaderboard",
    pageKey: "leaderboard",
    jsonld: [itemListLd],
    content,
  });
}

function laneMarkupServer(model, lang) {
  const L = label(lang);
  return `<article class="lane" data-slug="${esc(model.slug)}" style="--accent:${esc(model.accent)}">
          <header class="lane-head">
            <span class="lane-bib">${esc(model.bib)}</span>
            <div>
              <h3>${esc(model.name)}</h3>
              <small>${esc(vendorOf(model, lang))}</small>
            </div>
            <span class="lane-total">${fmt(totalOf(model))}</span>
          </header>
          <div class="lane-frame">
            <img src="${posterFor(model)}" alt="${esc(posterAlt(model, lang))}" loading="lazy" width="1200" height="750">
            <div class="lane-idle">
              <strong>${esc(L.ready)}</strong>
              <span>${lang === "en" ? "Press start" : "点击开始"}</span>
            </div>
          </div>
        </article>`;
}

function comparePage(lang) {
  const p = pages.compare[lang];
  const t = ui[lang];
  const L = t.labels;
  const defaults = ["doubao-2-1-pro", "kimi-k3-1-pro"].filter((slug) => bySlug.has(slug));
  const compareModels = ranked.map((model) => ({
    slug: model.slug,
    name: model.name,
    bib: model.bib,
    vendor: vendorOf(model, lang),
    accent: model.accent,
    total: fmt(totalOf(model)),
    control: model.control,
    artifact: `/artifacts/${model.artifact}`,
    poster: posterFor(model),
  }));
  const compareLabels = {
    ready: L.ready,
    loading: L.loading,
    racing: L.racing,
    paused: L.paused,
    countdown: lang === "en" ? "Countdown" : "倒计时",
    go: lang === "en" ? "GO" : "开始",
    idle: L.ready,
    idleHint: lang === "en" ? "Press start" : "点击开始",
    pickerHint: p.pickHint,
    pickMore: lang === "en" ? "Select at least two runs." : "至少选择两次运行。",
    pickLess: lang === "en" ? `Choose at most ${ranked.length} runs.` : `最多选择 ${ranked.length} 次运行。`,
  };

  const content = `    <section class="compare-hero">
      <div class="wrap reveal">
        <p class="eyebrow"><span class="eyebrow-dot" aria-hidden="true"></span>${esc(p.eyebrow)}</p>
        <h1>${esc(p.title)}</h1>
        <p class="lede">${esc(p.intro)}</p>
      </div>
    </section>

    <div class="wrap compare-shell" data-compare data-min="2" data-max="${ranked.length}" data-defaults="${defaults.join(",")}" data-hint="${esc(p.pickHint)}">
      <fieldset class="picker reveal">
        <legend>${esc(p.pickTitle)}</legend>
        <p class="picker-hint" data-picker-msg>${esc(p.pickHint)}</p>
        <div class="lane-chips">
          ${ranked
            .map(
              (model) => `<label class="lane-chip" style="--accent:${esc(model.accent)}">
            <input type="checkbox" name="lane" value="${esc(model.slug)}"${defaults.includes(model.slug) ? " checked" : ""}>
            <span class="chip-box" aria-hidden="true"></span>
            <span class="chip-text"><strong>${esc(model.name)}</strong><small>${esc(vendorOf(model, lang))}</small></span>
            <span class="chip-score">${fmt(totalOf(model))}</span>
          </label>`
            )
            .join("\n          ")}
        </div>
      </fieldset>

      <div class="compare-stage-wrap reveal">
        <div class="compare-bar">
          <div class="compare-bar-left">
            <span class="status-pill" data-status><span class="status-dot" aria-hidden="true"></span><span data-status-text>${esc(L.ready)}</span></span>
            <div class="clock"><output data-clock>00:00.0</output><span>${esc(L.clock)}</span></div>
          </div>
          <div class="compare-controls">
            <button class="btn btn-primary btn-sm" type="button" data-start>${esc(L.startSync)}</button>
            <button class="btn btn-sm" type="button" data-pause hidden>${esc(L.pause)}</button>
            <button class="btn btn-sm" type="button" data-resume hidden>${esc(L.resume)}</button>
            <button class="btn btn-sm" type="button" data-restart hidden>${esc(L.restart)}</button>
          </div>
        </div>
        <div class="compare-stage" data-lanes>
          ${defaults.map((slug) => laneMarkupServer(bySlug.get(slug), lang)).join("\n          ")}
        </div>
        <div class="countdown" data-countdown hidden><span>3</span></div>
        <div class="compare-error" data-compare-error hidden>${esc(p.errorNote)}</div>
        <p class="compare-note"><strong>${lang === "en" ? "Sync" : "同步"}</strong><span>${esc(p.syncNote)}</span></p>
      </div>
      <script type="application/json" id="pb-model-data">${JSON.stringify(compareModels).replaceAll("<", "\\u003c")}</script>
      <script type="application/json" id="pb-compare-labels">${JSON.stringify(compareLabels).replaceAll("<", "\\u003c")}</script>
    </div>

    <section class="section">
      <div class="wrap">
        <div class="section-head reveal">
          <div>
            <p class="section-label">${lang === "en" ? "Contact points" : "接触点"}</p>
            <h2>${esc(p.howTitle)}</h2>
          </div>
          <p class="section-aside">${esc(p.howBody)}</p>
        </div>
        <div class="look-grid">
          ${contactPoints[lang].items
            .map(
              (item) => `<article class="look-card reveal">
            <span>${esc(item.n)}</span>
            <h3>${esc(item.a)} ↔ ${esc(item.b)}</h3>
            <p>${esc(item.note)}</p>
          </article>`
            )
            .join("\n          ")}
        </div>
      </div>
    </section>`;

  return layout({
    lang,
    route: "/compare/",
    title: p.metaTitle,
    description: p.metaDescription,
    image: ogFor("home"),
    current: "compare",
    pageKey: "compare",
    content,
  });
}

function modelPage(lang, model) {
  const p = pages.model[lang];
  const t = ui[lang];
  const L = t.labels;
  const rank = rankOf.get(model.slug);
  const total = fmt(totalOf(model));
  const artifactUrl = `/artifacts/${model.artifact}`;
  const sourceFile = path.join(SOURCE, path.basename(model.source));
  const size = fs.existsSync(sourceFile) ? `${(fs.statSync(sourceFile).size / 1024).toFixed(1)} KB` : "—";
  const controlsText = model.controls[lang];
  const hasControls = controlsText !== "无" && controlsText !== "None";
  const index = ranked.findIndex((entry) => entry.slug === model.slug);
  const prev = index > 0 ? ranked[index - 1] : null;
  const next = index < ranked.length - 1 ? ranked[index + 1] : null;
  const compareUrl = `${pageUrl(lang, "/compare/")}?runs=${encodeURIComponent(model.slug)}`;
  const boardUrl = pageUrl(lang, "/leaderboard/");

  const statusOf = (value) => {
    if (value === true) return { cls: "is-yes", text: L.yes };
    if (value === "partial") return { cls: "is-partial", text: L.partial };
    return { cls: "is-no", text: L.no };
  };

  const reviewLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "CreativeWork",
      name: model.name,
      genre: "AI-generated animation",
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: totalOf(model),
      bestRating: 25,
      worstRating: 0,
    },
    author: { "@type": "Organization", name: lang === "en" ? siteMeta.name : siteMeta.nameZh },
    reviewBody: model.verdict[lang],
    url: abs(pageUrl(lang, modelRoute(model.slug))),
    datePublished: modelDate(model),
    inLanguage: HTML_LANG[lang],
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: lang === "en" ? "Home" : "首页", item: abs(pageUrl(lang, "/")) },
      { "@type": "ListItem", position: 2, name: p.breadcrumb, item: abs(boardUrl) },
      {
        "@type": "ListItem",
        position: 3,
        name: model.name,
        item: abs(pageUrl(lang, modelRoute(model.slug))),
      },
    ],
  };

  const content = `    <section class="model-hero">
      <div class="wrap">
        <a class="breadcrumb" href="${boardUrl}">← ${esc(p.breadcrumb)}</a>
        <div class="model-title-row reveal">
          <span class="model-bib" aria-hidden="true">${esc(model.bib)}</span>
          <div class="model-title">
            <h1>${esc(model.name)}</h1>
            <div class="model-meta">
              <span>${esc(vendorOf(model, lang))}</span>
              <span>${esc(model.role[lang])}</span>
              <span>${esc(p.rankLabel)} ${rank} / ${ranked.length}</span>
            </div>
          </div>
          <div class="model-stamp"><strong>${total}</strong><small>/ 25</small></div>
        </div>
        <p class="model-tagline reveal">${esc(model.tagline[lang])}</p>
      </div>
    </section>

    <div class="wrap model-layout">
      <div class="run-panel reveal">
        <div class="run-frame" id="run-${esc(model.slug)}" data-run data-src="${esc(artifactUrl)}" data-title="${esc(model.name)} — ${esc(p.runTitle)}">
          <img class="poster" src="${posterFor(model)}" width="1200" height="750" alt="${esc(posterAlt(model, lang))}">
          <button class="play-btn" type="button" data-play>
            <span aria-hidden="true">▶</span>
            <span>${esc(L.play)}</span>
          </button>
          <button class="fs-btn" type="button" data-fullscreen title="${esc(L.fullscreen)}" aria-label="${esc(L.fullscreen)}" data-exit="${esc(L.exitFullscreen)}">
            <svg class="fs-enter" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"/></svg>
            <svg class="fs-exit" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"/></svg>
          </button>
          <div class="run-loading" data-loading hidden>${esc(L.loading)}</div>
        </div>
        <div class="run-actions">
          <button class="btn btn-sm" type="button" data-reload-for="run-${esc(model.slug)}" hidden>${esc(L.reload)}</button>
          <a class="btn btn-sm" href="${artifactUrl}" target="_blank" rel="noopener">${esc(L.openRaw)}</a>
          <a class="btn btn-sm" href="${artifactUrl}" download>${esc(L.download)}</a>
          <a class="btn btn-sm" href="${compareUrl}">${esc(L.compareThis)}</a>
        </div>
        <p class="run-note">${esc(p.runHint)}${hasControls ? "" : ` ${esc(p.noControls)}`}</p>
      </div>

      <div class="score-panel reveal" style="--accent:${esc(model.accent)}">
        <section class="panel-block">
          <h2 class="panel-title">${esc(p.scorecard)}<span>25 ${lang === "en" ? "pts" : "分"}</span></h2>
          <dl>
            ${rubric[lang]
              .map(
                (item) => `<div class="bar-row">
              <dt>${esc(item.short)}</dt>
              <div class="bar-track"><span class="bar-fill" style="--v:${(model.scores[item.key] / item.points) * 100}%"></span></div>
              <dd>${fmt(model.scores[item.key])}</dd>
            </div>`
              )
              .join("\n            ")}
          </dl>
          <div class="total-row"><span>${esc(p.totalLabel)}</span><div><strong>${total}</strong> <small>${esc(p.outOf)}</small></div></div>
        </section>

        <section class="panel-block">
          <h2 class="panel-title">${esc(p.motion)}</h2>
          <dl class="motion-grid">
            ${Object.entries(motionChecks[lang])
              .map(([key, text]) => {
                const status = statusOf(model.motionCheck[key]);
                return `<div class="motion-cell">
              <dt>${esc(text)}</dt>
              <dd class="motion-status ${status.cls}"><span class="status-dot" aria-hidden="true"></span>${esc(status.text)}</dd>
            </div>`;
              })
              .join("\n            ")}
          </dl>
        </section>

        <section class="panel-block">
          <h2 class="panel-title">${esc(p.verdict)}</h2>
          <p class="verdict-text">${esc(model.verdict[lang])}</p>
        </section>

        <section class="panel-block">
          <h2 class="panel-title">${esc(p.works)}</h2>
          <ul class="works-list">${model.works[lang].map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
        </section>

        <section class="panel-block">
          <h2 class="panel-title">${esc(p.breaks)}</h2>
          <ul class="breaks-list">${model.breaks[lang].map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
        </section>

        <section class="panel-block">
          <h2 class="panel-title">${esc(p.spec)}</h2>
          <dl class="spec-list">
            <div><dt>${esc(p.vendorLabel)}</dt><dd>${esc(vendorOf(model, lang))}</dd></div>
            ${model.client ? `<div><dt>${esc(p.clientLabel)}</dt><dd>${esc(lang === "zh" ? model.clientZh || model.client : model.client)}</dd></div>` : ""}
            <div><dt>${esc(p.accessLabel)}</dt><dd>${esc(p.accessValue)}</dd></div>
            <div><dt>${esc(p.testedLabel)}</dt><dd>${esc(modelDate(model))}</dd></div>
            <div><dt>${esc(p.controlsLabel)}</dt><dd>${esc(controlsText)}</dd></div>
            <div><dt>${esc(p.fileLabel)}</dt><dd>${esc(model.artifact)} · ${esc(size)}</dd></div>
            <div><dt>${esc(p.rankLabel)}</dt><dd>${rank} / ${ranked.length}</dd></div>
          </dl>
          <p class="editorial-note">${esc(p.editorialNote)}</p>
        </section>
      </div>
    </div>

    <div class="wrap">
      <nav class="model-nav" aria-label="${lang === "en" ? "Run navigation" : "运行导航"}">
        ${
          prev
            ? `<a class="nav-card" href="${pageUrl(lang, modelRoute(prev.slug))}">
          <span class="nav-bib" aria-hidden="true">${esc(prev.bib)}</span>
          <span><small>${esc(p.prev)}</small><strong>${esc(prev.name)}</strong></span>
        </a>`
            : `<span aria-hidden="true"></span>`
        }
        ${
          next
            ? `<a class="nav-card nav-card--next" href="${pageUrl(lang, modelRoute(next.slug))}">
          <span><small>${esc(p.next)}</small><strong>${esc(next.name)}</strong></span>
          <span class="nav-bib" aria-hidden="true">${esc(next.bib)}</span>
        </a>`
            : `<span aria-hidden="true"></span>`
        }
      </nav>
    </div>`;

  return layout({
    lang,
    route: modelRoute(model.slug),
    title: `${p.metaTitle(model.name)} · ${lang === "en" ? siteMeta.name : siteMeta.nameZh}`,
    description: p.metaDesc(model.name, total),
    image: `/assets/og/${model.slug}.png`,
    imageAlt:
      lang === "en"
        ? `${model.name} — animated pelican on a bicycle, ${total}/25`
        : `${model.name} 的鹈鹕骑车动画，${total}/25`,
    ogType: "article",
    current: "leaderboard",
    pageKey: "model",
    jsonld: [reviewLd, breadcrumbLd],
    content,
  });
}

function reverseSection(lang) {
  const p = pages.prompt[lang];
  const m = pages.model[lang];
  const L = ui[lang].labels;
  const run = reverse.run;
  const artifactUrl = `/artifacts/${run.artifact}`;
  const sourceFile = path.join(ROOT, run.source);
  const size = fs.existsSync(sourceFile) ? `${(fs.statSync(sourceFile).size / 1024).toFixed(1)} KB` : "—";
  const alt =
    lang === "en"
      ? `${run.name} — still frame from the reversed-prompt run, a bicycle riding a pelican`
      : `${run.name} 的反向提示词运行静帧：自行车骑鹈鹕`;

  return `    <section class="section" id="control-flip">
      <div class="wrap">
        <div class="section-head reveal">
          <div>
            <p class="section-label">${esc(p.reverseLabel)}</p>
            <h2>${esc(p.reverseTitle)}</h2>
          </div>
          <p class="section-aside">${esc(p.reverseIntro)}</p>
        </div>

        <div class="model-layout">
          <div class="run-panel reveal">
            <div class="run-frame" id="run-${esc(run.slug)}" data-run data-src="${esc(artifactUrl)}" data-title="${esc(run.name)} — ${esc(p.reverseRunLabel)}">
              <img class="poster" src="${posterFor(run)}" width="1200" height="750" alt="${esc(alt)}" loading="lazy">
              <button class="play-btn" type="button" data-play>
                <span aria-hidden="true">▶</span>
                <span>${esc(L.play)}</span>
              </button>
              <button class="fs-btn" type="button" data-fullscreen title="${esc(L.fullscreen)}" aria-label="${esc(L.fullscreen)}" data-exit="${esc(L.exitFullscreen)}">
                <svg class="fs-enter" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"/></svg>
                <svg class="fs-exit" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"/></svg>
              </button>
              <div class="run-loading" data-loading hidden>${esc(L.loading)}</div>
            </div>
            <div class="run-actions">
              <a class="btn btn-sm" href="${artifactUrl}" target="_blank" rel="noopener">${esc(L.openRaw)}</a>
              <a class="btn btn-sm" href="${artifactUrl}" download>${esc(L.download)}</a>
            </div>
            <p class="run-note">${esc(run.namedFrom[lang])}</p>
          </div>

          <div class="score-panel reveal" style="--accent:${esc(run.accent)}">
            <section class="panel-block">
              <h2 class="panel-title">${esc(p.reversePromptLabel)}</h2>
              <p class="prompt-text" id="prompt-reverse">${esc(reverse.prompt[lang])}</p>
              <button class="btn copy-btn" type="button" data-copy-target="#prompt-reverse" data-copied="${esc(L.copied)}">${esc(L.copy)}</button>
            </section>

            <section class="panel-block">
              <h2 class="panel-title">${esc(p.reverseWorks)}</h2>
              <ul class="works-list">${run.works[lang].map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
            </section>

            <section class="panel-block">
              <h2 class="panel-title">${esc(p.reverseBreaks)}</h2>
              <ul class="breaks-list">${run.breaks[lang].map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
            </section>

            <section class="panel-block">
              <h2 class="panel-title">${esc(m.verdict)}</h2>
              <p class="verdict-text">${esc(run.verdict[lang])}</p>
            </section>

            <section class="panel-block">
              <h2 class="panel-title">${esc(m.spec)}</h2>
              <dl class="spec-list">
                <div><dt>${esc(m.vendorLabel)}</dt><dd>${esc(lang === "zh" ? run.vendorZh : run.vendor)}</dd></div>
                <div><dt>${esc(m.testedLabel)}</dt><dd>${esc(dateLabel(reverse.testedAt, lang))}</dd></div>
                <div><dt>${esc(m.controlsLabel)}</dt><dd>${esc(run.controls[lang])}</dd></div>
                <div><dt>${esc(m.fileLabel)}</dt><dd>${esc(run.artifact)} · ${esc(size)}</dd></div>
              </dl>
              <p class="editorial-note">${esc(p.reverseNotRanked)}</p>
            </section>
          </div>
        </div>
      </div>
    </section>`;
}

function promptPage(lang) {
  const p = pages.prompt[lang];
  const t = ui[lang];
  const L = t.labels;
  const originalLabel = lang === "en" ? "Original · Chinese" : "原文 · 中文";
  const translationLabel = p.translationLabel;
  const chars = (text) => `${text.replace(/\s/g, "").length}`;
  const boardUrl = pageUrl(lang, "/leaderboard/");
  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: lang === "en" ? "Run the pelican bicycle test on your own AI" : "用你自己的 AI 跑一遍鹈鹕自行车测试",
    inLanguage: HTML_LANG[lang],
    totalTime: "PT10M",
    step: steps[lang].map((step) => ({ "@type": "HowToStep", text: step })),
  };

  const content = `    <section class="prompt-hero">
      <div class="wrap reveal">
        <p class="eyebrow"><span class="eyebrow-dot" aria-hidden="true"></span>${esc(p.eyebrow)}</p>
        <h1>${esc(p.title)}</h1>
        <p class="lede">${esc(p.intro)}</p>
      </div>
    </section>

    <div class="wrap prompt-cards">
      <article class="prompt-card prompt-card--original reveal">
        <div class="prompt-card-head">
          <span class="prompt-label">${esc(originalLabel)}</span>
          <button class="btn copy-btn" type="button" data-copy-target="#prompt-original" data-copied="${esc(L.copied)}">${esc(L.copy)}</button>
        </div>
        <p class="prompt-text" id="prompt-original">${esc(prompt.zh)}</p>
        <div class="prompt-card-foot">
          <span>${esc(p.caveat)}</span>
          <span>${chars(prompt.zh)} ${lang === "en" ? "characters" : "字"}</span>
        </div>
      </article>

      <article class="prompt-card prompt-card--translation reveal">
        <div class="prompt-card-head">
          <span class="prompt-label">${esc(translationLabel)}</span>
          <button class="btn copy-btn" type="button" data-copy-target="#prompt-translation" data-copied="${esc(L.copied)}">${esc(L.copy)}</button>
        </div>
        <p class="prompt-text" id="prompt-translation">${esc(prompt.en)}</p>
        <div class="prompt-card-foot">
          <span>${lang === "en" ? "Sent once per model. No follow-ups." : "每个模型只发送一次，不追问。"}</span>
          <span>${chars(prompt.en)} ${lang === "en" ? "characters" : "字符"}</span>
        </div>
      </article>
    </div>

    ${reverseSection(lang)}

    <section class="section" id="checklist">
      <div class="wrap">
        <div class="section-head reveal">
          <div>
            <p class="section-label">${lang === "en" ? "Checklist" : "检查清单"}</p>
            <h2>${esc(p.checklistTitle)}</h2>
          </div>
          <p class="section-aside">${esc(p.checklistIntro)}</p>
        </div>
        <div class="checklist reveal">
          ${checklist[lang]
            .map(
              (item, index) => `<label class="check-item">
            <span class="check-num">${String(index + 1).padStart(2, "0")}</span>
            <span class="check-body">${esc(item.q)}<span class="check-tag">${esc(item.tag)}</span></span>
            <input type="checkbox" aria-label="${esc(item.q)}">
            <span class="check-box" aria-hidden="true"></span>
          </label>`
            )
            .join("\n          ")}
        </div>
      </div>
    </section>

    <section class="steps-section">
      <div class="wrap">
        <div class="section-head reveal">
          <div>
            <p class="section-label">${esc(p.runTitle)}</p>
            <h2>${lang === "en" ? "Four steps, ten minutes" : "四步，十分钟"}</h2>
          </div>
          <p class="section-aside">${esc(p.intro)}</p>
        </div>
        <div class="steps-grid">
          ${steps[lang]
            .map(
              (step, index) => `<div class="step-card reveal">
            <span class="step-n">${String(index + 1).padStart(2, "0")}</span>
            <p>${esc(step)}</p>
          </div>`
            )
            .join("\n          ")}
        </div>
        <div class="run-actions">
          <a class="btn btn-dark" href="/prompt.txt" download>${esc(p.download)}</a>
          <a class="btn btn-ghost" href="${boardUrl}">${esc(p.cta)}<span class="arrow" aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="dumb-card reveal">
          <h2>${esc(p.dumbTitle)}</h2>
          <p>${esc(p.dumbBody)}</p>
        </div>
      </div>
    </section>`;

  return layout({
    lang,
    route: "/prompt/",
    title: p.metaTitle,
    description: p.metaDescription,
    image: ogFor("home"),
    current: "prompt",
    pageKey: "prompt",
    jsonld: [howToLd],
    content,
  });
}

function methodologyPage(lang) {
  const p = pages.methodology[lang];
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${p.title} — ${lang === "en" ? siteMeta.name : siteMeta.nameZh}`,
    description: p.metaDescription,
    datePublished: DATE,
    dateModified: latestTestedAt,
    inLanguage: HTML_LANG[lang],
    author: { "@type": "Organization", name: lang === "en" ? siteMeta.name : siteMeta.nameZh },
    mainEntityOfPage: abs(pageUrl(lang, "/methodology/")),
  };
  const sections = [
    ["origin", p.originTitle, `<p>${esc(p.originBody)}</p>`],
    ["variant", p.variantTitle, `<p>${esc(p.variantBody)}</p>`],
    ["protocol", p.protocolTitle, `<ol class="protocol-list">${p.protocol.map((item) => `<li>${esc(item)}</li>`).join("")}</ol>`],
    [
      "rubric",
      p.rubricTitle,
      `<p>${esc(p.rubricNote)}</p>
      <div class="table-scroll" style="margin-top:18px">
        <table class="rubric-table">
          <thead><tr><th scope="col">${lang === "en" ? "Dimension" : "维度"}</th><th scope="col">${lang === "en" ? "What we look for" : "看什么"}</th><th scope="col">${lang === "en" ? "Points" : "分值"}</th></tr></thead>
          <tbody>
            ${rubric[lang].map((item) => `<tr><td>${esc(item.label)}</td><td>${esc(item.desc)}</td><td>${item.points}</td></tr>`).join("\n            ")}
          </tbody>
        </table>
      </div>`,
    ],
    ["limits", p.limitsTitle, `<ul class="limits-list">${p.limits.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`],
    ["attribution", p.attributionTitle, `<div class="attribution-card"><p>${p.attributionBody}</p></div>`],
    ["changelog", p.changelogTitle, `<ul class="changelog-list">${p.changelog.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`],
  ];

  const content = `    <section class="method-hero">
      <div class="wrap reveal">
        <p class="eyebrow"><span class="eyebrow-dot" aria-hidden="true"></span>${esc(p.eyebrow)}</p>
        <h1>${esc(p.title)}</h1>
        <p class="lede">${esc(p.intro)}</p>
      </div>
    </section>

    <div class="wrap method-layout">
      <nav class="method-toc" aria-label="${lang === "en" ? "On this page" : "本页目录"}">
        <p>${lang === "en" ? "On this page" : "本页目录"}</p>
        <ol>
          ${sections.map(([id, title]) => `<li><a href="#${id}">${esc(title)}</a></li>`).join("\n          ")}
        </ol>
      </nav>
      <article>
        ${sections
          .map(
            ([id, title, body]) => `<section class="method-section" id="${id}">
          <h2>${esc(title)}</h2>
          ${body}
        </section>`
          )
          .join("\n        ")}
      </article>
    </div>`;

  return layout({
    lang,
    route: "/methodology/",
    title: p.metaTitle,
    description: p.metaDescription,
    image: ogFor("home"),
    ogType: "article",
    current: "method",
    pageKey: "methodology",
    jsonld: [articleLd],
    content,
  });
}

function notFoundPage() {
  const lang = "en";
  const t = ui[lang];
  const content = `    <section class="notfound">
      <div class="wrap">
        <p class="notfound-code" aria-hidden="true">404</p>
        <h1>Wrong pelican.</h1>
        <p>This page does not exist. The bicycle is in the shop. Try the starting grid or the leaderboard instead.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="/">${esc(t.cta.start)}</a>
          <a class="btn btn-ghost" href="/leaderboard/">${esc(t.cta.board)}</a>
        </div>
      </div>
    </section>`;
  return layout({
    lang,
    route: "/404.html",
    title: "404 — Wrong pelican",
    description: "This page does not exist. Return to the pelican bicycle benchmark.",
    image: ogFor("home"),
    noindex: true,
    current: "",
    pageKey: "404",
    content,
  });
}

function sitemap(routes) {
  const entries = [];
  for (const route of routes) {
    for (const lang of LANGS) {
      const loc = abs(pageUrl(lang, route));
      entries.push(`  <url>
    <loc>${esc(loc)}</loc>
    <lastmod>${latestTestedAt}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${esc(abs(pageUrl("en", route)))}"/>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${esc(abs(pageUrl("zh", route)))}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(abs(pageUrl("en", route)))}"/>
  </url>`);
    }
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`;
}

function llmsTxt() {
  const leaderTotal = totalOf(ranked[0]);
  const resultLines = ranked.map((model, index) => {
    const total = fmt(totalOf(model));
    const tie = totalOf(model) === leaderTotal && leaders.length > 1 ? " (joint first)" : "";
    const rank = index + 1;
    return `${String(rank).padStart(2, " ")}. ${model.name} — ${total}/25${tie} — ${model.tagline.en} — ${SITE}${modelRoute(model.slug)}`;
  });
  const pageLines = (lang) =>
    [
      [lang === "en" ? "Home" : "首页", "/", lang === "en" ? "Overview, the animated scorecard and the full field." : "总览、动画记分卡和完整参赛名单。"],
      [lang === "en" ? "Leaderboard" : "排行榜", "/leaderboard/", lang === "en" ? "Ranked table with per-criterion scores out of 25." : "按四项标准给出 25 分制明细的排行榜。"],
      [lang === "en" ? "Compare" : "并排对比", "/compare/", lang === "en" ? `Synchronised side-by-side player, 2–${models.length} lanes, deep-linkable with ?runs=slug,slug.` : `同步并排播放器，2–${models.length} 条车道，可用 ?runs=slug,slug 深链。`],
      [lang === "en" ? "Prompt" : "提示词", "/prompt/", lang === "en" ? "The exact prompt, a 10-point checklist and the reversed-prompt control run." : "完整提示词、10 条自查清单，以及主宾对调的反向对照运行。"],
      [lang === "en" ? "Methodology" : "方法", "/methodology/", lang === "en" ? "Scoring rubric, evidence method and the limits of this benchmark." : "评分标准、取证方法与本基准的局限。"],
    ]
      .map(([name, route, desc]) => `- [${name}](${abs(pageUrl(lang, route))}): ${desc}`)
      .join("\n");

  return `# ${siteMeta.name}

> One identical prompt sent to ${models.length} consumer LLMs: an animated SVG of a pelican riding a bicycle. Every output is served unmodified and scored out of 25 on pelican anatomy, bicycle structure, motion and scene.

Tested ${testedRange("en")}. Scores are editorial judgements against the published rubric, backed by frame-diff evidence from headless Chrome.
The test descends from Simon Willison's pelican-on-a-bicycle benchmark (25 Oct 2024).

## Results

${resultLines.join("\n")}

## Pages

${pageLines("en")}

## 中文版本

${pageLines("zh")}

## Prompts

Original (Chinese, sent verbatim):
${prompt.zh}

English translation:
${prompt.en}

Reversed control run (Chinese, sent verbatim) — subject and object swapped, ${reverse.run.name}:
${reverse.prompt.zh}

## Files

- Prompt permalink: ${SITE}/prompt.txt
- Unmodified model artifacts: ${SITE}/artifacts/<slug>.html (slug per model, e.g. ${SITE}/artifacts/${models[0].artifact})
- Sitemap: ${SITE}/sitemap.xml
`;
}

function build() {
  if (!fs.existsSync(SOURCE)) {
    console.error(`Source folder not found: ${SOURCE}`);
    process.exit(1);
  }
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const staticRoutes = ["/", "/leaderboard/", "/compare/", "/prompt/", "/methodology/"];
  const routes = [...staticRoutes, ...models.map((model) => modelRoute(model.slug))];

  for (const model of models) {
    const source = path.join(SOURCE, path.basename(model.source));
    if (!fs.existsSync(source)) {
      console.warn(`artifact missing: ${model.source}`);
      continue;
    }
    const dest = path.join(OUT, "artifacts", model.artifact);
    ensure(dest);
    fs.copyFileSync(source, dest);
  }

  const reverseSource = path.join(ROOT, reverse.run.source);
  if (!fs.existsSync(reverseSource)) {
    console.warn(`artifact missing: ${reverse.run.source}`);
  } else {
    const dest = path.join(OUT, "artifacts", reverse.run.artifact);
    ensure(dest);
    fs.copyFileSync(reverseSource, dest);
  }

  copyDir(path.join(ROOT, "assets", "fonts"), path.join(OUT, "assets", "fonts"));
  copyDir(path.join(ROOT, "assets", "posters"), path.join(OUT, "assets", "posters"));
  copyDir(path.join(ROOT, "assets", "og"), path.join(OUT, "assets", "og"));
  for (const file of ["fonts.css", "site.css", "site.js", "favicon.svg"]) {
    copyFile(path.join(ROOT, "assets", file), path.join(OUT, "assets", file));
  }

  for (const lang of LANGS) {
    write(path.join(OUT, ...lang === "en" ? [] : ["zh"], "index.html"), homePage(lang));
    write(path.join(OUT, ...lang === "en" ? [] : ["zh"], "leaderboard", "index.html"), leaderboardPage(lang));
    write(path.join(OUT, ...lang === "en" ? [] : ["zh"], "compare", "index.html"), comparePage(lang));
    write(path.join(OUT, ...lang === "en" ? [] : ["zh"], "prompt", "index.html"), promptPage(lang));
    write(path.join(OUT, ...lang === "en" ? [] : ["zh"], "methodology", "index.html"), methodologyPage(lang));
    for (const model of models) {
      write(
        path.join(OUT, ...lang === "en" ? [] : ["zh"], "models", model.slug, "index.html"),
        modelPage(lang, model)
      );
    }
  }

  write(path.join(OUT, "404.html"), notFoundPage());

  write(path.join(OUT, "sitemap.xml"), sitemap(routes));
  write(
    path.join(OUT, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`
  );
  write(
    path.join(OUT, "prompt.txt"),
    `PELICAN BICYCLE BENCHMARK — PROMPT (v1.1 · ${latestTestedAt})
${SITE}/prompt/

ORIGINAL (Chinese, sent verbatim):
${prompt.zh}

ENGLISH TRANSLATION:
${prompt.en}

Sent once to each model. No follow-ups, no corrections, no fixes.
Prompt lineage: Simon Willison's pelican-on-a-bicycle test (25 Oct 2024).
`
  );

  write(path.join(OUT, "llms.txt"), llmsTxt());

  const pagesBuilt = routes.length * LANGS.length;
  console.log(`Built ${pagesBuilt} pages + 404 → ${path.relative(ROOT, OUT)}`);
  console.log(`Runs: ${models.length} · ranked: ${ranked.map((model) => `${model.name} ${fmt(totalOf(model))}`).join(" · ")}`);
  const missingPosters = models.filter((model) => !fs.existsSync(path.join(ROOT, "assets", "posters", `${model.slug}.webp`)));
  if (missingPosters.length) {
    console.warn(`posters missing (${missingPosters.length}): run \`npm run posters\``);
  }
}

build();
