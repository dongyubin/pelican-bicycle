import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const css = fs.readFileSync('scripts/.fonts.css', 'utf8');
const re = /\/\* latin \*\/\s*@font-face\s*\{([^}]+)\}/g;
const faces = [];
let m;
while ((m = re.exec(css))) {
  const b = m[1];
  const family = (b.match(/font-family:\s*'([^']+)'/) || [])[1];
  const weight = (b.match(/font-weight:\s*([0-9]+)/) || [])[1] || '400';
  const style = (b.match(/font-style:\s*([a-z]+)/) || [])[1] || 'normal';
  const url = (b.match(/url\((https:[^)]+)\)/) || [])[1];
  if (!family || !url) continue;
  const slug = `${family.toLowerCase().replace(/\s+/g, '-')}-${weight}${style === 'italic' ? '-italic' : ''}`;
  faces.push({ family, weight, style, url, slug });
}

const unique = [...new Map(faces.map((f) => [f.url, f])).values()];
fs.mkdirSync('assets/fonts', { recursive: true });
for (const f of unique) {
  const out = `assets/fonts/${f.slug}.woff2`;
  execFileSync('curl', ['-s', '--max-time', '30', '-x', 'http://127.0.0.1:7890', f.url, '-o', out]);
  console.log(out, fs.statSync(out).size);
}

const localCss = unique
  .map(
    (f) => `@font-face{font-family:'${f.family}';font-style:${f.style};font-weight:${f.weight};font-display:swap;src:url(../fonts/${f.slug}.woff2) format('woff2')}`
  )
  .join('\n');
fs.writeFileSync('assets/fonts.css', localCss + '\n');
console.log('faces', unique.map((f) => f.slug).join(', '));
