<script setup>
// All Orders — a focused mini-dashboard listing every recent order for the
// practitioner, with KPI tiles, status/type/search filters, and per-row view.
// Reuses the same row→order builder as the home dashboard.
import { Head } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import KpiTile from '@/components/shared/orders/KpiTile.vue';
import Field from '@/components/ui/Field.vue';
import Icon from '@/components/ui/Icon.vue';
import SearchInput from '@/components/ui/SearchInput.vue';
import StatusDot from '@/components/ui/StatusDot.vue';
import { HOME_ORDERS } from '@/data/mock';
import { buildOrderFromRow, setLastOrder } from '@/lib/orders';
import { visit } from '@/lib/routes';

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
const count = (st) => props.orders.filter((o) => o.status === st).length;
const kpis = computed(() => [
    {
        icon: 'coin',
        count: count('ממתין לתשלום'),
        label: 'ממתינות לתשלום',
        tone: 'amber',
        status: 'ממתין לתשלום',
    },
    {
        icon: 'flask',
        count: count('בהכנה'),
        label: 'בהכנה',
        tone: 'blue',
        status: 'בהכנה',
    },
    {
        icon: 'check',
        count: count('הושלם'),
        label: 'הושלמו',
        tone: 'green',
        status: 'הושלם',
    },
]);

const onlyDigits = (s) => (s || '').replace(/\D/g, '');

const filtered = computed(() =>
    props.orders.filter((o) => {
        if (status.value !== 'all' && o.status !== status.value) {
            return false;
        }

        if (phone.value) {
            const q = onlyDigits(phone.value);

            if (q && !onlyDigits(o.phone).includes(q)) {
                return false;
            }
        }

        if (date.value && !o.date.includes(date.value.trim())) {
            return false;
        }

        if (search.value) {
            const q = search.value.trim();

            if (
                !o.patient.includes(q) &&
                !o.formula.includes(q) &&
                !o.id.includes(q)
            ) {
                return false;
            }
        }

        return true;
    }),
);

const hasFilter = computed(
    () =>
        status.value !== 'all' ||
        !!search.value ||
        !!phone.value ||
        !!date.value,
);

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
                class="mb-[18px] inline-flex cursor-pointer items-center gap-[6px] text-[13px] text-ink-3"
                @click="goHome"
            >
                <Icon name="arrow_right" :size="15" /> חזרה ללוח הבקרה
            </a>

            <!-- Page head -->
            <div
                class="mb-[22px] flex flex-wrap items-start justify-between gap-[20px]"
            >
                <div>
                    <h1 class="page-title m-0">כל ההזמנות</h1>
                    <p class="page-sub mt-[6px]">
                        כל ההזמנות האחרונות שלך במקום אחד — סינון, חיפוש וצפייה
                        בכל הזמנה.
                    </p>
                </div>
            </div>

            <!-- KPI tiles -->
            <div class="mb-[24px] grid grid-cols-[repeat(3,1fr)] gap-[14px]">
                <KpiTile
                    v-for="kpi in kpis"
                    :key="kpi.status"
                    :icon="kpi.icon"
                    :count="kpi.count"
                    :label="kpi.label"
                    :tone="kpi.tone"
                    :active="status === kpi.status"
                    @click="toggleKpi(kpi.status)"
                />
            </div>

            <!-- Filter panel -->
            <div class="card mb-[18px] overflow-hidden p-0">
                <!-- Panel header -->
                <div
                    class="flex items-center justify-between gap-[12px] border-b border-line bg-surface-sunk px-[18px] py-[13px]"
                >
                    <div class="flex items-center gap-[9px]">
                        <Icon name="filter" :size="16" color="var(--ink-2)" />
                        <span class="text-[14px] font-semibold"
                            >סינון וחיפוש</span
                        >
                        <span
                            v-if="hasFilter"
                            class="num rounded-[999px] bg-accent-tint px-[9px] py-[2px] text-[11.5px] font-semibold text-accent"
                            >{{ filtered.length }} תוצאות</span
                        >
                    </div>
                    <button
                        v-if="hasFilter"
                        class="inline-flex items-center gap-[5px] border-none bg-transparent p-[4px] text-[13px] font-medium text-ink-3"
                        @click="clearAll"
                    >
                        <Icon name="x" :size="13" /> נקה הכל
                    </button>
                </div>

                <!-- Fields — RTL flows right→left, so general search sits on the right -->
                <div
                    class="grid grid-cols-[repeat(auto-fit,minmax(178px,1fr))] gap-[14px] p-[18px]"
                >
                    <Field label="חיפוש כללי">
                        <SearchInput
                            v-model="search"
                            placeholder="מטופל, פורמולה או מס׳ הזמנה"
                        />
                    </Field>

                    <Field label="סטטוס">
                        <select v-model="status" class="select">
                            <option
                                v-for="filter in ORDERS_STATUS_FILTERS"
                                :key="filter.id"
                                :value="filter.id"
                            >
                                {{
                                    filter.id === 'all'
                                        ? 'כל הסטטוסים'
                                        : filter.label
                                }}
                            </option>
                        </select>
                    </Field>

                    <Field label="תאריך">
                        <div class="input-wrap">
                            <span class="lead-icon"
                                ><Icon name="calendar" :size="16"
                            /></span>
                            <input
                                v-model="date"
                                class="input with-icon"
                                placeholder="לדוגמה: 24.05"
                            />
                        </div>
                    </Field>

                    <Field label="טלפון לקוח">
                        <div class="input-wrap">
                            <span class="lead-icon"
                                ><Icon name="phone" :size="15"
                            /></span>
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
            <div
                v-if="filtered.length === 0"
                class="card px-[24px] py-[64px] text-center"
            >
                <div
                    class="mb-[16px] inline-flex h-[56px] w-[56px] items-center justify-center rounded-[50%] bg-surface-sunk text-ink-3"
                >
                    <Icon name="search" :size="24" />
                </div>
                <div class="mb-[6px] text-[16px] font-medium">
                    לא נמצאו הזמנות מתאימות
                </div>
                <div class="small muted mb-[20px]">
                    נסה לשנות את הסינון או לנקות את החיפוש
                </div>
                <button class="btn btn--ghost" @click="clearAll">
                    נקה סינון
                </button>
            </div>
            <div v-else class="card overflow-hidden p-0">
                <!-- .orders-table: on phones the mobile stylesheet re-lays this
                     table out as stacked order cards (see app.css). -->
                <table class="orders-table w-full table-fixed border-collapse">
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
                                v-for="header in [
                                    'מס׳ הזמנה',
                                    'מטופל',
                                    'טלפון לקוח',
                                    'פורמולה',
                                    'סוג',
                                    'תאריך',
                                    'סטטוס',
                                    'פעולות',
                                ]"
                                :key="header"
                                class="border-b border-line bg-surface-sunk px-[16px] py-[12px] text-right text-[11px] font-semibold tracking-[0.08em] text-ink-3 uppercase"
                            >
                                {{ header }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(order, index) in filtered"
                            :key="order.id"
                            class="cursor-pointer transition-[background] duration-[120ms] ease-[ease]"
                            :class="[
                                hoverId === order.id
                                    ? 'bg-accent-tint'
                                    : 'bg-transparent',
                                index === filtered.length - 1
                                    ? ''
                                    : 'border-b border-line',
                            ]"
                            @mouseenter="hoverId = order.id"
                            @mouseleave="hoverId = null"
                            @click="openOrder(order)"
                        >
                            <td
                                class="num muted px-[16px] py-[14px] text-[13px]"
                            >
                                {{ order.id }}
                            </td>
                            <td
                                class="px-[16px] py-[14px] text-[14px] font-medium"
                            >
                                {{ order.patient }}
                            </td>
                            <td
                                class="num px-[16px] py-[14px] text-right text-[13px] text-ink-2 [direction:ltr]"
                            >
                                {{ order.phone }}
                            </td>
                            <td
                                class="overflow-hidden px-[16px] py-[14px] text-[14px] text-ellipsis whitespace-nowrap text-ink-2"
                            >
                                {{ order.formula }}
                            </td>
                            <td
                                class="px-[16px] py-[14px] text-[13px] text-ink-3"
                            >
                                {{ order.type }}
                            </td>
                            <td
                                class="num px-[16px] py-[14px] text-[13px] text-ink-3"
                            >
                                {{ order.date }}
                            </td>
                            <td class="px-[16px] py-[14px]">
                                <StatusDot :tone="order.dot">{{
                                    order.status
                                }}</StatusDot>
                            </td>
                            <td class="px-[16px] py-[14px]">
                                <a
                                    class="cursor-pointer text-[13px] font-semibold text-accent"
                                    @click.stop="openOrder(order)"
                                    >צפה</a
                                >
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Footer count -->
            <div
                class="mt-[14px] flex flex-wrap items-center justify-between gap-[10px]"
            >
                <span class="small muted">
                    מציג <span class="num">{{ filtered.length }}</span> מתוך
                    <span class="num">{{ props.orders.length }}</span> הזמנות
                </span>
                <a
                    v-if="hasFilter"
                    class="cursor-pointer text-[13px] text-ink-3"
                    @click="clearAll"
                    >נקה סינון</a
                >
            </div>
        </div>
    </div>
</template>
