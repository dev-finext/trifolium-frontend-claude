<script setup>
// 9 formula-type icons — line, 1.5px stroke. Each glyph carries animated-glyph
// hook classes (.tf-bub/.tf-cap/.tf-ribbon/.tf-aroma/.tf-stir/.tf-trail/.tf-pwd/
// .tf-steam/.tf-dome/.tf-leaf) that the global stylesheet animates.
defineProps({
    id: { type: String, required: true },
    size: { type: Number, default: 26 },
    color: { type: String, default: 'currentColor' },
});
</script>

<template>
    <svg
        :class="'ftype-svg ftype-svg--' + id"
        :width="size"
        :height="size"
        viewBox="0 0 24 24"
    >
        <!-- טינקטורה — liquid bubbles rise through the tube and pop at the surface -->
        <g
            v-if="id === 'tincture'"
            :stroke="color"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
        >
            <rect x="8" y="3" width="8" height="3" rx="1" />
            <path
                d="M9 6h6v2c0 1 1 2 1 3v8a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3v-8c0-1 1-2 1-3V6z"
            />
            <path d="M9 12.5c1 .7 2 .7 3 0s2-.7 3 0" />
            <circle
                class="tf-bub tf-bub-1"
                :fill="color"
                stroke="none"
                fill-opacity="0.5"
                cx="11"
                cy="19.4"
                r="1.4"
            />
            <circle
                class="tf-bub tf-bub-2"
                :fill="color"
                stroke="none"
                fill-opacity="0.5"
                cx="13"
                cy="19.8"
                r="1"
            />
            <circle
                class="tf-bub tf-bub-3"
                :fill="color"
                stroke="none"
                fill-opacity="0.5"
                cx="12"
                cy="18.8"
                r="1.9"
            />
            <circle
                class="tf-bub tf-bub-4"
                :fill="color"
                stroke="none"
                fill-opacity="0.5"
                cx="10.7"
                cy="19.6"
                r="0.8"
            />
            <circle
                class="tf-bub tf-bub-5"
                :fill="color"
                stroke="none"
                fill-opacity="0.5"
                cx="13.2"
                cy="19"
                r="1.2"
            />
        </g>

        <!-- קפסולות — jar tilts and spills capsules out of its mouth -->
        <g v-else-if="id === 'capsule'">
            <g
                class="tf-jar"
                :stroke="color"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                fill="none"
            >
                <rect x="8.5" y="3" width="7" height="2.6" rx="0.8" />
                <path d="M8 5.6h8v12.4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V5.6z" />
                <path d="M8 9h8" />
            </g>
            <g :fill="color" stroke="none">
                <rect
                    class="tf-cap tf-cap-1"
                    x="11.2"
                    y="4.2"
                    width="3.6"
                    height="1.8"
                    rx="0.9"
                />
                <rect
                    class="tf-cap tf-cap-2"
                    x="11.4"
                    y="4.2"
                    width="3.4"
                    height="1.7"
                    rx="0.85"
                />
                <rect
                    class="tf-cap tf-cap-3"
                    x="11"
                    y="4.4"
                    width="3.4"
                    height="1.7"
                    rx="0.85"
                />
            </g>
        </g>

        <!-- אבקה — funnel + particles sifting from the stem -->
        <g
            v-else-if="id === 'powder'"
            :stroke="color"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
        >
            <path d="M4 5h16l-6 8v6l-4 0v-6L4 5z" />
            <path d="M8 9h8" />
            <circle
                class="tf-pwd tf-pwd-1"
                :fill="color"
                stroke="none"
                cx="12"
                cy="18.6"
                r="1.7"
            />
            <circle
                class="tf-pwd tf-pwd-2"
                :fill="color"
                stroke="none"
                cx="9.6"
                cy="18.2"
                r="1.5"
            />
            <circle
                class="tf-pwd tf-pwd-3"
                :fill="color"
                stroke="none"
                cx="14.4"
                cy="18.2"
                r="1.5"
            />
            <circle
                class="tf-pwd tf-pwd-4"
                :fill="color"
                stroke="none"
                cx="11"
                cy="18.9"
                r="1.4"
            />
            <circle
                class="tf-pwd tf-pwd-5"
                :fill="color"
                stroke="none"
                cx="13"
                cy="18.9"
                r="1.4"
            />
            <circle
                class="tf-pwd tf-pwd-6"
                :fill="color"
                stroke="none"
                cx="8.4"
                cy="18.6"
                r="1.3"
            />
            <circle
                class="tf-pwd tf-pwd-7"
                :fill="color"
                stroke="none"
                cx="15.6"
                cy="18.6"
                r="1.3"
            />
        </g>

        <!-- חליטה — cup with steam wisps that rise and fade -->
        <g
            v-else-if="id === 'tea'"
            :stroke="color"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
        >
            <path d="M4 10h13v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-4z" />
            <path d="M17 11h2a2 2 0 0 1 0 4h-2" />
            <path
                class="tf-steam tf-steam-1"
                stroke-width="2"
                d="M8 9c-2 -2.4 2 -4.8 0 -7.2s2 -4.8 0 -7.2"
            />
            <path
                class="tf-steam tf-steam-2"
                stroke-width="2"
                d="M12 9c-2 -2.4 2 -4.8 0 -7.2s2 -4.8 0 -7.2"
            />
            <path
                class="tf-steam tf-steam-3"
                stroke-width="2"
                d="M16 9c-2 -2.4 2 -4.8 0 -7.2s2 -4.8 0 -7.2"
            />
        </g>

        <!-- בישול אישי — a spoon orbits the pot, stirring, leaving a faint swirl -->
        <g
            v-else-if="id === 'decoction'"
            :stroke="color"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
        >
            <path
                d="M5 13c0-1 .5-2 1.5-2.5C8 10 9.5 9.5 12 9.5s4 .5 5.5 1c1 .5 1.5 1.5 1.5 2.5v3a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-3z"
            />
            <path d="M8 10.2V9a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1.2" />
            <path d="M11.2 8h1.6V7h-1.6z" />
            <path d="M5 13.5h-1.2M19 13.5h1.2" />
            <circle
                class="tf-trail"
                cx="12"
                cy="13.5"
                r="2.7"
                stroke-width="1"
                stroke-dasharray="4 13"
            />
            <g class="tf-stir">
                <ellipse
                    class="tf-spoon-bowl"
                    :fill="color"
                    stroke="none"
                    cx="12"
                    cy="10.9"
                    rx="1.7"
                    ry="1.1"
                />
                <path
                    class="tf-spoon-handle"
                    d="M12 9.9 12.9 6.6"
                    stroke-width="1.3"
                />
            </g>
        </g>

        <!-- ג׳ל — a glossy ribbon of gel extrudes upward from the nozzle and curls -->
        <g
            v-else-if="id === 'gel'"
            :stroke="color"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
        >
            <path d="M7 3h10v2H7z" />
            <rect x="6" y="5" width="12" height="16" rx="2" />
            <path d="M9 9h6M9 13h6" />
            <path
                class="tf-ribbon"
                fill="none"
                :stroke="color"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3 C12 -3 11.5 -8 12 -11 C12.4 -13 14 -13 13.6 -11 C13.4 -9.9 12.3 -10.1 12.7 -11.3"
            />
            <path
                class="tf-ribbon tf-ribbon-gloss"
                fill="none"
                stroke="#fff"
                stroke-opacity="0.45"
                stroke-width="0.7"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3 C12 -3 11.5 -8 12 -11 C12.4 -13 14 -13 13.6 -11 C13.4 -9.9 12.3 -10.1 12.7 -11.3"
            />
        </g>

        <!-- קרם — a dome of cream rises from the open jar, holds, recedes -->
        <g
            v-else-if="id === 'cream'"
            :stroke="color"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
        >
            <ellipse
                class="tf-dome"
                :fill="color"
                stroke="none"
                cx="12"
                cy="8.8"
                rx="6"
                ry="3"
            />
            <rect x="4" y="6" width="16" height="3" rx="1" />
            <path d="M5 9l1 11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-11" />
            <path d="M10 14h4" />
        </g>

        <!-- שמן אתרי — aromatic arcs radiate up and out from the bottle mouth, diffusing -->
        <g
            v-else-if="id === 'eoil'"
            :stroke="color"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
        >
            <rect x="10" y="2" width="4" height="4" />
            <path
                d="M9 6h6v3c0 1 1 2 1 3v6a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3v-6c0-1 1-2 1-3V6z"
            />
            <path d="M12 14v3" />
            <path
                class="tf-aroma tf-aroma-1"
                stroke-width="1.4"
                d="M9 2 Q12 -1 15 2"
            />
            <path
                class="tf-aroma tf-aroma-2"
                stroke-width="1.4"
                d="M9 2 Q12 -1 15 2"
            />
            <path
                class="tf-aroma tf-aroma-3"
                stroke-width="1.4"
                d="M9 2 Q12 -1 15 2"
            />
        </g>

        <!-- שמן מושרה — leaves drift up out of the jar -->
        <g
            v-else-if="id === 'ioil'"
            :stroke="color"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
        >
            <rect x="6" y="4" width="12" height="2" rx="1" />
            <path d="M6 6v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6" />
            <path d="M9 10c1 1 1 3 0 4M12 12c1 1 1 3 0 4M15 11c1 1 1 3 0 4" />
            <path d="M8 18h8" />
            <path
                class="tf-leaf tf-leaf-1"
                :fill="color"
                stroke="none"
                d="M11 16.5q-2.6 1.8 -1.6 4.8 2.6 -1.8 1.6 -4.8z"
            />
            <path
                class="tf-leaf tf-leaf-2"
                :fill="color"
                stroke="none"
                d="M13 17q2.6 1.8 1.6 4.8 -2.6 -1.8 -1.6 -4.8z"
            />
            <path
                class="tf-leaf tf-leaf-3"
                :fill="color"
                stroke="none"
                d="M9.6 17.5q-2.4 1.7 -1.5 4.5 2.4 -1.7 1.5 -4.5z"
            />
            <path
                class="tf-leaf tf-leaf-4"
                :fill="color"
                stroke="none"
                d="M14.4 17.6q2.4 1.7 1.5 4.5 -2.4 -1.7 -1.5 -4.5z"
            />
            <path
                class="tf-leaf tf-leaf-5"
                :fill="color"
                stroke="none"
                d="M12 17.2q-2.5 1.7 -1.5 4.6 2.5 -1.7 1.5 -4.6z"
            />
        </g>
    </svg>
</template>
