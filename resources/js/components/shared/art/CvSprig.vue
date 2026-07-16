<script setup>
// Cover primitive — line-art herb sprig (stem + four leaves, optional accent tip).
// Renders an SVG <g>; must be placed inside an <svg>.
import CvLeaf from './CvLeaf.vue';

defineProps({
    p: { type: Object, required: true }, // cover palette from coverPalette()
    scale: { type: Number, default: 1 },
    rot: { type: Number, default: 0 },
    accentTip: { type: Boolean, default: false },
});
</script>

<template>
    <g :transform="`rotate(${rot}) scale(${scale})`">
        <path
            d="M0 0 Q 8 -28 0 -64"
            fill="none"
            :stroke="p.ink"
            stroke-width="1.8"
            stroke-linecap="round"
        />
        <CvLeaf :cx="-10" :cy="-14" :rx="11" :ry="4.5" :rot="-32" :p="p" />
        <CvLeaf :cx="11" :cy="-30" :rx="11" :ry="4.5" :rot="30" :p="p" />
        <CvLeaf :cx="-9" :cy="-46" :rx="9" :ry="4" :rot="-34" :p="p" />
        <CvLeaf :cx="8" :cy="-58" :rx="7" :ry="3.2" :rot="32" :p="p" />
        <circle v-if="accentTip" cx="0" cy="-64" r="3.4" :fill="p.accent" />
    </g>
</template>
