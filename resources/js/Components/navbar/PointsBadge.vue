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
        class="relative inline-flex items-center gap-[7px] cursor-default"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <GoldCoin :size="20" />
        <span class="num text-[15.5px] font-bold text-ink">{{ value }}</span>
        <span
            v-if="hover"
            role="tooltip"
            class="absolute top-[calc(100%_+_10px)] left-[50%] [transform:translateX(-50%)] z-[90] py-[5px] px-[9px] whitespace-nowrap text-[11.5px] font-semibold leading-[1] bg-(--ink) text-(--surface) rounded-[7px] shadow-[0_6px_18px_rgba(20,28,24,0.22)] pointer-events-none animate-[tf-tip-in_.12s_ease_both]"
        >נקודות זכות למימוש</span>
    </span>
</template>
