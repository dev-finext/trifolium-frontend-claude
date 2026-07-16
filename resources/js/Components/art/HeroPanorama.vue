<script setup>
// Home-hero backdrop — a wide apothecary still-life in the app's illustration
// language. Replaces the raster hero-bg.png (which shipped as a placeholder:
// the original exceeded the design-export size limit).
//
// Composition, right to left (the reading direction of the room):
//   · a shelf of glass jars and tincture bottles — the Western dispensary
//   · loose sprigs and scattered petals across the counter
//   · a clay decoction pot with goji berries and astragalus slices —
//     the Chinese-formula corner
// The center stays calm under a radial wash so the brand lockup that the
// hero overlays remains perfectly legible.
//
// Same primitive vocabulary as placeholders.jsx / covers.jsx: ellipses,
// rects, soft paths; palette from the design tokens.
import { computed } from 'vue';
import Sprig from '@/Components/art/Sprig.vue';
import Chrysanthemum from '@/Components/art/Chrysanthemum.vue';
import Goji from '@/Components/art/Goji.vue';
import AstragalusSlice from '@/Components/art/AstragalusSlice.vue';

const props = defineProps({
    /**
     * How the panorama fills its box:
     *   'cover' — crop-to-fill (desktop hero, wide boxes). Tall/narrow boxes
     *             would crop down to the empty center, so for those use:
     *   'strip' — the full still-life, bottom-anchored, letterboxed above —
     *             reads as a counter along the base (mobile brand card).
     */
    fit: { type: String, default: 'cover' },
});

const aspect = computed(() => (props.fit === 'strip' ? 'xMidYMax meet' : 'xMidYMid slice'));

// Local palette — sage room, deep herbal ink, warm apothecary accents.
const P = {
    light: '#f4f6ef',
    bg1: '#e7ecdf',
    bg2: '#ccd8c0',
    ink: '#3d5a3a',
    inkDeep: '#2a4028',
    amber: '#b98a4a',
    clay: '#7a4a33',
    clayDeep: '#57301f',
    cream: '#f4efe3',
};
</script>

<template>
    <svg viewBox="0 0 1600 520" :preserveAspectRatio="aspect" class="block w-full h-full" aria-hidden="true">
        <defs>
            <linearGradient id="hp-bg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" :stop-color="P.light" />
                <stop offset="70%" :stop-color="P.bg1" />
                <stop offset="100%" :stop-color="P.bg2" />
            </linearGradient>
            <radialGradient id="hp-wash" cx="0.5" cy="0.45" r="0.55">
                <stop offset="0%" stop-color="#f8faf3" stop-opacity="0.92" />
                <stop offset="55%" stop-color="#f8faf3" stop-opacity="0.55" />
                <stop offset="100%" stop-color="#f8faf3" stop-opacity="0" />
            </radialGradient>
            <linearGradient id="hp-glass" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#dfe8d8" stop-opacity="0.85" />
                <stop offset="100%" stop-color="#b9c9ad" stop-opacity="0.9" />
            </linearGradient>
            <linearGradient id="hp-amber" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#c79a5a" />
                <stop offset="100%" :stop-color="P.amber" />
            </linearGradient>
            <linearGradient id="hp-pot" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" :stop-color="P.clay" />
                <stop offset="100%" :stop-color="P.clayDeep" />
            </linearGradient>
            <radialGradient id="cnhero-goji" cx="0.35" cy="0.35" r="0.7">
                <stop offset="0%" stop-color="#d65840" />
                <stop offset="60%" stop-color="#a23023" />
                <stop offset="100%" stop-color="#7d2018" />
            </radialGradient>
            <pattern id="hp-grain" width="4" height="4" patternUnits="userSpaceOnUse">
                <rect width="4" height="4" fill="rgba(0,0,0,0.012)" />
                <circle cx="1" cy="2" r="0.5" fill="rgba(255,255,255,0.05)" />
            </pattern>
        </defs>

        <rect width="1600" height="520" fill="url(#hp-bg)" />

        <!-- counter line the still-life rests on -->
        <rect x="0" y="440" width="1600" height="80" :fill="P.bg2" opacity="0.55" />
        <rect x="0" y="440" width="1600" height="2" :fill="P.ink" opacity="0.12" />

        <!-- ══ RIGHT — the Western dispensary shelf ══ -->
        <g transform="translate(1310,0)">
            <!-- tall apothecary jar -->
            <g transform="translate(0,208)">
                <ellipse cx="0" cy="234" rx="86" ry="12" fill="rgba(31,46,29,0.14)" />
                <rect x="-46" y="-24" width="92" height="18" rx="5" :fill="P.inkDeep" />
                <path d="M -54 -6 Q -66 26 -66 60 L -66 204 Q -66 230 -40 230 L 40 230 Q 66 230 66 204 L 66 60 Q 66 26 54 -6 Z" fill="url(#hp-glass)" :stroke="P.ink" stroke-opacity="0.35" stroke-width="2" />
                <!-- dried herbs inside -->
                <g opacity="0.8">
                    <ellipse cx="-18" cy="180" rx="26" ry="9" :fill="P.ink" opacity="0.5" transform="rotate(-14 -18 180)" />
                    <ellipse cx="20" cy="192" rx="30" ry="10" :fill="P.ink" opacity="0.62" transform="rotate(10 20 192)" />
                    <ellipse cx="0" cy="164" rx="22" ry="8" :fill="P.amber" opacity="0.5" transform="rotate(4 0 164)" />
                </g>
                <!-- paper label -->
                <rect x="-38" y="70" width="76" height="52" rx="3" :fill="P.cream" opacity="0.96" />
                <rect x="-28" y="84" width="56" height="3" rx="1.5" :fill="P.ink" opacity="0.55" />
                <rect x="-28" y="94" width="40" height="2.5" rx="1" :fill="P.ink" opacity="0.35" />
                <rect x="-28" y="106" width="24" height="5" rx="1" :fill="P.amber" opacity="0.7" />
            </g>

            <!-- amber tincture bottle -->
            <g transform="translate(-152,286)">
                <ellipse cx="0" cy="158" rx="52" ry="9" fill="rgba(31,46,29,0.13)" />
                <rect x="-15" y="-30" width="30" height="16" rx="4" :fill="P.clayDeep" />
                <path d="M -13 -14 L -13 8 L -38 46 L -38 136 Q -38 156 -18 156 L 18 156 Q 38 156 38 136 L 38 46 L 13 8 L 13 -14 Z" fill="url(#hp-amber)" opacity="0.94" />
                <rect x="-26" y="70" width="52" height="44" rx="2" :fill="P.cream" opacity="0.95" />
                <rect x="-18" y="82" width="36" height="2.5" rx="1" :fill="P.ink" opacity="0.5" />
                <rect x="-18" y="90" width="26" height="2.5" rx="1" :fill="P.ink" opacity="0.35" />
            </g>

            <!-- squat round jar with cork -->
            <g transform="translate(-266,352)">
                <ellipse cx="0" cy="92" rx="56" ry="8" fill="rgba(31,46,29,0.12)" />
                <ellipse cx="0" cy="-34" rx="26" ry="9" :fill="P.amber" opacity="0.85" />
                <rect x="-26" y="-40" width="52" height="12" rx="5" :fill="P.amber" opacity="0.9" />
                <path d="M -44 -22 Q -60 10 -56 48 Q -52 88 0 88 Q 52 88 56 48 Q 60 10 44 -22 Z" fill="url(#hp-glass)" :stroke="P.ink" stroke-opacity="0.3" stroke-width="2" />
                <g opacity="0.75">
                    <circle cx="-14" cy="52" r="7" :fill="P.ink" opacity="0.45" />
                    <circle cx="8" cy="60" r="8" :fill="P.ink" opacity="0.55" />
                    <circle cx="22" cy="48" r="6" :fill="P.amber" opacity="0.6" />
                    <circle cx="-2" cy="66" r="6" :fill="P.inkDeep" opacity="0.4" />
                </g>
            </g>

            <!-- leaning sprigs behind the shelf -->
            <g transform="translate(-84,300) rotate(-16)" opacity="0.5">
                <Sprig :color="P.ink" :scale="1.15" />
            </g>
            <g transform="translate(-330,296) rotate(24)" opacity="0.4">
                <Sprig :color="P.inkDeep" :scale="0.85" />
            </g>
        </g>

        <!-- ══ LEFT — the Chinese-formula corner ══ -->
        <g transform="translate(240,0)">
            <!-- clay decoction pot -->
            <g transform="translate(0,344)">
                <ellipse cx="0" cy="104" rx="128" ry="14" fill="rgba(31,46,29,0.16)" />
                <path d="M -104 -14 Q -118 34 -92 68 Q -66 98 0 98 Q 66 98 92 68 Q 118 34 104 -14 Q 104 -24 94 -24 L -94 -24 Q -104 -24 -104 -14 Z" fill="url(#hp-pot)" />
                <!-- spout + handle -->
                <path d="M 100 -8 Q 128 -22 146 -34 Q 150 -30 148 -24 Q 130 -8 106 6 Z" :fill="P.clay" />
                <path d="M -102 -18 Q -128 -28 -136 -50 Q -140 -66 -126 -78 Q -112 -88 -98 -82" fill="none" :stroke="P.clay" stroke-width="12" stroke-linecap="round" />
                <!-- rim + lid -->
                <ellipse cx="0" cy="-24" rx="96" ry="11" :fill="P.clayDeep" />
                <path d="M -92 -28 Q -78 -46 0 -46 Q 78 -46 92 -28 Z" :fill="P.clay" />
                <circle cx="0" cy="-50" r="8" :fill="P.clayDeep" />
                <!-- glaze highlight -->
                <path d="M -58 -6 Q -66 30 -50 62" stroke="rgba(255,225,170,0.14)" stroke-width="12" fill="none" stroke-linecap="round" />
            </g>

            <!-- steam wisps -->
            <g fill="none" stroke="#fbfdf8" stroke-linecap="round" opacity="0.85">
                <path d="M -22 296 Q -34 262 -20 230 Q -6 200 -20 172" stroke-width="14" opacity="0.6" />
                <path d="M 26 286 Q 40 254 26 222 Q 14 194 30 168" stroke-width="10" opacity="0.5" />
            </g>

            <!-- goji berries scattered at the base -->
            <g transform="translate(150,462)">
                <Goji />
                <g transform="translate(28,8)"><Goji :scale="0.85" /></g>
                <g transform="translate(-18,12)"><Goji :scale="1.05" /></g>
                <g transform="translate(52,-4)"><Goji :scale="0.7" /></g>
            </g>

            <!-- astragalus slices -->
            <g transform="translate(-172,468)">
                <AstragalusSlice color="#d8c49a" :edge="P.amber" :rot="-10" />
                <g transform="translate(44,10)"><AstragalusSlice color="#e2cfa6" :edge="P.amber" :rot="18" :scale="0.85" /></g>
            </g>

            <!-- chrysanthemum bloom -->
            <g transform="translate(-168,404)" opacity="0.9">
                <Chrysanthemum :color="P.amber" center-color="#7d2018" :scale="0.62" />
            </g>

            <!-- foliage behind the pot -->
            <g transform="translate(-120,332) rotate(-22)" opacity="0.45">
                <Sprig color="#3a4d2f" :scale="1.05" />
            </g>
            <g transform="translate(118,320) rotate(18)" opacity="0.35">
                <Sprig color="#3a4d2f" :scale="0.8" />
            </g>
        </g>

        <!-- scattered petals along the counter -->
        <g opacity="0.6">
            <ellipse cx="620" cy="470" rx="9" ry="3.4" :fill="P.amber" transform="rotate(18 620 470)" />
            <ellipse cx="708" cy="486" rx="7" ry="2.8" :fill="P.ink" opacity="0.5" transform="rotate(-26 708 486)" />
            <ellipse cx="905" cy="478" rx="8" ry="3" :fill="P.amber" opacity="0.8" transform="rotate(30 905 478)" />
            <ellipse cx="1010" cy="490" rx="7" ry="2.6" :fill="P.ink" opacity="0.45" transform="rotate(-14 1010 490)" />
        </g>

        <!-- faint drifting sprig top-center-left, for depth -->
        <g transform="translate(560,130) rotate(-30)" opacity="0.14">
            <Sprig :color="P.ink" :scale="1.5" />
        </g>
        <g transform="translate(1060,110) rotate(26)" opacity="0.12">
            <Sprig :color="P.ink" :scale="1.3" />
        </g>

        <!-- calm center for the brand lockup + paper grain -->
        <rect width="1600" height="520" fill="url(#hp-wash)" />
        <rect width="1600" height="520" fill="url(#hp-grain)" />
    </svg>
</template>
