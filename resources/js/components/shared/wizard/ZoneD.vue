<script setup>
// ZONE D — Stats bar + bottle composition + upgraded legend.
import { computed } from 'vue';
import BottleChart from '@/components/shared/wizard/BottleChart.vue';
import LegendRow from '@/components/shared/wizard/LegendRow.vue';
import StatCell from '@/components/shared/wizard/StatCell.vue';
import { INGREDIENT_PALETTE } from '@/components/shared/wizard/step3-data';
import { VOLUME_RULES } from '@/components/shared/wizard/wizard-rules';
import FieldLabel from '@/components/ui/FieldLabel.vue';
import Icon from '@/components/ui/Icon.vue';
import { HERBS } from '@/data/mock';
import { useModeStore } from '@/stores/mode';

const props = defineProps({
    formula: { type: Object, required: true },
    ftype: { type: Object, default: null },
    patientLabel: { type: String, default: null },
    noPatient: { type: Boolean, default: false },
});

const { isChinese } = useModeStore();

const totalPct = computed(() =>
    props.formula.ingredients.reduce((s, i) => s + (+i.pct || 0), 0),
);
const tRounded = computed(() => Math.round(totalPct.value * 10) / 10);
const isOver = computed(() => !isChinese.value && tRounded.value > 100.04);
const isDone = computed(
    () => !isChinese.value && Math.abs(tRounded.value - 100) < 0.05,
);
const rules = computed(() => VOLUME_RULES[props.formula.typeId]);
const volume = computed(() => props.formula.formulaVolume);
const volumeUnit = computed(
    () => rules.value?.unit || (props.ftype && props.ftype.unit),
);
const totalParts = computed(() =>
    props.formula.ingredients.reduce((s, i) => s + (+i.parts || 0), 0),
);

// One hue per ingredient; the last segment turns warning-red when Σpct > 100.
const segments = computed(() =>
    props.formula.ingredients.map((row, i) => ({
        herb: HERBS.find((h) => h.id === row.herbId),
        pct: +row.pct || 0,
        qty: +row.qty || 0,
        parts: +row.parts || 0,
        color: INGREDIENT_PALETTE[i % INGREDIENT_PALETTE.length],
        overflowed: isOver.value && i === props.formula.ingredients.length - 1,
    })),
);

const hasContent = computed(() => segments.value.length > 0);
</script>

<template>
    <section class="card zone-d overflow-hidden">
        <!-- Stats bar — נפח כולל comes from Zone A -->
        <div class="grid grid-cols-[repeat(4,1fr)] border-b border-b-line">
            <StatCell label="נפח כולל" big accent>
                <template v-if="volume != null">
                    <span class="num">{{ volume }}</span>
                    <span class="text-[14px] font-medium">{{
                        volumeUnit
                    }}</span>
                </template>
                <span v-else class="text-[14px] font-medium text-ink-3"
                    >טרם נבחר</span
                >
            </StatCell>

            <StatCell label="רכיבים" big>
                <span class="num">{{ formula.ingredients.length }}</span>
            </StatCell>
            <StatCell label="סוג פורמולה">{{ ftype && ftype.heb }}</StatCell>
            <StatCell label="מטופל" last>
                <span v-if="noPatient" class="text-warning">ללא מטופל</span>
                <template v-else>{{ patientLabel || '—' }}</template>
            </StatCell>
        </div>

        <!-- Body -->
        <div
            v-if="!hasContent"
            class="px-[24px] py-[64px] text-center text-ink-3"
        >
            <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--ink-4)"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="mb-[12px] inline-block"
            >
                <path d="M12 2a10 10 0 1 0 10 10h-10V2z" />
                <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
            <div class="mb-[4px] font-semibold text-ink-2">
                הוסף רכיבים כדי לראות את התרשים
            </div>
            <div class="small">התרשים מתעדכן בזמן אמת.</div>
        </div>

        <div
            v-else
            class="grid grid-cols-[220px_1fr] items-center gap-[28px] px-[24px] py-[16px]"
        >
            <BottleChart
                :segments="segments"
                :total-pct="tRounded"
                :is-done="isChinese ? false : isDone"
                :is-over="isOver"
            />

            <!-- Legend + physical volume -->
            <div>
                <FieldLabel>פירוט הרכב</FieldLabel>
                <div class="col mb-[10px] gap-[4px]">
                    <LegendRow
                        v-for="(seg, i) in segments"
                        :key="i"
                        :seg="seg"
                        :chinese-unit="isChinese ? volumeUnit : null"
                        :show-parts="isChinese"
                    />
                </div>
                <div
                    v-if="volume != null"
                    class="flex items-center gap-[8px] pt-[8px] text-[12.5px] text-ink-3 [border-top:1px_dashed_var(--line)]"
                >
                    <Icon name="flask" :size="12" color="var(--ink-3)" />
                    <template v-if="isChinese">
                        נפח כולל:
                        <span class="num font-semibold text-ink-2">{{
                            volume
                        }}</span>
                        {{ volumeUnit }} ·
                        <span class="num font-semibold text-ink-2">{{
                            totalParts
                        }}</span>
                        חלקים
                    </template>
                    <template v-else>
                        נפח כולל:
                        <span class="num font-semibold text-ink-2">{{
                            volume
                        }}</span>
                        {{ volumeUnit }}
                    </template>
                </div>
            </div>
        </div>
    </section>
</template>
