// Application entry — boots the Inertia client and mounts the Vue app.
//
// This same file runs in production (served by Laravel + laravel-vite-plugin)
// and in the standalone preview server (`npm run preview`).
import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { initMobileLayoutFlag } from '@/lib/mobileLayout.js';
import { initEnglishOverlay } from '@/lib/i18n/overlay.js';

// In Laravel the stylesheet is included from Blade via @vite(); importing it
// here as well keeps the standalone preview and plain `vite build` working.
import '../css/app.css';

// Follows the viewport and toggles `html.tf-mobile`, which scopes the entire
// mobile stylesheet (see resources/css/app.css).
initMobileLayoutFlag();

// Developer English overlay — ACTIVE ONLY with ?lang=en (see resources/js/lib/i18n).
// A no-op in the default Hebrew product; never affects the end-user build.
initEnglishOverlay();

// PWA: register the service worker (production builds only — caching in dev
// would mask live edits). Scope = the deployment base, so the same worker
// serves GitHub Pages (/repo/) and Laravel (/). Files live in public/.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL })
            .catch(() => { /* PWA is progressive — the app works fine without it */ });
    });
}

createInertiaApp({
    title: (title) => (title ? `${title} — Trifolium` : 'Trifolium'),
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.vue', { eager: true });
        const page = pages[`./pages/${name}.vue`];
        if (!page) throw new Error(`Unknown Inertia page: ${name}`);
        // Every page gets the app chrome (navbar/footer) by default.
        // Auth screens are full-bleed and manage their own backdrop, so they
        // opt out. A page can still set its own `layout` explicitly.
        if (page.default.layout === undefined && !name.startsWith('auth/')) {
            page.default.layout = AppLayout;
        }
        return page;
    },
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .mount(el);
    },
});
