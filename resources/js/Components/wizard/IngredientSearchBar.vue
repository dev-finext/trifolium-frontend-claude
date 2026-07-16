<script setup>
// Ingredient search bar + floating results dropdown. Sits flush above the
// selected-ingredients table; the dropdown floats over the table with a soft
// shadow. Add → close → clear → refocus, so the practitioner can chain
// additions quickly.
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import NewRibbonMark from '@/Components/ui/NewRibbonMark.vue';
import SearchGroupHeader from '@/Components/wizard/SearchGroupHeader.vue';
import SearchResultRow from '@/Components/wizard/SearchResultRow.vue';
import { useModeStore } from '@/stores/mode';

const props = defineProps({
    query: { type: String, default: '' },
    results: { type: Array, required: true },
    // Predicate: is this herb id already in the formula?
    inFormula: { type: Function, required: true },
    patientMeds: { type: String, default: '' },
});
const emit = defineEmits(['update:query', 'add', 'open-preset']);

const { isChinese } = useModeStore();

const open = ref(false);
const wrapRef = ref(null);
const inputRef = ref(null);
// After an add we refocus the input but must NOT reopen the dropdown.
const skipOpen = ref(false);

// Results not yet in the formula — searching is for adding the NEXT ingredient.
const available = computed(() => props.results.filter((h) => !props.inFormula(h.id)));
// Chinese mode: surface the Chinese materia medica first, then the Western
// herbs, split by a labeled divider. (Western mode keeps a single flat list.)
const cnHerbs = computed(() => available.value.filter((h) => h.origin === 'cn'));
const westHerbs = computed(() => available.value.filter((h) => h.origin !== 'cn'));
const grouped = computed(() => isChinese.value && cnHerbs.value.length > 0 && westHerbs.value.length > 0);
const ordered = computed(() => (isChinese.value ? [...cnHerbs.value, ...westHerbs.value] : available.value));

// Close the dropdown when clicking anywhere outside the search area.
function onDown(e) {
    if (wrapRef.value && !wrapRef.value.contains(e.target)) open.value = false;
}
watch(open, (isOpen) => {
    if (isOpen) document.addEventListener('mousedown', onDown);
    else document.removeEventListener('mousedown', onDown);
});
onBeforeUnmount(() => document.removeEventListener('mousedown', onDown));

function handleAdd(herb) {
    emit('add', herb);
    emit('update:query', '');
    open.value = false;
    // Return focus so the practitioner can immediately search for the next one,
    // but keep the dropdown closed until they start typing again.
    skipOpen.value = true;
    requestAnimationFrame(() => inputRef.value && inputRef.value.focus());
}

function onInput(e) {
    emit('update:query', e.target.value);
    open.value = true;
}
function onFocus() {
    if (skipOpen.value) { skipOpen.value = false; return; }
    open.value = true;
}
</script>

<template>
    <div ref="wrapRef" class="relative z-[20]">
        <!-- Search field — prominent accent-bordered box -->
        <div
            class="ingredient-search-row relative flex items-center gap-[10px] py-[12px] px-[14px] bg-accent-tint border-b border-line rounded-tl-card rounded-tr-card"
        >
            <div class="relative flex flex-1 items-center bg-surface border-[1.5px] border-accent rounded-control shadow-[0_1px_4px_rgba(20,18,14,0.06)]">
                <span class="absolute left-[14px] top-[50%] -translate-y-1/2 inline-flex text-accent pointer-events-none">
                    <Icon name="search" :size="20" />
                </span>
                <input
                    ref="inputRef"
                    :value="query"
                    placeholder="חיפוש רכיב להוספה..."
                    class="ingredient-search-input w-full h-[50px] ps-[50px] pe-[18px] border-none outline-none bg-transparent text-[16px] font-semibold [font-family:inherit] text-ink rounded-control"
                    @input="onInput"
                    @focus="onFocus"
                />
            </div>
            <button
                class="tf-preset-btn relative overflow-hidden inline-flex items-center gap-[8px] shrink-0 h-[50px] ps-[18px] pe-[44px] text-[13.5px] font-bold [font-family:inherit] whitespace-nowrap text-accent bg-surface border-[1.5px] border-accent rounded-control cursor-pointer transition-[background,color] duration-[120ms] ease-[ease]"
                @click="emit('open-preset')"
            >
                <NewRibbonMark :top="9" :left="-32" />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <path d="M12 11h4M12 16h4M8 11h.01M8 16h.01" />
                </svg>
                בחר פורמולה מוכנה
                <!-- Mobile-only "חדש" pill (desktop uses the corner ribbon above) -->
                <span class="tf-new-badge">חדש</span>
            </button>
        </div>

        <!-- Floating results dropdown — overlays the table below -->
        <div
            v-if="open"
            class="absolute top-full left-0 right-0 max-h-[360px] overflow-y-auto bg-surface border border-line border-t-0 rounded-bl-card rounded-br-card shadow-[0_18px_40px_rgba(20,18,14,0.16)] z-[60]"
        >
            <div v-if="available.length === 0" class="muted py-[20px] px-[18px] text-[14px] text-center">
                {{ query ? 'לא נמצאו רכיבים מתאימים' : 'כל הרכיבים המתאימים כבר נוספו' }}
            </div>
            <template v-else-if="grouped">
                <SearchGroupHeader label="רפואה סינית" first />
                <SearchResultRow v-for="h in cnHerbs" :key="h.id" :herb="h" :patient-meds="patientMeds" @add="handleAdd(h)" />
                <SearchGroupHeader label="רפואה מערבית" />
                <SearchResultRow v-for="h in westHerbs" :key="h.id" :herb="h" :patient-meds="patientMeds" @add="handleAdd(h)" />
            </template>
            <template v-else>
                <SearchResultRow v-for="h in ordered" :key="h.id" :herb="h" :patient-meds="patientMeds" @add="handleAdd(h)" />
            </template>
        </div>
    </div>
</template>

<style>
.tf-preset-btn:hover { background: var(--accent) !important; color: var(--on-accent) !important; }
</style>
