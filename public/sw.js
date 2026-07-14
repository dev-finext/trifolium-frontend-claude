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
const CACHE = 'trifolium-v2'; // bumped: brand assets replaced (real logo)

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
                    // Offline: this page if we have it, else the app root.
                    return (await cache.match(request)) || (await cache.match(self.registration.scope)) || Response.error();
                }
            })()
        );
    }
});
