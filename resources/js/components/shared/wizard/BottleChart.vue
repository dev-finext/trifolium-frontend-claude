<script setup>
// Bottle composition chart ("בקבוק מעבדה") — a glass apothecary bottle filled
// bottom-up with one colored liquid layer per ingredient. Fill level = Σpct, so
// an unfinished formula shows air at the top; each layer's share within the
// liquid = its pct. Animated wave crests sit at every liquid boundary, with a
// slow glass shimmer drifting across. Updates live as percentages change.
import { computed } from 'vue';
import Icon from '@/components/ui/Icon.vue';
import { fmtPct } from '@/components/shared/wizard/wizard-lib';
import { bottleLighten, TF_WAVE_URI } from '@/components/shared/wizard/step3-data';

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
    const c = seg.overflowed ? 'var(--danger)' : seg.color;
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
    const c = seg.overflowed ? 'var(--danger)' : seg.color;
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
    <div class="flex items-center justify-center">
        <div class="relative flex flex-col items-center">
            <!-- cork -->
            <div class="mb-[-2px] rounded-[5px_5px_3px_3px] bg-[linear-gradient(#b78f5d,#8a6235)] shadow-[inset_0_2px_2px_rgba(255,255,255,.3)] z-[3]" :style="{ width: `${neckW * 0.92}px`, height: `${corkH}px` }" />
            <!-- neck -->
            <div class="bg-[rgba(255,255,255,.16)] border-2 border-[rgba(120,135,118,.30)] border-b-0 rounded-[5px_5px_0_0] z-[2]" :style="{ width: `${neckW}px`, height: `${neckH}px` }" />
            <!-- body -->
            <div class="relative overflow-hidden bg-[rgba(255,255,255,.12)] border-2 border-[rgba(120,135,118,.32)] rounded-[12px_12px_26px_26px] shadow-[inset_0_0_26px_rgba(255,255,255,.25)]" :style="{ width: `${bodyW}px`, height: `${bodyH}px` }">
                <!-- liquid (first ingredient at the bottom) -->
                <div class="absolute left-0 right-0 bottom-0 flex flex-col-reverse transition-[height] duration-500 ease-[ease]" :style="{ height: fill + '%' }">
                    <div v-for="(seg, i) in segments" :key="i" :style="layerStyle(seg)">
                        <div :style="crestStyle(seg, i)" />
                    </div>
                </div>
                <!-- glass glare -->
                <div class="absolute top-[6%] left-[12%] w-[15%] h-[80%] rounded-[40%] bg-[linear-gradient(rgba(255,255,255,.55),rgba(255,255,255,0))] blur-[2px] z-[2] pointer-events-none" />
                <!-- shimmer -->
                <div class="absolute top-0 w-[55%] h-full z-[2] pointer-events-none bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,.42)_50%,transparent_100%)] skew-x-[-14deg] animate-[tfBottleShimmer_5.5s_ease-in-out_infinite]" />
            </div>
            <!-- fill caption -->
            <div class="flex items-baseline gap-[6px] mt-[10px] text-[12px] font-semibold" :class="isOver ? 'text-danger' : 'text-ink-3'">
                <span v-if="isDone" class="inline-flex"><Icon name="check" :size="12" color="var(--accent)" :stroke="3" /></span>
                <span class="num text-[15px] font-bold" :class="isOver ? 'text-danger' : isDone ? 'text-accent' : 'text-ink'">{{ fmtPct(totalPct) }}%</span>
                {{ isDone ? 'הפורמולה מלאה' : isOver ? 'מעל 100%' : 'מתוך 100%' }}
            </div>
        </div>
    </div>
</template>

<style>
@keyframes tfBottleWave { from { -webkit-mask-position-x: 0; mask-position-x: 0; } to { -webkit-mask-position-x: 40px; mask-position-x: 40px; } }
@keyframes tfBottleShimmer { 0% { left: -70%; } 55%, 100% { left: 130%; } }
</style>
