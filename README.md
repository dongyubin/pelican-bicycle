# Pelican Bicycle

A bilingual (English / 简体中文) static benchmark site for the animated pelican-on-a-bicycle test. Eight models got one identical prompt in a consumer client; their original HTML animations are shown unmodified next to editorial scorecards.

## Commands

```bash
npm install        # one dev dependency: playwright-core
npm run build      # render 26 pages + 404 into dist/
npm run serve      # preview dist/ at http://localhost:8899 (PORT=... to change)
npm run posters    # re-shoot posters and OG cards (needs Chrome + ImageMagick)
```

The site is pure HTML/CSS/JS in `dist/`. There is no runtime framework and no backend; deploy the folder as-is, with `/` resolving to `dist/index.html`. On Vercel, import the repo — `vercel.json` sets the build command, `dist` output and trailing slashes.

## Before deploying

Set `SITE_URL` (e.g. in the Vercel project's environment variables) or edit `siteMeta.url` in `data/content.mjs`. Canonicals, hreflang, sitemap and OG URLs all derive from it. The build warns while it is still `example.com`.

## Layout

```
鹈鹕骑自行车/            original model HTML outputs (never edited)
data/models.json        runs, scores, verdicts, artifact paths
data/content.mjs        site meta, UI labels, rubric, copy blocks
data/pages.mjs          per-page EN/ZH titles and descriptions
scripts/build.mjs       static renderer → dist/
scripts/shoot.mjs       poster + OG screenshot generator
scripts/serve.mjs       zero-dependency preview server
assets/                 site.css, site.js, fonts, posters, OG images
```

## Adding a run

1. Put the model's self-contained HTML in `鹈鹕骑自行车/` and add its filename as `artifact` plus the source path as `source` in `data/models.json`.
2. Add an entry to `data/models.json` with a unique `slug`, `bib`, bilingual `name`, `vendor`/`vendorZh`, `role`, `tagline`, `accent`, `control` mode (`waapi`, `button`, or `none`), the five scores (each out of 5), and the bilingual `verdict` / `works` / `breaks` / `motionCheck` content.
3. Run `npm run posters` to generate `assets/posters/<slug>.webp` and `assets/og/<slug>.png`. `scripts/shoot.mjs` has a `still` map for runs that need a specific frame, a native button click, or a cancelled animation; add the new slug there if its poster needs one.
4. Run `npm run build`.

Pages, ranking order, JSON-LD, sitemap entries, language switchers and the compare picker are all generated from `data/models.json`.

## Scoring

Five dimensions — semantics, anatomy/contact, bicycle structure, motion physics, polish/interaction — each scored 0–5, total out of 25. Scores are editorial, one zero-shot run per model on 2026-10-27. Full rubric: `/methodology/`.

The canonical pelican test comes from Simon Willison; this site is an animated extension and is not affiliated with the models, vendors or the original authors.
