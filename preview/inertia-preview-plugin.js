// Dev-only Vite plugin that stands in for the Laravel backend.
//
// Inertia's client needs a server that (a) renders the first visit as HTML
// with the page object in `<div id="app" data-page="...">`, and (b) answers
// follow-up requests carrying the `X-Inertia` header with a JSON page object.
// This middleware implements exactly that for the routes in ./routes.js,
// which lets the real production entry (resources/js/app.js) run unmodified.
//
// Delete the whole preview/ directory when integrating into Laravel — the
// @inertia Blade directive plays this role in production.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolvePreviewRoute } from './routes.js';

const previewDir = path.dirname(fileURLToPath(import.meta.url));

/** Escape a JSON string for safe embedding inside a double-quoted HTML attribute. */
function escapeAttribute(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

export default function inertiaPreview() {
    return {
        name: 'trifolium-inertia-preview',
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                const url = new URL(req.url, 'http://localhost');

                // Dev-only escape hatch: POST a data-URL image here and it lands
                // in preview/.snapshots/ — lets tooling (or a human) capture a
                // canvas-rendered snapshot of the running UI for inspection.
                if (url.pathname === '/__snapshot' && req.method === 'POST') {
                    let body = '';
                    req.on('data', (c) => { body += c; });
                    req.on('end', () => {
                        const m = body.match(/^data:image\/(png|jpeg);base64,(.+)$/s);
                        if (!m) { res.statusCode = 400; return res.end('expected an image data URL'); }
                        const dir = path.join(previewDir, '.snapshots');
                        fs.mkdirSync(dir, { recursive: true });
                        const name = (url.searchParams.get('name') || 'snapshot').replace(/[^\w-]/g, '') + '.' + (m[1] === 'png' ? 'png' : 'jpg');
                        fs.writeFileSync(path.join(dir, name), Buffer.from(m[2], 'base64'));
                        res.end('saved ' + name);
                    });
                    return;
                }

                const match = resolvePreviewRoute(url.pathname);
                if (!match) return next();

                const page = {
                    component: match.component,
                    // Query-string params are merged in so flows like
                    // /forgot-password/sent?email=x work without a backend.
                    props: { ...match.props, ...Object.fromEntries(url.searchParams) },
                    url: url.pathname + url.search,
                    version: 'preview',
                };

                // Inertia XHR navigation → JSON page object.
                if (req.headers['x-inertia']) {
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('X-Inertia', 'true');
                    res.setHeader('Vary', 'X-Inertia');
                    res.end(JSON.stringify(page));
                    return;
                }

                // Full page load → HTML shell with the page object embedded.
                let html = fs.readFileSync(path.join(previewDir, 'index.html'), 'utf8');
                html = html.replace('data-page="__PAGE__"', `data-page="${escapeAttribute(JSON.stringify(page))}"`);
                html = await server.transformIndexHtml(req.url, html);
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                res.end(html);
            });
        },
    };
}
