<script setup>
// Shared formula summary card — header (name/type/patient/volume/count) +
// ingredients table + optional patient-facing instructions. Used by both the
// order path and the save path in step 5.
import { computed } from 'vue';
import { FORMULA_TYPES, HERBS } from '@/data/mock';

const props = defineProps({
    formula: { type: Object, required: true },
    patientLabel: { type: String, default: null },
    /** Pre-computed volume label (e.g. "200 ml", "60 כמוסות"). */
    totalVol: { type: String, default: '' },
});

const ftype = computed(() => FORMULA_TYPES.find((t) => t.id === props.formula.typeId));
const totalQty = computed(() => props.formula.ingredients.reduce((s, x) => s + x.qty, 0));

const herbFor = (id) => HERBS.find((h) => h.id === id);
</script>

<template>
    <div class="card">
        <div class="p-[24px] border-b border-b-line">
            <div class="field-label">פורמולה</div>
            <h2 class="m-0 mt-[4px] text-[22px] font-semibold">
                <template v-if="formula.name">{{ formula.name }}</template>
                <span v-else class="muted">— ללא שם —</span>
            </h2>
            <div class="small muted mt-[8px] flex flex-wrap gap-[14px]">
                <span><strong>סוג:</strong> {{ ftype.heb }}</span>
                <span v-if="patientLabel"><strong>מטופל:</strong> {{ patientLabel }}</span>
                <span><strong>נפח:</strong> {{ totalVol }}</span>
                <span><strong>רכיבים:</strong> <span class="num">{{ formula.ingredients.length }}</span></span>
            </div>
        </div>

        <!-- Ingredients table -->
        <table class="w-full border-collapse">
            <thead>
                <tr>
                    <th
                        v-for="(h, i) in ['#', 'שם רכיב', 'כמות', '%']"
                        :key="i"
                        class="px-[20px] py-[10px] text-right text-[11px] tracking-[0.06em] uppercase font-semibold text-ink-3 bg-surface-sunk border-b border-b-line"
                    >{{ h }}</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(row, i) in formula.ingredients"
                    :key="row.herbId"
                    :class="i === formula.ingredients.length - 1 ? '' : 'border-b border-b-line'"
                >
                    <td class="num muted px-[20px] py-[12px]">{{ i + 1 }}</td>
                    <td class="px-[20px] py-[12px]">
                        <div class="text-[14px] font-medium">{{ herbFor(row.herbId).heb }}</div>
                        <div class="small muted latin text-[11px] italic">{{ herbFor(row.herbId).lat }}</div>
                    </td>
                    <td class="num px-[20px] py-[12px] text-[13px]">{{ row.qty }} {{ ftype.unit }}</td>
                    <td class="num px-[20px] py-[12px] text-[13px] text-ink-2">{{ (totalQty ? (row.qty / totalQty) * 100 : 0).toFixed(1) }}%</td>
                </tr>
            </tbody>
        </table>

        <!-- Patient-facing instructions -->
        <div
            v-if="formula.externalNotes"
            class="px-[20px] py-[14px] text-[13px] leading-[1.55] text-accent-ink bg-accent-tint border-t border-t-line"
        >
            <div class="mb-[4px] text-[11px] tracking-[0.06em] uppercase font-bold">
                הנחיות למטופל
            </div>
            {{ formula.externalNotes }}
        </div>
    </div>
</template>
