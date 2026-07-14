<script setup>
// Custom-formula card body.
import { computed } from 'vue';
import { FORMULA_TYPES, HERBS } from '@/data/mock';
import FormulaGlyph from '@/Components/cart/FormulaGlyph.vue';
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
    <div style="flex: 1; padding: 24px; display: flex; gap: 22px; align-items: flex-start">
        <!-- bottle illustration + caption -->
        <div style="width: 124px; flex-shrink: 0; text-align: center">
            <div
                :style="{
                    height: '132px', borderRadius: 'var(--r-card)',
                    background: 'var(--surface-sunk)', border: '1px solid var(--line)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }"
            >
                <FormulaGlyph :type-id="item.typeId" />
            </div>
            <div style="font-size: 13px; font-weight: 600; margin-top: 10px">{{ ftype.heb }}</div>
            <div v-if="item.typeNote" class="small muted" style="font-size: 11.5px">({{ item.typeNote }})</div>
            <div class="small muted num" style="font-size: 11.5px">{{ item.vol }}</div>
            <span
                v-if="item.route"
                :style="{
                    display: 'inline-flex', marginTop: '8px', padding: '3px 12px',
                    borderRadius: '999px', background: '#fbf3e3', color: 'var(--warning)',
                    border: '1px solid #ecd9b0', fontSize: '11.5px', fontWeight: 600,
                }"
            >{{ item.route }}</span>
        </div>

        <!-- details -->
        <div style="flex: 1; min-width: 0">
            <!-- patient header -->
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

            <h3 style="margin: 14px 0 0; font-size: 18px; font-weight: 600">{{ item.name }}</h3>

            <!-- ingredients -->
            <div style="margin-top: 12px">
                <div class="field-label" style="margin-bottom: 8px">רכיבים</div>
                <div style="display: flex; flex-direction: column; gap: 7px; max-width: 460px">
                    <div
                        v-for="(ing, i) in ingredientRows"
                        :key="i"
                        style="display: flex; align-items: center; justify-content: space-between; gap: 12px"
                    >
                        <span style="display: flex; align-items: baseline; gap: 8px; min-width: 0">
                            <span style="font-size: 13.5px; font-weight: 500">{{ ing.herb.heb }}</span>
                            <span class="small muted latin" style="font-size: 11px; font-style: italic">{{ ing.herb.lat }}</span>
                        </span>
                        <span
                            class="num"
                            :style="{
                                flexShrink: 0, padding: '2px 10px', borderRadius: '999px',
                                background: 'var(--accent-tint-strong)', color: 'var(--accent-ink)',
                                fontSize: '12px', fontWeight: 600,
                            }"
                        >{{ ing.pct.toFixed(2) }}%</span>
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
    </div>
</template>
