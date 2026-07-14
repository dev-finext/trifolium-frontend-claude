<script setup>
// Round initials avatar — filled accent when the patient is selected.
defineProps({
    initials: { type: String, default: '' },
    size: { type: Number, default: 46 },
    sel: { type: Boolean, default: false },
});
</script>

<template>
    <div
        :style="{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            flexShrink: 0,
            background: sel ? 'var(--accent)' : 'var(--accent-tint-strong)',
            color: sel ? '#fff' : 'var(--accent-ink)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: `${Math.round(size * 0.34)}px`,
        }"
    >{{ initials }}</div>
</template>
