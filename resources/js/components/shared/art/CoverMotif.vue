<script setup>
// Central subject motif for ItemCover — one topic-specific drawing per key,
// ported 1:1 from covers.jsx's COVER_MOTIFS map. Renders an SVG <g> centered
// on the origin; ItemCover translates it to the middle of the cover.
import CvBloom from './CvBloom.vue';
import CvLeaf from './CvLeaf.vue';
import CvSprig from './CvSprig.vue';

defineProps({
    motif: { type: String, required: true }, // one of MOTIF_KEYS from art-data.js
    p: { type: Object, required: true }, // cover palette from coverPalette()
});
</script>

<template>
    <!-- Annual conference — banner, audience, stage -->
    <g v-if="motif === 'conference'">
        <rect
            x="-70"
            y="-58"
            width="140"
            height="26"
            rx="4"
            fill="none"
            :stroke="p.ink"
            stroke-width="2"
        />
        <line
            x1="-58"
            y1="-49"
            x2="38"
            y2="-49"
            :stroke="p.ink"
            stroke-width="2"
            opacity="0.5"
        />
        <circle cx="52" cy="-45" r="4" :fill="p.accent" />
        <g
            v-for="(x, i) in [-44, 0, 44]"
            :key="i"
            :transform="`translate(${x},18)`"
            fill="none"
            :stroke="p.ink"
            stroke-width="2"
        >
            <circle cx="0" cy="-16" r="11" />
            <path d="M -18 22 Q -18 -2 0 -2 Q 18 -2 18 22" />
        </g>
        <line
            x1="-82"
            y1="44"
            x2="82"
            y2="44"
            :stroke="p.ink"
            stroke-width="2.2"
            stroke-linecap="round"
        />
        <g transform="translate(-74,-18) rotate(-22)"
            ><CvSprig :p="p" :scale="0.5" accent-tip
        /></g>
    </g>

    <!-- Adaptogens — forked ginseng root + radiant energy -->
    <g v-else-if="motif === 'adaptogen'">
        <g
            transform="translate(0,-34)"
            :stroke="p.accent"
            stroke-width="2.4"
            stroke-linecap="round"
            opacity="0.85"
        >
            <line
                v-for="i in 12"
                :key="i"
                x1="0"
                y1="-14"
                x2="0"
                y2="-24"
                :transform="`rotate(${(i - 1) * 30})`"
            />
            <circle
                cx="0"
                cy="0"
                r="6"
                fill="none"
                :stroke="p.accent"
                stroke-width="2"
            />
        </g>
        <g
            :stroke="p.ink"
            stroke-width="2.4"
            fill="none"
            stroke-linecap="round"
        >
            <path d="M 0 -22 Q 4 -2 -2 18 Q -6 36 -22 48" />
            <path d="M -3 8 Q -18 16 -30 32" />
            <path d="M 1 2 Q 16 12 26 30" />
            <path d="M 2 22 Q 6 38 2 54" />
        </g>
        <g
            :stroke="p.ink"
            stroke-width="1.3"
            opacity="0.7"
            stroke-linecap="round"
        >
            <line x1="-22" y1="48" x2="-31" y2="56" /><line
                x1="-22"
                y1="48"
                x2="-17"
                y2="58"
            />
            <line x1="26" y1="30" x2="35" y2="38" /><line
                x1="2"
                y1="54"
                x2="2"
                y2="64"
            />
        </g>
    </g>

    <!-- New herbs added to the database — tied bundle + "new" sparkles -->
    <g v-else-if="motif === 'newherbs'">
        <g transform="translate(0,8)">
            <g transform="rotate(-16)"
                ><CvSprig :p="p" :scale="0.92" accent-tip
            /></g>
            <CvSprig :p="p" :scale="1.04" accent-tip />
            <g transform="rotate(16)"
                ><CvSprig :p="p" :scale="0.92" accent-tip
            /></g>
            <rect
                x="-13"
                y="2"
                width="26"
                height="10"
                rx="3"
                fill="none"
                :stroke="p.ink"
                stroke-width="2"
            />
        </g>
        <g :fill="p.accent">
            <path
                d="M -56 -34 l 3 8 l 8 3 l -8 3 l -3 8 l -3 -8 l -8 -3 l 8 -3 z"
            />
            <path
                d="M 54 -20 l 2.4 6 l 6 2.4 l -6 2.4 l -2.4 6 l -2.4 -6 l -6 -2.4 l 6 -2.4 z"
                opacity="0.85"
            />
        </g>
    </g>

    <!-- Webinar — screen + play -->
    <g v-else-if="motif === 'webinar'">
        <rect
            x="-66"
            y="-40"
            width="132"
            height="78"
            rx="6"
            fill="none"
            :stroke="p.ink"
            stroke-width="2"
        />
        <line
            x1="-66"
            y1="-26"
            x2="66"
            y2="-26"
            :stroke="p.ink"
            stroke-width="1.6"
            opacity="0.55"
        />
        <circle cx="-58" cy="-33" r="2.2" :fill="p.accent" />
        <circle
            cx="0"
            cy="4"
            r="15"
            fill="none"
            :stroke="p.ink"
            stroke-width="2"
        />
        <path d="M -5 -5 L 9 4 L -5 13 Z" :fill="p.accent" />
        <line x1="0" y1="38" x2="0" y2="48" :stroke="p.ink" stroke-width="2" />
        <line
            x1="-16"
            y1="50"
            x2="16"
            y2="50"
            :stroke="p.ink"
            stroke-width="2"
            stroke-linecap="round"
        />
    </g>

    <!-- Welcome tour — Trifolium trefoil mark -->
    <g v-else-if="motif === 'welcome'">
        <g
            transform="translate(0,-6)"
            fill="none"
            :stroke="p.ink"
            stroke-width="2.2"
        >
            <circle cx="-16" cy="-6" r="15" /><circle
                cx="16"
                cy="-6"
                r="15"
            /><circle cx="0" cy="18" r="15" />
        </g>
        <line
            x1="0"
            y1="32"
            x2="0"
            y2="52"
            :stroke="p.ink"
            stroke-width="2.2"
            stroke-linecap="round"
        />
        <circle cx="0" cy="-6" r="4.5" :fill="p.accent" />
        <path
            d="M -44 -32 l 2.4 6 l 6 2.4 l -6 2.4 l -2.4 6 l -2.4 -6 l -6 -2.4 l 6 -2.4 z"
            :fill="p.accent"
            opacity="0.85"
        />
    </g>

    <!-- Compounding — flask, liquid, droplet -->
    <g v-else-if="motif === 'compounding'">
        <g
            fill="none"
            :stroke="p.ink"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <line x1="-12" y1="-44" x2="12" y2="-44" />
            <path
                d="M -8 -44 L -8 -16 L -34 36 Q -40 50 -22 50 L 22 50 Q 40 50 34 36 L 8 -16 L 8 -44"
            />
            <line x1="-27" y1="14" x2="27" y2="14" opacity="0.55" />
        </g>
        <path
            d="M -31 22 L 31 22 L 25 38 Q 21 46 8 46 L -8 46 Q -21 46 -25 38 Z"
            :fill="p.accent"
            opacity="0.85"
        />
        <path d="M 0 -64 Q 8 -52 0 -46 Q -8 -52 0 -64 Z" :fill="p.accent" />
    </g>

    <!-- Ingredient database — leaf grid + magnifier -->
    <g v-else-if="motif === 'ingredients'">
        <template v-for="r in [-1, 0, 1]" :key="r">
            <CvLeaf
                v-for="c in [-1, 0, 1]"
                :key="`${r}-${c}`"
                :cx="c * 42"
                :cy="r * 34"
                :rx="15"
                :ry="6"
                :rot="(r + c) % 2 ? 28 : -26"
                :p="p"
            />
        </template>
        <g transform="translate(40,30)">
            <circle
                cx="0"
                cy="0"
                r="17"
                fill="none"
                :stroke="p.accent"
                stroke-width="2.6"
            />
            <line
                x1="12"
                y1="12"
                x2="27"
                y2="27"
                :stroke="p.accent"
                stroke-width="2.6"
                stroke-linecap="round"
            />
        </g>
    </g>

    <!-- Patients — two figures + a heart -->
    <g
        v-else-if="motif === 'patients'"
        fill="none"
        :stroke="p.ink"
        stroke-width="2"
    >
        <g transform="translate(-30,4)">
            <circle cx="0" cy="-22" r="13" /><path
                d="M -22 30 Q -22 0 0 0 Q 22 0 22 30"
            />
        </g>
        <g transform="translate(30,4)">
            <circle cx="0" cy="-22" r="13" /><path
                d="M -22 30 Q -22 0 0 0 Q 22 0 22 30"
            />
        </g>
        <path
            d="M 0 -42 Q 6 -50 13 -44 Q 20 -38 0 -24 Q -20 -38 -13 -44 Q -6 -50 0 -42 Z"
            :fill="p.accent"
            stroke="none"
        />
    </g>

    <!-- Catalog — bottles on a shelf -->
    <g v-else-if="motif === 'catalog'">
        <g
            v-for="(x, i) in [-46, 0, 46]"
            :key="i"
            :transform="`translate(${x},-2)`"
            fill="none"
            :stroke="p.ink"
            stroke-width="2"
        >
            <line x1="-7" y1="-40" x2="7" y2="-40" />
            <rect x="-13" y="-36" width="26" height="64" rx="4" />
            <rect
                x="-13"
                y="-8"
                width="26"
                height="20"
                :fill="p.accent"
                :opacity="i === 1 ? 0.85 : 0.4"
                stroke="none"
            />
        </g>
        <line
            x1="-72"
            y1="32"
            x2="72"
            y2="32"
            :stroke="p.ink"
            stroke-width="2.4"
            stroke-linecap="round"
        />
    </g>

    <!-- Orders — package box with tape + motion -->
    <g
        v-else-if="motif === 'orders'"
        fill="none"
        :stroke="p.ink"
        stroke-width="2"
        stroke-linejoin="round"
    >
        <path d="M -46 -20 L 0 -40 L 46 -20 L 0 0 Z" />
        <path d="M -46 -20 L -46 34 L 0 54 L 0 0 Z" />
        <path d="M 46 -20 L 46 34 L 0 54 L 0 0 Z" />
        <line
            x1="0"
            y1="-40"
            x2="0"
            y2="0"
            :stroke="p.accent"
            stroke-width="2.4"
        />
        <g
            :stroke="p.accent"
            stroke-width="2"
            stroke-linecap="round"
            opacity="0.85"
        >
            <line x1="-80" y1="-6" x2="-60" y2="-6" /><line
                x1="-86"
                y1="8"
                x2="-66"
                y2="8"
            />
        </g>
    </g>

    <!-- Sleep — crescent moon, stars, valerian sprig -->
    <g v-else-if="motif === 'sleep'">
        <path
            d="M 16 -36 A 34 34 0 1 0 16 36 A 26 26 0 1 1 16 -36 Z"
            fill="none"
            :stroke="p.ink"
            stroke-width="2.2"
        />
        <g :fill="p.accent">
            <path
                d="M -42 -34 l 2.4 6 l 6 2.4 l -6 2.4 l -2.4 6 l -2.4 -6 l -6 -2.4 l 6 -2.4 z"
            />
            <circle cx="-52" cy="8" r="2.6" /><circle
                cx="-30"
                cy="32"
                r="2.1"
            />
        </g>
        <g transform="translate(42,54) rotate(10)"
            ><CvSprig :p="p" :scale="0.66" accent-tip
        /></g>
    </g>

    <!-- Curcumin bioavailability — turmeric root + molecule -->
    <g v-else-if="motif === 'molecule'">
        <g
            fill="none"
            :stroke="p.ink"
            stroke-width="2.2"
            stroke-linecap="round"
        >
            <path d="M -58 22 Q -40 8 -20 16 Q -2 22 12 12" />
            <path d="M -44 16 Q -46 28 -38 34" />
            <path d="M -14 17 Q -12 30 -4 34" />
            <path d="M 6 13 Q 10 0 4 -8" />
        </g>
        <g
            transform="translate(32,-18)"
            fill="none"
            :stroke="p.ink"
            stroke-width="2"
        >
            <polygon points="0,-18 16,-9 16,9 0,18 -16,9 -16,-9" />
            <line x1="16" y1="-9" x2="34" y2="-17" />
            <circle cx="0" cy="-18" r="3.6" :fill="p.accent" stroke="none" />
            <circle cx="16" cy="9" r="3.6" :fill="p.accent" stroke="none" />
            <circle cx="38" cy="-19" r="3.4" :fill="p.ink" stroke="none" />
        </g>
    </g>

    <!-- Presenting a formula to a patient — two figures + a formula card -->
    <g v-else-if="motif === 'consult'">
        <g
            transform="translate(-46,10)"
            fill="none"
            :stroke="p.ink"
            stroke-width="2"
        >
            <circle cx="0" cy="-20" r="12" /><path
                d="M -20 30 Q -20 2 0 2 Q 20 2 20 30"
            />
        </g>
        <g
            transform="translate(46,14)"
            fill="none"
            :stroke="p.ink"
            stroke-width="2"
        >
            <circle cx="0" cy="-18" r="10" /><path
                d="M -16 28 Q -16 4 0 4 Q 16 4 16 28"
            />
        </g>
        <g transform="translate(0,-28)">
            <rect
                x="-21"
                y="-18"
                width="42"
                height="36"
                rx="4"
                fill="none"
                :stroke="p.ink"
                stroke-width="2"
            />
            <line
                x1="-13"
                y1="-9"
                x2="13"
                y2="-9"
                :stroke="p.ink"
                stroke-width="1.6"
                opacity="0.55"
            />
            <line
                x1="-13"
                y1="-2"
                x2="8"
                y2="-2"
                :stroke="p.ink"
                stroke-width="1.6"
                opacity="0.45"
            />
            <CvLeaf :cx="0" :cy="10" :rx="9" :ry="3.6" :rot="0" :p="p" accent />
            <path
                d="M -7 18 L 0 27 L 7 18"
                fill="none"
                :stroke="p.ink"
                stroke-width="2"
            />
        </g>
    </g>

    <!-- Echinacea monograph — coneflower bloom -->
    <g v-else-if="motif === 'coneflower'">
        <g fill="none" :stroke="p.ink" stroke-width="2">
            <path
                v-for="i in 12"
                :key="i"
                d="M 0 -16 Q 0 -42 -5 -54"
                :transform="`rotate(${((i - 1) / 12) * 360})`"
            />
        </g>
        <ellipse
            cx="0"
            cy="-6"
            rx="13"
            ry="16"
            :fill="p.accent"
            :stroke="p.ink"
            stroke-width="2"
        />
        <g :stroke="p.ink" stroke-width="0.9" opacity="0.5">
            <line
                v-for="i in 5"
                :key="i"
                x1="-8"
                :y1="-16 + (i - 1) * 6"
                x2="8"
                :y2="-13 + (i - 1) * 6"
            />
        </g>
        <line
            x1="0"
            y1="10"
            x2="0"
            y2="54"
            :stroke="p.ink"
            stroke-width="2.2"
        />
        <CvLeaf :cx="-14" :cy="40" :rx="12" :ry="4.5" :rot="-30" :p="p" />
    </g>

    <!-- Milk thistle & the liver -->
    <g v-else-if="motif === 'liver'">
        <path
            d="M -56 -4 Q -58 -28 -30 -28 L 34 -28 Q 58 -28 56 0 Q 54 26 22 30 Q -6 34 -28 28 Q -52 22 -56 -4 Z"
            fill="none"
            :stroke="p.ink"
            stroke-width="2.2"
        />
        <path
            d="M 2 -28 Q 6 0 -6 28"
            fill="none"
            :stroke="p.ink"
            stroke-width="1.6"
            opacity="0.55"
        />
        <path
            d="M 30 2 L 30 14 Q 30 22 22 27 Q 14 22 14 14 L 14 2 Z"
            :fill="p.accent"
            stroke="none"
            opacity="0.85"
        />
        <g transform="translate(-34,-30)">
            <line
                x1="0"
                y1="0"
                x2="0"
                y2="-16"
                :stroke="p.ink"
                stroke-width="2"
            />
            <g :stroke="p.ink" stroke-width="1.5">
                <line
                    v-for="i in 7"
                    :key="i"
                    x1="0"
                    y1="-15"
                    :x2="(i - 1 - 3) * 4"
                    y2="-30"
                />
            </g>
            <ellipse
                cx="0"
                cy="-13"
                rx="6"
                ry="5"
                :fill="p.accent"
                :stroke="p.ink"
                stroke-width="1.3"
            />
        </g>
    </g>

    <!-- Herb–drug interaction safety — shield + crossing capsules -->
    <g v-else-if="motif === 'safety'">
        <path
            d="M 0 -52 L 40 -38 L 40 2 Q 40 38 0 54 Q -40 38 -40 2 L -40 -38 Z"
            fill="none"
            :stroke="p.ink"
            stroke-width="2.2"
        />
        <g transform="rotate(45)">
            <rect
                x="-26"
                y="-9"
                width="52"
                height="18"
                rx="9"
                fill="none"
                :stroke="p.ink"
                stroke-width="2"
            />
            <rect
                x="-25"
                y="-8"
                width="25"
                height="16"
                rx="8"
                :fill="p.accent"
                opacity="0.7"
                stroke="none"
            />
            <line
                x1="0"
                y1="-9"
                x2="0"
                y2="9"
                :stroke="p.ink"
                stroke-width="2"
            />
        </g>
        <g transform="rotate(-45)">
            <rect
                x="-26"
                y="-9"
                width="52"
                height="18"
                rx="9"
                fill="none"
                :stroke="p.ink"
                stroke-width="2"
            />
            <line
                x1="0"
                y1="-9"
                x2="0"
                y2="9"
                :stroke="p.ink"
                stroke-width="2"
            />
        </g>
    </g>

    <!-- Hormonal balance (menopause) — scale, flower & leaf -->
    <g
        v-else-if="motif === 'balance'"
        fill="none"
        :stroke="p.ink"
        stroke-width="2"
        stroke-linecap="round"
    >
        <line x1="0" y1="-44" x2="0" y2="40" />
        <line x1="-20" y1="44" x2="20" y2="44" />
        <line x1="-44" y1="-34" x2="44" y2="-34" />
        <path d="M -44 -34 L -58 -8 L -30 -8 Z" />
        <path d="M 44 -34 L 30 -8 L 58 -8 Z" />
        <g transform="translate(-44,-22)"
            ><CvBloom :p="p" :petals="8" :scale="0.5"
        /></g>
        <g transform="translate(44,-20)"
            ><CvLeaf :cx="0" :cy="0" :rx="11" :ry="4.5" :rot="0" :p="p" accent
        /></g>
        <circle cx="0" cy="-48" r="4.5" :fill="p.accent" stroke="none" />
    </g>
</template>
