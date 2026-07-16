<script setup>
// One legend row under the bottle chart — swatch, herb name, mini bar and the
// share readout. In Chinese mode it also shows the parts count + physical qty.
import HerbName from '@/components/shared/mode/HerbName.vue';
import { fmtPct } from '@/components/shared/wizard/wizard-lib';

defineProps({
    seg: { type: Object, required: true },
    // In Chinese mode this is the volume unit; null in Western mode.
    chineseUnit: { type: String, default: null },
    showParts: { type: Boolean, default: false },
});
</script>

<template>
    <div class="flex items-center gap-[12px] px-0 py-[4px] [direction:ltr]">
        <span
            class="h-[10px] w-[10px] shrink-0 rounded-[3px]"
            :style="{
                background: seg.overflowed ? 'var(--danger)' : seg.color,
            }"
        />
        <div class="flex min-w-0 flex-1 flex-col gap-[1px]">
            <HerbName
                :herb="seg.herb"
                :primary-size="13"
                :secondary-size="11.5"
                :primary-weight="500"
                hide-secondary
            />
        </div>

        <span
            class="h-[5px] w-[64px] shrink-0 overflow-hidden rounded-[999px] bg-surface-sunk"
        >
            <span
                class="block h-full rounded-[999px] transition-[width] duration-[.4s] ease-[ease]"
                :style="{
                    width: `${Math.min(100, seg.pct)}%`,
                    background: seg.overflowed ? 'var(--danger)' : seg.color,
                }"
            />
        </span>

        <span
            v-if="chineseUnit"
            class="inline-flex w-[132px] items-center justify-end gap-[6px]"
        >
            <span
                v-if="showParts"
                class="inline-flex shrink-0 items-baseline gap-[2px] rounded-[999px] border border-line bg-surface-sunk px-[7px] py-[1px]"
            >
                <span class="num text-[11.5px] font-bold text-accent-ink">{{
                    seg.parts
                }}</span>
                <span class="text-[10px] text-ink-3">ח׳</span>
            </span>
            <span
                class="text-left text-[12px] font-semibold whitespace-nowrap"
                :class="seg.overflowed ? 'text-[#a13030]' : 'text-ink-2'"
            >
                <span class="num">{{ seg.qty }}</span> {{ chineseUnit }}
                <span class="font-medium text-ink-3"> · </span>
                <span class="num font-medium text-ink-3"
                    >{{ fmtPct(seg.pct) }}%</span
                >
            </span>
        </span>
        <span
            v-else
            class="num w-[56px] text-left text-[12.5px] font-semibold"
            :class="seg.overflowed ? 'text-[#a13030]' : 'text-ink-2'"
            >{{ fmtPct(seg.pct) }}%</span
        >
    </div>
</template>
