// URL → Inertia page component map for the standalone preview server.
//
// This doubles as the ROUTE CONTRACT for the Laravel backend: each entry here
// should become a Laravel route whose controller returns
// Inertia::render('<component>', [/* props */]).
// The client-side counterpart (logical name → URL) lives in
// resources/js/lib/routes.js — keep the two files in sync.

/** Static routes: pathname → page component. (Also consumed by scripts/build-static-demo.mjs.) */
export const STATIC_ROUTES = {
    '/': 'Home',
    '/login': 'Auth/Login',
    '/register': 'Auth/Register',
    '/register/submitted': 'Auth/Submitted',
    '/forgot-password': 'Auth/ForgotPassword',
    '/forgot-password/sent': 'Auth/ForgotSent',
    '/reset-password': 'Auth/ResetPassword',
    '/reset-password/done': 'Auth/ResetDone',
    '/catalog': 'Catalog',
    '/compounding': 'Compounding',
    '/articles': 'Articles/Index',
    '/orders': 'Orders/Index',
    '/cart': 'Cart',
    '/pending': 'Pending',
    '/contact': 'Contact',
    '/profile': 'Profile/Edit',
    '/profile/password': 'Profile/ChangePassword',
    '/my-formulas': 'MyFormulas',
};

/** Dynamic routes: regex → component + captured props. */
const DYNAMIC_ROUTES = [
    { pattern: /^\/articles\/([^/]+)$/, component: 'Articles/Show', props: (m) => ({ id: m[1] }) },
    { pattern: /^\/orders\/([^/]+)$/, component: 'Orders/Show', props: (m) => ({ id: m[1] }) },
];

/**
 * Resolve a pathname to `{ component, props }`, or null when the URL is not
 * an app page (e.g. a Vite asset request that should fall through).
 */
export function resolvePreviewRoute(pathname) {
    const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
    if (STATIC_ROUTES[clean]) {
        return { component: STATIC_ROUTES[clean], props: {} };
    }
    for (const route of DYNAMIC_ROUTES) {
        const m = clean.match(route.pattern);
        if (m) return { component: route.component, props: route.props(m) };
    }
    return null;
}
