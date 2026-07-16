<script setup>
// Cover primitive — outlined leaf (ellipse + midrib line).
// Renders an SVG <g>; must be placed inside an <svg>.
defineProps({
    cx: { type: Number, default: 0 },
    cy: { type: Number, default: 0 },
    rx: { type: Number, default: 13 },
    ry: { type: Number, default: 5 },
    rot: { type: Number, default: 0 },
    p: { type: Object, required: true }, // cover palette from coverPalette()
    accent: { type: Boolean, default: false },
});
</script>

<template>
    <g :transform="`rotate(${rot} ${cx} ${cy})`">
        <ellipse :cx="cx" :cy="cy" :rx="rx" :ry="ry" :fill="accent ? p.accent : 'none'" :stroke="p.ink" stroke-width="1.6" />
        <line :x1="cx - rx + 1" :y1="cy" :x2="cx + rx - 1" :y2="cy" :stroke="p.ink" stroke-width="0.9" opacity="0.55" />
    </g>
</template>
