<script setup>
// Small labeled divider between the Chinese and Western groups in the
// ingredient dropdown.
defineProps({
    label: { type: String, required: true },
    first: { type: Boolean, default: false },
});
</script>

<template>
    <div
        dir="rtl"
        :style="{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: first ? '10px 14px 7px' : '11px 14px 7px',
            borderTop: first ? 'none' : '1px solid var(--line)',
            background: 'var(--surface-sunk)',
        }"
    >
        <span style="font-size: 11px; letter-spacing: .08em; font-weight: 700; color: var(--ink-3); white-space: nowrap">{{ label }}</span>
        <span style="flex: 1; height: 1px; background: var(--line)" />
    </div>
</template>
