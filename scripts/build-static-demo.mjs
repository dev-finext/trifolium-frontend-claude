// Build step 2 of `npm run build:demo` — turn the Vite output into a fully
// static, GitHub-Pages-ready site.
//
// Step 1 (vite build --mode static) emits dist/preview/index.html with hashed
// asset references and the literal `data-page="__PAGE__"` placeholder. This
// script clones that shell once per route, embedding each route's Inertia page
// object (component + mock props), so every URL is a real pre-rendered page:
//
//   dist/index.html                    ← /
//   dist/catalog/index.html           ← /catalog
//   dist/articles/a1/index.html       ← /articles/a1
//   …
//
// Navigation on the demo is a full page load between these files (the app is
// built with VITE_STATIC_DEMO=1 — see resources/js/lib/routes.js), because a
// static host can't answer Inertia XHR visits. Client state (cart, wizard)
// therefore resets between pages — acceptable for a design-review demo.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { STATIC_ROUTES } from '../preview/routes.js';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(rootDir, 'dist');
const shellPath = path.join(distDir, 'preview', 'index.html');

if (!fs.existsSync(shellPath)) {
    console.error('dist/preview/index.html not found — run `vite build --mode static` first.');
    process.exit(1);
}
const shell = fs.readFileSync(shellPath, 'utf8');

// Base subpath the site is served under (must match the vite build's VITE_BASE).
const base = (process.env.VITE_BASE || '/').replace(/\/$/, '');

/** Escape a JSON string for a double-quoted HTML attribute (same as the preview server). */
const escapeAttribute = (v) =>
    v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function writeRoute(urlPath, component, props = {}) {
    const page = { component, props, url: base + urlPath, version: 'static' };
    const html = shell.replace(
        'data-page="__PAGE__"',
        `data-page="${escapeAttribute(JSON.stringify(page))}"`
    );
    const outDir = urlPath === '/' ? distDir : path.join(distDir, ...urlPath.split('/').filter(Boolean));
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html);
    return path.relative(distDir, path.join(outDir, 'index.html'));
}

// ── 1. Every static route from the shared route contract ────────────────────
let count = 0;
for (const [urlPath, component] of Object.entries(STATIC_ROUTES)) {
    writeRoute(urlPath, component);
    count++;
}

// ── 2. Dynamic detail pages, from the mock data ─────────────────────────────
// Article ids are scraped from data/mock.js (its `ARTICLES` block); the mock
// module itself imports image assets, so it can't be imported in plain Node.
const mockSrc = fs.readFileSync(path.join(rootDir, 'resources/js/data/mock.js'), 'utf8');
const articlesBlock = mockSrc.slice(mockSrc.indexOf('const ARTICLES = ['), mockSrc.indexOf('const VIDEOS'));
const articleIds = [...articlesBlock.matchAll(/id:\s*'([^']+)'/g)].map((m) => m[1]);
for (const id of articleIds) {
    writeRoute(`/articles/${id}`, 'Articles/Show', { id });
    count++;
}
// One representative order — Orders/Show falls back to its demo order for any id.
writeRoute('/orders/TF-2850', 'Orders/Show', { id: 'TF-2850' });
count++;

// ── 3. Pages plumbing ────────────────────────────────────────────────────────
// 404.html: GitHub Pages serves it for unknown paths — reuse the home page so
// deep links land in the app instead of a dead end.
fs.copyFileSync(path.join(distDir, 'index.html'), path.join(distDir, '404.html'));
// .nojekyll: tell Pages to serve files verbatim (no Jekyll processing).
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
// Drop the intermediate shell.
fs.rmSync(path.join(distDir, 'preview'), { recursive: true, force: true });

console.log(`static demo ready: ${count} pages pre-rendered into dist/ (base: '${base || '/'}', ${articleIds.length} articles)`);
