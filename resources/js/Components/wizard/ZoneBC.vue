<script setup>
// ZONE B+C — Merged block: ingredient search + selected-ingredients table.
// Always interactive — but the continue button (in WizardStep3) blocks
// submission if the Zone A volume is not yet chosen.
import { ref, computed } from 'vue';
import IngredientSearchBar from '@/Components/wizard/IngredientSearchBar.vue';
import SelectedColumn from '@/Components/wizard/SelectedColumn.vue';
import PresetFormulaPicker from '@/Components/wizard/PresetFormulaPicker.vue';
import { useModeStore } from '@/stores/mode';
import { HERBS, FORMULA_TYPES, PRESET_FORMULAS, FREEPOUR_FORMULAS } from '@/data/mock';
import {
    reflowParts, isHerbCompatible, herbMatchesQuery, sortHerbsByQuery, findInteractions,
} from '@/Components/wizard/wizard-lib';

const props = defineProps({
    formula: { type: Object, required: true },
    // Patch function supplied by WizardStep3 → emit('patch', …).
    setF: { type: Function, required: true },
    patientMeds: { type: String, default: '' },
    // Load an editable formula into the lab (the picker's "mine"/"system" tabs).
    loadSavedFormula: { type: Function, required: true },
});

const { isChinese } = useModeStore();

const search = ref('');
const presetOpen = ref(false);

const ftype = computed(() => FORMULA_TYPES.find((t) => t.id === props.formula.typeId));
const volume = computed(() => props.formula.formulaVolume);

// Preset base formula (if loaded) — from the classic library or free-pour shelf.
const presetBase = computed(() => {
    if (!props.formula.presetBaseId) return null;
    return (PRESET_FORMULAS || []).find((p) => p.id === props.formula.presetBaseId)
        || (FREEPOUR_FORMULAS || []).find((p) => p.id === props.formula.presetBaseId)
        || null;
});

const inFormula = (id) => props.formula.ingredients.find((i) => i.herbId === id);

function add(herb) {
    if (inFormula(herb.id)) return;
    let next = [...props.formula.ingredients, { herbId: herb.id, pct: 0, qty: 0, parts: '', preset: false }];
    next = reflowParts(next, volume.value || 0);
    props.setF({ ingredients: next });
}
// Load a preset formula — places its ingredients as locked base rows.
function loadPreset(preset) {
    const nonPreset = props.formula.ingredients.filter((i) => !i.preset);
    const presetIngredients = preset.ingredients.map((pi) => ({
        herbId: pi.herbId, parts: pi.parts, pct: 0, qty: 0, preset: true,
    }));
    props.setF({ ingredients: reflowParts([...presetIngredients, ...nonPreset], volume.value || 0), presetBaseId: preset.id });
    presetOpen.value = false;
}
// Clear preset — remove all locked rows, keep user-added ones.
function clearPreset() {
    const nonPreset = props.formula.ingredients.filter((i) => !i.preset);
    props.setF({ ingredients: reflowParts(nonPreset, volume.value || 0), presetBaseId: null });
}
// Unified parts model: edit relative parts; pct & qty derived from Σparts + volume.
function update({ idx, value }) {
    if (props.formula.ingredients[idx] && props.formula.ingredients[idx].preset) return;
    const v = value === '' ? '' : Math.max(0, +value || 0);
    let next = props.formula.ingredients.map((row, i) => (i === idx ? { ...row, parts: v } : row));
    next = reflowParts(next, volume.value || 0);
    props.setF({ ingredients: next });
}
function remove(idx) {
    if (props.formula.ingredients[idx] && props.formula.ingredients[idx].preset) return;
    let next = props.formula.ingredients.filter((_, i) => i !== idx);
    next = reflowParts(next, volume.value || 0);
    props.setF({ ingredients: next });
}

const filtered = computed(() => sortHerbsByQuery(
    HERBS.filter((h) => isHerbCompatible(h, props.formula.typeId) && herbMatchesQuery(h, search.value, { allowPinyin: isChinese.value })),
    search.value, isChinese.value,
));

const totalPct = computed(() => props.formula.ingredients.reduce((s, i) => s + (+i.pct || 0), 0));

// Formula-level interaction alerts.
const interactionAlerts = computed(() => {
    const alerts = [];
    props.formula.ingredients.forEach((row) => {
        findInteractions(row.herbId, props.patientMeds).forEach((k) => {
            const herb = HERBS.find((h) => h.id === row.herbId);
            alerts.push({ herb, k, drug: props.patientMeds.match(k.drug)?.[0] || 'תרופה' });
        });
    });
    return alerts;
});

function onPickEditable(f) {
    if (props.loadSavedFormula) props.loadSavedFormula(f);
    presetOpen.value = false;
}
</script>

<template>
    <section class="relative" id="tf-anchor-ingredients">
        <div class="card relative flex flex-col overflow-visible">
            <IngredientSearchBar
                v-model:query="search"
                :results="filtered"
                :in-formula="inFormula"
                :patient-meds="patientMeds"
                @add="add"
                @open-preset="presetOpen = true"
            />

            <SelectedColumn
                :formula="formula"
                :ftype="ftype"
                :total-pct="totalPct"
                :patient-meds="patientMeds"
                :preset-base="presetBase"
                @update="update"
                @remove="remove"
                @clear-preset="clearPreset"
            />
        </div>

        <!-- Drug-interaction warning — standalone box, set apart from the table. -->
        <div
            v-if="interactionAlerts.length > 0"
            role="alert"
            class="flex items-start gap-[11px] mt-[16px] py-[12px] px-[16px] text-danger bg-[#faf0ed] border border-[#e6c3ba] rounded-card"
        >
            <span class="inline-flex items-center justify-center shrink-0 w-[22px] h-[22px] mt-[1px] text-white bg-danger rounded-[50%]">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 7v6" />
                    <path d="M12 17h.01" />
                </svg>
            </span>
            <div class="min-w-0">
                <div class="text-[13.5px] font-semibold leading-[1.45]">אינטראקציה אפשרית — המשך באחריות המטפל</div>
                <div
                    v-for="(a, i) in interactionAlerts.slice(0, 2)" :key="i"
                    class="mt-[4px] text-[12.5px] font-medium leading-[1.5] text-ink-2"
                >
                    <strong>{{ a.herb.lat }}</strong> + <strong>{{ a.drug }}</strong> — {{ a.k.note }}
                </div>
            </div>
        </div>

        <PresetFormulaPicker
            v-if="presetOpen"
            @close="presetOpen = false"
            @pick="loadPreset"
            @pick-editable="onPickEditable"
        />
    </section>
</template>
