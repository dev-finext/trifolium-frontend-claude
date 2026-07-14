# Trifolium — Frontend (Vue 3 + Inertia.js)

Production-ready frontend for **Trifolium**, a professional compounding-pharmacy
platform: practitioners log in, browse a herb/product catalog, compose custom
herbal formulas through a multi-step wizard (Western **or** Traditional-Chinese
style), manage a cart, place and track orders, read articles, and manage their
profile. The UI is **Hebrew, right-to-left**, with a calm "herbal green"
aesthetic.

Built as a high-fidelity port of the Claude Design handoff
(`design_handoff_trifolium` — see [docs/CONVERSION-GUIDE.md](docs/CONVERSION-GUIDE.md)),
targeting a **Laravel + Inertia.js** backend. This repo contains the frontend
only; every backend seam is marked with `// TODO(backend)`.

---

## Running it

### Standalone (no Laravel — design review / frontend development)

```bash
npm install
npm run preview      # → http://localhost:5173
```

`npm run preview` starts Vite with a tiny middleware
([preview/inertia-preview-plugin.js](preview/inertia-preview-plugin.js)) that
speaks the Inertia protocol and serves every page with mock props — the exact
same `resources/js/app.js` entry that runs in production.

`npm run build:preview` is a standalone compile check.

### Inside Laravel (production)

1. Copy `resources/` and `vite.config.js` into the Laravel project root, merge
   `package.json` deps (`vue`, `@inertiajs/vue3`, `@vitejs/plugin-vue`,
   `laravel-vite-plugin`, `vite`), and `npm install`.
2. Install the server side: `composer require inertiajs/inertia-laravel`,
   publish the `HandleInertiaRequests` middleware.
3. Root Blade template (`resources/views/app.blade.php`) — mirror
   [preview/index.html](preview/index.html):

   ```blade
   <!doctype html>
   <html dir="rtl" lang="he">
   <head>
       <meta charset="utf-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1" />
       <link rel="preconnect" href="https://fonts.googleapis.com" />
       <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
       <link href="https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&family=Cormorant+Garamond:wght@500;600&display=swap" rel="stylesheet" />
       @vite(['resources/css/app.css', 'resources/js/app.js'])
       @inertiaHead
   </head>
   <body>
       @inertia
   </body>
   </html>
   ```

4. Define the routes. **[preview/routes.js](preview/routes.js) is the route
   contract** — each entry becomes a Laravel route returning
   `Inertia::render('<Component>', [/* props */])`:

   | URL | Component | Notes |
   | --- | --- | --- |
   | `/` | `Home` | dashboard |
   | `/login`, `/register`, `/register/submitted`, `/forgot-password`, `/forgot-password/sent`, `/reset-password`, `/reset-password/done` | `Auth/*` | guest routes |
   | `/catalog` | `Catalog` | props: `products` |
   | `/compounding` | `Compounding` | the formula wizard |
   | `/articles`, `/articles/{id}` | `Articles/Index`, `Articles/Show` | Show gets `id` |
   | `/orders`, `/orders/{id}` | `Orders/Index`, `Orders/Show` | Show gets `id` |
   | `/cart`, `/pending` | `Cart`, `Pending` | client-side cart for now |
   | `/contact` | `Contact` | |
   | `/profile`, `/profile/password` | `Profile/Edit`, `Profile/ChangePassword` | |
   | `/my-formulas` | `MyFormulas` | |

5. Delete `preview/` and `vite.preview.config.js` — they are dev scaffolding.

### CI/CD — demo on every push

Every push to `main` runs [.github/workflows/deploy.yml](.github/workflows/deploy.yml):

1. **CI gate** — `npm run build` (the Laravel-target build) must compile.
2. **Deploy** — `npm run build:demo` pre-renders a fully static demo
   (one HTML per route, via [scripts/build-static-demo.mjs](scripts/build-static-demo.mjs))
   and publishes it to **GitHub Pages**:
   **https://dev-finext.github.io/trifolium-frontend-claude/**

Demo caveats (static host, no Inertia server): navigation is a full page load
and client state (cart, wizard) resets between pages — it's for design review,
not a production environment. The production deploy will be the Laravel app.

One-time repo setup if the first run fails at "configure-pages":
Settings → Pages → Source: **GitHub Actions**.

### Wiring real data

- **Props-first pages**: list pages declare their data as props with mock
  defaults (e.g. `products: { type: Array, default: () => PRODUCTS } }`), so a
  controller that passes real props **wins automatically** — no code changes.
  [resources/js/data/mock.js](resources/js/data/mock.js) is the API-contract
  sketch: every exported array shows the exact shape the endpoint should return.
- **Client stores** (`resources/js/stores/`): cart & pending (`cart.js`),
  treatment style (`mode.js`), wizard cross-page state (`wizard.js`), saved
  formulas (`saved-formulas.js`). Their function APIs are the seams — swap the
  bodies for Inertia form submissions / API calls; callers won't change.
- **Navigation** goes through [resources/js/lib/routes.js](resources/js/lib/routes.js)
  (logical name → URL). To adopt Ziggy/named routes, rewrite that one file.
- **Auth user** is a hard-coded constant in `Layouts/AppLayout.vue`
  (`TODO(backend)`) — replace with Inertia shared props.

---

## English developer overlay

The product ships **Hebrew only**. English exists purely as a **developer aid**
for non-Hebrew-speaking developers — it is **not** a user-facing feature and has
**no on-screen toggle**. Add `?lang=en` to any URL to read the UI in English;
the layout stays **RTL in both languages** (only the words change).

- `resources/js/i18n/overlay.js` — runs at boot; a no-op in Hebrew, and in
  English mode translates the DOM live from the dictionary (with a
  `MutationObserver` for Vue/Inertia re-renders). Components import/wrap nothing.
- `resources/js/i18n/dictionary.js` — the **single maintenance point**: a flat
  `"Hebrew" → "English"` map. Missing strings stay Hebrew (safe partial
  coverage). `patterns.js` handles interpolated number/unit strings.
- Full how-to in [docs/I18N-GUIDE.md](docs/I18N-GUIDE.md). In short: add a
  `"exact Hebrew": "English"` pair to `dictionary.js` and it works everywhere.

---

## Project structure

```
resources/
├── css/app.css               # Design tokens (:root) + all global styles (RTL, mobile)
├── img/                      # Brand assets (see resources/img/README.md — 2 files are placeholders)
└── js/
    ├── app.js                # Inertia boot — same entry for Laravel & standalone preview
    ├── Layouts/AppLayout.vue # Navbar + footer + cart toast + mode-switch confirm
    ├── Pages/                # One Inertia page per screen (Auth/, Articles/, Orders/, Profile/…)
    ├── Components/
    │   ├── ui/               # Icon, Field, SearchInput, StatusDot, MedsSafetyDeclaration, NewRibbon…
    │   ├── mode/             # Western/Chinese style: HerbName, ModeSwitch, confirm modals…
    │   ├── navbar/           # TheNavbar + drawer, user menu, points badge
    │   ├── art/              # Decorative SVG illustrations & cover art (from the design)
    │   ├── wizard/           # The multi-step formula wizard (core flow)
    │   └── <page>/           # Page-private subcomponents (catalog/, cart/, orders/…)
    ├── stores/               # Reactive singletons: cart, mode, wizard, saved-formulas
    ├── composables/          # useAddresses (address book)
    ├── i18n/                 # English DEV overlay (?lang=en): overlay.js + dictionary.js
    ├── lib/                  # routes (nav contract), orders, herbs, mobile-layout
    └── data/mock.js          # Mock data = API contract sketch
preview/                      # Dev-only Inertia mock server (delete in Laravel)
docs/CONVERSION-GUIDE.md      # Design-handoff → Vue conventions (how this repo was built)
```

## Design system

All visual decisions live in [resources/css/app.css](resources/css/app.css)
`:root` tokens: background `#f6f8f5`, ink scale from `#1f2e1d`, accent
`#3d5a3a` (deep herbal green), radii 6px, nav 64px, content max 960px
(1080px in the wizard). Hebrew UI in **Assistant**, Latin text & all numerals
in **Inter** (`.num` / `.latin` classes, tabular numerals), brand serif
**Cormorant Garamond**. Icons are inline lucide-style SVG (1.5px stroke, never
filled) — the full set is in `Components/ui/Icon.vue`.

**RTL:** `dir="rtl"` on `<html>`; the code uses logical properties
(`margin-inline-*`, `inset-inline-*`) — never hard-code left/right.

**Mobile:** the entire phone layout (≤760px) is scoped under `html.tf-mobile`,
toggled by `lib/mobile-layout.js`. Wizard tables, pickers, and the nav drawer
all restyle through the hook classes listed in the conversion guide — keep
those class names when refactoring.

## Two-mode system (מערבי / סיני)

`stores/mode.js` holds the treatment style. It changes herb naming everywhere
(`Components/mode/HerbName.vue`: Latin-primary in Western, pinyin-primary in
Chinese) and parts of the wizard. Switching mid-formula is destructive, so the
store parks the request and `AppLayout` shows a confirmation modal; on confirm
the wizard wipes the formula (keeps the patient) and restarts on the compose
step.
