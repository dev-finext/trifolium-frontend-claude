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

const ROUTE_URLS = {
    // Auth flow
    'login': '/login',
    'register': '/register',
    'submitted': '/register/submitted',
    'forgot': '/forgot-password',
    'forgot-sent': '/forgot-password/sent',
    'reset': '/reset-password',
    'reset-done': '/reset-password/done',
    // App screens
    'home': '/',
    'catalog': '/catalog',
    'compounding': '/compounding',
    'articles': '/articles',
    'article': '/articles/:id',
    'orders': '/orders',
    'order': '/orders/:id',
    'cart': '/cart',
    'pending': '/pending',
    'contact': '/contact',
    'profile': '/profile',
    'change-password': '/profile/password',
    'my-formulas': '/my-formulas',
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
    if (!url) throw new Error(`Unknown route name: ${name}`);

    const query = {};
    for (const [key, value] of Object.entries(params)) {
        if (url.includes(`:${key}`)) {
            url = url.replace(`:${key}`, encodeURIComponent(value));
        } else if (value !== undefined && value !== null && value !== '') {
            query[key] = value;
        }
    }
    const qs = new URLSearchParams(query).toString();
    return qs ? `${url}?${qs}` : url;
}

/**
 * Reverse lookup: current Inertia URL → logical screen name (or null).
 * Used by the layout to highlight the active nav link.
 */
export function routeNameFromUrl(url) {
    const path = (url.split('?')[0].replace(/\/+$/, '')) || '/';
    for (const [name, pattern] of Object.entries(ROUTE_URLS)) {
        if (!pattern.includes(':') && pattern === path) return name;
    }
    for (const [name, pattern] of Object.entries(ROUTE_URLS)) {
        if (!pattern.includes(':')) continue;
        const rx = new RegExp(`^${pattern.replace(/:[^/]+/g, '[^/]+')}$`);
        if (rx.test(path)) return name;
    }
    return null;
}

/**
 * Navigate to a logical screen (replaces the prototype's `tf:route` event).
 * Inertia resets scroll to the top on visit, matching the prototype's
 * `window.scrollTo(0, 0)` behavior.
 */
export function visit(name, params = {}) {
    router.visit(routeUrl(name, params));
}
