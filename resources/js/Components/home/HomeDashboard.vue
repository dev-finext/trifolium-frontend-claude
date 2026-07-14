<script setup>
// Practitioner Dashboard — recent orders with filters & search.
import { ref, computed } from 'vue';
import { HOME_ORDERS } from '@/data/mock';
import { visit } from '@/lib/routes';
import { buildOrderFromRow, setLastOrder } from '@/lib/orders';
import Icon from '@/Components/ui/Icon.vue';
import SearchInput from '@/Components/ui/SearchInput.vue';
import StatusDot from '@/Components/ui/StatusDot.vue';
import EmptyState from '@/Components/home/EmptyState.vue';
import ReorderSheet from '@/Components/home/ReorderSheet.vue';

const STATUS_FILTERS = [
    { id: 'all', label: 'הכל' },
    { id: 'ממתין לתשלום', label: 'בהמתנה' },
    { id: 'בהכנה', label: 'בהכנה' },
    { id: 'נשלח', label: 'נשלח' },
    { id: 'הושלם', label: 'הושלם' },
];

const HEADERS = ['מטופל', 'פורמולה', 'סוג', 'תאריך', 'סטטוס', 'פעולות'];

const props = defineProps({
    orders: { type: Array, default: () => HOME_ORDERS },
});

const filter = ref('all');
const search = ref('');
const hoverId = ref(null);
const reorder = ref(null);

const filtered = computed(() => props.orders.filter((o) => {
    if (filter.value !== 'all' && o.status !== filter.value) return false;
    if (search.value) {
        const q = search.value.trim();
        if (!o.patient.includes(q) && !o.formula.includes(q)) return false;
    }
    return true;
}));

const visible = computed(() => filtered.value.slice(0, 5));

// Replaces the prototype's window.TF_buildOrderFromRow + window.__tfLastOrder
// hand-off before navigating to the order detail page.
function viewOrder(o) {
    setLastOrder(buildOrderFromRow(o));
    visit('order', { id: o.id });
}
</script>

<template>
    <section style="padding: 28px 24px 56px">
        <div style="max-width: 1200px; margin: 0 auto">
            <div class="card" style="padding: 24px">

                <!-- Header row -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 18px">
                    <h2 style="font-size: 20px; font-weight: 600; letter-spacing: -0.01em; margin: 0">הזמנות אחרונות</h2>
                    <a style="font-size: 13px; color: var(--ink-2); cursor: pointer; font-weight: 500" @click="visit('orders')">
                        לכל ההזמנות ←
                    </a>
                </div>

                <!-- Controls -->
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 18px; flex-wrap: wrap">
                    <div style="display: flex; gap: 6px; flex-wrap: wrap">
                        <button
                            v-for="f in STATUS_FILTERS"
                            :key="f.id"
                            :class="`tag${filter === f.id ? ' tag--selected' : ''}`"
                            style="background-color: rgb(255, 255, 255); color: rgb(0, 0, 0)"
                            @click="filter = f.id"
                        >
                            <Icon v-if="filter === f.id" name="check" :size="12" color="#fff" />
                            {{ f.label }}
                        </button>
                    </div>
                    <div style="width: 280px">
                        <SearchInput v-model="search" placeholder="חפש לפי שם מטופל או פורמולה" />
                    </div>
                </div>

                <!-- Table -->
                <EmptyState
                    v-if="visible.length === 0"
                    :has-filter="filter !== 'all' || !!search"
                    @action="visit('compounding')"
                />
                <div v-else style="border: 1px solid var(--line); border-radius: var(--r-card); overflow: hidden">
                    <table style="width: 100%; border-collapse: collapse; table-layout: fixed">
                        <colgroup>
                            <col style="width: 140px" />
                            <col />
                            <col style="width: 90px" />
                            <col style="width: 130px" />
                            <col style="width: 140px" />
                            <col style="width: 150px" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th
                                    v-for="h in HEADERS"
                                    :key="h"
                                    :style="{
                                        textAlign: 'right',
                                        padding: '12px 16px',
                                        fontSize: '11px',
                                        letterSpacing: '0.08em',
                                        textTransform: 'uppercase',
                                        color: 'var(--ink-3)',
                                        fontWeight: 600,
                                        borderBottom: '1px solid var(--line)',
                                        background: 'var(--surface-sunk)',
                                    }"
                                >{{ h }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(o, i) in visible"
                                :key="o.id"
                                :style="{
                                    background: hoverId === o.id ? 'var(--accent-tint)' : 'transparent',
                                    borderBottom: i === visible.length - 1 ? 'none' : '1px solid var(--line)',
                                    transition: 'background .12s ease',
                                }"
                                @mouseenter="hoverId = o.id"
                                @mouseleave="hoverId = null"
                            >
                                <td style="padding: 14px 16px; font-size: 14px; font-weight: 500">
                                    {{ o.patient }}
                                </td>
                                <td style="padding: 14px 16px; font-size: 14px; color: var(--ink-2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
                                    {{ o.formula }}
                                </td>
                                <td style="padding: 14px 16px; font-size: 13px; color: var(--ink-3)">
                                    {{ o.type }}
                                </td>
                                <td class="num" style="padding: 14px 16px; font-size: 13px; color: var(--ink-3)">
                                    {{ o.date }}
                                </td>
                                <td style="padding: 14px 16px">
                                    <StatusDot :tone="o.dot">{{ o.status }}</StatusDot>
                                </td>
                                <td style="padding: 14px 16px">
                                    <span style="display: flex; gap: 14px; font-size: 13px; white-space: nowrap">
                                        <a style="color: var(--ink-2); cursor: pointer" @click="viewOrder(o)">צפה</a>
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Footer -->
                <div v-if="visible.length > 0" style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px">
                    <span class="small muted">
                        מציג <span class="num">{{ visible.length }}</span> מתוך <span class="num">{{ orders.length }}</span> הזמנות
                    </span>
                </div>
            </div>
        </div>

        <ReorderSheet v-if="reorder" :order="reorder" @close="reorder = null" />
    </section>
</template>
