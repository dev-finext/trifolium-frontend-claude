<script setup>
// One legend row under the bottle chart — swatch, herb name, mini bar and the
// share readout. In Chinese mode it also shows the parts count + physical qty.
import HerbName from '@/Components/mode/HerbName.vue';
import { fmtPct } from '@/Components/wizard/wizard-lib';

defineProps({
    seg: { type: Object, required: true },
    // In Chinese mode this is the volume unit; null in Western mode.
    chineseUnit: { type: String, default: null },
    showParts: { type: Boolean, default: false },
});
</script>

<template>
    <div style="display: flex; align-items: center; gap: 12px; padding: 4px 0; direction: ltr">
        <span
            :style="{
                width: '10px', height: '10px',
                borderRadius: '3px',
                background: seg.overflowed ? 'var(--danger)' : seg.color,
                flexShrink: 0,
            }"
        />
        <div style="min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 1px">
            <HerbName :herb="seg.herb" :primary-size="13" :secondary-size="11.5" :primary-weight="500" hide-secondary />
        </div>

        <span style="width: 64px; height: 5px; background: var(--surface-sunk); border-radius: 999px; overflow: hidden; flex-shrink: 0">
            <span
                :style="{
                    display: 'block',
                    height: '100%',
                    width: `${Math.min(100, seg.pct)}%`,
                    background: seg.overflowed ? 'var(--danger)' : seg.color,
                    borderRadius: '999px',
                    transition: 'width .4s ease',
                }"
            />
        </span>

        <span v-if="chineseUnit" style="display: inline-flex; align-items: center; gap: 6px; width: 132px; justify-content: flex-end">
            <span
                v-if="showParts"
                style="display: inline-flex; align-items: baseline; gap: 2px; padding: 1px 7px; border-radius: 999px; background: var(--surface-sunk); border: 1px solid var(--line); flex-shrink: 0"
            >
                <span class="num" style="font-size: 11.5px; font-weight: 700; color: var(--accent-ink)">{{ seg.parts }}</span>
                <span style="font-size: 10px; color: var(--ink-3)">ח׳</span>
            </span>
            <span
                :style="{
                    fontSize: '12px',
                    color: seg.overflowed ? '#a13030' : 'var(--ink-2)',
                    textAlign: 'left',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                }"
            >
                <span class="num">{{ seg.qty }}</span> {{ chineseUnit }}
                <span style="color: var(--ink-3); font-weight: 500"> · </span>
                <span class="num" style="color: var(--ink-3); font-weight: 500">{{ fmtPct(seg.pct) }}%</span>
            </span>
        </span>
        <span
            v-else
            class="num"
            :style="{
                fontSize: '12.5px',
                color: seg.overflowed ? '#a13030' : 'var(--ink-2)',
                width: '56px',
                textAlign: 'left',
                fontWeight: 600,
            }"
        >{{ fmtPct(seg.pct) }}%</span>
    </div>
</template>
