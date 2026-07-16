# Components/Shared

**Composed, app-aware components** reused across multiple pages. Unlike `../UI` primitives, these may know about the app's domain, routes, stores, and Inertia — they wire UI primitives together into meaningful, reusable pieces.

Import via the `@/` alias:

```ts
import AppHeader from '@/components/shared/AppHeader.vue';
```

## What belongs here

- Layout & chrome shared across pages: `AppLayout.vue`, `AppHeader.vue`, `Sidebar.vue`, `Footer.vue`, `Breadcrumbs.vue`.
- Cross-page feature widgets: `FlashMessages.vue`, `Pagination.vue`, `SearchBar.vue`, `UserMenu.vue`, `NotificationBell.vue`.
- Components that compose `@/components/ui` primitives and may:
    - use Inertia (`<Link>`, `<Form>`, `useForm`, `router`),
    - read from `@/stores`,
    - reference routes via Wayfinder (`@/routes`, `@/actions`),
    - call `@/composables`.

```vue
<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import Button from '@/components/ui/Button.vue';
</script>

<template>
    <header class="flex items-center justify-between p-4">
        <Link href="/">Home</Link>
        <Button>New</Button>
    </header>
</template>
```

## What does NOT belong here

- Generic, domain-agnostic primitives (buttons, inputs, cards) → `../UI`.
- Full page components rendered by `Inertia::render()` → `@/Pages`.
- Reusable stateful logic without markup → `@/composables`; global state → `@/stores`.

## Conventions

- One component per file, **PascalCase** filename (`AppHeader.vue`).
- Every component has a **single root element** (Inertia + Vue requirement).
- Build from `@/components/ui` primitives instead of restyling from scratch.
- Type props/emits with `<script setup lang="ts">`.

## Example: sample & how it's used

**Sample** — `Components/Shared/UserCard.vue` (composes a UI primitive + uses Inertia)

```vue
<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import Button from '@/components/ui/Button.vue';
import type { User } from '@/types';

defineProps<{ user: User }>();
</script>

<template>
    <div class="flex items-center justify-between rounded border p-4">
        <span>{{ user.name }}</span>
        <Link :href="`/users/${user.id}/edit`"
            ><Button variant="ghost">Edit</Button></Link
        >
    </div>
</template>
```

**How it's used** — in a Page, driven by server data

```vue
<script setup lang="ts">
import UserCard from '@/components/shared/UserCard.vue';
import type { User } from '@/types';

defineProps<{ users: User[] }>();
</script>

<template>
    <UserCard v-for="user in users" :key="user.id" :user="user" />
</template>
```

## Domain subfolders (this app)

This app groups its shared components by product domain to keep ~140 files
navigable: `auth/`, `wizard/`, `cart/`, `catalog/`, `home/`, `orders/`,
`pending/`, `profile/`, `my-formulas/`, `contact/`, `navbar/`, `mode/`, `art/`
(decorative SVG illustrations). The classification rule is unchanged — every
file in these folders is a Shared component; the folders are organization only.
