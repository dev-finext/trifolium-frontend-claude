<script setup>
// Diagonal "חדש" corner banner for marking features that are new vs. the
// previous system: a wide band crossing the top-left corner, clipped flush by
// the element's rounded corner (overflow:hidden + matching border-radius).
import NewRibbonMark from '@/components/shared/NewRibbonMark.vue';

defineProps({
    radius: { type: Number, default: 6 },
    top: { type: Number, default: 11 },
    left: { type: Number, default: -30 },
});
</script>

<template>
    <span
        class="relative inline-flex overflow-hidden"
        :style="{ borderRadius: `${radius}px` }"
    >
        <slot />
        <NewRibbonMark :top="top" :left="left" />
    </span>
</template>
