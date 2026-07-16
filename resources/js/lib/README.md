# lib

**Framework-agnostic utility functions and helpers** — pure, stateless code with no Vue reactivity and no rendering. Small building blocks used throughout the app.

Import via the `@/` alias:

```ts
import { cn } from '@/lib/utils';
```

## What belongs here

- Pure helper functions: `utils.ts` (`cn()`), `formatDate.ts`, `formatCurrency.ts`, `str.ts`.
- Thin wrappers/config around third-party libs (dates, validation, etc.).
- Constants and pure data transforms shared across components.

The existing `utils.ts` holds the Tailwind class-merge helper:

```ts
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## What does NOT belong here

- Anything reactive or with Vue lifecycle → `@/composables`.
- Global mutable state → `@/stores`.
- Anything that renders markup → `@/components/*`.
- Type-only declarations → `@/types`.

## Conventions

- **camelCase** filenames grouped by concern (`utils.ts`, `formatDate.ts`).
- Export named, **pure** functions (same input → same output, no side effects).
- Keep functions small, typed, and independently testable.

## Example: sample & how it's used

**Sample** — `lib/formatDate.ts`

```ts
export function formatDate(value: string | Date, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}
```

**How it's used** — imported anywhere a formatted date is needed

```vue
<script setup lang="ts">
import { formatDate } from '@/lib/formatDate';

defineProps<{ publishedAt: string }>();
</script>

<template>
  <time>{{ formatDate(publishedAt) }}</time>
</template>
```
