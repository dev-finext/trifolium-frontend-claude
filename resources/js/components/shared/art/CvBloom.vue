<script setup>
// Cover primitive — outlined radial bloom with an accent center.
// Renders an SVG <g>; must be placed inside an <svg>.
defineProps({
    p: { type: Object, required: true }, // cover palette from coverPalette()
    petals: { type: Number, default: 10 },
    scale: { type: Number, default: 1 },
});
</script>

<template>
    <g :transform="`scale(${scale})`">
        <ellipse
            v-for="i in petals"
            :key="i"
            cx="0" cy="-15" rx="5" ry="13"
            fill="none" :stroke="p.ink" stroke-width="1.5"
            :transform="`rotate(${((i - 1) / petals) * 360})`"
        />
        <circle cx="0" cy="0" r="6" :fill="p.accent" :stroke="p.ink" stroke-width="1.3" />
    </g>
</template>
