<script setup>
// Detail panel for a free-pour shelf product (locked base, choose your volume).
import { computed } from 'vue';
import { HERBS, FORMULA_TYPES } from '@/data/mock';

const props = defineProps({
    f: { type: Object, required: true },
});

const ftype = computed(() => FORMULA_TYPES.find((t) => t.id === props.f.typeId));
const totalParts = computed(() => props.f.ingredients.reduce((s, i) => s + (+i.parts || 0), 0) || 1);
const rows = computed(() => props.f.ingredients.map((ing) => ({
    ing,
    herb: HERBS.find((h) => h.id === ing.herbId),
    pct: Math.round((+ing.parts || 0) / totalParts.value * 1000) / 10,
})));
</script>

<template>
    <div>
        <div style="margin-bottom: 20px">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px; flex-wrap: wrap">
                <h2 style="margin: 0; font-size: 21px; font-weight: 700; color: var(--ink)">{{ f.name }}</h2>
                <span v-if="ftype" style="font-size: 11.5px; font-weight: 600; color: var(--ink-2); background: var(--surface-sunk); border: 1px solid var(--line); border-radius: 999px; padding: 2px 10px">
                    {{ ftype.heb }}
                </span>
                <span v-if="f.shelfVol" style="font-size: 11.5px; font-weight: 600; color: var(--ink-3)">נפח מדף: {{ f.shelfVol }}</span>
            </div>
            <div style="padding: 10px 14px; background: var(--accent-tint); border: 1px solid var(--accent); border-radius: var(--r-control); font-size: 13.5px; color: var(--accent-ink); font-weight: 600; line-height: 1.5">
                {{ f.indication }}
            </div>
        </div>

        <div style="border-radius: var(--r-card); border: 1px solid var(--line); overflow: hidden">
            <div style="background: var(--surface-sunk); padding: 8px 16px; border-bottom: 1px solid var(--line); font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-3)">
                הרכב הפורמולה
            </div>
            <div
                v-for="(r, i) in rows" :key="r.ing.herbId"
                :style="{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '9px 16px',
                    borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--line)',
                    background: i % 2 === 0 ? 'transparent' : 'var(--surface-sunk)',
                }"
            >
                <span style="font-size: 12px; color: var(--ink-4); width: 18px; text-align: center; flex-shrink: 0">{{ i + 1 }}</span>
                <div style="flex: 1; min-width: 0">
                    <div style="display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap">
                        <span style="font-size: 14px; font-weight: 600; color: var(--ink)">{{ r.herb ? r.herb.heb : r.ing.herbId }}</span>
                        <span v-if="r.herb && r.herb.lat" style="font-size: 12px; font-style: italic; color: var(--ink-3); font-family: var(--font-latin)">{{ r.herb.lat }}</span>
                    </div>
                </div>
                <span class="num" style="font-size: 13px; color: var(--ink-3); flex-shrink: 0">{{ r.pct }}%</span>
            </div>
        </div>

        <div style="margin-top: 14px; display: flex; align-items: flex-start; gap: 7px; font-size: 12.5px; color: var(--ink-3); line-height: 1.6">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="margin-top: 2px; flex-shrink: 0">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            המוצר נטען כבסיס נעול — בחר את הנפח הרצוי במזיגה חופשית. ניתן להוסיף רכיבים נוספים מעל הבסיס, אך הרכב המוצר נעול לשינוי.
        </div>
    </div>
</template>
