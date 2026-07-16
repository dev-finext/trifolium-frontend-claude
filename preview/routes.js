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
    '/login': 'auth/Login',
    '/register': 'auth/Register',
    '/register/submitted': 'auth/Submitted',
    '/forgot-password': 'auth/ForgotPassword',
    '/forgot-password/sent': 'auth/ForgotSent',
    '/reset-password': 'auth/ResetPassword',
    '/reset-password/done': 'auth/ResetDone',
    '/catalog': 'Catalog',
    '/compounding': 'Compounding',
    '/articles': 'articles/Index',
    '/orders': 'orders/Index',
    '/cart': 'Cart',
    '/pending': 'Pending',
    '/contact': 'Contact',
    '/profile': 'profile/Edit',
    '/profile/password': 'profile/ChangePassword',
    '/my-formulas': 'MyFormulas',
};

/** Dynamic routes: regex → component + captured props. */
const DYNAMIC_ROUTES = [
    {
        pattern: /^\/articles\/([^/]+)$/,
        component: 'articles/Show',
        props: (m) => ({ id: m[1] }),
    },
    {
        pattern: /^\/orders\/([^/]+)$/,
        component: 'orders/Show',
        props: (m) => ({ id: m[1] }),
    },
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

        if (m) {
            return { component: route.component, props: route.props(m) };
        }
    }

    return null;
}
