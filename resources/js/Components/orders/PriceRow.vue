<script setup>
// Single pricing line — label + amount, optionally muted or accented.
defineProps({
    label: { type: String, default: '' },
    value: { type: String, default: '' },
    muted: { type: Boolean, default: false },
    accent: { type: Boolean, default: false },
});
</script>

<template>
    <div style="display: flex; justify-content: space-between; align-items: baseline; padding: 6px 0">
        <span style="font-size: 13px; color: var(--ink-2)">{{ label }}</span>
        <span
            class="num"
            :style="{ fontSize: '14px', fontWeight: 500, color: accent ? 'var(--accent)' : muted ? 'var(--ink-3)' : 'var(--ink)' }"
        >{{ value }}</span>
    </div>
</template>
