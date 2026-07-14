# Conversion guide — design-handoff JSX → Vue 3 SFC

This project recreates the Trifolium design prototype (React JSX, in
`design_handoff_trifolium/` of the Claude Design project) as a Vue 3 +
Inertia.js frontend. This document is the contract every converted page
follows — read it together with the canonical example,
[`resources/js/Pages/Contact.vue`](../resources/js/Pages/Contact.vue).

## Golden rules


1. **High fidelity.** Colors, typography, spacing, copy and interactions in the
   prototype are final. Port them exactly — do not redesign, "improve", or
   drop details. All Hebrew strings are copied **verbatim**.
2. **One component per `.vue` file**, named after the source component.
   Pages live in `resources/js/Pages/`; page-private subcomponents live in
   `resources/js/Components/<page>/` (see `Components/contact/`).
3. **Comments are English**, explain *why*/constraints, and keep the source
   file's useful comments. Mark backend seams with `// TODO(backend): …`.
4. Indentation: 4 spaces. `<script setup>` + Composition API only.

## Mechanical JSX → Vue rules

| Prototype (React)                      | Here (Vue)                                              |
| -------------------------------------- | ------------------------------------------------------- |
| `className=`                           | `class=`                                                |
| `style={{ fontSize: 13, gap: 8 }}`     | `:style="{ fontSize: '13px', gap: '8px' }"` (px strings; static styles may use a plain `style=""` attribute) |
| `onClick={...}`                        | `@click="..."`                                          |
| `React.useState`                       | `ref()` / `reactive()`                                  |
| `React.useEffect`                      | `onMounted` / `watch` / `onBeforeUnmount`               |
| `{cond && <X/>}`                       | `v-if`                                                  |
| `arr.map(...)`                         | `v-for` with `:key`                                     |
| controlled input `value` + `onChange`  | `v-model` (foundation inputs support it)                |
| inline `<style>{...}</style>` in JSX   | SFC `<style>` block (global, prefix classes `tf-…`) or existing keyframes in `resources/css/app.css` (`tf-toast-in`, `tf-pa-in`, `tf-tip-in`) |
| hover via `onMouseEnter` style swap    | small `ref` + `:style`, or a `:hover` rule in the SFC `<style>` block |

## Replacing the prototype's global systems

| Prototype                                   | Here                                                                 |
| ------------------------------------------- | -------------------------------------------------------------------- |
| `window.dispatchEvent('tf:route', name)`    | `visit(name, params?)` from `@/lib/routes` (same logical names)      |
| `tf:openArticle` (detail = id)              | `visit('article', { id })`                                           |
| `tf:addToCart` event                        | `useCartStore().addToCart(item)` from `@/stores/cart`                |
| `tf:moveToPending` event                    | `useCartStore().moveToPending(item)`                                 |
| `useMode()` context                         | `useModeStore()` from `@/stores/mode` (`mode`, `isChinese`, `requestMode`) |
| wizard dirty/reset wiring via App props     | `useWizardStore()` from `@/stores/wizard` (`state.dirty`, `state.resetSignal`, `setDirty`) |
| `window.TFDATA.X` / `window.HERB_*`         | `import { X } from '@/data/mock'` (all names preserved)              |
| `window.herbPinyin`                         | `import { herbPinyin } from '@/lib/herbs'`                           |
| `window.__tfPendingFormula` (load into lab) | `useWizardStore().setPendingFormula(f)` before `visit('compounding')`; the wizard calls `consumePendingFormula()` on mount |
| `window.TFDATA.SAVED_FORMULAS` mutation + `window.__tfHighlightFormula` | `useSavedFormulasStore()` from `@/stores/saved-formulas` (`state.list`, `add`, `remove`, `consumeHighlight`) |
| `window.TF_buildOrderFromRow` / `window.__tfLastOrder` | `@/lib/orders` (created with the Orders pages): `buildOrderFromRow(row)`, `setLastOrder(o)` / `getLastOrder()` |
| `assets/foo.png` / `window.__resources`     | `import fooUrl from '@img/foo.png'`                                  |
| `<image-slot>` web component                | plain `<img>` (or `.img-placeholder` div when no asset exists)       |
| Tweaks panel / `useTweaks` / i18n overlay   | **dropped** — shipped defaults are baked into `resources/css/app.css` |
| `data-screen-label` wrappers in app.jsx     | already emitted by `Layouts/AppLayout.vue`                           |

## Foundation components (import from `@/Components/...`)

- `ui/Icon.vue` — `<Icon name="cart" :size="19" color="var(--ink-2)" :stroke="1.6" />`.
  Same icon inventory as the prototype's `shared.jsx`.
- `ui/StatusDot.vue` — `<StatusDot tone="green">text</StatusDot>`.
- `ui/Field.vue` / `ui/FieldLabel.vue` — label prop / slot.
- `ui/SearchInput.vue` — `v-model` + `placeholder`.
- `ui/MedsSafetyDeclaration.vue` — `:patient-meds`, optional `confirmable` +
  `v-model:checked`.
- `ui/NewRibbon.vue` / `ui/NewRibbonMark.vue` — diagonal "חדש" corner band.
- `ui/DangerConfirmModal.vue` — destructive confirm base (`title`,
  `confirm-label`, `@confirm`, `@cancel`, message slot).
- `mode/HerbName.vue` — same props as prototype (`herb`, `inline`,
  `hideSecondary`, `parallel`, sizes/colors).
- `mode/ModeBadge.vue`, `mode/ModeCircle.vue` (`:mode`), `mode/ModeSwitch.vue`
  (`:mode` + `@request`), `mode/FormulaTypeSwitchConfirmModal.vue`
  (`:target-label`), glyphs `YinYang` / `MortarPestle` / `ModeGlyph`.
- Decorative art from the prototype's `placeholders.jsx` / `covers.jsx` is in
  `Components/art/` under the original component names.

## Pages

- Add `<Head title="…" />` (from `@inertiajs/vue3`) with the page's Hebrew title.
- The app layout (navbar/footer/toast) is applied automatically — pages render
  only their `.page` content. Auth pages get **no** layout automatically.
- Page-level data is declared as **props with mock defaults**, so a Laravel
  controller that passes real props wins without code changes:

  ```js
  import { PRODUCTS } from '@/data/mock';
  const props = defineProps({
      products: { type: Array, default: () => PRODUCTS },
  });
  ```

- Purely client-side interactions (filters, steppers, local form state) stay
  client-side, exactly as in the prototype.

## Route names (lib/routes.js)

`login, register, submitted, forgot, forgot-sent, reset, reset-done, home,
catalog, compounding, articles, article(:id), orders, order(:id), cart,
pending, contact, profile, change-password, my-formulas` — identical to the
prototype's route strings, so navigation calls port 1:1.
