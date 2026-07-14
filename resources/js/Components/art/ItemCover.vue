<script setup>
// Per-item cover art — a unique, topic-specific illustration for every
// event, video and article. Shared graphic language (tinted botanical
// ground · connective corner sprigs · one terracotta accent · line-art)
// keeps the set cohesive; the central motif (CoverMotif) makes each one
// personal.
import { computed } from 'vue';
import CvCornerSprigs from './CvCornerSprigs.vue';
import CoverMotif from './CoverMotif.vue';
import { coverPalette, COVER_MAP, MOTIF_KEYS, fallbackFor } from './art-data.js';

const props = defineProps({
    item: { type: Object, default: null },  // { id, ... } — id picks motif + hue
    kind: { type: String, default: '' },    // 'video' switches to the dark palette
});

const id = computed(() => props.item && props.item.id);
const def = computed(() => COVER_MAP[id.value] || fallbackFor(id.value));
const dark = computed(() => props.kind === 'video');
const p = computed(() => coverPalette(def.value.h, dark.value));

// Same fallback as the source's `COVER_MOTIFS[def.m] || COVER_MOTIFS.ingredients`.
const motif = computed(() => (MOTIF_KEYS.includes(def.value.m) ? def.value.m : 'ingredients'));

// Gradient ids are unique per item so many covers can share one page.
const uid = computed(() => `cv-${id.value || def.value.m}`);
</script>

<template>
    <svg viewBox="0 0 320 192" preserveAspectRatio="xMidYMid slice" style="width: 100%; height: 100%; display: block">
        <defs>
            <linearGradient :id="`${uid}-bg`" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" :stop-color="p.bg1" />
                <stop offset="100%" :stop-color="p.bg2" />
            </linearGradient>
            <radialGradient :id="`${uid}-glow`" cx="0.3" cy="0.24" r="0.85">
                <stop offset="0%" :stop-color="dark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.55)'" />
                <stop offset="100%" stop-color="rgba(255,255,255,0)" />
            </radialGradient>
        </defs>
        <rect width="320" height="192" :fill="`url(#${uid}-bg)`" />
        <rect width="320" height="192" :fill="`url(#${uid}-glow)`" />
        <CvCornerSprigs :p="p" />
        <g transform="translate(160,96)"><CoverMotif :motif="motif" :p="p" /></g>
    </svg>
</template>
