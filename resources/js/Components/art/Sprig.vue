<script setup>
// Reusable herb sprig — stem + leaves, drawn from primitives only.
// Renders an SVG <g>; must be placed inside an <svg>.
defineProps({
    color: { type: String, default: '#3d5a3a' },
    scale: { type: Number, default: 1 },
});
</script>

<template>
    <g :transform="`scale(${scale})`" :stroke="color" stroke-width="2" :fill="color" fill-opacity="0.6">
        <path d="M 0 0 Q 12 -40 0 -120" fill="none" />
        <ellipse cx="-14" cy="-22" rx="14" ry="6" transform="rotate(-30 -14 -22)" />
        <ellipse cx="16" cy="-46" rx="14" ry="6" transform="rotate(28 16 -46)" />
        <ellipse cx="-12" cy="-70" rx="13" ry="5" transform="rotate(-32 -12 -70)" />
        <ellipse cx="14" cy="-94" rx="13" ry="5" transform="rotate(30 14 -94)" />
        <ellipse cx="-8" cy="-114" rx="10" ry="4" transform="rotate(-35 -8 -114)" />
    </g>
</template>
