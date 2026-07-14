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
        <div style="padding: 24px; border-bottom: 1px solid var(--line)">
            <div class="field-label">פורמולה</div>
            <h2 style="margin: 4px 0 0; font-size: 22px; font-weight: 600">
                <template v-if="formula.name">{{ formula.name }}</template>
                <span v-else class="muted">— ללא שם —</span>
            </h2>
            <div class="small muted mt-8" style="display: flex; gap: 14px; flex-wrap: wrap">
                <span><strong>סוג:</strong> {{ ftype.heb }}</span>
                <span v-if="patientLabel"><strong>מטופל:</strong> {{ patientLabel }}</span>
                <span><strong>נפח:</strong> {{ totalVol }}</span>
                <span><strong>רכיבים:</strong> <span class="num">{{ formula.ingredients.length }}</span></span>
            </div>
        </div>

        <!-- Ingredients table -->
        <table style="width: 100%; border-collapse: collapse">
            <thead>
                <tr>
                    <th
                        v-for="(h, i) in ['#', 'שם רכיב', 'כמות', '%']"
                        :key="i"
                        style="text-align: right; padding: 10px 20px; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-3); font-weight: 600; border-bottom: 1px solid var(--line); background: var(--surface-sunk)"
                    >{{ h }}</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(row, i) in formula.ingredients"
                    :key="row.herbId"
                    :style="{ borderBottom: i === formula.ingredients.length - 1 ? 'none' : '1px solid var(--line)' }"
                >
                    <td style="padding: 12px 20px" class="num muted">{{ i + 1 }}</td>
                    <td style="padding: 12px 20px">
                        <div style="font-size: 14px; font-weight: 500">{{ herbFor(row.herbId).heb }}</div>
                        <div class="small muted latin" style="font-size: 11px; font-style: italic">{{ herbFor(row.herbId).lat }}</div>
                    </td>
                    <td style="padding: 12px 20px; font-size: 13px" class="num">{{ row.qty }} {{ ftype.unit }}</td>
                    <td style="padding: 12px 20px; font-size: 13px; color: var(--ink-2)" class="num">{{ (totalQty ? (row.qty / totalQty) * 100 : 0).toFixed(1) }}%</td>
                </tr>
            </tbody>
        </table>

        <!-- Patient-facing instructions -->
        <div
            v-if="formula.externalNotes"
            style="padding: 14px 20px; background: var(--accent-tint); border-top: 1px solid var(--line); font-size: 13px; color: var(--accent-ink); line-height: 1.55"
        >
            <div style="font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; font-weight: 700; margin-bottom: 4px">
                הנחיות למטופל
            </div>
            {{ formula.externalNotes }}
        </div>
    </div>
</template>
