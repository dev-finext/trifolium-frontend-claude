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
        class="inline-flex items-center px-[9px] py-[2px] text-[11.5px] font-semibold rounded-[999px] whitespace-nowrap"
        :style="{
            background: colors.bg,
            color: colors.fg,
        }"
    ><slot /></span>
</template>
