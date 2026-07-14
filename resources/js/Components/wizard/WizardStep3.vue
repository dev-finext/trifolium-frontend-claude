<script setup>
// Wizard Step 3 — Compounding Lab. Zone A (identity) + Zone B/C (ingredients)
// + Zone D (composition chart), an optional inline dose strip, and the usage
// directions slot. The parent owns the `formula` object; every mutation flows
// up through emit('patch', …) (the source's setF) and emit('load-saved', …).
import { ref, computed, useSlots } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import ValidationNote from '@/Components/wizard/ValidationNote.vue';
import ZoneA from '@/Components/wizard/ZoneA.vue';
import ZoneBC from '@/Components/wizard/ZoneBC.vue';
import ZoneD from '@/Components/wizard/ZoneD.vue';
import DoseInline from '@/Components/wizard/DoseInline.vue';
import SavedFormulaPicker from '@/Components/wizard/SavedFormulaPicker.vue';
import { useSavedFormulasStore } from '@/stores/saved-formulas';
import { visit } from '@/lib/routes';
import { HERBS, FORMULA_TYPES } from '@/data/mock';

const props = defineProps({
    formula: { type: Object, required: true },
    patientMeds: { type: String, default: '' },
    patientOnMeds: { type: Boolean, default: false },
    noPatient: { type: Boolean, default: false },
    patientLabel: { type: String, default: null },
    canNext: { type: Boolean, default: false },
});
const emit = defineEmits(['patch', 'load-saved', 'back', 'next']);

const slots = useSlots();
const hasDirections = computed(() => !!slots.directions);

// setF/loadSavedFormula bridges — passed down to the zone components so their
// ported logic (setF({...}) / loadSavedFormula(f)) stays 1:1 with the source.
const setF = (patch) => emit('patch', patch);
const loadSavedFormula = (saved) => emit('load-saved', saved);

const savedStore = useSavedFormulasStore();

const ftype = computed(() => FORMULA_TYPES.find((t) => t.id === props.formula.typeId));

// "Save to my list" — persists the formula and routes to הפורמולות שלי.
const savedOpen = ref(false);
const nameError = ref(false);
const savingList = ref(false);

function onSaveToList() {
    // Guard: a formula may never be saved without a name.
    if (!props.formula.name || !props.formula.name.trim()) {
        nameError.value = true;
        return;
    }
    nameError.value = false;

    // Build a SAVED_FORMULAS-shaped entry from the live formula.
    const summary = props.formula.ingredients
        .map((i) => (HERBS.find((h) => h.id === i.herbId) || {}).heb)
        .filter(Boolean)
        .slice(0, 4)
        .join(' · ');
    const saved = {
        id: 'sf_' + Date.now(),
        name: props.formula.name.trim(),
        summary,
        typeId: props.formula.typeId,
        tinctureVolume: props.formula.tinctureVolume,
        capsuleCount: props.formula.capsuleCount,
        capsuleMultiPacks: props.formula.capsuleMultiPacks,
        ingredients: props.formula.ingredients.map((i) => ({ herbId: i.herbId, qty: i.qty })),
        externalNotes: props.formula.externalNotes,
        lastUsed: 'זה עתה נשמרה',
        usageCount: 0,
    };
    // Prepend + flag for the library arrival highlight (store replaces the old
    // window.TFDATA.SAVED_FORMULAS mutation + window.__tfHighlightFormula).
    savedStore.add(saved);

    // Brief loading state, then route to the library.
    savingList.value = true;
    window.setTimeout(() => {
        visit('my-formulas');
        window.scrollTo(0, 0);
    }, 700);
}

// Continue-button blocker reasons (in priority order).
const totalParts = computed(() => props.formula.ingredients.reduce((s, i) => s + (+i.parts || 0), 0));
const blocker = computed(() => {
    if (props.canNext) return null;
    if (props.formula.formulaVolume == null) return { msg: 'נא לבחור נפח פורמולה', target: 'tf-anchor-volume' };
    if (!props.formula.name.trim()) return { msg: 'נא להזין שם פורמולה', target: 'tf-anchor-name' };
    if (props.formula.ingredients.length === 0) return { msg: 'נא להוסיף לפחות רכיב אחד לפורמולה', target: 'tf-anchor-ingredients' };
    if (totalParts.value <= 0) return { msg: 'נא להזין חלקים לפחות לרכיב אחד', target: 'tf-anchor-ingredients' };
    return null;
});
</script>

<template>
    <div class="col gap-24">
        <ZoneA :formula="formula" :set-f="setF" />
        <ZoneBC :formula="formula" :set-f="setF" :patient-meds="patientMeds" :load-saved-formula="loadSavedFormula" />
        <ZoneD :formula="formula" :ftype="ftype" :patient-label="patientLabel" :no-patient="noPatient" />

        <!-- DoseInline is hidden when the directions slot is present — the new
             WizardStep4 card already contains the full dose + timing UI. -->
        <DoseInline v-if="!hasDirections && !noPatient" :formula="formula" :set-f="setF" />

        <!-- Usage directions — embedded at the end of the compounding flow -->
        <slot name="directions" />

        <div class="col gap-12">
            <ValidationNote
                v-if="!noPatient && !canNext && blocker"
                :message="blocker.msg"
                :target="blocker.target"
            />
            <ValidationNote
                v-if="nameError && !formula.name.trim()"
                message="לא ניתן לשמור פורמולה ללא שם — נא להזין שם פורמולה לפני השמירה."
                target="tf-anchor-name"
            />
            <div
                v-if="savingList"
                style="display: flex; align-items: center; gap: 12px; background: var(--accent-tint); color: var(--accent-ink, var(--accent)); border: 1px solid var(--accent); border-radius: var(--r-card); padding: 12px 16px; font-size: 13px; font-weight: 600"
            >
                <div style="width: 18px; height: 18px; flex-shrink: 0; border: 2.5px solid var(--accent-tint-strong); border-top-color: var(--accent); border-radius: 50%; animation: tf-spin 0.7s linear infinite" />
                <span>שומר את הפורמולה — מעביר אותך אל הפורמולות שלי…</span>
            </div>
            <div style="display: flex; justify-content: space-between">
                <button class="btn btn--ghost" @click="emit('back')">
                    <Icon name="arrow_right" :size="16" /> חזור
                </button>
                <div style="display: flex; align-items: center; gap: 12px">
                    <button
                        class="btn btn--ghost save-to-list-btn"
                        title="שמירת הפורמולה לרשימה שלי"
                        aria-label="שמירת הפורמולה לרשימה שלי"
                        style="font-size: 12.5px; gap: 0; justify-content: center"
                        @click="onSaveToList"
                    >
                        <Icon name="save" :size="15" />
                        <span class="save-to-list-label">שמירת הפורמולה לרשימה שלי</span>
                    </button>
                    <button
                        v-if="!noPatient"
                        class="btn btn--primary"
                        :disabled="!canNext"
                        :title="blocker ? blocker.msg : undefined"
                        :style="{ opacity: canNext ? 1 : 0.4, cursor: canNext ? 'pointer' : 'not-allowed', paddingInline: '28px' }"
                        @click="emit('next')"
                    >
                        המשך לאישור
                        <Icon name="arrow_left" :size="16" />
                    </button>
                </div>
            </div>
        </div>

        <SavedFormulaPicker
            v-if="savedOpen"
            @close="savedOpen = false"
            @pick="(saved) => { loadSavedFormula(saved); savedOpen = false; }"
        />
    </div>
</template>

<style>
@keyframes tf-spin { to { transform: rotate(360deg); } }
</style>
