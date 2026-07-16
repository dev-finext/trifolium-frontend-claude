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
                class="inline-flex items-center gap-[6px] mb-[18px] text-[13px] text-ink-3 cursor-pointer"
                @click="goHome"
            >
                <Icon name="arrow_right" :size="15" /> חזרה ללוח הבקרה
            </a>

            <!-- Page head -->
            <div class="flex items-start justify-between flex-wrap gap-[20px] mb-[22px]">
                <div>
                    <h1 class="page-title m-0">כל ההזמנות</h1>
                    <p class="page-sub mt-[6px]">
                        כל ההזמנות האחרונות שלך במקום אחד — סינון, חיפוש וצפייה בכל הזמנה.
                    </p>
                </div>
            </div>

            <!-- KPI tiles -->
            <div class="grid grid-cols-[repeat(3,1fr)] gap-[14px] mb-[24px]">
                <KpiTile
                    v-for="k in kpis"
                    :key="k.status"
                    :icon="k.icon" :count="k.count" :label="k.label" :tone="k.tone"
                    :active="status === k.status"
                    @click="toggleKpi(k.status)"
                />
            </div>

            <!-- Filter panel -->
            <div class="card p-0 mb-[18px] overflow-hidden">
                <!-- Panel header -->
                <div
                    class="flex items-center justify-between gap-[12px] py-[13px] px-[18px] bg-surface-sunk border-b border-line"
                >
                    <div class="flex items-center gap-[9px]">
                        <Icon name="filter" :size="16" color="var(--ink-2)" />
                        <span class="text-[14px] font-semibold">סינון וחיפוש</span>
                        <span
                            v-if="hasFilter"
                            class="num py-[2px] px-[9px] text-[11.5px] font-semibold text-accent bg-accent-tint rounded-[999px]"
                        >{{ filtered.length }} תוצאות</span>
                    </div>
                    <button
                        v-if="hasFilter"
                        class="inline-flex items-center gap-[5px] p-[4px] text-[13px] font-medium text-ink-3 bg-transparent border-none"
                        @click="clearAll"
                    ><Icon name="x" :size="13" /> נקה הכל</button>
                </div>

                <!-- Fields — RTL flows right→left, so general search sits on the right -->
                <div
                    class="grid grid-cols-[repeat(auto-fit,minmax(178px,1fr))] gap-[14px] p-[18px]"
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
            <div v-if="filtered.length === 0" class="card py-[64px] px-[24px] text-center">
                <div
                    class="inline-flex items-center justify-center w-[56px] h-[56px] mb-[16px] text-ink-3 bg-surface-sunk rounded-[50%]"
                ><Icon name="search" :size="24" /></div>
                <div class="mb-[6px] text-[16px] font-medium">לא נמצאו הזמנות מתאימות</div>
                <div class="small muted mb-[20px]">נסה לשנות את הסינון או לנקות את החיפוש</div>
                <button class="btn btn--ghost" @click="clearAll">נקה סינון</button>
            </div>
            <div v-else class="card p-0 overflow-hidden">
                <!-- .orders-table: on phones the mobile stylesheet re-lays this
                     table out as stacked order cards (see app.css). -->
                <table class="orders-table w-full border-collapse table-fixed">
                    <colgroup>
                        <col class="w-[108px]" />
                        <col class="w-[120px]" />
                        <col class="w-[130px]" />
                        <col />
                        <col class="w-[80px]" />
                        <col class="w-[120px]" />
                        <col class="w-[140px]" />
                        <col class="w-[78px]" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th
                                v-for="h in ['מס׳ הזמנה', 'מטופל', 'טלפון לקוח', 'פורמולה', 'סוג', 'תאריך', 'סטטוס', 'פעולות']"
                                :key="h"
                                class="py-[12px] px-[16px] text-right text-[11px] tracking-[0.08em] uppercase font-semibold text-ink-3 bg-surface-sunk border-b border-line"
                            >{{ h }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(o, i) in filtered"
                            :key="o.id"
                            class="cursor-pointer transition-[background] duration-[120ms] ease-[ease]"
                            :class="[
                                hoverId === o.id ? 'bg-accent-tint' : 'bg-transparent',
                                i === filtered.length - 1 ? '' : 'border-b border-line',
                            ]"
                            @mouseenter="hoverId = o.id"
                            @mouseleave="hoverId = null"
                            @click="openOrder(o)"
                        >
                            <td class="num muted py-[14px] px-[16px] text-[13px]">{{ o.id }}</td>
                            <td class="py-[14px] px-[16px] text-[14px] font-medium">{{ o.patient }}</td>
                            <td class="num py-[14px] px-[16px] text-[13px] text-ink-2 [direction:ltr] text-right">{{ o.phone }}</td>
                            <td class="py-[14px] px-[16px] text-[14px] text-ink-2 overflow-hidden text-ellipsis whitespace-nowrap">{{ o.formula }}</td>
                            <td class="py-[14px] px-[16px] text-[13px] text-ink-3">{{ o.type }}</td>
                            <td class="num py-[14px] px-[16px] text-[13px] text-ink-3">{{ o.date }}</td>
                            <td class="py-[14px] px-[16px]">
                                <StatusDot :tone="o.dot">{{ o.status }}</StatusDot>
                            </td>
                            <td class="py-[14px] px-[16px]">
                                <a
                                    class="text-[13px] font-semibold text-accent cursor-pointer"
                                    @click.stop="openOrder(o)"
                                >צפה</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Footer count -->
            <div class="flex items-center justify-between flex-wrap mt-[14px] gap-[10px]">
                <span class="small muted">
                    מציג <span class="num">{{ filtered.length }}</span> מתוך <span class="num">{{ props.orders.length }}</span> הזמנות
                </span>
                <a
                    v-if="hasFilter"
                    class="text-[13px] text-ink-3 cursor-pointer"
                    @click="clearAll"
                >נקה סינון</a>
            </div>

        </div>
    </div>
</template>
