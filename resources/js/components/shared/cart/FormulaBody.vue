<script setup>
// Custom-formula cart line. No product image (a compounded formula has none) —
// the ingredient breakdown is the content that matters, so it leads: each herb
// with its botanical name and its share of the mix, on divided rows.
import { computed } from 'vue';
import PatientLine from '@/components/shared/cart/PatientLine.vue';
import TypeBadge from '@/components/shared/cart/TypeBadge.vue';
import { FORMULA_TYPES, HERBS } from '@/data/mock';

const props = defineProps({
    item: { type: Object, required: true },
});

const ftype = computed(() =>
    FORMULA_TYPES.find((t) => t.id === props.item.typeId),
);
// Resolve each ingredient's herb record once for the template loop.
const ingredientRows = computed(() =>
    props.item.ingredients.map((ing) => ({
        ...ing,
        herb: HERBS.find((x) => x.id === ing.herbId),
    })),
);
</script>

<template>
    <div class="min-w-0 flex-1 px-[24px] py-[20px]">
        <!-- header: patient + type badge -->
        <div class="flex flex-wrap items-start justify-between gap-[12px]">
            <PatientLine :name="item.patient" :phone="item.phone" />
            <div class="flex flex-wrap items-center justify-end gap-[8px]">
                <TypeBadge kind="formula" />
                <span
                    v-if="item.sample"
                    class="rounded-[999px] border border-dashed border-line-strong px-[12px] py-[5px] text-[12px] font-medium whitespace-nowrap text-ink-3"
                >
                    דוגמא · {{ item.dosage }}
                </span>
            </div>
        </div>

        <!-- name + preparation meta (type · volume · evaporation · route) -->
        <h3 class="m-0 mt-[12px] text-[18px] font-semibold">{{ item.name }}</h3>
        <div class="mt-[8px] flex flex-wrap items-center gap-[8px]">
            <span
                class="inline-flex items-center rounded-[999px] bg-accent-tint px-[10px] py-[3px] text-[12px] font-semibold text-accent-ink"
                >{{ ftype.heb }}</span
            >
            <span v-if="item.typeNote" class="small muted text-[12px]">{{
                item.typeNote
            }}</span>
            <span class="small muted num text-[12px]">{{ item.vol }}</span>
            <span
                v-if="item.route"
                class="inline-flex rounded-[999px] border border-[#ecd9b0] bg-[#fbf3e3] px-[10px] py-[3px] text-[11.5px] font-semibold text-warning"
                >{{ item.route }}</span
            >
        </div>

        <!-- ingredients — the heart of a formula, shown clearly -->
        <div class="mt-[16px]">
            <div class="field-label mb-[6px]">
                רכיבים · <span class="num">{{ ingredientRows.length }}</span>
            </div>
            <div class="flex max-w-[540px] flex-col">
                <div
                    v-for="(ing, i) in ingredientRows"
                    :key="i"
                    class="flex items-center justify-between gap-[12px] px-0 py-[7px]"
                    :class="
                        i === ingredientRows.length - 1
                            ? 'border-b-0'
                            : 'border-b border-line'
                    "
                >
                    <span class="flex min-w-0 items-baseline gap-[8px]">
                        <span class="text-[14px] font-semibold text-ink">{{
                            ing.herb.heb
                        }}</span>
                        <span class="small muted latin text-[11.5px] italic">{{
                            ing.herb.lat
                        }}</span>
                    </span>
                    <span
                        class="num shrink-0 rounded-[999px] bg-accent-tint-strong px-[10px] py-[2px] text-[12px] font-bold text-accent-ink"
                        >{{ ing.pct.toFixed(1) }}%</span
                    >
                </div>
            </div>
        </div>

        <!-- pharmacy note -->
        <div class="small mt-[14px] text-ink-3">
            <span class="font-semibold">הוראות לבית המרקחת:</span>{{ ' ' }}
            <span
                :class="
                    item.pharmacyNote === 'אין' ? 'text-ink-4' : 'text-ink-2'
                "
            >
                {{ item.pharmacyNote }}
            </span>
        </div>
    </div>
</template>
