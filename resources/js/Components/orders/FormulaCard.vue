<script setup>
// Formula card with ingredient table.
defineProps({
    /** The order's formula block: name, typeHeb, totalVol, unit, ingredients */
    f: { type: Object, required: true },
});
</script>

<template>
    <div class="card">
        <div style="padding: 24px; border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap">
            <div>
                <div class="field-label">פורמולה</div>
                <h2 style="margin: 4px 0 0; font-size: 22px; font-weight: 600">
                    <template v-if="f.name">{{ f.name }}</template>
                    <span v-else class="muted">— ללא שם —</span>
                </h2>
                <div class="small muted mt-8" style="display: flex; gap: 14px; flex-wrap: wrap">
                    <span><strong>סוג:</strong> {{ f.typeHeb }}</span>
                    <span><strong>נפח:</strong> {{ f.totalVol }}</span>
                    <span><strong>רכיבים:</strong> <span class="num">{{ f.ingredients.length }}</span></span>
                </div>
            </div>
        </div>

        <table style="width: 100%; border-collapse: collapse">
            <thead>
                <tr>
                    <th
                        v-for="(h, i) in ['#', 'שם רכיב', 'כמות', '%']"
                        :key="i"
                        style="text-align: right; padding: 10px 24px; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-3); font-weight: 600; border-bottom: 1px solid var(--line); background: var(--surface-sunk)"
                    >{{ h }}</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(row, i) in f.ingredients"
                    :key="i"
                    :style="{ borderBottom: i === f.ingredients.length - 1 ? 'none' : '1px solid var(--line)' }"
                >
                    <td style="padding: 12px 24px" class="num muted">{{ i + 1 }}</td>
                    <td style="padding: 12px 24px">
                        <div style="font-size: 14px; font-weight: 500">{{ row.heb }}</div>
                        <div class="small muted latin" style="font-size: 11px; font-style: italic">{{ row.lat }}</div>
                    </td>
                    <td style="padding: 12px 24px; font-size: 13px" class="num">{{ row.qty }} {{ f.unit }}</td>
                    <td style="padding: 12px 24px; font-size: 13px; color: var(--ink-2)" class="num">{{ row.pct.toFixed(1) }}%</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
