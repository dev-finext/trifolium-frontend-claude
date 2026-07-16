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
        class="pointer-events-none absolute z-[6] origin-center [transform:rotate(-45deg)] bg-accent px-[34px] py-[3px] font-heb text-[10px] leading-[1] font-extrabold tracking-[0.06em] text-on-accent"
        :style="{ top: `${top}px`, left: `${left}px` }"
        >חדש</span
    >
</template>
