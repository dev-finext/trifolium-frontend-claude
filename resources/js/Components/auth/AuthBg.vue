<script>
// Soft, blurred natural-pharmacy ambient backdrops for the centered auth
// cards. Several gentle variants — all kept calm and low-contrast so the
// white card stays crisp. The prototype selected the variant via the Tweaks
// panel ("רקע"); that panel was dropped, so the shipped default
// ('מרווה רכה') is baked in as the prop default. The other variants are
// kept verbatim in case the choice ever becomes server-driven.
export const AUTH_BG_OPTIONS = [
    'פרחי מרפא (ירוק)',   // floral, green wash
    'פרחי מרפא (בהיר)',   // floral, airy/light wash
    'מרווה רכה',          // soft sage gradient, no photo — shipped default
    'זוהר ירוק',          // soft green radial glow
    'קרם חמים',           // warm cream gradient
];
</script>

<script setup>
import { computed } from 'vue';
import echinaceaUrl from '@img/echinacea.jpg';

const props = defineProps({
    variant: { type: String, default: 'מרווה רכה' },
});

// Base style of the blurred photo layer (floral variants only).
const photoBase = {
    position: 'absolute', inset: '-60px',
    backgroundImage: `url(${echinaceaUrl})`,
    backgroundSize: 'cover', backgroundPosition: 'center',
    transform: 'scale(1.12)',
};

// Each variant is a list of absolutely-positioned layer styles.
const layers = computed(() => {
    switch (props.variant) {
        case 'פרחי מרפא (בהיר)':
            return [
                { ...photoBase, filter: 'blur(20px) saturate(0.85) brightness(1.12)' },
                { position: 'absolute', inset: '0', background: 'linear-gradient(150deg, rgba(246,248,245,0.58), rgba(231,238,229,0.74))' },
                { position: 'absolute', inset: '0', background: 'radial-gradient(120% 100% at 50% 35%, rgba(255,255,255,0.30), rgba(61,90,58,0.10) 75%)' },
            ];
        case 'מרווה רכה':
            return [
                { position: 'absolute', inset: '0', background: 'linear-gradient(160deg, #eef2ec 0%, #e4ece1 55%, #dae4d6 100%)' },
                { position: 'absolute', inset: '0', background: 'radial-gradient(110% 80% at 28% 22%, rgba(255,255,255,0.55), rgba(255,255,255,0) 60%)' },
            ];
        case 'זוהר ירוק':
            return [
                { position: 'absolute', inset: '0', background: '#eef2ec' },
                { position: 'absolute', inset: '0', background: 'radial-gradient(90% 70% at 25% 18%, rgba(61,90,58,0.18), rgba(61,90,58,0) 60%)' },
                { position: 'absolute', inset: '0', background: 'radial-gradient(80% 70% at 82% 88%, rgba(61,90,58,0.16), rgba(61,90,58,0) 58%)' },
            ];
        case 'קרם חמים':
            return [
                { position: 'absolute', inset: '0', background: 'linear-gradient(160deg, #f8f5ed 0%, #f0ebde 60%, #e9e2d2 100%)' },
                { position: 'absolute', inset: '0', background: 'radial-gradient(110% 80% at 30% 20%, rgba(255,255,255,0.5), rgba(125,74,42,0.05) 70%)' },
            ];
        default: // 'פרחי מרפא (ירוק)'
            return [
                { ...photoBase, filter: 'blur(18px) saturate(0.8) brightness(1.02)' },
                { position: 'absolute', inset: '0', background: 'linear-gradient(150deg, rgba(31,46,29,0.30), rgba(31,46,29,0.52))' },
                { position: 'absolute', inset: '0', background: 'radial-gradient(120% 90% at 50% 40%, rgba(246,248,245,0.22), rgba(31,46,29,0) 60%)' },
            ];
    }
});
</script>

<template>
    <div
        aria-hidden="true"
        :style="{ position: 'absolute', inset: '0', zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }"
    >
        <div v-for="(layer, i) in layers" :key="i" :style="layer" />
    </div>
</template>
