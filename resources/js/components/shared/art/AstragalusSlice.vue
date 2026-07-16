<script setup>
// Astragalus root slice — flat oval disc with concentric rings.
// Renders an SVG <g>; must be placed inside an <svg>.
defineProps({
    color: { type: String, default: '#c8b48a' },
    edge: { type: String, default: '#b8893f' },
    rot: { type: Number, default: 0 },
    scale: { type: Number, default: 1 },
});
</script>

<template>
    <g :transform="`rotate(${rot}) scale(${scale})`">
        <ellipse cx="0" cy="0" rx="22" ry="8" :fill="color" :stroke="edge" stroke-width="1.2" />
        <ellipse cx="0" cy="0" rx="14" ry="5" fill="none" :stroke="edge" stroke-width="0.8" opacity="0.55" />
        <ellipse cx="0" cy="0" rx="7" ry="2.5" :fill="edge" opacity="0.35" />
        <!-- tiny fiber lines -->
        <path d="M -16 0 L -10 0 M -4 0 L 4 0 M 10 0 L 16 0" :stroke="edge" stroke-width="0.6" opacity="0.5" />
    </g>
</template>
