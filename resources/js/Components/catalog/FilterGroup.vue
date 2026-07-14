<script setup>
// Sidebar filter section: small uppercase label above a stacked list of rows.
// `last` drops the bottom divider/spacing on the final group.
defineProps({
    label: { type: String, required: true },
    last: { type: Boolean, default: false },
});
</script>

<template>
    <div
        :style="{
            paddingBottom: last ? 0 : '18px',
            marginBottom: last ? 0 : '18px',
            borderBottom: last ? 'none' : '1px solid var(--line)',
        }"
    >
        <div style="font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-3); font-weight: 600; margin-bottom: 10px">
            {{ label }}
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px">
            <slot />
        </div>
    </div>
</template>
