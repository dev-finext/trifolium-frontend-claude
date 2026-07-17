<script setup>
// מוצרי מדף — Shelf products catalog with right-side filter sidebar
import { Head } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import FilterGroup from '@/components/shared/catalog/FilterGroup.vue';
import FilterRow from '@/components/shared/catalog/FilterRow.vue';
import PatientPickerModal from '@/components/shared/catalog/PatientPickerModal.vue';
import ProductCard from '@/components/shared/catalog/ProductCard.vue';
import Icon from '@/components/ui/Icon.vue';
import SearchInput from '@/components/ui/SearchInput.vue';
import { useIsMobile } from '@/composables/useIsMobile';
import { PRODUCTS, CATEGORIES, PATIENTS } from '@/data/mock';
import { useCartStore } from '@/stores/cart';

const props = defineProps({
    products: { type: Array, default: () => PRODUCTS },
    categories: { type: Array, default: () => CATEGORIES },
    patients: { type: Array, default: () => PATIENTS },
});

const cartStore = useCartStore();

// Map product → category by keyword (products don't carry an explicit cat)
const productCat = (p) => {
    const s = p.heb + ' ' + p.sub;

    if (/שינה|מצב רוח|הרגעה|חרדה|ערב/.test(s)) {
        return 'nerv';
    }

    if (/חיסון|אכינצאה|אסטרגלוס/.test(s)) {
        return 'immune';
    }

    if (/אדפטוגן|אשווגנדה|רודיולה/.test(s)) {
        return 'adapt';
    }

    if (/עיכול|כורכום|זנגביל/.test(s)) {
        return 'digest';
    }

    if (/לב|לחץ|עוזרר|עלי זית/.test(s)) {
        return 'circ';
    }

    if (/קלנדולה|משחה|עור/.test(s)) {
        return 'skin';
    }

    if (/כבד|גדילן|שן הארי/.test(s)) {
        return 'liver';
    }

    return 'other';
};

// Derive a product form (תמיסה, כמוסות, etc.) from the vol/heb fields
const productForm = (p) => {
    const s = p.heb + ' ' + p.vol;

    if (/כמוסות/.test(s)) {
        return 'כמוסות';
    }

    if (/אבקה/.test(s)) {
        return 'אבקה';
    }

    if (/^משחת|משחה/.test(p.heb)) {
        return 'משחה';
    }

    if (/תה|שקיות/.test(s)) {
        return 'תה';
    }

    if (/מ"ל|תמיסת|תמצית|משקה/.test(s)) {
        return 'תמיסה';
    }

    return 'אחר';
};

const FORMS = ['תמיסה', 'כמוסות', 'אבקה', 'תה', 'משחה'];
const PRODUCT_TAGS = ['נמכר ביותר', 'חדש'];

// On phones the sidebar stacks above the grid (the mobile grid collapse), so
// an always-open 900px filter panel buried the products. It collapses behind
// a toggle instead; desktop renders the sidebar permanently, as designed.
const isMobile = useIsMobile();
const filtersOpen = ref(false);

const activeCat = ref('all');
const pickFor = ref(null); // product awaiting patient selection
const activeForms = ref([]);
const activeTags = ref([]);
const priceMax = ref(150);
const search = ref('');
const sortBy = ref('pop'); // 'pop' | 'price-asc' | 'price-desc' | 'new'
// Per-product added quantity — drives each card's "בסל" badge.
const cart = ref({});

const filtered = computed(() =>
    props.products.filter((p) => {
        if (
            search.value &&
            !p.heb.includes(search.value) &&
            !p.sub.includes(search.value)
        ) {
            return false;
        }

        if (activeCat.value !== 'all' && productCat(p) !== activeCat.value) {
            return false;
        }

        if (
            activeForms.value.length &&
            !activeForms.value.includes(productForm(p))
        ) {
            return false;
        }

        if (activeTags.value.length && !activeTags.value.includes(p.tag)) {
            return false;
        }

        if (p.price > priceMax.value) {
            return false;
        }

        return true;
    }),
);

// A12 — the sort control is now wired (was a dead <select>). Sorts a copy so
// the source order is preserved. "Popularity" floats best-sellers first;
// "new" floats the חדש items first.
const sorted = computed(() => {
    const arr = [...filtered.value];

    if (sortBy.value === 'price-asc') {
        return arr.sort((a, b) => a.price - b.price);
    }

    if (sortBy.value === 'price-desc') {
        return arr.sort((a, b) => b.price - a.price);
    }

    if (sortBy.value === 'new') {
        return arr.sort((a, b) => (b.tag === 'חדש') - (a.tag === 'חדש'));
    }

    return arr.sort(
        (a, b) => (b.tag === 'נמכר ביותר') - (a.tag === 'נמכר ביותר'),
    );
});

// Sidebar option lists with counts; zero-count options are hidden (except 'הכל').
const categoryRows = computed(() =>
    props.categories
        .map((c) => ({
            ...c,
            count:
                c.id === 'all'
                    ? props.products.length
                    : props.products.filter((p) => productCat(p) === c.id)
                          .length,
        }))
        .filter((c) => c.id === 'all' || c.count > 0),
);

const formRows = computed(() =>
    FORMS.map((f) => ({
        label: f,
        count: props.products.filter((p) => productForm(p) === f).length,
    })).filter((f) => f.count > 0),
);

const tagRows = computed(() =>
    PRODUCT_TAGS.map((t) => ({
        label: t,
        count: props.products.filter((p) => p.tag === t).length,
    })).filter((t) => t.count > 0),
);

const activeCount = computed(
    () =>
        (activeCat.value !== 'all' ? 1 : 0) +
        activeForms.value.length +
        activeTags.value.length +
        (priceMax.value < 150 ? 1 : 0),
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
        form: productForm(product),
        vol: product.vol,
        tags: [productForm(product)].concat(product.tag ? [product.tag] : []),
        desc: product.sub,
        price: product.price,
        qty: 1,
    });
    pickFor.value = null;
}

// Kept from the prototype (it defined but never wired this in the markup).

// Toggle a value in a multi-select filter list (forms / tags). Kept in script
// scope because template expressions auto-unwrap refs.
function toggle(listRef, v) {
    listRef.value = listRef.value.includes(v)
        ? listRef.value.filter((x) => x !== v)
        : [...listRef.value, v];
}
const toggleForm = (v) => toggle(activeForms, v);
const toggleTag = (v) => toggle(activeTags, v);

function clearAll() {
    activeCat.value = 'all';
    activeForms.value = [];
    activeTags.value = [];
    priceMax.value = 150;
}
</script>

<template>
    <Head title="מוצרי מדף" />
    <div class="page">
        <div class="page__inner page__inner--wide">
            <div class="page-head">
                <div>
                    <h1 class="page-title">מוצרי מדף</h1>
                    <p class="page-sub">
                        פורמולות מוכנות, תמיסות ותערובות · הנחת מטפל 20% כלולה
                    </p>
                </div>
                <div class="row gap-[8px]">
                    <div class="catalog-search w-[260px]">
                        <SearchInput
                            v-model="search"
                            placeholder="חיפוש מוצר…"
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
                    class="catalog-filters sticky top-[80px] rounded-card border border-line bg-surface px-[18px] py-[20px]"
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

                    <!-- CATEGORIES -->
                    <FilterGroup label="קטגוריה">
                        <FilterRow
                            v-for="category in categoryRows"
                            :key="category.id"
                            :label="category.heb"
                            :count="category.count"
                            :checked="activeCat === category.id"
                            radio
                            @change="activeCat = category.id"
                        />
                    </FilterGroup>

                    <!-- PRODUCT FORM -->
                    <FilterGroup label="צורת מוצר">
                        <FilterRow
                            v-for="form in formRows"
                            :key="form.label"
                            :label="form.label"
                            :count="form.count"
                            :checked="activeForms.includes(form.label)"
                            @change="toggleForm(form.label)"
                        />
                    </FilterGroup>

                    <!-- PRICE -->
                    <FilterGroup label="מחיר מקסימלי">
                        <div class="px-[4px] pt-[4px] pb-0">
                            <input
                                v-model.number="priceMax"
                                type="range"
                                :min="30"
                                :max="150"
                                :step="5"
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
                                <span class="num">₪150</span>
                            </div>
                        </div>
                    </FilterGroup>

                    <!-- TAGS -->
                    <FilterGroup label="תגיות" last>
                        <FilterRow
                            v-for="tag in tagRows"
                            :key="tag.label"
                            :label="tag.label"
                            :count="tag.count"
                            :checked="activeTags.includes(tag.label)"
                            @change="toggleTag(tag.label)"
                        />
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
                                <option value="pop">פופולריות</option>
                                <option value="price-asc">
                                    מחיר נמוך לגבוה
                                </option>
                                <option value="price-desc">
                                    מחיר גבוה לנמוך
                                </option>
                                <option value="new">חדשים</option>
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
   (its desktop position:sticky is an inline style, hence the !important). */
html.tf-mobile .catalog-filters {
    position: static !important;
}
</style>
