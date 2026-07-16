<script setup>
// Detail panel for a classic-Chinese preset — parts-based composition, locked.
import { computed } from 'vue';
import { HERBS } from '@/data/mock';

const props = defineProps({
    preset: { type: Object, required: true },
});

const totalParts = computed(() =>
    props.preset.ingredients.reduce((s, i) => s + i.parts, 0),
);
// Resolve + filter out any unknown herbs (source returns null for those).
const rows = computed(() =>
    props.preset.ingredients
        .map((ing) => ({ ing, herb: HERBS.find((h) => h.id === ing.herbId) }))
        .filter((r) => r.herb),
);
</script>

<template>
    <div>
        <div class="mb-[20px]">
            <div class="mb-[8px] flex flex-wrap items-baseline gap-[12px]">
                <h2
                    class="m-0 font-latin text-[21px] font-bold text-ink italic"
                >
                    {{ preset.nameEn }}
                </h2>
                <span class="font-latin text-[13.5px] text-ink-3">{{
                    preset.namePinyin
                }}</span>
                <span class="[font-family:serif] text-[19px] text-ink-2">{{
                    preset.nameZh
                }}</span>
            </div>
            <div class="mb-[12px] text-[12.5px] text-ink-3">
                <span class="font-semibold text-ink-2">מקור: </span
                >{{ preset.source }}
            </div>
            <div
                class="rounded-control border border-accent bg-accent-tint px-[14px] py-[10px] text-[13.5px] leading-[1.5] font-semibold text-accent-ink"
            >
                {{ preset.indication }}
            </div>
        </div>

        <div class="overflow-hidden rounded-card border border-line">
            <div
                class="border-b border-line bg-surface-sunk px-[16px] py-[8px] text-[11px] font-bold tracking-[0.1em] text-ink-3 uppercase"
            >
                הרכב הפורמולה
            </div>
            <div
                v-for="(r, i) in rows"
                :key="r.ing.herbId"
                dir="ltr"
                class="flex items-center gap-[12px] px-[16px] py-[9px]"
                :class="[
                    i === rows.length - 1 ? '' : 'border-b border-line',
                    i % 2 === 0 ? 'bg-transparent' : 'bg-surface-sunk',
                ]"
            >
                <span
                    class="w-[18px] shrink-0 text-center text-[12px] text-ink-4"
                    >{{ i + 1 }}</span
                >
                <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-baseline gap-[7px]">
                        <span
                            class="font-latin text-[14px] font-semibold text-ink italic"
                            >{{ r.herb.lat }}</span
                        >
                        <span
                            v-if="r.herb.cn"
                            class="[font-family:serif] text-[12.5px] text-ink-3"
                            >{{ r.herb.cn.split(' · ')[0] }}</span
                        >
                        <span class="text-[12.5px] text-ink-3"
                            >| {{ r.herb.heb }}</span
                        >
                    </div>
                </div>
                <span class="num shrink-0 text-[16px] font-bold text-ink">{{
                    r.ing.parts
                }}</span>
            </div>
            <div
                dir="ltr"
                class="flex items-center justify-between border-t-2 border-t-line bg-surface-sunk px-[16px] py-[9px]"
            >
                <span class="text-[12.5px] font-bold text-ink-2">Total</span>
                <span class="num text-[16px] font-bold text-ink">{{
                    totalParts
                }}</span>
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
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
            </svg>
            לאחר הטעינה ניתן להוסיף רכיבים נוספים ולשנות את יחסיהם בלבד. יחסי
            הבסיס נעולים.
        </div>
    </div>
</template>
