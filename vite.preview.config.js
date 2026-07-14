// Standalone preview config — run the frontend WITHOUT a Laravel backend.
//
//   npm run preview
//
// A tiny Vite middleware (preview/inertia-preview-plugin.js) speaks the
// Inertia protocol and serves every page with mock props, so the exact same
// resources/js/app.js entry works both here and inside Laravel.
//
// This file and the preview/ directory are development scaffolding only —
// they are NOT needed (and can be deleted) once the frontend is integrated
// into the Laravel project.
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import inertiaPreview from './preview/inertia-preview-plugin.js';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [vue(), inertiaPreview()],
    resolve: {
        alias: {
            '@': path.resolve(rootDir, 'resources/js'),
            '@img': path.resolve(rootDir, 'resources/img'),
        },
    },
    build: {
        // Allows `npm run build:preview` as a compile check without Laravel.
        rollupOptions: {
            input: path.resolve(rootDir, 'resources/js/app.js'),
        },
    },
});
