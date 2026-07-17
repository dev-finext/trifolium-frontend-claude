<script setup>
// Points badge — gold coin + count. Clicking it opens the wallet ("תנועות
// הארנק שלי"); a hover tooltip explains what the points are.
import { ref } from 'vue';
import GoldCoin from '@/components/shared/navbar/GoldCoin.vue';
import { visit } from '@/lib/routes';

defineProps({
    /** Formatted points count, e.g. "1,240". */
    value: { type: String, required: true },
});

const hover = ref(false);
</script>

<template>
    <button
        type="button"
        class="relative inline-flex cursor-pointer items-center gap-[7px] rounded-[999px] border-none bg-transparent p-0 transition-opacity hover:opacity-80"
        aria-label="תנועות הארנק שלי"
        @click="visit('wallet')"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <GoldCoin :size="20" />
        <span class="num text-[15.5px] font-bold text-ink">{{ value }}</span>
        <span
            v-if="hover"
            role="tooltip"
            class="pointer-events-none absolute top-[calc(100%_+_10px)] left-[50%] z-[90] [transform:translateX(-50%)] animate-[tf-tip-in_.12s_ease_both] rounded-[7px] bg-(--ink) px-[9px] py-[5px] text-[11.5px] leading-[1] font-semibold whitespace-nowrap text-(--surface) shadow-[0_6px_18px_rgba(20,28,24,0.22)]"
            >לתנועות הארנק שלי</span
        >
    </button>
</template>
