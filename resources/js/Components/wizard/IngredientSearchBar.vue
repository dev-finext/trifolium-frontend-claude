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
    <div ref="wrapRef" style="position: relative; z-index: 20">
        <!-- Search field — prominent accent-bordered box -->
        <div
            class="ingredient-search-row"
            style="position: relative; padding: 12px 14px; background: var(--accent-tint); border-bottom: 1px solid var(--line); border-top-left-radius: var(--r-card); border-top-right-radius: var(--r-card); display: flex; gap: 10px; align-items: center"
        >
            <div style="flex: 1; position: relative; display: flex; align-items: center; background: #fff; border: 1.5px solid var(--accent); border-radius: var(--r-control); box-shadow: 0 1px 4px rgba(20, 18, 14, 0.06)">
                <span style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--accent); pointer-events: none; display: inline-flex">
                    <Icon name="search" :size="20" />
                </span>
                <input
                    ref="inputRef"
                    :value="query"
                    placeholder="חיפוש רכיב להוספה..."
                    class="ingredient-search-input"
                    style="width: 100%; height: 50px; border: none; outline: none; background: transparent; padding-inline-start: 50px; padding-inline-end: 18px; font-size: 16px; font-weight: 600; font-family: inherit; color: var(--ink); border-radius: var(--r-control)"
                    @input="onInput"
                    @focus="onFocus"
                />
            </div>
            <button
                class="tf-preset-btn"
                style="position: relative; overflow: hidden; display: inline-flex; align-items: center; gap: 8px; height: 50px; padding-inline-start: 18px; padding-inline-end: 44px; border: 1.5px solid var(--accent); border-radius: var(--r-control); background: #fff; color: var(--accent); font-size: 13.5px; font-weight: 700; cursor: pointer; flex-shrink: 0; white-space: nowrap; font-family: inherit; transition: background .12s, color .12s"
                @click="emit('open-preset')"
            >
                <NewRibbonMark :top="9" :left="-32" />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <path d="M12 11h4M12 16h4M8 11h.01M8 16h.01" />
                </svg>
                בחר פורמולה מוכנה
            </button>
        </div>

        <!-- Floating results dropdown — overlays the table below -->
        <div
            v-if="open"
            style="position: absolute; top: 100%; left: 0; right: 0; background: var(--surface); border: 1px solid var(--line); border-top: none; border-bottom-left-radius: var(--r-card); border-bottom-right-radius: var(--r-card); box-shadow: 0 18px 40px rgba(20, 18, 14, 0.16); max-height: 360px; overflow-y: auto; z-index: 60"
        >
            <div v-if="available.length === 0" class="muted" style="padding: 20px 18px; font-size: 14px; text-align: center">
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
.tf-preset-btn:hover { background: var(--accent) !important; color: #fff !important; }
</style>
