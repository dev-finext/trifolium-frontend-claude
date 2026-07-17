// Client-side route map — logical screen name → URL.
//
// The design prototype navigated by screen id ('catalog', 'cart', …); this
// module keeps those ids as the single vocabulary for navigation so every
// component stays URL-agnostic. The server-side counterpart of this contract
// is preview/routes.js (and, in production, your Laravel routes file).
//
// INTEGRATION NOTE: if you use Ziggy (or want Laravel named routes), this is
// the one file to rewrite — e.g. `return route(name, params)`.
import { router } from '@inertiajs/vue3';

// Deployment base path (Vite's `base`) — '/' in dev and under Laravel, a
// subpath on the static GitHub Pages demo. Every generated URL carries it.
const BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

// Static-demo mode (GitHub Pages): there is no Inertia server, so navigation
// must be a full page load to the pre-rendered HTML instead of an XHR visit.
// Set at build time by `npm run build:demo` (vite --mode static); always off
// in dev and in the Laravel build.
const STATIC_DEMO = import.meta.env.VITE_STATIC_DEMO === '1';

const ROUTE_URLS = {
    // Auth flow
    login: '/login',
    register: '/register',
    submitted: '/register/submitted',
    forgot: '/forgot-password',
    'forgot-sent': '/forgot-password/sent',
    reset: '/reset-password',
    'reset-done': '/reset-password/done',
    // App screens
    home: '/',
    catalog: '/catalog',
    compounding: '/compounding',
    articles: '/articles',
    article: '/articles/:id',
    orders: '/orders',
    order: '/orders/:id',
    cart: '/cart',
    pending: '/pending',
    contact: '/contact',
    profile: '/profile',
    'change-password': '/profile/password',
    'my-formulas': '/my-formulas',
    wallet: '/wallet',
    terms: '/terms',
    accessibility: '/accessibility',
    privacy: '/privacy',
};

/**
 * Build the URL for a logical screen name.
 * `params` fills `:placeholders` first; leftovers become the query string.
 *
 *   routeUrl('article', { id: 'a3' })        → '/articles/a3'
 *   routeUrl('forgot-sent', { email: 'x@y' }) → '/forgot-password/sent?email=x%40y'
 */
export function routeUrl(name, params = {}) {
    let url = ROUTE_URLS[name];

    if (!url) {
        throw new Error(`Unknown route name: ${name}`);
    }

    const query = {};

    for (const [key, value] of Object.entries(params)) {
        if (url.includes(`:${key}`)) {
            url = url.replace(`:${key}`, encodeURIComponent(value));
        } else if (value !== undefined && value !== null && value !== '') {
            query[key] = value;
        }
    }

    // Static demo: routes are pre-rendered as <route>/index.html, so link
    // straight to the directory form ("/cart/") — works on any static host
    // without relying on a trailing-slash redirect.
    if (STATIC_DEMO && url !== '/') {
        url += '/';
    }

    const qs = new URLSearchParams(query).toString();

    return BASE + (qs ? `${url}?${qs}` : url);
}

/**
 * Reverse lookup: current Inertia URL → logical screen name (or null).
 * Used by the layout to highlight the active nav link.
 */
export function routeNameFromUrl(url) {
    let path = url.split('?')[0].replace(/\/+$/, '') || '/';

    // Strip the deployment base so matching stays base-agnostic.
    if (BASE && path.startsWith(BASE)) {
        path = path.slice(BASE.length) || '/';
    }

    for (const [name, pattern] of Object.entries(ROUTE_URLS)) {
        if (!pattern.includes(':') && pattern === path) {
            return name;
        }
    }

    for (const [name, pattern] of Object.entries(ROUTE_URLS)) {
        if (!pattern.includes(':')) {
            continue;
        }

        const rx = new RegExp(`^${pattern.replace(/:[^/]+/g, '[^/]+')}$`);

        if (rx.test(path)) {
            return name;
        }
    }

    return null;
}

/**
 * Navigate to a logical screen (replaces the prototype's `tf:route` event).
 * Inertia resets scroll to the top on visit, matching the prototype's
 * `window.scrollTo(0, 0)` behavior.
 */
export function visit(name, params = {}) {
    let url = routeUrl(name, params);

    // Static demo (no server): full page load to the pre-rendered HTML.
    if (STATIC_DEMO) {
        // Carry the developer English overlay (?lang=en) across page loads —
        // on the demo every navigation is a fresh document, so the URL is the
        // only place the language choice lives. (In the real Inertia app the
        // overlay persists by itself: navigation never reloads the page.)
        try {
            if (
                new URLSearchParams(window.location.search).get('lang') === 'en'
            ) {
                url += (url.includes('?') ? '&' : '?') + 'lang=en';
            }
        } catch {
            /* ignore */
        }

        window.location.assign(url);

        return;
    }

    router.visit(url);
}
