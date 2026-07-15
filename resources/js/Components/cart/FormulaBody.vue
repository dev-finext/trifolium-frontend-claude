<script setup>
// Custom-formula cart line. No product image (a compounded formula has none) —
// the ingredient breakdown is the content that matters, so it leads: each herb
// with its botanical name and its share of the mix, on divided rows.
import { computed } from 'vue';
import { FORMULA_TYPES, HERBS } from '@/data/mock';
import TypeBadge from '@/Components/cart/TypeBadge.vue';
import PatientLine from '@/Components/cart/PatientLine.vue';

const props = defineProps({
    item: { type: Object, required: true },
});

const ftype = computed(() => FORMULA_TYPES.find((t) => t.id === props.item.typeId));
// Resolve each ingredient's herb record once for the template loop.
const ingredientRows = computed(() => props.item.ingredients.map((ing) => ({
    ...ing,
    herb: HERBS.find((x) => x.id === ing.herbId),
})));
</script>

<template>
    <div style="flex: 1; padding: 20px 24px; min-width: 0">
        <!-- header: patient + type badge -->
        <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap">
            <PatientLine :name="item.patient" :phone="item.phone" />
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: flex-end">
                <TypeBadge kind="formula" />
                <span
                    v-if="item.sample"
                    :style="{
                        padding: '5px 12px', borderRadius: '999px',
                        border: '1px dashed var(--line-strong)', color: 'var(--ink-3)',
                        fontSize: '12px', fontWeight: 500, whiteSpace: 'nowrap',
                    }"
                >
                    דוגמא · {{ item.dosage }}
                </span>
            </div>
        </div>

        <!-- name + preparation meta (type · volume · evaporation · route) -->
        <h3 style="margin: 12px 0 0; font-size: 18px; font-weight: 600">{{ item.name }}</h3>
        <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 8px">
            <span
                :style="{
                    display: 'inline-flex', alignItems: 'center',
                    padding: '3px 10px', borderRadius: '999px',
                    background: 'var(--accent-tint)', color: 'var(--accent-ink)',
                    fontSize: '12px', fontWeight: 600,
                }"
            >{{ ftype.heb }}</span>
            <span v-if="item.typeNote" class="small muted" style="font-size: 12px">{{ item.typeNote }}</span>
            <span class="small muted num" style="font-size: 12px">{{ item.vol }}</span>
            <span
                v-if="item.route"
                :style="{
                    display: 'inline-flex', padding: '3px 10px', borderRadius: '999px',
                    background: '#fbf3e3', color: 'var(--warning)',
                    border: '1px solid #ecd9b0', fontSize: '11.5px', fontWeight: 600,
                }"
            >{{ item.route }}</span>
        </div>

        <!-- ingredients — the heart of a formula, shown clearly -->
        <div style="margin-top: 16px">
            <div class="field-label" style="margin-bottom: 6px">
                רכיבים · <span class="num">{{ ingredientRows.length }}</span>
            </div>
            <div style="display: flex; flex-direction: column; max-width: 540px">
                <div
                    v-for="(ing, i) in ingredientRows"
                    :key="i"
                    :style="{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
                        padding: '7px 0',
                        borderBottom: i === ingredientRows.length - 1 ? 'none' : '1px solid var(--line)',
                    }"
                >
                    <span style="display: flex; align-items: baseline; gap: 8px; min-width: 0">
                        <span style="font-size: 14px; font-weight: 600; color: var(--ink)">{{ ing.herb.heb }}</span>
                        <span class="small muted latin" style="font-size: 11.5px; font-style: italic">{{ ing.herb.lat }}</span>
                    </span>
                    <span
                        class="num"
                        :style="{
                            flexShrink: 0, padding: '2px 10px', borderRadius: '999px',
                            background: 'var(--accent-tint-strong)', color: 'var(--accent-ink)',
                            fontSize: '12px', fontWeight: 700,
                        }"
                    >{{ ing.pct.toFixed(1) }}%</span>
                </div>
            </div>
        </div>

        <!-- pharmacy note -->
        <div class="small" style="margin-top: 14px; color: var(--ink-3)">
            <span style="font-weight: 600">הוראות לבית המרקחת:</span>{{ ' ' }}
            <span :style="{ color: item.pharmacyNote === 'אין' ? 'var(--ink-4)' : 'var(--ink-2)' }">
                {{ item.pharmacyNote }}
            </span>
        </div>
    </div>
</template>
