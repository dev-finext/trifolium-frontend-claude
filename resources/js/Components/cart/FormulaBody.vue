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
    <div class="flex-1 min-w-0 px-[24px] py-[20px]">
        <!-- header: patient + type badge -->
        <div class="flex items-start justify-between gap-[12px] flex-wrap">
            <PatientLine :name="item.patient" :phone="item.phone" />
            <div class="flex items-center justify-end gap-[8px] flex-wrap">
                <TypeBadge kind="formula" />
                <span
                    v-if="item.sample"
                    class="px-[12px] py-[5px] text-[12px] font-medium whitespace-nowrap text-ink-3 border border-dashed border-line-strong rounded-[999px]"
                >
                    דוגמא · {{ item.dosage }}
                </span>
            </div>
        </div>

        <!-- name + preparation meta (type · volume · evaporation · route) -->
        <h3 class="m-0 mt-[12px] text-[18px] font-semibold">{{ item.name }}</h3>
        <div class="flex flex-wrap items-center gap-[8px] mt-[8px]">
            <span
                class="inline-flex items-center px-[10px] py-[3px] text-[12px] font-semibold text-accent-ink bg-accent-tint rounded-[999px]"
            >{{ ftype.heb }}</span>
            <span v-if="item.typeNote" class="small muted text-[12px]">{{ item.typeNote }}</span>
            <span class="small muted num text-[12px]">{{ item.vol }}</span>
            <span
                v-if="item.route"
                class="inline-flex px-[10px] py-[3px] text-[11.5px] font-semibold text-warning bg-[#fbf3e3] border border-[#ecd9b0] rounded-[999px]"
            >{{ item.route }}</span>
        </div>

        <!-- ingredients — the heart of a formula, shown clearly -->
        <div class="mt-[16px]">
            <div class="field-label mb-[6px]">
                רכיבים · <span class="num">{{ ingredientRows.length }}</span>
            </div>
            <div class="flex flex-col max-w-[540px]">
                <div
                    v-for="(ing, i) in ingredientRows"
                    :key="i"
                    class="flex items-center justify-between gap-[12px] px-0 py-[7px]"
                    :class="i === ingredientRows.length - 1 ? 'border-b-0' : 'border-b border-line'"
                >
                    <span class="flex items-baseline gap-[8px] min-w-0">
                        <span class="text-[14px] font-semibold text-ink">{{ ing.herb.heb }}</span>
                        <span class="small muted latin text-[11.5px] italic">{{ ing.herb.lat }}</span>
                    </span>
                    <span
                        class="num shrink-0 px-[10px] py-[2px] text-[12px] font-bold text-accent-ink bg-accent-tint-strong rounded-[999px]"
                    >{{ ing.pct.toFixed(1) }}%</span>
                </div>
            </div>
        </div>

        <!-- pharmacy note -->
        <div class="small mt-[14px] text-ink-3">
            <span class="font-semibold">הוראות לבית המרקחת:</span>{{ ' ' }}
            <span :class="item.pharmacyNote === 'אין' ? 'text-ink-4' : 'text-ink-2'">
                {{ item.pharmacyNote }}
            </span>
        </div>
    </div>
</template>
