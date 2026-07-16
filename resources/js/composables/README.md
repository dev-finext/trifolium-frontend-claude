# Composables

Reusable **Vue composition functions** (`use*`) that encapsulate stateful logic, side effects, and reactivity — without rendering any markup. Share behavior across components/pages here.

Import via the `@/` alias:

```ts
import { useDarkMode } from '@/composables/useDarkMode';
```

## What belongs here

- Vue composables that return reactive state and helpers: `useDarkMode.ts`, `useClipboard.ts`, `useDebounce.ts`, `usePagination.ts`, `useMediaQuery.ts`.
- Wrappers around Inertia patterns reused in many places (e.g. a form/flash/polling helper).
- Logic built on `ref`, `computed`, `watch`, `onMounted`, and other Vue APIs.

```ts
import { ref, onMounted } from 'vue';

export function useDarkMode() {
  const isDark = ref(false);

  onMounted(() => {
    isDark.value = document.documentElement.classList.contains('dark');
  });

  function toggle() {
    isDark.value = !isDark.value;
    document.documentElement.classList.toggle('dark', isDark.value);
  }

  return { isDark, toggle };
}
```

## What does NOT belong here

- Anything that renders markup → `@/components/*`.
- Global/shared app-wide state → `@/stores`.
- Pure, non-reactive helper functions (formatting, `cn()`, etc.) → `@/lib`.

## Conventions

- One composable per file; filename = composable name, **`useXxx.ts`** (camelCase).
- Always `export function useXxx()` returning refs/computed and functions.
- Keep them framework-pure: no direct DOM assumptions beyond what's guarded (SSR-safe).
- Type inputs and returns explicitly.

## Example: sample & how it's used

**Sample** — `Composables/useDarkMode.ts`

```ts
import { ref, onMounted } from 'vue';

export function useDarkMode() {
  const isDark = ref(false);

  onMounted(() => {
    isDark.value = document.documentElement.classList.contains('dark');
  });

  function toggle() {
    isDark.value = !isDark.value;
    document.documentElement.classList.toggle('dark', isDark.value);
  }

  return { isDark, toggle };
}
```

**How it's used** — called from any component's `<script setup>`

```vue
<script setup lang="ts">
import Button from '@/components/ui/Button.vue';
import { useDarkMode } from '@/composables/useDarkMode';

const { isDark, toggle } = useDarkMode();
</script>

<template>
  <Button @click="toggle">{{ isDark ? '☀️ Light' : '🌙 Dark' }}</Button>
</template>
```
