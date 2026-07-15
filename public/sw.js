// Trifolium service worker — installability + sane offline behavior.
//
// Strategy (deliberately conservative for a frequently-deployed demo):
//   • Pages (navigations)  → network-first, falling back to the cached copy
//     when offline. Fresh deploys are therefore picked up immediately.
//   • Hashed build assets (/assets/*) and icons → cache-first: their names
//     change on every build, so a cached copy can never go stale.
//   • Everything else (cross-origin fonts, etc.) → network, best-effort cache.
//
// Registered with the deployment base as its scope (see resources/js/app.js),
// so the same file works on GitHub Pages (/repo-name/) and under Laravel (/).
const CACHE = 'trifolium-v4'; // bumped: offline fallback document + audit fixes

// A self-contained offline document, served for navigations we can't fulfil
// (offline + never-visited deep link, and the app shell isn't cached). No
// external refs so it renders with no network. RTL, brand-styled.
const OFFLINE_HTML = `<!doctype html><html dir="rtl" lang="he"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Trifolium — לא מקוון</title><style>
:root{color-scheme:light dark}
html,body{margin:0;height:100%}
body{display:flex;align-items:center;justify-content:center;text-align:center;
font-family:'Assistant','Heebo','Segoe UI',sans-serif;background:#f6f8f5;color:#1f2e1d;
padding:env(safe-area-inset-top) 24px env(safe-area-inset-bottom)}
@media(prefers-color-scheme:dark){body{background:#12160f;color:#e8ece0}}
.m{max-width:320px}
.r{width:78px;height:78px;border-radius:50%;border:1px solid #9a6b23;
display:flex;align-items:center;justify-content:center;margin:0 auto 20px}
.r span{width:58px;height:58px;border-radius:50%;border:1px solid #3d5a3a;
display:flex;align-items:center;justify-content:center;font-size:24px;color:#3d5a3a}
h1{font-size:20px;font-weight:700;margin:0 0 8px}
p{font-size:14px;line-height:1.6;color:#54614f;margin:0 0 22px}
@media(prefers-color-scheme:dark){p{color:#97a08b}}
button{height:46px;padding:0 26px;border:none;border-radius:999px;background:#3d5a3a;
color:#f4efe1;font:inherit;font-weight:700;font-size:14px;cursor:pointer}
</style></head><body><div class="m"><div class="r"><span>❋</span></div>
<h1>אין חיבור לאינטרנט</h1><p>נראה שאתה במצב לא מקוון. בדוק את החיבור ונסה שוב.</p>
<button onclick="location.reload()">נסה שוב</button></div></body></html>`;

self.addEventListener('install', (event) => {
    // Activate the new worker immediately on deploy.
    self.skipWaiting();
    // Warm the cache with the app entry (scope root).
    event.waitUntil(
        caches.open(CACHE).then((cache) => cache.add(new Request(self.registration.scope)).catch(() => {}))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            // Drop caches from older versions.
            for (const key of await caches.keys()) {
                if (key !== CACHE) await caches.delete(key);
            }
            await self.clients.claim();
        })()
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;
    const url = new URL(request.url);

    // Hashed assets + icons: immutable → cache-first.
    if (url.origin === self.location.origin && /\/(assets|icons)\//.test(url.pathname)) {
        event.respondWith(
            caches.open(CACHE).then(async (cache) => {
                const hit = await cache.match(request);
                if (hit) return hit;
                const res = await fetch(request);
                if (res.ok) cache.put(request, res.clone());
                return res;
            })
        );
        return;
    }

    // Page navigations: network-first with offline fallback.
    if (request.mode === 'navigate') {
        event.respondWith(
            (async () => {
                const cache = await caches.open(CACHE);
                try {
                    const res = await fetch(request);
                    if (res.ok) cache.put(request, res.clone());
                    return res;
                } catch {
                    // Offline: this page if cached, else the app shell (it will
                    // client-route), else the self-contained offline document.
                    return (await cache.match(request))
                        || (await cache.match(self.registration.scope))
                        || new Response(OFFLINE_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
                }
            })()
        );
    }
});
