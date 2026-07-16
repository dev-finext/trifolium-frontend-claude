<script setup>
// Chrysanthemum / osmanthus flower head — radial petals around a center.
// Renders an SVG <g>; must be placed inside an <svg>.
defineProps({
    color: { type: String, default: '#b8893f' },
    centerColor: { type: String, default: '#7d2018' },
    scale: { type: Number, default: 1 },
});

const PETALS = 10;
</script>

<template>
    <g :transform="`scale(${scale})`">
        <!-- outer petals -->
        <ellipse
            v-for="i in PETALS"
            :key="i"
            cx="0" cy="-14"
            rx="6" ry="13"
            :fill="color"
            opacity="0.85"
            :transform="`rotate(${((i - 1) / PETALS) * 360})`"
        />
        <!-- inner petals -->
        <ellipse
            v-for="i in PETALS"
            :key="`i-${i}`"
            cx="0" cy="-7"
            rx="4" ry="7"
            :fill="color"
            opacity="0.95"
            :transform="`rotate(${((i - 1) / PETALS) * 360 + 18})`"
        />
        <circle cx="0" cy="0" r="4" :fill="centerColor" />
        <circle cx="-1" cy="-1" r="1.4" fill="#f5d57a" />
    </g>
</template>
