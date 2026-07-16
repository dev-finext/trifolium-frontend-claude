<script setup>
// PRODUCT CARD — illustration per format inferred from product name.
import { computed } from 'vue';
import { PALETTES } from './art-data.js';

const props = defineProps({
    // heb: the product's Hebrew name — keywords in it pick the "format".
    heb: { type: String, required: true },
});

// pick a "format" by keyword in the name
const kind = computed(() => {
    if (props.heb.includes('כמוסות')) return 'capsules';
    if (props.heb.includes('משחת') || props.heb.includes('קרם') || props.heb.includes('ג׳ל')) return 'jar';
    if (props.heb.includes('תה') || props.heb.includes('חליטה')) return 'tea';
    if (props.heb.includes('אבקה')) return 'powder';
    return 'bottle';
});

const palette = computed(() => ({
    bottle:   PALETTES.green,
    capsules: PALETTES.warm,
    jar:      PALETTES.cool,
    tea:      PALETTES.earth,
    powder:   PALETTES.slate,
}[kind.value]));

// Gradient id is unique per product (kind + name), as in the source, so
// several product cards can render on the same page without id clashes.
const gradId = computed(() => `prod-${kind.value}-bg-${props.heb}`);

// scattered capsule positions (x, y, rotation)
const CAPSULES = [
    { x: 110, y: 80, r: 20 },
    { x: 160, y: 100, r: 0 },
    { x: 210, y: 80, r: -20 },
    { x: 140, y: 124, r: -10 },
    { x: 184, y: 124, r: 14 },
];
</script>

<template>
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" class="block w-full h-full">
        <defs>
            <linearGradient :id="gradId" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" :stop-color="palette.light" />
                <stop offset="100%" :stop-color="palette.bg1" />
            </linearGradient>
        </defs>
        <rect width="320" height="180" :fill="`url(#${gradId})`" />

        <g v-if="kind === 'bottle'" transform="translate(160,98)">
            <ellipse cx="0" cy="68" rx="40" ry="6" fill="rgba(0,0,0,0.12)" />
            <rect x="-12" y="-60" width="24" height="10" rx="2" :fill="palette.ink" />
            <path d="M -10 -50 L -10 -32 L -28 6 L -28 60 Q -28 70 -16 70 L 16 70 Q 28 70 28 60 L 28 6 L 10 -32 L 10 -50 Z" :fill="palette.ink" opacity="0.92" />
            <rect x="-22" y="14" width="44" height="40" fill="#fff" />
            <rect x="-16" y="22" width="32" height="2" :fill="palette.ink" opacity="0.55" />
            <rect x="-16" y="28" width="22" height="2" :fill="palette.ink" opacity="0.4" />
            <rect x="-16" y="36" width="16" height="6" :fill="palette.accent" />
        </g>

        <g v-if="kind === 'capsules'">
            <g v-for="(c, i) in CAPSULES" :key="i" :transform="`translate(${c.x},${c.y}) rotate(${c.r})`">
                <rect x="-20" y="-8" width="40" height="16" rx="8" fill="#fff" :stroke="palette.ink" stroke-width="1.4" />
                <path d="M 0 -8 L 0 8" :stroke="palette.ink" stroke-width="1.4" />
                <rect x="-19" y="-7" width="19" height="14" rx="7" :fill="palette.accent" opacity="0.7" />
            </g>
        </g>

        <g v-if="kind === 'jar'" transform="translate(160,108)">
            <ellipse cx="0" cy="60" rx="56" ry="6" fill="rgba(0,0,0,0.12)" />
            <ellipse cx="0" cy="-40" rx="40" ry="8" :fill="palette.ink" />
            <rect x="-40" y="-40" width="80" height="100" :fill="palette.ink" opacity="0.92" />
            <ellipse cx="0" cy="60" rx="40" ry="8" :fill="palette.ink" />
            <rect x="-32" y="-20" width="64" height="56" fill="#fff" />
            <rect x="-26" y="-8" width="52" height="2" :fill="palette.ink" opacity="0.55" />
            <rect x="-26" y="0" width="36" height="2" :fill="palette.ink" opacity="0.4" />
            <rect x="-26" y="14" width="20" height="8" :fill="palette.accent" />
        </g>

        <g v-if="kind === 'tea'">
            <!-- Tea cup with steam -->
            <g transform="translate(160,110)">
                <ellipse cx="0" cy="38" rx="56" ry="6" fill="rgba(0,0,0,0.12)" />
                <path d="M -50 -10 L 50 -10 L 44 32 Q 40 40 30 40 L -30 40 Q -40 40 -44 32 Z" :fill="palette.ink" opacity="0.92" />
                <ellipse cx="0" cy="-10" rx="50" ry="8" :fill="palette.bg2" />
                <ellipse cx="0" cy="-10" rx="42" ry="5" :fill="palette.accent" opacity="0.6" />
                <path d="M 50 0 Q 70 4 70 18 Q 70 30 54 30" fill="none" :stroke="palette.ink" stroke-width="3" />
            </g>
            <!-- Steam -->
            <g :stroke="palette.ink" stroke-width="2" fill="none" opacity="0.55" stroke-linecap="round">
                <path d="M 142 60 Q 138 50 142 40 Q 146 30 142 22" />
                <path d="M 160 56 Q 156 46 160 36 Q 164 26 160 18" />
                <path d="M 178 60 Q 174 50 178 40 Q 182 30 178 22" />
            </g>
        </g>

        <g v-if="kind === 'powder'" transform="translate(160,108)">
            <ellipse cx="0" cy="58" rx="56" ry="6" fill="rgba(0,0,0,0.12)" />
            <path d="M -50 -42 L 50 -42 L 38 48 Q 36 58 28 58 L -28 58 Q -36 58 -38 48 Z" :fill="palette.ink" opacity="0.92" />
            <ellipse cx="0" cy="-42" rx="50" ry="6" :fill="palette.bg2" />
            <ellipse cx="0" cy="-42" rx="44" ry="4" :fill="palette.accent" opacity="0.7" />
            <rect x="-26" y="-14" width="52" height="34" fill="#fff" />
            <rect x="-20" y="-6" width="40" height="2" :fill="palette.ink" opacity="0.55" />
            <rect x="-20" y="0" width="28" height="2" :fill="palette.ink" opacity="0.4" />
        </g>
    </svg>
</template>
