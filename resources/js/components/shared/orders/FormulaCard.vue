<script setup>
// Formula card with ingredient table.
defineProps({
    /** The order's formula block: name, typeHeb, totalVol, unit, ingredients */
    f: { type: Object, required: true },
});
</script>

<template>
    <div class="card">
        <div
            class="flex flex-wrap items-start justify-between gap-[16px] border-b border-b-line p-[24px]"
        >
            <div>
                <div class="field-label">פורמולה</div>
                <h2 class="mx-0 mt-[4px] mb-0 text-[22px] font-semibold">
                    <template v-if="f.name">{{ f.name }}</template>
                    <span v-else class="muted">— ללא שם —</span>
                </h2>
                <div class="small muted mt-[8px] flex flex-wrap gap-[14px]">
                    <span><strong>סוג:</strong> {{ f.typeHeb }}</span>
                    <span><strong>נפח:</strong> {{ f.totalVol }}</span>
                    <span
                        ><strong>רכיבים:</strong>
                        <span class="num">{{
                            f.ingredients.length
                        }}</span></span
                    >
                </div>
            </div>
        </div>

        <table class="w-full border-collapse">
            <thead>
                <tr>
                    <th
                        v-for="(h, i) in ['#', 'שם רכיב', 'כמות', '%']"
                        :key="i"
                        class="border-b border-b-line bg-surface-sunk px-[24px] py-[10px] text-right text-[11px] font-semibold tracking-[0.06em] text-ink-3 uppercase"
                    >
                        {{ h }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(row, i) in f.ingredients"
                    :key="i"
                    :class="
                        i === f.ingredients.length - 1
                            ? 'border-b-0'
                            : 'border-b border-b-line'
                    "
                >
                    <td class="num muted px-[24px] py-[12px]">{{ i + 1 }}</td>
                    <td class="px-[24px] py-[12px]">
                        <div class="text-[14px] font-medium">{{ row.heb }}</div>
                        <div class="small muted latin text-[11px] italic">
                            {{ row.lat }}
                        </div>
                    </td>
                    <td class="num px-[24px] py-[12px] text-[13px]">
                        {{ row.qty }} {{ f.unit }}
                    </td>
                    <td class="num px-[24px] py-[12px] text-[13px] text-ink-2">
                        {{ row.pct.toFixed(1) }}%
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
