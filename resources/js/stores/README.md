# Stores

**Global, app-wide reactive state** shared across pages and components that outlives a single component tree (e.g. UI state, cached client data, cross-cutting flags).

Import via the `@/` alias:

```ts
import { useSidebarStore } from '@/stores/sidebar';
```

## What belongs here

- Central state modules: `sidebar.ts`, `theme.ts`, `notifications.ts`, `cart.ts`.
- State that multiple, unrelated components need to read/write.
- Client-only state that complements Inertia's server-driven page props.

If Pinia is added, one store per file:

```ts
import { defineStore } from 'pinia';

export const useSidebarStore = defineStore('sidebar', {
    state: () => ({ open: false }),
    actions: {
        toggle() {
            this.open = !this.open;
        },
    },
});
```

Otherwise a lightweight `reactive()` singleton works too:

```ts
import { reactive } from 'vue';

export const sidebarStore = reactive({
    open: false,
    toggle() {
        this.open = !this.open;
    },
});
```

## What does NOT belong here

- Per-component or per-page local logic → `@/composables`.
- Server state for a single page → pass as Inertia **page props** instead.
- Pure helper functions → `@/lib`.

## Conventions

- One store per file; **camelCase** filename named after the domain (`sidebar.ts`).
- Export a `useXxxStore` (Pinia) or a named singleton; keep the pattern consistent across files.
- Prefer server-driven page props first; reach for a store only for genuinely global client state.

## Example: sample & how it's used

**Sample** — `Stores/sidebar.ts`

```ts
import { reactive } from 'vue';

export const sidebarStore = reactive({
    open: false,
    toggle() {
        this.open = !this.open;
    },
});
```

**How it's used** — read/written from any component or layout

```vue
<script setup lang="ts">
import Button from '@/components/ui/Button.vue';
import { sidebarStore } from '@/stores/sidebar';
</script>

<template>
    <Button @click="sidebarStore.toggle()">Menu</Button>
    <aside v-if="sidebarStore.open" class="w-64 border-r">…</aside>
</template>
```

Both a header button and the layout's sidebar read the same `sidebarStore.open`,
so toggling in one place updates everywhere.
