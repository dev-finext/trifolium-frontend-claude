<script setup>
// Bottle composition chart ("בקבוק מעבדה") — a glass apothecary bottle filled
// bottom-up with one colored liquid layer per ingredient. Fill level = Σpct, so
// an unfinished formula shows air at the top; each layer's share within the
// liquid = its pct. Animated wave crests sit at every liquid boundary, with a
// slow glass shimmer drifting across. Updates live as percentages change.
import { computed } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import { fmtPct } from '@/Components/wizard/wizard-lib';
import { bottleLighten, TF_WAVE_URI } from '@/Components/wizard/step3-data';

const props = defineProps({
    segments: { type: Array, required: true },
    totalPct: { type: Number, default: 0 },
    isDone: { type: Boolean, default: false },
    isOver: { type: Boolean, default: false },
});

const neckW = 40, neckH = 26, corkH = 12, bodyW = 104, bodyH = 150;

const sumPct = computed(() => props.segments.reduce((s, x) => s + x.pct, 0) || 0);
// Liquid level inside the body (clamped 0–100).
const fill = computed(() => Math.max(0, Math.min(100, sumPct.value)));

// Per-layer style: share within the liquid + a glassy horizontal gradient.
function layerStyle(seg) {
    const within = sumPct.value > 0 ? (seg.pct / sumPct.value) * 100 : 0;
    const c = seg.overflowed ? '#c93838' : seg.color;
    return {
        position: 'relative',
        flex: `0 0 ${within}%`,
        background: `linear-gradient(90deg, ${bottleLighten(c, -0.06)} 0%, ${c} 45%, ${bottleLighten(c, 0.18)} 100%)`,
        boxShadow: 'inset 0 0 16px rgba(0,0,0,.12)',
        transition: 'flex-basis .5s ease',
    };
}

// The wavy crest sitting on top of each layer.
function crestStyle(seg, i) {
    const c = seg.overflowed ? '#c93838' : seg.color;
    const isTop = i === props.segments.length - 1;
    return {
        position: 'absolute',
        left: 0, top: '-6px',
        width: '100%', height: '12px',
        backgroundColor: isTop ? bottleLighten(c, 0.12) : c,
        WebkitMask: `url("${TF_WAVE_URI}") repeat-x`,
        mask: `url("${TF_WAVE_URI}") repeat-x`,
        WebkitMaskSize: '40px 12px',
        maskSize: '40px 12px',
        animation: `tfBottleWave ${2.6 + i * 0.5}s linear infinite`,
    };
}
</script>

<template>
    <div style="display: flex; justify-content: center; align-items: center">
        <div style="position: relative; display: flex; flex-direction: column; align-items: center">
            <!-- cork -->
            <div :style="{ width: `${neckW * 0.92}px`, height: `${corkH}px`, marginBottom: '-2px', borderRadius: '5px 5px 3px 3px', background: 'linear-gradient(#b78f5d,#8a6235)', boxShadow: 'inset 0 2px 2px rgba(255,255,255,.3)', zIndex: 3 }" />
            <!-- neck -->
            <div :style="{ width: `${neckW}px`, height: `${neckH}px`, background: 'rgba(255,255,255,.16)', border: '2px solid rgba(120,135,118,.30)', borderBottom: 'none', borderRadius: '5px 5px 0 0', zIndex: 2 }" />
            <!-- body -->
            <div :style="{ position: 'relative', width: `${bodyW}px`, height: `${bodyH}px`, background: 'rgba(255,255,255,.12)', border: '2px solid rgba(120,135,118,.32)', borderRadius: '12px 12px 26px 26px', overflow: 'hidden', boxShadow: 'inset 0 0 26px rgba(255,255,255,.25)' }">
                <!-- liquid (first ingredient at the bottom) -->
                <div :style="{ position: 'absolute', left: 0, right: 0, bottom: 0, height: fill + '%', display: 'flex', flexDirection: 'column-reverse', transition: 'height .5s ease' }">
                    <div v-for="(seg, i) in segments" :key="i" :style="layerStyle(seg)">
                        <div :style="crestStyle(seg, i)" />
                    </div>
                </div>
                <!-- glass glare -->
                <div style="position: absolute; top: 6%; left: 12%; width: 15%; height: 80%; border-radius: 40%; background: linear-gradient(rgba(255,255,255,.55),rgba(255,255,255,0)); filter: blur(2px); z-index: 2; pointer-events: none" />
                <!-- shimmer -->
                <div style="position: absolute; top: 0; width: 55%; height: 100%; z-index: 2; pointer-events: none; background: linear-gradient(115deg,transparent 0%,rgba(255,255,255,.42) 50%,transparent 100%); transform: skewX(-14deg); animation: tfBottleShimmer 5.5s ease-in-out infinite" />
            </div>
            <!-- fill caption -->
            <div :style="{ marginTop: '10px', fontSize: '12px', fontWeight: 600, color: isOver ? '#c93838' : 'var(--ink-3)', display: 'flex', alignItems: 'baseline', gap: '6px' }">
                <span v-if="isDone" style="display: inline-flex"><Icon name="check" :size="12" color="var(--accent)" :stroke="3" /></span>
                <span class="num" :style="{ fontSize: '15px', fontWeight: 700, color: isOver ? '#c93838' : isDone ? 'var(--accent)' : 'var(--ink)' }">{{ fmtPct(totalPct) }}%</span>
                {{ isDone ? 'הפורמולה מלאה' : isOver ? 'מעל 100%' : 'מתוך 100%' }}
            </div>
        </div>
    </div>
</template>

<style>
@keyframes tfBottleWave { from { -webkit-mask-position-x: 0; mask-position-x: 0; } to { -webkit-mask-position-x: 40px; mask-position-x: 40px; } }
@keyframes tfBottleShimmer { 0% { left: -70%; } 55%, 100% { left: 130%; } }
</style>
