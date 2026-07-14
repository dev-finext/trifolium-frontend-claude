<script setup>
// VIDEO THUMBNAIL — illustration per chapter.
import { computed } from 'vue';
import { PALETTES } from './art-data.js';

const props = defineProps({
    // chapter: 'GETTING STARTED' | 'COMPOUNDING' | 'INGREDIENTS' |
    //          'PATIENTS' | 'CATALOG' | 'ORDERS'
    chapter: { type: String, default: 'GETTING STARTED' },
});

const MAP = {
    'GETTING STARTED': { palette: PALETTES.slate, draw: 'welcome' },
    'COMPOUNDING':     { palette: PALETTES.earth, draw: 'flask' },
    'INGREDIENTS':     { palette: PALETTES.green, draw: 'grid' },
    'PATIENTS':        { palette: PALETTES.cool,  draw: 'people' },
    'CATALOG':         { palette: PALETTES.warm,  draw: 'shelf' },
    'ORDERS':          { palette: PALETTES.ink,   draw: 'box' },
};

const v = computed(() => MAP[props.chapter] || MAP['GETTING STARTED']);
const p = computed(() => v.value.palette);

// index helpers for the 3×3 leaf grid and the shelf bottles
const THREE = [0, 1, 2];
</script>

<template>
    <svg viewBox="0 0 320 220" preserveAspectRatio="xMidYMid slice" style="width: 100%; height: 100%; display: block">
        <defs>
            <linearGradient :id="`vid-${v.draw}-bg`" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" :stop-color="p.bg2" />
                <stop offset="100%" :stop-color="p.ink" />
            </linearGradient>
        </defs>
        <rect width="320" height="220" :fill="`url(#vid-${v.draw}-bg)`" />

        <g v-if="v.draw === 'welcome'" opacity="0.85">
            <!-- Trefoil + Trifolium-like mark -->
            <g transform="translate(160,100)">
                <circle cx="-22" cy="-8" r="22" fill="none" stroke="#fff" stroke-width="2" />
                <circle cx="22" cy="-8" r="22" fill="none" stroke="#fff" stroke-width="2" />
                <circle cx="0" cy="22" r="22" fill="none" stroke="#fff" stroke-width="2" />
            </g>
        </g>

        <g v-if="v.draw === 'flask'" opacity="0.85">
            <!-- Big flask + droplet -->
            <g transform="translate(160,110)">
                <rect x="-12" y="-50" width="24" height="6" rx="2" fill="#fff" />
                <path d="M -8 -44 L -8 -20 L -36 30 Q -42 46 -24 46 L 24 46 Q 42 46 36 30 L 8 -20 L 8 -44 Z" fill="none" stroke="#fff" stroke-width="2" />
                <path d="M -22 14 L 22 14" stroke="#fff" stroke-width="1.5" opacity="0.7" />
                <!-- liquid -->
                <path d="M -28 18 L 28 18 L 22 38 Q 16 44 4 44 L -4 44 Q -16 44 -22 38 Z" fill="#fff" opacity="0.25" />
            </g>
        </g>

        <g v-if="v.draw === 'grid'" opacity="0.82">
            <!-- 3×3 leaf grid -->
            <template v-for="r in THREE" :key="r">
                <g v-for="c in THREE" :key="`${r}-${c}`" :transform="`translate(${100 + c * 60},${72 + r * 40})`">
                    <ellipse cx="0" cy="0" rx="18" ry="8" fill="none" stroke="#fff" stroke-width="1.5" :transform="`rotate(${(r + c) % 2 ? 30 : -25} 0 0)`" />
                </g>
            </template>
        </g>

        <g v-if="v.draw === 'people'" opacity="0.88">
            <!-- Two figures -->
            <g transform="translate(118,110)">
                <circle cx="0" cy="-30" r="16" fill="none" stroke="#fff" stroke-width="2" />
                <path d="M -28 30 Q -28 0 0 0 Q 28 0 28 30 Z" fill="none" stroke="#fff" stroke-width="2" />
            </g>
            <g transform="translate(202,110)">
                <circle cx="0" cy="-30" r="16" fill="none" stroke="#fff" stroke-width="2" />
                <path d="M -28 30 Q -28 0 0 0 Q 28 0 28 30 Z" fill="none" stroke="#fff" stroke-width="2" />
            </g>
        </g>

        <g v-if="v.draw === 'shelf'" opacity="0.85">
            <!-- Three bottles on a shelf -->
            <g v-for="i in THREE" :key="i" :transform="`translate(${100 + i * 60},108)`">
                <rect x="-7" y="-44" width="14" height="4" rx="1" fill="#fff" />
                <rect x="-12" y="-40" width="24" height="64" rx="3" fill="none" stroke="#fff" stroke-width="1.6" />
                <rect x="-8" y="-12" width="16" height="20" fill="#fff" opacity="0.2" />
            </g>
            <line x1="60" y1="138" x2="260" y2="138" stroke="#fff" stroke-width="1.5" opacity="0.7" />
        </g>

        <g v-if="v.draw === 'box'" opacity="0.85">
            <!-- Package box -->
            <g transform="translate(160,110)">
                <path d="M -50 -22 L 0 -42 L 50 -22 L 0 -2 Z" fill="none" stroke="#fff" stroke-width="2" />
                <path d="M -50 -22 L -50 36 L 0 56 L 0 -2 Z" fill="none" stroke="#fff" stroke-width="2" />
                <path d="M 50 -22 L 50 36 L 0 56 L 0 -2 Z" fill="none" stroke="#fff" stroke-width="2" />
                <path d="M -50 -22 L 0 -2 L 50 -22" fill="none" stroke="#fff" stroke-width="2" />
            </g>
        </g>
    </svg>
</template>
