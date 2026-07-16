// Standalone preview config — run the frontend WITHOUT a Laravel backend.
//
//   npm run preview       → dev server with a mock-Inertia middleware
//   npm run build:demo    → fully static demo (used by CI → GitHub Pages)
//
// Dev: a tiny Vite middleware (preview/inertia-preview-plugin.js) speaks the
// Inertia protocol and serves every page with mock props, so the exact same
// resources/js/app.ts entry works both here and inside Laravel.
//
// Static demo (`--mode static`): builds preview/index.html as the entry, then
// scripts/build-static-demo.mjs pre-renders one HTML per route. Because there
// is no server, the app is built with VITE_STATIC_DEMO=1 so navigation does
// full page loads (see resources/js/lib/routes.js). `VITE_BASE` sets the
// hosting subpath (e.g. /trifolium-frontend-claude/ on GitHub Pages).
//
// This file and the preview/ directory are development scaffolding only —
// they are NOT needed (and can be deleted) once the frontend is integrated
// into the Laravel project.
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import inertiaPreview from './preview/inertia-preview-plugin.js';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
    const isStaticDemo = mode === 'static';
    return {
        base: process.env.VITE_BASE || '/',
        plugins: [tailwindcss(), vue(), inertiaPreview()],
        resolve: {
            alias: {
                '@': path.resolve(rootDir, 'resources/js'),
                '@img': path.resolve(rootDir, 'resources/img'),
            },
        },
        define: {
            // Compile-time flag consumed by resources/js/lib/routes.js.
            'import.meta.env.VITE_STATIC_DEMO': JSON.stringify(isStaticDemo ? '1' : ''),
        },
        build: {
            rollupOptions: {
                // Static demo builds the HTML shell (hashed asset refs included);
                // the plain compile check builds just the JS entry.
                input: isStaticDemo
                    ? path.resolve(rootDir, 'preview/index.html')
                    : path.resolve(rootDir, 'resources/js/app.ts'),
            },
        },
    };
});
