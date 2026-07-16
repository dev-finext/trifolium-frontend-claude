<script setup>
// One label/value cell inside the sticky order-summary footer.
// The value can come as a prop or as slot content (icon+text combos).
defineProps({
    label: { type: String, required: true },
    value: { type: [String, Number], default: undefined },
    highlight: { type: Boolean, default: false },
    warning: { type: Boolean, default: false },
    /** Last cell — drops the divider on its end side. */
    last: { type: Boolean, default: false },
});
</script>

<template>
    <div
        class="flex h-[24px] items-center gap-[8px] px-[18px] py-0 text-[13px] whitespace-nowrap"
        :class="last ? '' : 'border-l border-line'"
    >
        <span
            class="text-[11px] font-semibold tracking-[0.08em] text-ink-3 uppercase"
            >{{ label }}</span
        >
        <span
            v-if="$slots.default || value !== undefined"
            :class="[
                warning
                    ? 'text-warning'
                    : highlight
                      ? 'text-ink'
                      : 'text-ink-2',
                warning || highlight ? 'font-semibold' : 'font-medium',
            ]"
        >
            <slot>{{ value }}</slot>
        </span>
    </div>
</template>
