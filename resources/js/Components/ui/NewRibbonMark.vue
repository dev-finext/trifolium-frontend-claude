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
        :style="{
            position: 'absolute', top: `${top}px`, left: `${left}px`, zIndex: 6,
            transform: 'rotate(-45deg)', transformOrigin: 'center',
            background: 'var(--accent)', color: '#fff', fontFamily: 'var(--font-heb)',
            fontSize: '10px', fontWeight: 800, letterSpacing: '0.06em', lineHeight: 1,
            padding: '3px 34px', pointerEvents: 'none',
        }"
    >חדש</span>
</template>
