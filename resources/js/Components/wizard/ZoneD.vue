<script setup>
// ZONE D — Stats bar + bottle composition + upgraded legend.
import { computed } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import FieldLabel from '@/Components/ui/FieldLabel.vue';
import StatCell from '@/Components/wizard/StatCell.vue';
import BottleChart from '@/Components/wizard/BottleChart.vue';
import LegendRow from '@/Components/wizard/LegendRow.vue';
import { useModeStore } from '@/stores/mode';
import { HERBS, FORMULA_TYPES } from '@/data/mock';
import { VOLUME_RULES } from '@/Components/wizard/wizard-rules';
import { INGREDIENT_PALETTE } from '@/Components/wizard/step3-data';

const props = defineProps({
    formula: { type: Object, required: true },
    ftype: { type: Object, default: null },
    patientLabel: { type: String, default: null },
    noPatient: { type: Boolean, default: false },
});

const { isChinese } = useModeStore();

const totalPct = computed(() => props.formula.ingredients.reduce((s, i) => s + (+i.pct || 0), 0));
const tRounded = computed(() => Math.round(totalPct.value * 10) / 10);
const isOver = computed(() => !isChinese.value && tRounded.value > 100.04);
const isDone = computed(() => !isChinese.value && Math.abs(tRounded.value - 100) < 0.05);
const rules = computed(() => VOLUME_RULES[props.formula.typeId]);
const volume = computed(() => props.formula.formulaVolume);
const volumeUnit = computed(() => rules.value?.unit || (props.ftype && props.ftype.unit));
const totalParts = computed(() => props.formula.ingredients.reduce((s, i) => s + (+i.parts || 0), 0));

// One hue per ingredient; the last segment turns warning-red when Σpct > 100.
const segments = computed(() => props.formula.ingredients.map((row, i) => ({
    herb: HERBS.find((h) => h.id === row.herbId),
    pct: +row.pct || 0,
    qty: +row.qty || 0,
    parts: +row.parts || 0,
    color: INGREDIENT_PALETTE[i % INGREDIENT_PALETTE.length],
    overflowed: isOver.value && i === props.formula.ingredients.length - 1,
})));

const hasContent = computed(() => segments.value.length > 0);
</script>

<template>
    <section class="card zone-d" style="overflow: hidden">
        <!-- Stats bar — נפח כולל comes from Zone A -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); border-bottom: 1px solid var(--line)">
            <StatCell label="נפח כולל" big accent>
                <template v-if="volume != null">
                    <span class="num">{{ volume }}</span> <span style="font-size: 14px; font-weight: 500">{{ volumeUnit }}</span>
                </template>
                <span v-else style="color: var(--ink-3); font-size: 14px; font-weight: 500">טרם נבחר</span>
            </StatCell>

            <StatCell label="רכיבים" big>
                <span class="num">{{ formula.ingredients.length }}</span>
            </StatCell>
            <StatCell label="סוג פורמולה">{{ ftype && ftype.heb }}</StatCell>
            <StatCell label="מטופל" last>
                <span v-if="noPatient" style="color: var(--warning)">ללא מטופל</span>
                <template v-else>{{ patientLabel || '—' }}</template>
            </StatCell>
        </div>

        <!-- Body -->
        <div v-if="!hasContent" style="padding: 64px 24px; text-align: center; color: var(--ink-3)">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--ink-4)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; margin-bottom: 12px">
                <path d="M12 2a10 10 0 1 0 10 10h-10V2z" />
                <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
            <div style="font-weight: 600; color: var(--ink-2); margin-bottom: 4px">הוסף רכיבים כדי לראות את התרשים</div>
            <div class="small">התרשים מתעדכן בזמן אמת.</div>
        </div>

        <div v-else style="display: grid; grid-template-columns: 220px 1fr; gap: 28px; padding: 16px 24px; align-items: center">
            <BottleChart
                :segments="segments"
                :total-pct="tRounded"
                :is-done="isChinese ? false : isDone"
                :is-over="isOver"
            />

            <!-- Legend + physical volume -->
            <div>
                <FieldLabel>פירוט הרכב</FieldLabel>
                <div class="col gap-4" style="margin-bottom: 10px">
                    <LegendRow
                        v-for="(seg, i) in segments" :key="i"
                        :seg="seg"
                        :chinese-unit="isChinese ? volumeUnit : null"
                        :show-parts="isChinese"
                    />
                </div>
                <div
                    v-if="volume != null"
                    style="padding-top: 8px; border-top: 1px dashed var(--line); font-size: 12.5px; color: var(--ink-3); display: flex; align-items: center; gap: 8px"
                >
                    <Icon name="flask" :size="12" color="var(--ink-3)" />
                    <template v-if="isChinese">
                        נפח כולל: <span class="num" style="color: var(--ink-2); font-weight: 600">{{ volume }}</span> {{ volumeUnit }} · <span class="num" style="color: var(--ink-2); font-weight: 600">{{ totalParts }}</span> חלקים
                    </template>
                    <template v-else>
                        נפח כולל: <span class="num" style="color: var(--ink-2); font-weight: 600">{{ volume }}</span> {{ volumeUnit }}
                    </template>
                </div>
            </div>
        </div>
    </section>
</template>
