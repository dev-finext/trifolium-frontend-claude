<script setup>
// Single goji berry — small red ovoid with tiny stem.
// Renders an SVG <g>; relies on the `#cnhero-goji` radial gradient defined
// in HeroPanorama's <defs>, so it is only meaningful inside it.
defineProps({
    scale: { type: Number, default: 1 },
});
</script>

<template>
    <g :transform="`scale(${scale})`">
        <!-- stem -->
        <path
            d="M 0 -10 Q 3 -16 7 -18"
            stroke="#3a4d2f"
            stroke-width="1.5"
            fill="none"
            stroke-linecap="round"
        />
        <ellipse
            cx="6"
            cy="-18"
            rx="3"
            ry="1.2"
            fill="#3a4d2f"
            transform="rotate(28 6 -18)"
        />
        <!-- berry -->
        <ellipse cx="0" cy="0" rx="8" ry="10" fill="url(#cnhero-goji)" />
        <!-- highlight -->
        <ellipse
            cx="-3"
            cy="-3"
            rx="2.2"
            ry="3"
            fill="#ffb09a"
            opacity="0.55"
        />
    </g>
</template>
