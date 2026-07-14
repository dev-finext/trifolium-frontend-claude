<script setup>
// EVENT CARD — different illustration per category.
import { computed } from 'vue';
import Sprig from './Sprig.vue';
import { PALETTES } from './art-data.js';

const props = defineProps({
    // cat: 'אירוע' | 'מאמר חדש' | 'עדכון מערכת' | 'וובינר'
    cat: { type: String, default: 'אירוע' },
});

const VARIANTS = {
    'אירוע':       { palette: PALETTES.green,  draw: 'event' },
    'מאמר חדש':    { palette: PALETTES.earth,  draw: 'article' },
    'עדכון מערכת': { palette: PALETTES.cool,   draw: 'update' },
    'וובינר':      { palette: PALETTES.ink,    draw: 'webinar' },
};

const v = computed(() => VARIANTS[props.cat] || VARIANTS['אירוע']);
const p = computed(() => v.value.palette);
</script>

<template>
    <svg viewBox="0 0 320 160" preserveAspectRatio="xMidYMid slice" style="width: 100%; height: 100%; display: block">
        <defs>
            <!-- gradient id keyed by variant so multiple cards can coexist -->
            <linearGradient :id="`evt-${v.draw}-bg`" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" :stop-color="p.light" />
                <stop offset="100%" :stop-color="p.bg1" />
            </linearGradient>
        </defs>
        <rect width="320" height="160" :fill="`url(#evt-${v.draw}-bg)`" />

        <g v-if="v.draw === 'event'">
            <!-- Calendar block -->
            <g transform="translate(160,52)">
                <rect x="-44" y="-4" width="88" height="76" rx="4" fill="#fff" :stroke="p.ink" stroke-width="1.5" />
                <rect x="-44" y="-4" width="88" height="20" rx="4" :fill="p.ink" />
                <rect x="-32" y="-12" width="3" height="14" rx="1.5" :fill="p.ink" />
                <rect x="29" y="-12" width="3" height="14" rx="1.5" :fill="p.ink" />
                <!-- date "12" -->
                <text x="0" y="50" text-anchor="middle" font-family="Inter, sans-serif" font-size="28" font-weight="700" :fill="p.ink">12</text>
                <!-- June -->
                <text x="0" y="8" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" font-weight="600" letter-spacing="0.1em" fill="#fff">JUN</text>
            </g>
            <!-- small leaves around -->
            <g transform="translate(60,40) rotate(-25)" opacity="0.55">
                <Sprig :color="p.ink" :scale="0.4" />
            </g>
            <g transform="translate(260,120) rotate(35)" opacity="0.45">
                <Sprig :color="p.ink" :scale="0.35" />
            </g>
        </g>

        <g v-if="v.draw === 'article'">
            <!-- Stacked pages -->
            <g transform="translate(160,80)">
                <rect x="-58" y="-44" width="116" height="80" rx="2" fill="#fff" :stroke="p.ink" stroke-width="1.5" transform="rotate(-3)" />
                <rect x="-54" y="-40" width="116" height="80" rx="2" :fill="p.light" :stroke="p.ink" stroke-width="1.5" />
                <!-- text lines -->
                <rect x="-44" y="-28" width="80" height="3" rx="1.5" :fill="p.ink" />
                <rect x="-44" y="-18" width="100" height="2" rx="1" :fill="p.ink" opacity="0.5" />
                <rect x="-44" y="-10" width="90" height="2" rx="1" :fill="p.ink" opacity="0.5" />
                <rect x="-44" y="-2" width="100" height="2" rx="1" :fill="p.ink" opacity="0.5" />
                <rect x="-44" y="6" width="70" height="2" rx="1" :fill="p.ink" opacity="0.5" />
                <rect x="-44" y="14" width="100" height="2" rx="1" :fill="p.ink" opacity="0.5" />
                <rect x="-44" y="22" width="40" height="2" rx="1" :fill="p.accent" />
            </g>
        </g>

        <g v-if="v.draw === 'update'">
            <!-- Sparkle + gear -->
            <g transform="translate(160,80)">
                <!-- Box with arrows (update) -->
                <rect x="-44" y="-32" width="88" height="64" rx="6" fill="#fff" :stroke="p.ink" stroke-width="1.5" />
                <path d="M -20 -8 L -8 -8 L -8 -16 L 8 0 L -8 16 L -8 8 L -20 8 Z" :fill="p.ink" opacity="0.85" />
                <circle cx="20" cy="-12" r="3" :fill="p.accent" />
                <circle cx="20" cy="0" r="3" :fill="p.ink" opacity="0.4" />
                <circle cx="20" cy="12" r="3" :fill="p.ink" opacity="0.4" />
            </g>
            <!-- Sparkle -->
            <g transform="translate(70,40)">
                <path d="M 0 -12 L 3 -3 L 12 0 L 3 3 L 0 12 L -3 3 L -12 0 L -3 -3 Z" :fill="p.accent" opacity="0.7" />
            </g>
            <g transform="translate(260,120)">
                <path d="M 0 -8 L 2 -2 L 8 0 L 2 2 L 0 8 L -2 2 L -8 0 L -2 -2 Z" :fill="p.ink" opacity="0.55" />
            </g>
        </g>

        <g v-if="v.draw === 'webinar'">
            <!-- Monitor + play -->
            <g transform="translate(160,72)">
                <rect x="-58" y="-32" width="116" height="68" rx="4" fill="#fff" :stroke="p.ink" stroke-width="1.5" />
                <rect x="-58" y="-32" width="116" height="10" rx="4" :fill="p.ink" />
                <circle cx="-50" cy="-27" r="2" fill="#fff" />
                <circle cx="-44" cy="-27" r="2" fill="#fff" />
                <!-- Play triangle -->
                <circle cx="0" cy="4" r="14" :fill="p.accent" />
                <path d="M -4 -4 L 6 4 L -4 12 Z" fill="#fff" />
                <!-- Stand -->
                <rect x="-12" y="36" width="24" height="3" rx="1.5" :fill="p.ink" />
                <rect x="-3" y="38" width="6" height="8" :fill="p.ink" />
            </g>
        </g>
    </svg>
</template>
