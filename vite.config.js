// Production Vite config — used once this frontend lives inside your Laravel app.
//
// Drop the `resources/` directory (and this file) into the Laravel project root.
// `laravel-vite-plugin` wires the dev server + build manifest into Blade via
// @vite(['resources/css/app.css', 'resources/js/app.js']).
//
// For running the frontend WITHOUT Laravel (design review / development of this
// repo on its own), use `npm run preview`, which loads vite.preview.config.js.
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    // Let Vue templates reference Vite-served assets directly.
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(rootDir, 'resources/js'),
            '@img': path.resolve(rootDir, 'resources/img'),
        },
    },
});
