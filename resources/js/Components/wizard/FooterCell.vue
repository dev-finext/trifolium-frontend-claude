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
        :style="{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0 18px',
            borderLeft: last ? 'none' : '1px solid var(--line)',
            height: '24px',
            fontSize: '13px',
            whiteSpace: 'nowrap',
        }"
    >
        <span
            style="font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-3); font-weight: 600"
        >{{ label }}</span>
        <span
            v-if="$slots.default || value !== undefined"
            :style="{
                color: warning ? 'var(--warning)' : (highlight ? 'var(--ink)' : 'var(--ink-2)'),
                fontWeight: warning || highlight ? 600 : 500,
            }"
        >
            <slot>{{ value }}</slot>
        </span>
    </div>
</template>
