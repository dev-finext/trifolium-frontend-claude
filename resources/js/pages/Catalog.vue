<script setup>
// המוצרים שלנו — the pharmacy's shelf-product catalog. A right-side filter
// sidebar (product type · health condition · price) narrows the grid; each
// product can be added to the cart against a chosen patient (or none).
import { Head } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import FilterGroup from '@/components/shared/catalog/FilterGroup.vue';
import FilterRow from '@/components/shared/catalog/FilterRow.vue';
import PatientPickerModal from '@/components/shared/catalog/PatientPickerModal.vue';
import ProductCard from '@/components/shared/catalog/ProductCard.vue';
import Icon from '@/components/ui/Icon.vue';
import SearchInput from '@/components/ui/SearchInput.vue';
import { useIsMobile } from '@/composables/useIsMobile';
import {
    PRODUCTS,
    PRODUCT_TYPES,
    PRODUCT_CONDITIONS,
    PATIENTS,
} from '@/data/mock';
import { useCartStore } from '@/stores/cart';

const props = defineProps({
    products: { type: Array, default: () => PRODUCTS },
    productTypes: { type: Array, default: () => PRODUCT_TYPES },
    conditions: { type: Array, default: () => PRODUCT_CONDITIONS },
    patients: { type: Array, default: () => PATIENTS },
});

const cartStore = useCartStore();

// Highest price on the shelf, rounded up — bounds the price slider.
const PRICE_CAP =
    Math.ceil(Math.max(...props.products.map((p) => p.price), 0) / 50) * 50;

// On phones the sidebar stacks above the grid, so it collapses behind a toggle;
// desktop renders it permanently (as designed).
const isMobile = useIsMobile();
const filtersOpen = ref(false);

const activeType = ref('all');
const activeConditions = ref([]);
const kidsOnly = ref(false);
const priceMax = ref(PRICE_CAP);
const search = ref('');
const sortBy = ref('default'); // 'default' | 'price-asc' | 'price-desc' | 'name'
const pickFor = ref(null); // product awaiting patient selection
// Per-product added quantity — drives each card's "בסל" badge.
const cart = ref({});

const filtered = computed(() =>
    props.products.filter((p) => {
        if (
            search.value &&
            !p.heb.includes(search.value) &&
            !(p.sub || '').includes(search.value) &&
            !p.sku.includes(search.value)
        ) {
            return false;
        }

        if (activeType.value !== 'all' && p.type !== activeType.value) {
            return false;
        }

        // Health conditions are OR'd — a product matches if it carries any of
        // the selected conditions.
        if (
            activeConditions.value.length &&
            !activeConditions.value.some((c) => (p.tags || []).includes(c))
        ) {
            return false;
        }

        if (kidsOnly.value && !p.kids) {
            return false;
        }

        if (p.price > priceMax.value) {
            return false;
        }

        return true;
    }),
);

const sorted = computed(() => {
    const arr = [...filtered.value];

    if (sortBy.value === 'price-asc') {
        return arr.sort((a, b) => a.price - b.price);
    }

    if (sortBy.value === 'price-desc') {
        return arr.sort((a, b) => b.price - a.price);
    }

    if (sortBy.value === 'name') {
        return arr.sort((a, b) => a.heb.localeCompare(b.heb, 'he'));
    }

    return arr; // 'default' — curated order from the data (grouped by type)
});

// Sidebar option lists with counts; zero-count options are hidden.
const typeRows = computed(() =>
    props.productTypes
        .map((t) => ({
            ...t,
            count: props.products.filter((p) => p.type === t.id).length,
        }))
        .filter((t) => t.count > 0),
);

const conditionRows = computed(() =>
    props.conditions
        .map((c) => ({
            label: c,
            count: props.products.filter((p) => (p.tags || []).includes(c))
                .length,
        }))
        .filter((c) => c.count > 0),
);

const kidsCount = computed(() => props.products.filter((p) => p.kids).length);

const activeCount = computed(
    () =>
        (activeType.value !== 'all' ? 1 : 0) +
        activeConditions.value.length +
        (kidsOnly.value ? 1 : 0) +
        (priceMax.value < PRICE_CAP ? 1 : 0),
);

// Clicking "הוסף" opens the patient picker; the order is then tied to a patient (or none).
function confirmAdd(product, patient) {
    cart.value = {
        ...cart.value,
        [product.id]: (cart.value[product.id] || 0) + 1,
    };
    cartStore.addToCart({
        id: 'shelf-' + product.id + '-' + (patient ? patient.id : 'none'),
        kind: 'shelf',
        name: product.heb,
        patient: patient ? patient.heb : 'ללא מטופל',
        form: product.type,
        vol: product.vol,
        tags: [product.type].concat(
            product.tags ? product.tags.slice(0, 2) : [],
        ),
        desc: product.sub,
        price: product.price,
        qty: 1,
    });
    pickFor.value = null;
}

function toggleCondition(v) {
    activeConditions.value = activeConditions.value.includes(v)
        ? activeConditions.value.filter((x) => x !== v)
        : [...activeConditions.value, v];
}

function clearAll() {
    activeType.value = 'all';
    activeConditions.value = [];
    kidsOnly.value = false;
    priceMax.value = PRICE_CAP;
}
</script>

<template>
    <Head title="המוצרים שלנו" />
    <div class="page">
        <div class="page__inner page__inner--wide">
            <div class="page-head">
                <div>
                    <h1 class="page-title">המוצרים שלנו</h1>
                    <p class="page-sub">
                        מוצרי המדף של בית המרקחת — פורמולות, תמציות, שמנים
                        ותכשירים · הנחת מטפל 20% כלולה
                    </p>
                </div>
                <div class="row gap-[8px]">
                    <div class="catalog-search w-[260px]">
                        <SearchInput
                            v-model="search"
                            placeholder="חיפוש מוצר או מק״ט…"
                        />
                    </div>
                </div>
            </div>

            <!-- Mobile: filters collapse behind this toggle (hidden on desktop) -->
            <button
                v-if="isMobile"
                class="catalog-filters-toggle"
                @click="filtersOpen = !filtersOpen"
            >
                <Icon name="filter" :size="15" color="var(--ink-2)" />
                סינון
                <span
                    v-if="activeCount > 0"
                    class="catalog-filters-toggle__count num"
                    >{{ activeCount }}</span
                >
                <Icon
                    :name="filtersOpen ? 'chevron_down' : 'chevron_left'"
                    :size="15"
                    color="var(--ink-3)"
                    class="ms-auto"
                />
            </button>

            <!-- Two-column layout: sidebar (right in RTL) + grid -->
            <div class="grid grid-cols-[240px_1fr] items-start gap-[32px]">
                <!-- FILTER SIDEBAR -->
                <aside
                    v-show="!isMobile || filtersOpen"
                    class="catalog-filters sticky top-[80px] max-h-[calc(100vh-100px)] overflow-y-auto rounded-card border border-line bg-surface px-[18px] py-[20px]"
                >
                    <div
                        class="mb-[16px] flex items-center justify-between border-b border-b-line pb-[14px]"
                    >
                        <div class="flex items-center gap-[8px]">
                            <Icon
                                name="filter"
                                :size="15"
                                color="var(--ink-2)"
                            />
                            <span class="text-[14px] font-semibold text-ink"
                                >סינון</span
                            >
                            <span
                                v-if="activeCount > 0"
                                class="num inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-[999px] bg-accent px-[5px] py-0 text-[10px] font-bold text-white"
                                >{{ activeCount }}</span
                            >
                        </div>
                        <button
                            v-if="activeCount > 0"
                            class="btn btn--text text-[12px] text-ink-3"
                            @click="clearAll"
                        >
                            נקה הכל
                        </button>
                    </div>

                    <!-- PRODUCT TYPE -->
                    <FilterGroup label="סוג מוצר">
                        <FilterRow
                            label="הכל"
                            :count="products.length"
                            :checked="activeType === 'all'"
                            radio
                            @change="activeType = 'all'"
                        />
                        <FilterRow
                            v-for="type in typeRows"
                            :key="type.id"
                            :label="type.heb"
                            :count="type.count"
                            :checked="activeType === type.id"
                            radio
                            @change="activeType = type.id"
                        />
                    </FilterGroup>

                    <!-- CHILDREN-FRIENDLY -->
                    <FilterGroup v-if="kidsCount" label="התאמה">
                        <FilterRow
                            label="מותאם לילדים"
                            :count="kidsCount"
                            :checked="kidsOnly"
                            @change="kidsOnly = !kidsOnly"
                        />
                    </FilterGroup>

                    <!-- HEALTH CONDITION -->
                    <FilterGroup label="מצב בריאותי">
                        <FilterRow
                            v-for="condition in conditionRows"
                            :key="condition.label"
                            :label="condition.label"
                            :count="condition.count"
                            :checked="
                                activeConditions.includes(condition.label)
                            "
                            @change="toggleCondition(condition.label)"
                        />
                    </FilterGroup>

                    <!-- PRICE -->
                    <FilterGroup label="מחיר מקסימלי" last>
                        <div class="px-[4px] pt-[4px] pb-0">
                            <input
                                v-model.number="priceMax"
                                type="range"
                                :min="30"
                                :max="PRICE_CAP"
                                :step="10"
                                aria-label="מחיר מקסימלי"
                                :aria-valuetext="`עד ${priceMax} שקלים`"
                                class="w-full cursor-pointer accent-(--accent)"
                            />
                            <div
                                class="mt-[4px] flex justify-between text-[11px] text-ink-3"
                            >
                                <span class="num">₪30</span>
                                <span
                                    class="text-[13px] font-semibold text-ink"
                                >
                                    עד <span class="num">₪{{ priceMax }}</span>
                                </span>
                                <span class="num">₪{{ PRICE_CAP }}</span>
                            </div>
                        </div>
                    </FilterGroup>
                </aside>

                <!-- GRID -->
                <div>
                    <div
                        class="mb-[16px] flex items-center justify-between text-[13px] text-ink-3"
                    >
                        <span>
                            <span class="num font-semibold text-ink">{{
                                filtered.length
                            }}</span>
                            מוצרים
                            <span
                                v-if="filtered.length !== props.products.length"
                                class="text-ink-3"
                            >
                                מתוך
                                <span class="num">{{
                                    props.products.length
                                }}</span>
                            </span>
                        </span>
                        <div class="flex items-center gap-[6px]">
                            <label for="catalog-sort" class="text-[12px]"
                                >מיון:</label
                            >
                            <select
                                id="catalog-sort"
                                v-model="sortBy"
                                class="select h-[36px] w-auto px-[8px] py-0 text-[13px]"
                            >
                                <option value="default">מומלץ</option>
                                <option value="price-asc">
                                    מחיר נמוך לגבוה
                                </option>
                                <option value="price-desc">
                                    מחיר גבוה לנמוך
                                </option>
                                <option value="name">שם א׳-ת׳</option>
                            </select>
                        </div>
                    </div>

                    <div
                        v-if="filtered.length === 0"
                        class="card px-[24px] py-[60px] text-center text-ink-3"
                    >
                        <Icon name="filter" :size="28" color="var(--ink-4)" />
                        <div class="mt-[12px] text-[14px]">
                            לא נמצאו מוצרים לפי הסינון
                        </div>
                        <button
                            class="btn btn--ghost btn--sm mt-[16px]"
                            @click="clearAll"
                        >
                            נקה סינון
                        </button>
                    </div>
                    <div v-else class="grid grid-cols-3 gap-[16px]">
                        <ProductCard
                            v-for="product in sorted"
                            :key="product.id"
                            :product="product"
                            :in-cart="cart[product.id] || 0"
                            @add="pickFor = product"
                        />
                    </div>
                </div>
            </div>
        </div>

        <PatientPickerModal
            v-if="pickFor"
            :product="pickFor"
            :patients="props.patients"
            @close="pickFor = null"
            @pick="(patient) => confirmAdd(pickFor, patient)"
        />
    </div>
</template>

<style>
/* Mobile filter toggle — rendered only under the phone tier (v-if isMobile) */
.catalog-filters-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    margin-bottom: 14px;
    padding: 12px 16px;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--r-card);
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    color: var(--ink);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
}
.catalog-filters-toggle__count {
    background: var(--accent);
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
/* When stacked above the grid on phones, the panel must scroll with the page
   (its desktop position:sticky + max-height are inline utilities). */
html.tf-mobile .catalog-filters {
    position: static !important;
    max-height: none !important;
    overflow: visible !important;
}
</style>
