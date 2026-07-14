<script setup>
// All Orders — a focused mini-dashboard listing every recent order for the
// practitioner, with KPI tiles, status/type/search filters, and per-row view.
// Reuses the same row→order builder as the home dashboard.
import { computed, ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import Icon from '@/Components/ui/Icon.vue';
import Field from '@/Components/ui/Field.vue';
import SearchInput from '@/Components/ui/SearchInput.vue';
import StatusDot from '@/Components/ui/StatusDot.vue';
import KpiTile from '@/Components/orders/KpiTile.vue';
import { visit } from '@/lib/routes';
import { buildOrderFromRow, setLastOrder } from '@/lib/orders';
import { HOME_ORDERS } from '@/data/mock';

// TODO(backend): a Laravel controller passing real `orders` wins over the mock.
const props = defineProps({
    orders: { type: Array, default: () => HOME_ORDERS },
});

const ORDERS_STATUS_FILTERS = [
    { id: 'all', label: 'הכל' },
    { id: 'ממתין לתשלום', label: 'ממתין לתשלום' },
    { id: 'בהכנה', label: 'בהכנה' },
    { id: 'נשלח', label: 'נשלח' },
    { id: 'הושלם', label: 'הושלם' },
    { id: 'בוטל', label: 'בוטל' },
];

// Kept from the prototype for parity (the type filter select was not rendered
// in the shipped design — status/date/phone/search are the active filters).
const ORDERS_TYPE_FILTERS = [
    { id: 'all', label: 'הכל' },
    { id: 'מותאמת', label: 'מותאמת' },
    { id: 'מדף', label: 'מדף' },
];

const status = ref('all');
const search = ref('');
const phone = ref('');
const date = ref('');
const hoverId = ref(null);

const goHome = () => visit('home');

const openOrder = (o) => {
    setLastOrder(buildOrderFromRow(o));
    visit('order', { id: o.id });
};

// KPI counts (over the full set, not the filtered view).
const count = (st) => props.orders.filter(o => o.status === st).length;
const kpis = computed(() => [
    { icon: 'coin',  count: count('ממתין לתשלום'), label: 'ממתינות לתשלום', tone: 'amber', status: 'ממתין לתשלום' },
    { icon: 'flask', count: count('בהכנה'),        label: 'בהכנה',          tone: 'blue',  status: 'בהכנה' },
    { icon: 'check', count: count('הושלם'),        label: 'הושלמו',         tone: 'green', status: 'הושלם' },
]);

const onlyDigits = (s) => (s || '').replace(/\D/g, '');

const filtered = computed(() => props.orders.filter((o) => {
    if (status.value !== 'all' && o.status !== status.value) return false;
    if (phone.value) {
        const q = onlyDigits(phone.value);
        if (q && !onlyDigits(o.phone).includes(q)) return false;
    }
    if (date.value && !o.date.includes(date.value.trim())) return false;
    if (search.value) {
        const q = search.value.trim();
        if (!o.patient.includes(q) && !o.formula.includes(q) && !o.id.includes(q)) return false;
    }
    return true;
}));

const hasFilter = computed(() => status.value !== 'all' || !!search.value || !!phone.value || !!date.value);

const clearAll = () => {
    status.value = 'all';
    search.value = '';
    phone.value = '';
    date.value = '';
};

const toggleKpi = (kpiStatus) => {
    status.value = status.value === kpiStatus ? 'all' : kpiStatus;
};
</script>

<template>
    <Head title="ההזמנות שלי" />
    <div class="page" data-screen-label="כל ההזמנות">
        <div class="page__inner page__inner--wide">

            <!-- Breadcrumb back -->
            <a
                style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--ink-3); cursor: pointer; margin-bottom: 18px"
                @click="goHome"
            >
                <Icon name="arrow_right" :size="15" /> חזרה ללוח הבקרה
            </a>

            <!-- Page head -->
            <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; flex-wrap: wrap; margin-bottom: 22px">
                <div>
                    <h1 class="page-title" style="margin: 0">כל ההזמנות</h1>
                    <p class="page-sub" style="margin-top: 6px">
                        כל ההזמנות האחרונות שלך במקום אחד — סינון, חיפוש וצפייה בכל הזמנה.
                    </p>
                </div>
            </div>

            <!-- KPI tiles -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 24px">
                <KpiTile
                    v-for="k in kpis"
                    :key="k.status"
                    :icon="k.icon" :count="k.count" :label="k.label" :tone="k.tone"
                    :active="status === k.status"
                    @click="toggleKpi(k.status)"
                />
            </div>

            <!-- Filter panel -->
            <div class="card" style="padding: 0; margin-bottom: 18px; overflow: hidden">
                <!-- Panel header -->
                <div
                    :style="{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
                        padding: '13px 18px', borderBottom: '1px solid var(--line)', background: 'var(--surface-sunk)',
                    }"
                >
                    <div style="display: flex; align-items: center; gap: 9px">
                        <Icon name="filter" :size="16" color="var(--ink-2)" />
                        <span style="font-size: 14px; font-weight: 600">סינון וחיפוש</span>
                        <span
                            v-if="hasFilter"
                            class="num"
                            :style="{
                                fontSize: '11.5px', fontWeight: 600, color: 'var(--accent)',
                                background: 'var(--accent-tint)', borderRadius: '999px', padding: '2px 9px',
                            }"
                        >{{ filtered.length }} תוצאות</span>
                    </div>
                    <button
                        v-if="hasFilter"
                        :style="{
                            display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'none',
                            border: 'none', fontSize: '13px', color: 'var(--ink-3)', fontWeight: 500, padding: '4px',
                        }"
                        @click="clearAll"
                    ><Icon name="x" :size="13" /> נקה הכל</button>
                </div>

                <!-- Fields — RTL flows right→left, so general search sits on the right -->
                <div
                    :style="{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(178px, 1fr))',
                        gap: '14px', padding: '18px',
                    }"
                >
                    <Field label="חיפוש כללי">
                        <SearchInput v-model="search" placeholder="מטופל, פורמולה או מס׳ הזמנה" />
                    </Field>

                    <Field label="סטטוס">
                        <select v-model="status" class="select">
                            <option v-for="f in ORDERS_STATUS_FILTERS" :key="f.id" :value="f.id">
                                {{ f.id === 'all' ? 'כל הסטטוסים' : f.label }}
                            </option>
                        </select>
                    </Field>

                    <Field label="תאריך">
                        <div class="input-wrap">
                            <span class="lead-icon"><Icon name="calendar" :size="16" /></span>
                            <input
                                v-model="date"
                                class="input with-icon"
                                placeholder="לדוגמה: 24.05"
                            />
                        </div>
                    </Field>

                    <Field label="טלפון לקוח">
                        <div class="input-wrap">
                            <span class="lead-icon"><Icon name="phone" :size="15" /></span>
                            <input
                                v-model="phone"
                                class="input with-icon"
                                placeholder="מספר טלפון של לקוח"
                                inputmode="tel"
                            />
                        </div>
                    </Field>
                </div>
            </div>

            <!-- Table -->
            <div v-if="filtered.length === 0" class="card" style="padding: 64px 24px; text-align: center">
                <div
                    :style="{
                        width: '56px', height: '56px', borderRadius: '50%', background: 'var(--surface-sunk)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '16px', color: 'var(--ink-3)',
                    }"
                ><Icon name="search" :size="24" /></div>
                <div style="font-size: 16px; font-weight: 500; margin-bottom: 6px">לא נמצאו הזמנות מתאימות</div>
                <div class="small muted" style="margin-bottom: 20px">נסה לשנות את הסינון או לנקות את החיפוש</div>
                <button class="btn btn--ghost" @click="clearAll">נקה סינון</button>
            </div>
            <div v-else class="card" style="padding: 0; overflow: hidden">
                <table style="width: 100%; border-collapse: collapse; table-layout: fixed">
                    <colgroup>
                        <col style="width: 108px" />
                        <col style="width: 120px" />
                        <col style="width: 130px" />
                        <col />
                        <col style="width: 80px" />
                        <col style="width: 120px" />
                        <col style="width: 140px" />
                        <col style="width: 78px" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th
                                v-for="h in ['מס׳ הזמנה', 'מטופל', 'טלפון לקוח', 'פורמולה', 'סוג', 'תאריך', 'סטטוס', 'פעולות']"
                                :key="h"
                                style="text-align: right; padding: 12px 16px; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-3); font-weight: 600; border-bottom: 1px solid var(--line); background: var(--surface-sunk)"
                            >{{ h }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(o, i) in filtered"
                            :key="o.id"
                            :style="{
                                background: hoverId === o.id ? 'var(--accent-tint)' : 'transparent',
                                borderBottom: i === filtered.length - 1 ? 'none' : '1px solid var(--line)',
                                transition: 'background .12s ease', cursor: 'pointer',
                            }"
                            @mouseenter="hoverId = o.id"
                            @mouseleave="hoverId = null"
                            @click="openOrder(o)"
                        >
                            <td style="padding: 14px 16px; font-size: 13px" class="num muted">{{ o.id }}</td>
                            <td style="padding: 14px 16px; font-size: 14px; font-weight: 500">{{ o.patient }}</td>
                            <td style="padding: 14px 16px; font-size: 13px; color: var(--ink-2); direction: ltr; text-align: right" class="num">{{ o.phone }}</td>
                            <td style="padding: 14px 16px; font-size: 14px; color: var(--ink-2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap">{{ o.formula }}</td>
                            <td style="padding: 14px 16px; font-size: 13px; color: var(--ink-3)">{{ o.type }}</td>
                            <td style="padding: 14px 16px; font-size: 13px; color: var(--ink-3)" class="num">{{ o.date }}</td>
                            <td style="padding: 14px 16px">
                                <StatusDot :tone="o.dot">{{ o.status }}</StatusDot>
                            </td>
                            <td style="padding: 14px 16px">
                                <a
                                    style="color: var(--accent); cursor: pointer; font-size: 13px; font-weight: 600"
                                    @click.stop="openOrder(o)"
                                >צפה</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Footer count -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; flex-wrap: wrap; gap: 10px">
                <span class="small muted">
                    מציג <span class="num">{{ filtered.length }}</span> מתוך <span class="num">{{ props.orders.length }}</span> הזמנות
                </span>
                <a
                    v-if="hasFilter"
                    style="font-size: 13px; color: var(--ink-3); cursor: pointer"
                    @click="clearAll"
                >נקה סינון</a>
            </div>

        </div>
    </div>
</template>
