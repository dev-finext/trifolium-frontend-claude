<script setup>
// Detail panel for a free-pour shelf product (locked base, choose your volume).
import { computed } from 'vue';
import { HERBS, FORMULA_TYPES } from '@/data/mock';

const props = defineProps({
    f: { type: Object, required: true },
});

const ftype = computed(() =>
    FORMULA_TYPES.find((t) => t.id === props.f.typeId),
);
const totalParts = computed(
    () => props.f.ingredients.reduce((s, i) => s + (+i.parts || 0), 0) || 1,
);
const rows = computed(() =>
    props.f.ingredients.map((ing) => ({
        ing,
        herb: HERBS.find((h) => h.id === ing.herbId),
        pct: Math.round(((+ing.parts || 0) / totalParts.value) * 1000) / 10,
    })),
);
</script>

<template>
    <div>
        <div class="mb-[20px]">
            <div class="mb-[8px] flex flex-wrap items-center gap-[10px]">
                <h2 class="m-0 text-[21px] font-bold text-ink">{{ f.name }}</h2>
                <span
                    v-if="ftype"
                    class="rounded-[999px] border border-line bg-surface-sunk px-[10px] py-[2px] text-[11.5px] font-semibold text-ink-2"
                >
                    {{ ftype.heb }}
                </span>
                <span
                    v-if="f.shelfVol"
                    class="text-[11.5px] font-semibold text-ink-3"
                    >נפח מדף: {{ f.shelfVol }}</span
                >
            </div>
            <div
                class="rounded-control border border-accent bg-accent-tint px-[14px] py-[10px] text-[13.5px] leading-[1.5] font-semibold text-accent-ink"
            >
                {{ f.indication }}
            </div>
        </div>

        <div class="overflow-hidden rounded-card border border-line">
            <div
                class="border-b border-b-line bg-surface-sunk px-[16px] py-[8px] text-[11px] font-bold tracking-[0.1em] text-ink-3 uppercase"
            >
                הרכב הפורמולה
            </div>
            <div
                v-for="(r, i) in rows"
                :key="r.ing.herbId"
                class="flex items-center gap-[12px] px-[16px] py-[9px]"
                :class="[
                    i === rows.length - 1 ? '' : 'border-b border-b-line',
                    i % 2 === 0 ? 'bg-transparent' : 'bg-surface-sunk',
                ]"
            >
                <span
                    class="w-[18px] shrink-0 text-center text-[12px] text-ink-4"
                    >{{ i + 1 }}</span
                >
                <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-baseline gap-[8px]">
                        <span class="text-[14px] font-semibold text-ink">{{
                            r.herb ? r.herb.heb : r.ing.herbId
                        }}</span>
                        <span
                            v-if="r.herb && r.herb.lat"
                            class="font-latin text-[12px] text-ink-3 italic"
                            >{{ r.herb.lat }}</span
                        >
                    </div>
                </div>
                <span class="num shrink-0 text-[13px] text-ink-3"
                    >{{ r.pct }}%</span
                >
            </div>
        </div>

        <div
            class="mt-[14px] flex items-start gap-[7px] text-[12.5px] leading-[1.6] text-ink-3"
        >
            <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="mt-[2px] shrink-0"
            >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            המוצר נטען כבסיס נעול — בחר את הנפח הרצוי במזיגה חופשית. ניתן להוסיף
            רכיבים נוספים מעל הבסיס, אך הרכב המוצר נעול לשינוי.
        </div>
    </div>
</template>
