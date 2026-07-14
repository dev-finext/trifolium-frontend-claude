<script setup>
// One label/value line inside the order-summary card.
defineProps({
    label: { type: String, required: true },
    value: { type: String, required: true },
    accent: { type: Boolean, default: false },
});
</script>

<template>
    <div style="display: flex; justify-content: space-between; align-items: baseline; padding: 6px 0">
        <span style="font-size: 13.5px; color: var(--ink-2)">{{ label }}</span>
        <span class="num" :style="{ fontSize: '14px', fontWeight: 600, color: accent ? 'var(--accent)' : 'var(--ink)' }">{{ value }}</span>
    </div>
</template>
