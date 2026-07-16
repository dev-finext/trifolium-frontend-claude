# Layouts

**Persistent layout components** that wrap page content — the shared chrome (header, sidebar, footer, flash messages) around `@/Pages` views. Layouts define the structure a page renders _into_ via a default `<slot />`.

Import via the `@/` alias:

```ts
import AppLayout from '@/layouts/AppLayout.vue';
```

## What belongs here

- Top-level page shells: `AppLayout.vue`, `GuestLayout.vue`, `AuthLayout.vue`, `SettingsLayout.vue`.
- Structural wrappers that compose `@/components/shared` (headers, sidebars) and expose a `<slot />` for page content.
- Layouts may use Inertia (`<Link>`, `$page`), read `@/stores`, and reference routes.

```vue
<script setup lang="ts">
import AppHeader from '@/components/shared/AppHeader.vue';
</script>

<template>
    <div class="min-h-screen">
        <AppHeader />
        <main class="p-4">
            <slot />
        </main>
    </div>
</template>
```

## How pages use a layout

Wrap the page content directly:

```vue
<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
</script>

<template>
    <AppLayout>
        <!-- page content -->
    </AppLayout>
</template>
```

Or as a **persistent layout** (state survives across Inertia visits):

```vue
<script lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
export default { layout: AppLayout };
</script>

<script setup lang="ts">
// page props & logic
</script>
```

## What does NOT belong here

- Page/route views → `@/Pages`.
- Reusable header/sidebar/footer pieces themselves → `@/components/shared` (compose them here).
- Generic UI primitives → `@/components/ui`.

## Conventions

- One layout per file, **PascalCase** filename ending in `Layout` (`AppLayout.vue`).
- Every layout has a **single root element** and a default `<slot />` for page content.
- `<script setup lang="ts">`; build structure from `@/components/shared`, not from scratch.

## Example: sample & how it's used

**Sample** — `Layouts/AppLayout.vue`

```vue
<script setup lang="ts">
import AppHeader from '@/components/shared/AppHeader.vue';
</script>

<template>
    <div class="bg-gray-50 min-h-screen">
        <AppHeader />
        <main class="mx-auto max-w-5xl p-4">
            <slot />
        </main>
    </div>
</template>
```

**How it's used** — a Page wraps its content in the layout

```vue
<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
</script>

<template>
    <AppLayout>
        <h1 class="text-2xl font-bold">Dashboard</h1>
        <!-- page content renders into the layout's <slot /> -->
    </AppLayout>
</template>
```
