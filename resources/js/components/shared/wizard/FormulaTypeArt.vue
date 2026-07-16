<script setup>
// FormulaTypeArt — the "בוטני עם ענף" (Botanical Sprig) direction for the
// formula-type picker. Each of the 9 types is drawn as its real vessel in a
// warm apothecary line-and-fill, tucked beside a UNIQUE herb sprig — no sprig
// repeats, so every type reads as its own little still-life. The Chinese
// slow-simmer decoction pot (בישול איטי) is included, with rising steam.
//
// Colour: a cream glass body, a herbal-green outline, a soft wash of the
// vessel's real contents (--c), and a sprig whose blooms/berries carry the
// "little colour". Self-contained palette (doesn't take a `color` prop) so the
// illustration always reads the same on any tile.
import { computed } from 'vue';

const props = defineProps({
    id: { type: String, required: true },
    size: { type: Number, default: 50 },
});

// The natural colour of what's inside each vessel — the only per-type wash.
const CONTENT = {
    tincture: '#cf9540', // amber extract
    capsule: '#6f9a4e', // green herb powder
    powder: '#caa267', // sand
    tea: '#b0743c', // steeped brew
    decoction: '#a6503a', // dark simmered decoction
    gel: '#57ab7d', // fresh gel
    cream: '#d59a7a', // soft balm
    eoil: '#9a86b5', // aromatic distillate
    ioil: '#b7913f', // golden infused oil
};
const content = computed(() => CONTENT[props.id] || '#7d9a63');
</script>

<template>
    <svg
        class="fta"
        :width="size"
        :height="size"
        viewBox="0 0 72 72"
        :style="{ '--c': content }"
        role="img"
        aria-hidden="true"
    >
        <!-- ─────────── טינקטורה · dropper bottle + lavender spike ─────────── -->
        <g v-if="id === 'tincture'">
            <g class="sprig">
                <path class="stem" d="M20 64 C15 54 14 46 19 39" />
                <ellipse class="lav" cx="19" cy="38" rx="1.6" ry="2.4" />
                <ellipse class="lav" cx="17.3" cy="41" rx="1.5" ry="2.2" />
                <ellipse class="lav" cx="20.7" cy="41.5" rx="1.5" ry="2.2" />
                <ellipse class="lav" cx="16.4" cy="44.6" rx="1.4" ry="2" />
                <ellipse class="lav" cx="19.8" cy="45.2" rx="1.4" ry="2" />
            </g>
            <rect class="k" x="27" y="7" width="18" height="11" rx="4" />
            <rect class="k" x="30.5" y="17.5" width="11" height="5" rx="1.5" />
            <rect class="b" x="18" y="21.5" width="36" height="44" rx="9" />
            <rect class="c" x="21" y="41" width="30" height="21.5" rx="6" />
            <line class="d" x1="36" y1="22" x2="36" y2="49" />
        </g>

        <!-- ─────────── קפסולות · two capsules + oval leaves & berry ─────────── -->
        <g v-else-if="id === 'capsule'">
            <g class="sprig">
                <path class="stem" d="M17 64 C15 55 15 48 20 42" />
                <path
                    class="leaf"
                    d="M16 53 c-6 -1 -9 -5 -8 -10 c6 0 9 4 8 10 z"
                />
                <path
                    class="leaf"
                    d="M19 47 c5 -2 9 0 10 4 c-5 2 -9 0 -10 -4 z"
                />
                <circle class="berryRed" cx="20" cy="41" r="2.3" />
            </g>
            <g transform="rotate(15 40 30)">
                <rect class="b" x="24" y="23" width="31" height="13" rx="6.5" />
                <rect class="c" x="24" y="23" width="15" height="13" rx="6.5" />
                <line class="d" x1="39" y1="23.5" x2="39" y2="35.5" />
            </g>
            <g transform="rotate(-16 32 45)">
                <rect class="b" x="12" y="38" width="42" height="17" rx="8.5" />
                <rect class="c" x="12" y="38" width="20" height="17" rx="8.5" />
                <line class="d" x1="32" y1="38.5" x2="32" y2="54.5" />
            </g>
        </g>

        <!-- ─────────── אבקה · jar + scoop + broad serrated leaf ─────────── -->
        <g v-else-if="id === 'powder'">
            <g class="sprig">
                <path class="stem" d="M13 64 C12 56 13 50 16 45" />
                <path
                    class="leaf"
                    d="M16 45 c-8 2 -12 9 -10 17 c8 -1 13 -8 10 -17 z"
                />
                <path class="vein" d="M14 61 C14 54 15 49 16 45" />
            </g>
            <rect class="b" x="15" y="30" width="36" height="33" rx="6" />
            <rect class="k" x="12" y="20.5" width="42" height="10.5" rx="3" />
            <rect class="c" x="18" y="44" width="30" height="16" rx="4" />
            <g transform="rotate(24 54 44)">
                <path class="d" d="M54 40 L61 30" />
                <ellipse class="c" cx="53.5" cy="43" rx="7" ry="4.6" />
            </g>
        </g>

        <!-- ─────────── חליטה · cup + saucer + steam + chamomile daisy ─────────── -->
        <g v-else-if="id === 'tea'">
            <g class="sprig">
                <path class="stem" d="M15 64 C13 56 14 49 18 44" />
                <g class="petals">
                    <ellipse cx="18" cy="39.6" rx="1.3" ry="2.6" />
                    <ellipse
                        cx="21.8"
                        cy="41.8"
                        rx="1.3"
                        ry="2.6"
                        transform="rotate(60 21.8 41.8)"
                    />
                    <ellipse
                        cx="21.8"
                        cy="46.2"
                        rx="1.3"
                        ry="2.6"
                        transform="rotate(120 21.8 46.2)"
                    />
                    <ellipse cx="18" cy="48.4" rx="1.3" ry="2.6" />
                    <ellipse
                        cx="14.2"
                        cy="46.2"
                        rx="1.3"
                        ry="2.6"
                        transform="rotate(60 14.2 46.2)"
                    />
                    <ellipse
                        cx="14.2"
                        cy="41.8"
                        rx="1.3"
                        ry="2.6"
                        transform="rotate(120 14.2 41.8)"
                    />
                </g>
                <circle class="pollen" cx="18" cy="44" r="2.1" />
            </g>
            <path class="steam" d="M30 27 q-3 -4 0 -8 q3 -4 0 -8" />
            <path class="steam" d="M41 27 q-3 -4 0 -8 q3 -4 0 -8" />
            <ellipse class="b" cx="35" cy="57" rx="22" ry="4.4" />
            <path class="b" d="M18 33 h34 l-3 15 a14 7 0 0 1 -28 0 z" />
            <ellipse class="c" cx="35" cy="34" rx="15.5" ry="3.3" />
            <path class="d" d="M51 36 q9 1 7 9 q-1.5 4 -7 3.5" />
        </g>

        <!-- ─────────── בישול איטי · Chinese decoction pot + goji berry branch ─────────── -->
        <g v-else-if="id === 'decoction'">
            <g class="sprig">
                <path class="stem" d="M13 62 C12 54 14 47 19 42" />
                <path
                    class="leaf"
                    d="M13 52 c-5 0 -8 -4 -7 -8 c5 0 8 3 7 8 z"
                />
                <path
                    class="leaf"
                    d="M17 46 c4 -2 8 0 8 3 c-4 2 -8 0 -8 -3 z"
                />
                <path class="vein" d="M11 58 v-2 M15 60 v-2 M19 56 v-2" />
                <ellipse class="berryGoji" cx="11" cy="59" rx="1.7" ry="2.5" />
                <ellipse class="berryGoji" cx="15" cy="61" rx="1.7" ry="2.5" />
                <ellipse
                    class="berryGoji"
                    cx="19"
                    cy="57.5"
                    rx="1.7"
                    ry="2.5"
                />
            </g>
            <!-- slow simmer -->
            <path class="steam" d="M31 20 q-3 -4 0 -8 q3 -4 0 -8" />
            <path class="steam" d="M40 20 q-3 -4 0 -8 q3 -4 0 -8" />
            <!-- pot -->
            <rect
                class="b handle"
                x="54"
                y="37.5"
                width="14"
                height="5"
                rx="2.5"
            />
            <path
                class="b"
                d="M16 38 C16 51 24 59 36 59 C48 59 56 51 56 38 z"
            />
            <path
                class="c"
                d="M20 40 C20.5 49 27 55 36 55 C45 55 51.5 49 52 40 z"
            />
            <rect class="k" x="13" y="34" width="46" height="5" rx="2" />
            <path
                class="b"
                d="M22 34 C22 26 29 22 36 22 C43 22 50 26 50 34 z"
            />
            <ellipse class="k" cx="36" cy="21" rx="3.2" ry="2.2" />
        </g>

        <!-- ─────────── ג׳ל · tube + gel bead + twin succulent leaves ─────────── -->
        <g v-else-if="id === 'gel'">
            <g class="sprig">
                <path
                    class="succ"
                    d="M18 64 C10 53 10 41 16 35 C20 43 22 55 18 64 z"
                />
                <path
                    class="succ"
                    d="M20 64 C26 55 27 45 23 38 C19 46 17 56 20 64 z"
                />
            </g>
            <rect class="k" x="32" y="9" width="8" height="8" rx="1.5" />
            <ellipse class="c" cx="36" cy="8" rx="4.2" ry="3.2" />
            <path class="b" d="M26 24 q0 -7 6 -7 h8 q6 0 6 7 z" />
            <rect class="b" x="23" y="23" width="26" height="39" rx="8" />
            <rect class="k" x="23" y="57.5" width="26" height="5" rx="1.6" />
            <line class="d" x1="30" y1="59" x2="30" y2="61" />
            <line class="d" x1="36" y1="59" x2="36" y2="61" />
            <line class="d" x1="42" y1="59" x2="42" y2="61" />
        </g>

        <!-- ─────────── קרם · balm jar + calendula bloom ─────────── -->
        <g v-else-if="id === 'cream'">
            <g class="sprig">
                <path class="stem" d="M15 64 C14 56 15 50 18 45" />
                <path
                    class="leaf"
                    d="M13 51 c-5 0 -8 -4 -7 -8 c5 0 8 3 7 8 z"
                />
                <circle class="calOut" cx="18" cy="42" r="5.4" />
                <circle class="calIn" cx="18" cy="42" r="2.8" />
            </g>
            <ellipse class="c" cx="36" cy="22.5" rx="8.5" ry="3.5" />
            <rect class="k" x="21" y="21" width="30" height="9" rx="2" />
            <rect class="b" x="24" y="29.5" width="24" height="29" rx="4" />
            <path class="d" d="M28 45 h16" />
        </g>

        <!-- ─────────── שמן אתרי · dropper vial + aroma + rosemary needles ─────────── -->
        <g v-else-if="id === 'eoil'">
            <g class="sprig">
                <path class="stem" d="M18 64 C16 55 16 47 20 41" />
                <g class="vein">
                    <path d="M17 59 l-4 2" />
                    <path d="M18 56 l4 1.5" />
                    <path d="M16.5 53 l-4 1.5" />
                    <path d="M17.5 50 l4 1" />
                    <path d="M17 47 l-3.5 1" />
                    <path d="M18 44 l3.5 0.5" />
                </g>
            </g>
            <path class="aroma" d="M31 7 Q36 2.5 41 7" />
            <path class="aroma" d="M33 4.5 Q36 1.5 39 4.5" />
            <rect class="k" x="30" y="8" width="12" height="7" rx="2" />
            <rect class="k" x="32" y="15" width="8" height="3.5" rx="1" />
            <rect class="b" x="27" y="18" width="18" height="41" rx="7" />
            <rect class="c" x="30" y="37" width="12" height="20" rx="4" />
        </g>

        <!-- ─────────── שמן מושרה · infused bottle (herbs inside) + olive branch ─────────── -->
        <g v-else-if="id === 'ioil'">
            <g class="sprig">
                <path class="stem" d="M13 63 C12 55 14 48 20 43" />
                <path
                    class="leaf"
                    d="M11 55 c-4 -3 -4 -8 -1 -11 c3 3 4 8 1 11 z"
                />
                <path
                    class="leaf"
                    d="M17 49 c-3 -4 -2 -9 1 -11 c2 4 2 8 -1 11 z"
                />
                <path
                    class="leaf"
                    d="M22 44 c1 -4 5 -6 8 -5 c-1 4 -4 6 -8 5 z"
                />
                <ellipse class="olive" cx="14" cy="58" rx="1.8" ry="2.4" />
                <ellipse class="olive" cx="18.5" cy="54" rx="1.8" ry="2.4" />
            </g>
            <rect class="cork" x="30" y="8" width="12" height="7" rx="1.5" />
            <rect class="b" x="21" y="17.5" width="30" height="44" rx="11" />
            <rect class="c" x="24" y="31" width="24" height="27" rx="8" />
            <path class="d" d="M32 52 c2 -4 2 -9 0 -13" />
            <path class="d" d="M40 50 c-1 -4 -1 -8 1 -11" />
        </g>
    </svg>
</template>

<style scoped>
.fta {
    display: block;
    overflow: visible;
}

/* vessel body — cream apothecary glass with a herbal outline */
.b {
    fill: #fffdf6;
    stroke: #45603c;
    stroke-width: 2;
    stroke-linejoin: round;
}
/* contents — a soft wash of the real material */
.c {
    fill: var(--c);
    opacity: 0.5;
}
/* caps / lids / rims */
.k {
    fill: #45603c;
}
.cork {
    fill: #a9814e;
}
/* thin details — pipettes, seams, handles, infusion twigs */
.d {
    fill: none;
    stroke: #45603c;
    stroke-width: 1.6;
    stroke-linecap: round;
}
/* steam + aroma — faint rising wisps */
.steam {
    fill: none;
    stroke: #6d9459;
    stroke-width: 1.8;
    stroke-linecap: round;
    opacity: 0.55;
}
.aroma {
    fill: none;
    stroke: #9a86b5;
    stroke-width: 1.5;
    stroke-linecap: round;
    opacity: 0.7;
}

/* ——— the sprigs (unique per type) ——— */
.stem {
    fill: none;
    stroke: #5c8150;
    stroke-width: 1.8;
    stroke-linecap: round;
}
.leaf {
    fill: #6d9459;
}
.succ {
    fill: #79a86a;
}
.vein {
    fill: none;
    stroke: #4c6f3e;
    stroke-width: 1;
    stroke-linecap: round;
    opacity: 0.6;
}
.lav {
    fill: #9a86b5;
} /* lavender buds */
.berryRed {
    fill: #c65b46;
} /* nightshade-family berry */
.berryGoji {
    fill: #cf4f3a;
} /* goji — Chinese decoction */
.petals ellipse {
    fill: #f4efe3;
    stroke: #d9d2be;
    stroke-width: 0.4;
}
.pollen {
    fill: #e6b84b;
} /* chamomile centre */
.calOut {
    fill: #e59a45;
} /* calendula bloom */
.calIn {
    fill: #c9702a;
}
.olive {
    fill: #7f9a44;
}
</style>
