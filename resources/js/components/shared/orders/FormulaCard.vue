<script setup>
// Formula card with ingredient table.
defineProps({
    /** The order's formula block: name, typeHeb, totalVol, unit, ingredients */
    f: { type: Object, required: true },
});
</script>

<template>
    <div class="card">
        <div class="flex justify-between items-start gap-[16px] flex-wrap p-[24px] border-b border-b-line">
            <div>
                <div class="field-label">פורמולה</div>
                <h2 class="mt-[4px] mx-0 mb-0 text-[22px] font-semibold">
                    <template v-if="f.name">{{ f.name }}</template>
                    <span v-else class="muted">— ללא שם —</span>
                </h2>
                <div class="small muted mt-[8px] flex gap-[14px] flex-wrap">
                    <span><strong>סוג:</strong> {{ f.typeHeb }}</span>
                    <span><strong>נפח:</strong> {{ f.totalVol }}</span>
                    <span><strong>רכיבים:</strong> <span class="num">{{ f.ingredients.length }}</span></span>
                </div>
            </div>
        </div>

        <table class="w-full border-collapse">
            <thead>
                <tr>
                    <th
                        v-for="(h, i) in ['#', 'שם רכיב', 'כמות', '%']"
                        :key="i"
                        class="py-[10px] px-[24px] text-right text-[11px] tracking-[0.06em] uppercase font-semibold text-ink-3 bg-surface-sunk border-b border-b-line"
                    >{{ h }}</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(row, i) in f.ingredients"
                    :key="i"
                    :class="i === f.ingredients.length - 1 ? 'border-b-0' : 'border-b border-b-line'"
                >
                    <td class="num muted py-[12px] px-[24px]">{{ i + 1 }}</td>
                    <td class="py-[12px] px-[24px]">
                        <div class="text-[14px] font-medium">{{ row.heb }}</div>
                        <div class="small muted latin text-[11px] italic">{{ row.lat }}</div>
                    </td>
                    <td class="num py-[12px] px-[24px] text-[13px]">{{ row.qty }} {{ f.unit }}</td>
                    <td class="num py-[12px] px-[24px] text-[13px] text-ink-2">{{ row.pct.toFixed(1) }}%</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
