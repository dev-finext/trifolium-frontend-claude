<script setup>
// Points badge — gold coin + count, with a hover tooltip explaining the points.
import { ref } from 'vue';
import GoldCoin from '@/Components/navbar/GoldCoin.vue';

defineProps({
    /** Formatted points count, e.g. "1,240". */
    value: { type: String, required: true },
});

const hover = ref(false);
</script>

<template>
    <span
        style="position: relative; display: inline-flex; align-items: center; gap: 7px; cursor: default"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <GoldCoin :size="20" />
        <span class="num" style="font-size: 15.5px; font-weight: 700; color: var(--ink)">{{ value }}</span>
        <span
            v-if="hover"
            role="tooltip"
            :style="{
                position: 'absolute', top: 'calc(100% + 10px)', left: '50%',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap', padding: '5px 9px', borderRadius: '7px',
                background: 'var(--ink)', color: 'var(--surface)',
                fontSize: '11.5px', fontWeight: 600, lineHeight: 1, zIndex: 90,
                boxShadow: '0 6px 18px rgba(20,28,24,0.22)', pointerEvents: 'none',
                animation: 'tf-tip-in .12s ease both',
            }"
        >נקודות זכות למימוש</span>
    </span>
</template>
