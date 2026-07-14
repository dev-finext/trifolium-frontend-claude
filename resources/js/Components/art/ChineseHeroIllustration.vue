<script setup>
// HERO (Chinese mode) — clay decoction pot, herbs & berries.
// Same compositional vocabulary as HeroIllustration (SVG primitives,
// palette-driven), but a TCM aesthetic: ceramic, deep reds, warm golds,
// dark green foliage, ivory ground with faint ink-stroke texture.
import Sprig from './Sprig.vue';
import Chrysanthemum from './Chrysanthemum.vue';
import Goji from './Goji.vue';
import AstragalusSlice from './AstragalusSlice.vue';

// Local Chinese palette (warm ivory · deep terracotta · gold · forest green)
const cp = {
    ivory:    '#f4ecd8',
    cream:    '#e8d9b8',
    sand:     '#c8b48a',
    pot:      '#3e2620',  // dark glazed ceramic
    potDeep:  '#26120e',
    potRim:   '#5a2f24',
    red:      '#a23023',  // goji berry / cinnabar
    redDeep:  '#7d2018',
    gold:     '#b8893f',  // osmanthus / saffron
    goldSoft: '#d5b070',
    green:    '#3a4d2f',  // dark TCM green
    greenSoft: '#6a7d4e',
    ink:      '#2a1f18',
};

// Bamboo slats — x positions of the vertical faint lines on the tray band.
const BAMBOO_SLATS = [60, 130, 220, 320, 410, 500, 575];
</script>

<template>
    <svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice" style="width: 100%; height: 100%; display: block">
        <defs>
            <!-- Warm ivory ground -->
            <linearGradient id="cnhero-bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#fbf4e2" />
                <stop offset="55%" :stop-color="cp.ivory" />
                <stop offset="100%" :stop-color="cp.cream" />
            </linearGradient>
            <!-- Soft top-left warm light -->
            <radialGradient id="cnhero-glow" cx="0.32" cy="0.28" r="0.55">
                <stop offset="0%" stop-color="#fff3d0" stop-opacity="0.55" />
                <stop offset="100%" stop-color="#fff3d0" stop-opacity="0" />
            </radialGradient>
            <!-- Pot ceramic gradient — top-lit dark glaze -->
            <linearGradient id="cnhero-pot" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#523028" />
                <stop offset="55%" :stop-color="cp.pot" />
                <stop offset="100%" :stop-color="cp.potDeep" />
            </linearGradient>
            <!-- Lid -->
            <linearGradient id="cnhero-lid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#603a30" />
                <stop offset="100%" :stop-color="cp.potDeep" />
            </linearGradient>
            <!-- Steam — soft white wisp -->
            <linearGradient id="cnhero-steam" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
                <stop offset="40%" stop-color="#ffffff" stop-opacity="0.45" />
                <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
            </linearGradient>
            <!-- Goji berry (referenced by the Goji helper) -->
            <radialGradient id="cnhero-goji" cx="0.35" cy="0.35" r="0.7">
                <stop offset="0%" stop-color="#d65840" />
                <stop offset="60%" :stop-color="cp.red" />
                <stop offset="100%" :stop-color="cp.redDeep" />
            </radialGradient>
            <!-- Faint rice-paper fiber pattern -->
            <pattern id="cnhero-paper" width="6" height="6" patternUnits="userSpaceOnUse">
                <rect width="6" height="6" fill="rgba(120, 80, 30, 0.018)" />
                <circle cx="1.5" cy="2" r="0.45" fill="rgba(80,50,20,0.04)" />
                <circle cx="4.5" cy="4" r="0.35" fill="rgba(150,110,60,0.05)" />
            </pattern>
            <!-- Bamboo tray strip wood grain -->
            <linearGradient id="cnhero-bamboo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#b89263" />
                <stop offset="100%" stop-color="#8a6940" />
            </linearGradient>
        </defs>

        <!-- Background — ivory ground with warm glow -->
        <rect width="600" height="600" fill="url(#cnhero-bg)" />
        <rect width="600" height="600" fill="url(#cnhero-glow)" />

        <!-- Very faint ink brush strokes — top-right corner -->
        <g opacity="0.06" :stroke="cp.ink" fill="none" stroke-linecap="round">
            <path d="M 470 60 Q 510 80 540 70" stroke-width="14" />
            <path d="M 490 110 Q 520 130 555 118" stroke-width="8" />
            <path d="M 510 158 Q 528 170 548 162" stroke-width="5" />
        </g>

        <!-- Bamboo / wooden tray surface — soft horizontal band along bottom -->
        <g>
            <rect x="0" y="430" width="600" height="170" :fill="cp.sand" opacity="0.5" />
            <rect x="0" y="430" width="600" height="2" :fill="cp.gold" opacity="0.35" />
            <!-- Bamboo slats — vertical faint lines -->
            <line
                v-for="(x, i) in BAMBOO_SLATS"
                :key="i"
                :x1="x" y1="430" :x2="x" y2="600"
                :stroke="cp.ink" stroke-width="1" opacity="0.08"
            />
        </g>

        <!-- Backdrop sprig — faint dark green -->
        <g opacity="0.35" transform="translate(430,90) rotate(-22)">
            <Sprig :color="cp.green" :scale="0.85" />
        </g>
        <g opacity="0.28" transform="translate(80,400) rotate(38)">
            <Sprig :color="cp.green" :scale="0.7" />
        </g>

        <!-- Soft chrysanthemum bunch — back-right (gold petals around a center) -->
        <g transform="translate(440,260)" opacity="0.85">
            <Chrysanthemum :color="cp.gold" :center-color="cp.redDeep" :scale="0.7" />
        </g>
        <g transform="translate(485,310)" opacity="0.6">
            <Chrysanthemum :color="cp.goldSoft" :center-color="cp.gold" :scale="0.5" />
        </g>

        <!-- Steam wisps rising behind the pot -->
        <g opacity="0.7">
            <path
                d="M 235 215 Q 222 180 240 145 Q 256 110 240 75"
                stroke="url(#cnhero-steam)" stroke-width="22" fill="none" stroke-linecap="round"
            />
            <path
                d="M 280 200 Q 295 170 280 135 Q 268 100 290 70"
                stroke="url(#cnhero-steam)" stroke-width="16" fill="none" stroke-linecap="round" opacity="0.75"
            />
            <path
                d="M 215 230 Q 200 200 215 170"
                stroke="url(#cnhero-steam)" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.5"
            />
        </g>

        <!-- THE DECOCTION POT — squat bulbous yaohu / 煎药壶 -->
        <g transform="translate(250,360)">
            <!-- Cast shadow -->
            <ellipse cx="0" cy="78" rx="155" ry="20" fill="rgba(0,0,0,0.18)" />

            <!-- Body — bulbous teapot-style with rounded base -->
            <path
                d="
                M -130 -20
                Q -150 30  -120 60
                Q -90 85   0 85
                Q 90 85   120 60
                Q 150 30   130 -20
                Q 130 -32  118 -32
                L -118 -32
                Q -130 -32 -130 -20 Z
                "
                fill="url(#cnhero-pot)"
            />

            <!-- Spout — diagonal cylindrical spout on the right (visual left in RTL) -->
            <g transform="translate(125,-15)">
                <path d="M 0 0 Q 32 -22 56 -36 Q 60 -32 58 -26 Q 38 -10 14 8 Z" :fill="cp.pot" />
                <path d="M 50 -38 Q 64 -42 60 -28" fill="none" :stroke="cp.potRim" stroke-width="2" stroke-linecap="round" />
            </g>

            <!-- Handle — arching loop over the lid -->
            <g transform="translate(-128,-25)">
                <path
                    d="M 0 0 Q -28 -10 -38 -34 Q -42 -52 -28 -68 Q -10 -82 8 -76"
                    :stroke="cp.pot" stroke-width="14" fill="none" stroke-linecap="round"
                />
                <path
                    d="M 0 0 Q -22 -10 -32 -32 Q -36 -48 -24 -62 Q -10 -72 6 -68"
                    :stroke="cp.potRim" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.5"
                />
            </g>

            <!-- Top rim of pot -->
            <ellipse cx="0" cy="-32" rx="120" ry="13" :fill="cp.potDeep" />
            <ellipse cx="0" cy="-34" rx="116" ry="9" :fill="cp.potRim" />

            <!-- Lid — flat dome with knob -->
            <g transform="translate(0,-38)">
                <path d="M -116 0 Q -100 -22 0 -22 Q 100 -22 116 0 Z" fill="url(#cnhero-lid)" />
                <ellipse cx="0" cy="-1" rx="116" ry="6" :fill="cp.potDeep" opacity="0.7" />
                <!-- Knob -->
                <circle cx="0" cy="-26" r="9" :fill="cp.potRim" />
                <circle cx="0" cy="-26" r="6" :fill="cp.pot" />
                <circle cx="-2" cy="-28" r="2" :fill="cp.goldSoft" opacity="0.5" />
            </g>

            <!-- Subtle vertical glaze highlight on body -->
            <path d="M -70 -10 Q -78 25 -60 65" stroke="rgba(255,210,140,0.10)" stroke-width="14" fill="none" stroke-linecap="round" />

            <!-- Small gold seal-mark on the belly -->
            <g transform="translate(-30,30)" opacity="0.75">
                <rect x="-12" y="-12" width="24" height="24" fill="none" :stroke="cp.gold" stroke-width="1.5" />
                <path d="M -6 -4 L 6 -4 M -6 0 L 6 0 M -6 4 L 6 4" :stroke="cp.gold" stroke-width="1.2" />
            </g>
        </g>

        <!-- Astragalus slices — light tan oval discs, scattered front-left -->
        <g transform="translate(95,470)">
            <AstragalusSlice :color="cp.sand" :edge="cp.gold" :rot="-12" />
            <g transform="translate(48,-6)"><AstragalusSlice :color="cp.sand" :edge="cp.gold" :rot="22" :scale="0.85" /></g>
            <g transform="translate(20,28)"><AstragalusSlice color="#dec59a" :edge="cp.gold" :rot="-30" :scale="0.9" /></g>
        </g>

        <!-- Goji berries — clustered in front, with little stems -->
        <g transform="translate(370,495)">
            <Goji />
            <g transform="translate(-22,8)"><Goji :scale="0.9" /></g>
            <g transform="translate(20,14)"><Goji :scale="1.05" /></g>
            <g transform="translate(-8,-12)"><Goji :scale="0.75" /></g>
            <g transform="translate(38,-2)"><Goji :scale="0.8" /></g>
        </g>

        <!-- Foreground sprig — dark green leaves -->
        <g transform="translate(140,310) rotate(-18)">
            <Sprig :color="cp.greenSoft" :scale="1.0" />
        </g>

        <!-- Tiny scattered dried petals -->
        <g opacity="0.7">
            <ellipse cx="180" cy="450" rx="6" ry="2.5" :fill="cp.gold" transform="rotate(20 180 450)" />
            <ellipse cx="305" cy="465" rx="5" ry="2" :fill="cp.goldSoft" transform="rotate(-40 305 465)" />
            <ellipse cx="430" cy="455" rx="6" ry="2.4" :fill="cp.gold" transform="rotate(15 430 455)" />
            <ellipse cx="510" cy="490" rx="5" ry="2" :fill="cp.goldSoft" transform="rotate(-25 510 490)" />
        </g>

        <!-- Rice paper grain overlay -->
        <rect width="600" height="600" fill="url(#cnhero-paper)" />
        <rect width="600" height="600" fill="rgba(255,240,210,0.04)" style="mix-blend-mode: overlay" />
    </svg>
</template>
