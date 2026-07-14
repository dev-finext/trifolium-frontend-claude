<script setup>
// ARTICLE CARD — illustration per category.
import { computed } from 'vue';
import Sprig from './Sprig.vue';
import { PALETTES } from './art-data.js';

const props = defineProps({
    // cat: 'צמחי מרפא' | 'מחקר' | 'טיפ קליני'
    cat: { type: String, default: 'צמחי מרפא' },
});

const VARIANTS = {
    'צמחי מרפא':  { palette: PALETTES.herb,  draw: 'herbs' },
    'מחקר':       { palette: PALETTES.cool,  draw: 'research' },
    'טיפ קליני':  { palette: PALETTES.warm,  draw: 'clinical' },
};

const v = computed(() => VARIANTS[props.cat] || VARIANTS['צמחי מרפא']);
const p = computed(() => v.value.palette);
</script>

<template>
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" style="width: 100%; height: 100%; display: block">
        <defs>
            <linearGradient :id="`art-${v.draw}-bg`" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" :stop-color="p.light" />
                <stop offset="100%" :stop-color="p.bg1" />
            </linearGradient>
        </defs>
        <rect width="320" height="200" :fill="`url(#art-${v.draw}-bg)`" />

        <g v-if="v.draw === 'herbs'">
            <!-- Bowl with herb sprigs -->
            <g transform="translate(160,148)">
                <ellipse cx="0" cy="20" rx="86" ry="8" fill="rgba(0,0,0,0.10)" />
                <path d="M -76 0 Q -82 40 -50 50 L 50 50 Q 82 40 76 0 Z" :fill="p.ink" opacity="0.85" />
                <ellipse cx="0" cy="0" rx="76" ry="10" :fill="p.bg2" />
            </g>
            <!-- Three sprigs rising from bowl -->
            <g transform="translate(110,110) rotate(-20)"><Sprig :color="p.ink" :scale="0.8" /></g>
            <g transform="translate(160,98)"><Sprig :color="p.accent" :scale="0.95" /></g>
            <g transform="translate(210,108) rotate(22)"><Sprig :color="p.ink" :scale="0.75" /></g>
        </g>

        <g v-if="v.draw === 'research'">
            <!-- Bar chart on a card -->
            <g transform="translate(160,100)">
                <rect x="-80" y="-50" width="160" height="100" rx="4" fill="#fff" :stroke="p.ink" stroke-width="1.5" />
                <!-- axes -->
                <line x1="-60" y1="-30" x2="-60" y2="30" :stroke="p.ink" stroke-width="1.2" />
                <line x1="-60" y1="30" x2="60" y2="30" :stroke="p.ink" stroke-width="1.2" />
                <!-- bars -->
                <rect x="-50" y="0" width="14" height="30" :fill="p.ink" opacity="0.7" />
                <rect x="-30" y="-12" width="14" height="42" :fill="p.accent" />
                <rect x="-10" y="-20" width="14" height="50" :fill="p.ink" opacity="0.85" />
                <rect x="10" y="-8" width="14" height="38" :fill="p.ink" opacity="0.55" />
                <rect x="30" y="-26" width="14" height="56" :fill="p.accent" />
            </g>
            <!-- Magnifier -->
            <g transform="translate(60,52)">
                <circle cx="0" cy="0" r="16" fill="none" :stroke="p.ink" stroke-width="2.5" />
                <line x1="11" y1="11" x2="22" y2="22" :stroke="p.ink" stroke-width="2.5" stroke-linecap="round" />
            </g>
        </g>

        <g v-if="v.draw === 'clinical'">
            <!-- Clipboard with checklist -->
            <g transform="translate(160,100)">
                <rect x="-50" y="-58" width="100" height="116" rx="6" fill="#fff" :stroke="p.ink" stroke-width="1.5" />
                <rect x="-20" y="-66" width="40" height="14" rx="2" :fill="p.ink" />
                <!-- Checklist rows (first three checked) -->
                <g v-for="i in [0, 1, 2, 3]" :key="i" :transform="`translate(-36,${-30 + i * 22})`">
                    <circle cx="0" cy="0" r="6" :fill="i < 3 ? p.accent : 'none'" :stroke="p.ink" stroke-width="1.4" />
                    <path v-if="i < 3" d="M -3 0 L -1 2 L 3 -2" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round" />
                    <rect x="14" y="-3" :width="i === 1 ? 44 : 56" height="2.5" rx="1" :fill="p.ink" opacity="0.65" />
                </g>
            </g>
        </g>
    </svg>
</template>
