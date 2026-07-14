<script setup>
// Detail panel for a classic-Chinese preset — parts-based composition, locked.
import { computed } from 'vue';
import { HERBS } from '@/data/mock';

const props = defineProps({
    preset: { type: Object, required: true },
});

const totalParts = computed(() => props.preset.ingredients.reduce((s, i) => s + i.parts, 0));
// Resolve + filter out any unknown herbs (source returns null for those).
const rows = computed(() => props.preset.ingredients
    .map((ing) => ({ ing, herb: HERBS.find((h) => h.id === ing.herbId) }))
    .filter((r) => r.herb));
</script>

<template>
    <div>
        <div style="margin-bottom: 20px">
            <div style="display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; margin-bottom: 8px">
                <h2 style="margin: 0; font-size: 21px; font-weight: 700; color: var(--ink); font-family: var(--font-latin); font-style: italic">{{ preset.nameEn }}</h2>
                <span style="font-size: 13.5px; color: var(--ink-3); font-family: var(--font-latin)">{{ preset.namePinyin }}</span>
                <span style="font-size: 19px; font-family: serif; color: var(--ink-2)">{{ preset.nameZh }}</span>
            </div>
            <div style="font-size: 12.5px; color: var(--ink-3); margin-bottom: 12px">
                <span style="font-weight: 600; color: var(--ink-2)">מקור: </span>{{ preset.source }}
            </div>
            <div style="padding: 10px 14px; background: var(--accent-tint); border: 1px solid var(--accent); border-radius: var(--r-control); font-size: 13.5px; color: var(--accent-ink); font-weight: 600; line-height: 1.5">
                {{ preset.indication }}
            </div>
        </div>

        <div style="border-radius: var(--r-card); border: 1px solid var(--line); overflow: hidden">
            <div style="background: var(--surface-sunk); padding: 8px 16px; border-bottom: 1px solid var(--line); font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-3)">
                הרכב הפורמולה
            </div>
            <div
                v-for="(r, i) in rows" :key="r.ing.herbId"
                dir="ltr"
                :style="{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '9px 16px',
                    borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--line)',
                    background: i % 2 === 0 ? 'transparent' : 'var(--surface-sunk)',
                }"
            >
                <span style="font-size: 12px; color: var(--ink-4); width: 18px; text-align: center; flex-shrink: 0">{{ i + 1 }}</span>
                <div style="flex: 1; min-width: 0">
                    <div style="display: flex; align-items: baseline; gap: 7px; flex-wrap: wrap">
                        <span style="font-size: 14px; font-weight: 600; font-style: italic; font-family: var(--font-latin); color: var(--ink)">{{ r.herb.lat }}</span>
                        <span v-if="r.herb.cn" style="font-size: 12.5px; color: var(--ink-3); font-family: serif">{{ r.herb.cn.split(' · ')[0] }}</span>
                        <span style="font-size: 12.5px; color: var(--ink-3)">| {{ r.herb.heb }}</span>
                    </div>
                </div>
                <span class="num" style="font-size: 16px; font-weight: 700; color: var(--ink); flex-shrink: 0">{{ r.ing.parts }}</span>
            </div>
            <div dir="ltr" style="display: flex; align-items: center; justify-content: space-between; padding: 9px 16px; background: var(--surface-sunk); border-top: 2px solid var(--line)">
                <span style="font-size: 12.5px; font-weight: 700; color: var(--ink-2)">Total</span>
                <span class="num" style="font-size: 16px; font-weight: 700; color: var(--ink)">{{ totalParts }}</span>
            </div>
        </div>

        <div style="margin-top: 14px; display: flex; align-items: flex-start; gap: 7px; font-size: 12.5px; color: var(--ink-3); line-height: 1.6">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="margin-top: 2px; flex-shrink: 0">
                <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
            </svg>
            לאחר הטעינה ניתן להוסיף רכיבים נוספים ולשנות את יחסיהם בלבד. יחסי הבסיס נעולים.
        </div>
    </div>
</template>
