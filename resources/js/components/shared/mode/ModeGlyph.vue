<script setup>
// Tiny mode glyph (12px): yin-yang or outline mortar.
import YinYang from '@/components/shared/mode/YinYang.vue';

defineProps({
    /** 'western' | 'chinese' */
    mode: { type: String, required: true },
    size: { type: Number, default: 12 },
});
</script>

<template>
    <YinYang v-if="mode === 'chinese'" :size="size" />
    <svg
        v-else
        :width="size"
        :height="size"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <path d="M14.5 3.5 L19 8" />
        <path d="M4 11 H20 L18.5 18 a3 3 0 0 1 -3 2.5 H8.5 a3 3 0 0 1 -3 -2.5 Z" />
    </svg>
</template>
