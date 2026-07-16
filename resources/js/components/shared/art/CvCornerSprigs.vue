<script setup>
// Connective decoration — the same faint sprigs in two opposite corners
// on every cover, the visual thread that ties the whole set together.
// Renders an SVG <g>; must be placed inside an <svg>.
import CvSprig from './CvSprig.vue';

defineProps({
    p: { type: Object, required: true }, // cover palette from coverPalette()
});
</script>

<template>
    <!-- dark (video) covers use the lighter opacity; ink color doubles as the dark flag -->
    <g :opacity="p.ink === '#f3efe6' ? 0.16 : 0.20">
        <g transform="translate(24,184) rotate(-14)"><CvSprig :p="p" :scale="0.72" /></g>
        <g transform="translate(300,10) rotate(166)"><CvSprig :p="p" :scale="0.6" /></g>
    </g>
</template>
