<script setup>
// The diagonal "חדש" band on its own — drop into any element that is already
// position:relative + overflow:hidden (leave clearance so it does not cover
// existing content). Usually used via NewRibbon.vue.
defineProps({
    top: { type: Number, default: 11 },
    left: { type: Number, default: -30 },
});
</script>

<template>
    <span
        aria-label="פיצ'ר חדש"
        class="absolute z-[6] origin-center [transform:rotate(-45deg)] py-[3px] px-[34px] font-heb text-[10px] font-extrabold tracking-[0.06em] leading-[1] text-on-accent bg-accent pointer-events-none"
        :style="{ top: `${top}px`, left: `${left}px` }"
    >חדש</span>
</template>
