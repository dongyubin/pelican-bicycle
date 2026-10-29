# Pelican Bicycle

A bilingual (English / 简体中文) static benchmark site for the animated pelican-on-a-bicycle test. Ten models got one identical prompt in a consumer client; their original HTML animations are shown unmodified next to editorial scorecards.

## Commands

```bash
npm install        # one dev dependency: playwright-core
npm run build      # render 30 pages + 404 into dist/
npm run serve      # preview dist/ at http://localhost:8899 (PORT=... to change)
npm run posters    # re-shoot posters and OG cards (needs Chrome + ImageMagick)
```

The site is pure HTML/CSS/JS in `dist/`. There is no runtime framework and no backend; deploy the folder as-is, with `/` resolving to `dist/index.html`. On Vercel, import the repo — `vercel.json` sets the build command, `dist` output and trailing slashes.

## Before deploying

`SITE_URL` defaults to `https://pelican-bicycle.wwkejishe.top` in `data/content.mjs`; override it in the Vercel project's environment variables if the domain ever changes. Canonicals, hreflang, sitemap, robots, `prompt.txt` and `llms.txt` all derive from it.

## Layout

```
鹈鹕骑自行车/            original model HTML outputs (never edited)
自行车骑鹈鹕/            reversed-prompt control run (never edited)
data/models.json        runs, scores, verdicts, artifact paths, reversed control
data/counts.mjs         run count, number words and test dates derived from models.json
data/content.mjs        site meta, UI labels, rubric, copy blocks
data/pages.mjs          per-page EN/ZH titles and descriptions
scripts/build.mjs       static renderer → dist/
scripts/shoot.mjs       poster + OG screenshot generator
scripts/serve.mjs       zero-dependency preview server
assets/                 site.css, site.js, fonts, posters, OG images
```

## Adding a run

1. Put the model's self-contained HTML in `鹈鹕骑自行车/` and add its filename as `artifact` plus the source path as `source` in `data/models.json`.
2. Add an entry to `data/models.json` with a unique `slug`, `bib`, bilingual `name`, `vendor`/`vendorZh`, `role`, `tagline`, `accent`, `control` mode (`waapi`, `button`, or `none`), the five scores (each out of 5), and the bilingual `verdict` / `works` / `breaks` / `motionCheck` content. Add `testedAt` when the run happened on a different date than the top-level `testedAt`, and `client`/`clientZh` when the run came through a named client app.
3. Run `npm run posters` to generate `assets/posters/<slug>.webp` and `assets/og/<slug>.png`. `scripts/shoot.mjs` has a `still` map for runs that need a specific frame, a native button click, or a cancelled animation; add the new slug there if its poster needs one.
4. Run `npm run build`.

Pages, ranking order, JSON-LD, sitemap entries, language switchers, the run count in every headline and the compare picker are all generated from `data/models.json`.

## Reversed control

`data/models.json → reverse` holds one run produced from the same sentence with subject and object swapped (自行车骑鹈鹕). It renders as the "Control flip" block on `/prompt/` and is deliberately **not** ranked: a different prompt is not comparable, and one model is not a field. Its artifact is copied to `dist/artifacts/` by `scripts/build.mjs`, its poster by `npm run posters`.

## Scoring

Five dimensions — semantics, anatomy/contact, bicycle structure, motion physics, polish/interaction — each scored 0–5, total out of 25. Scores are editorial, one zero-shot run per model, tested on 2026-10-27 and 2026-10-28. Full rubric: `/methodology/`.

The canonical pelican test comes from Simon Willison; this site is an animated extension and is not affiliated with the models, vendors or the original authors.
