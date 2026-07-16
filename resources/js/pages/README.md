# Pages

**Inertia page components** — the top-level views rendered by the server via `Inertia::render('...')` or `Route::inertia('/', 'Welcome')`. Each file here maps to a route on the backend.

```php
// routes/web.php
Route::inertia('/', 'Welcome')->name('home'); // -> resources/js/Pages/Welcome.vue
return Inertia::render('Users/Index', [...]);  // -> resources/js/Pages/Users/Index.vue
```

## What belongs here

- One `.vue` file per screen/route (`Welcome.vue`, `Dashboard.vue`, `Users/Index.vue`, `Users/Edit.vue`).
- Components that receive server data as **page props** and orchestrate the view.
- Group related pages in subfolders that mirror the route/resource (`Users/`, `Settings/`).

```vue
<script setup lang="ts">
import AppLayout from '@/components/shared/AppLayout.vue';

defineProps<{ users: App.Data.UserData[] }>();
</script>

<template>
  <AppLayout>
    <!-- page content -->
  </AppLayout>
</template>
```

## What does NOT belong here

- Reusable UI primitives → `@/components/ui`.
- Cross-page composed components / layouts → `@/components/shared`.
- Data/state logic → `@/composables` or `@/stores`.

## Conventions

- **PascalCase** filenames matching the string passed to `Inertia::render()`.
- The path/name here must match the backend render string exactly (case-sensitive).
- Every component has a **single root element**; compose layouts from `@/components/shared`.
- Type page props with `defineProps` and the shared types in `@/types`.

## Example: sample & how it's used

**Sample** — `Pages/Users/Index.vue`

```vue
<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import UserCard from '@/components/shared/UserCard.vue';
import type { User } from '@/types';

defineProps<{ users: User[] }>();
</script>

<template>
  <AppLayout>
    <UserCard v-for="user in users" :key="user.id" :user="user" />
  </AppLayout>
</template>
```

**How it's used** — the backend renders it by name and passes the props

```php
// routes/web.php
Route::get('/users', fn () => Inertia::render('Users/Index', [
    'users' => User::all(),
]))->name('users.index');
```

The render string `'Users/Index'` maps directly to `Pages/Users/Index.vue`, and the
`users` array arrives as the page's `users` prop.
