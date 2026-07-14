<script setup>
// Status pill on a patient card: פעיל (accent) / מעקב (amber "follow").
import { computed } from 'vue';

const props = defineProps({
    tone: { type: String, default: 'active' },
});

const MAP = {
    active: { bg: 'var(--accent-tint)', fg: 'var(--accent-ink)' },
    follow: { bg: '#f4ecd8', fg: 'var(--warning)' },
};

const colors = computed(() => MAP[props.tone] || MAP.active);
</script>

<template>
    <span
        :style="{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 9px',
            borderRadius: '999px',
            fontSize: '11.5px',
            fontWeight: 600,
            background: colors.bg,
            color: colors.fg,
            whiteSpace: 'nowrap',
        }"
    ><slot /></span>
</template>
