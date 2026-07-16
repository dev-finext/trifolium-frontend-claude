# types

**Shared TypeScript type definitions** for the frontend — domain models, Inertia page-prop shapes, and ambient module augmentations. Type-only; nothing here emits runtime code.

Import via the `@/` alias:

```ts
import type { Auth } from '@/types/auth';
import type { User } from '@/types';
```

## What's here

- **`index.ts`** — barrel that re-exports the app's shared types for easy importing.
- **`auth.ts`** — auth-related types (`Auth`, `User`, etc.) shared across pages.
- **`global.d.ts`** — ambient declarations: augments `vite/client` (`ImportMetaEnv`), `@inertiajs/core` (`sharedPageProps`), and `vue` (`$inertia`, `$page` custom properties).
- **`vue-shims.d.ts`** — lets TypeScript understand `*.vue` single-file component imports.

## What belongs here

- Reusable `interface` / `type` definitions for domain models and DTOs.
- Inertia shared page-prop shapes and page-specific prop types.
- Ambient `declare module` augmentations (`*.d.ts`).

## What does NOT belong here

- Runtime values, functions, or constants → `@/lib`.
- Reactive logic → `@/composables`; state → `@/stores`.

## Conventions

- **`.d.ts`** for ambient/global declarations; **`.ts`** for importable named types.
- Re-export shared types through `index.ts` so consumers import from `@/types`.
- Use `import type { ... }` for type-only imports to keep bundles clean.
- Keep names aligned with backend models/DTOs (and any generated data types) where applicable.

## Example: sample & how it's used

**Sample** — `types/user.ts`, re-exported from `types/index.ts`

```ts
// types/user.ts
export interface User {
    id: number;
    name: string;
    email: string;
}
```

```ts
// types/index.ts (barrel)
export * from './auth';
export * from './user';
```

**How it's used** — imported as a type from `@/types` to type props and data

```vue
<script setup lang="ts">
import type { User } from '@/types';

defineProps<{ users: User[] }>();
</script>
```
