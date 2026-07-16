# Components/UI

Low-level, **reusable presentational primitives** — the design-system building blocks of the app. These components are generic, unaware of any business/domain logic, and safe to use anywhere.

Import via the `@/` alias:

```ts
import Button from '@/components/ui/Button.vue';
```

## What belongs here

- Generic, self-contained UI primitives: `Button.vue`, `Input.vue`, `Card.vue`, `Badge.vue`, `Modal.vue`, `Dropdown.vue`, `Avatar.vue`, `Spinner.vue`, `Tooltip.vue`, etc.
- Purely driven by **props, slots, and emits** — no Inertia calls, no stores, no API/route knowledge.
- Style with Tailwind. Merge/override classes with the `cn()` helper from `@/lib/utils`:

  ```vue
  <script setup lang="ts">
  import { cn } from '@/lib/utils';

  const props = defineProps<{ class?: string }>();
  </script>

  <template>
    <button :class="cn('rounded px-4 py-2 font-medium', props.class)">
      <slot />
    </button>
  </template>
  ```

## What does NOT belong here

- Anything that fetches data, submits forms, or references routes/stores → put it in `../Shared` (composed feature components) or `@/Pages`.
- Full page components → `@/Pages`.
- Data-fetching / state logic → `@/composables` or `@/stores`.

## Conventions

- One component per file, **PascalCase** filename matching the component (`Button.vue`).
- Every component has a **single root element** (Inertia + Vue requirement).
- Type props/emits with `<script setup lang="ts">` and `defineProps`/`defineEmits`.
- Prefer a `class?: string` prop merged with `cn()` so consumers can restyle.

## Example: sample & how it's used

**Sample** — `Components/UI/Button.vue`

```vue
<script setup lang="ts">
import { cn } from '@/lib/utils';

withDefaults(defineProps<{ variant?: 'primary' | 'ghost'; class?: string }>(), {
  variant: 'primary',
});
defineEmits<{ click: [MouseEvent] }>();

const styles = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  ghost: 'bg-transparent text-blue-600 hover:bg-blue-50',
};
</script>

<template>
  <button
    :class="cn('rounded px-4 py-2 font-medium', styles[variant], $props.class)"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
```

**How it's used** — in a Shared component or a Page

```vue
<script setup lang="ts">
import Button from '@/components/ui/Button.vue';
</script>

<template>
  <Button @click="save">Save</Button>
  <Button variant="ghost" class="ml-2">Cancel</Button>
</template>
```
