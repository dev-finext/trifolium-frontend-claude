<script setup>
// Wizard Step 3 — Compounding Lab. Zone A (identity) + Zone B/C (ingredients)
// + Zone D (composition chart), an optional inline dose strip, and the usage
// directions slot. The parent owns the `formula` object; every mutation flows
// up through emit('patch', …) (the source's setF) and emit('load-saved', …).
import { ref, computed, useSlots } from 'vue';
import DoseInline from '@/components/shared/wizard/DoseInline.vue';
import SavedFormulaPicker from '@/components/shared/wizard/SavedFormulaPicker.vue';
import ValidationNote from '@/components/shared/wizard/ValidationNote.vue';
import ZoneA from '@/components/shared/wizard/ZoneA.vue';
import ZoneBC from '@/components/shared/wizard/ZoneBC.vue';
import Icon from '@/components/ui/Icon.vue';
import { HERBS } from '@/data/mock';
import { visit } from '@/lib/routes';
import { useSavedFormulasStore } from '@/stores/savedFormulas';

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
        ingredients: props.formula.ingredients.map((i) => ({
            herbId: i.herbId,
            qty: i.qty,
        })),
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
const totalParts = computed(() =>
    props.formula.ingredients.reduce((s, i) => s + (+i.parts || 0), 0),
);
const blocker = computed(() => {
    if (props.canNext) {
        return null;
    }

    if (props.formula.formulaVolume == null) {
        return { msg: 'נא לבחור נפח פורמולה', target: 'tf-anchor-volume' };
    }

    if (!props.formula.name.trim()) {
        return { msg: 'נא להזין שם פורמולה', target: 'tf-anchor-name' };
    }

    if (props.formula.ingredients.length === 0) {
        return {
            msg: 'נא להוסיף לפחות רכיב אחד לפורמולה',
            target: 'tf-anchor-ingredients',
        };
    }

    if (totalParts.value <= 0) {
        return {
            msg: 'נא להזין חלקים לפחות לרכיב אחד',
            target: 'tf-anchor-ingredients',
        };
    }

    return null;
});
</script>

<template>
    <div class="col gap-[24px]">
        <ZoneA :formula="formula" :set-f="setF" />
        <ZoneBC
            :formula="formula"
            :set-f="setF"
            :patient-meds="patientMeds"
            :load-saved-formula="loadSavedFormula"
        />

        <!-- DoseInline is hidden when the directions slot is present — the new
             WizardStep4 card already contains the full dose + timing UI. -->
        <DoseInline
            v-if="!hasDirections && !noPatient"
            :formula="formula"
            :set-f="setF"
        />

        <!-- Usage directions — embedded at the end of the compounding flow -->
        <slot name="directions" />

        <div class="col gap-[12px]">
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
                class="flex items-center gap-[12px] rounded-card border border-accent bg-accent-tint px-[16px] py-[12px] text-[13px] font-semibold text-[color:var(--accent-ink,var(--accent))]"
            >
                <div
                    class="h-[18px] w-[18px] shrink-0 animate-[tf-spin_0.7s_linear_infinite] rounded-[50%] border-[2.5px] border-accent-tint-strong border-t-accent"
                />
                <span>שומר את הפורמולה — מעביר אותך אל הפורמולות שלי…</span>
            </div>
            <div class="flex justify-between">
                <button class="btn btn--ghost" @click="emit('back')">
                    <Icon name="arrow_right" :size="16" /> חזור
                </button>
                <div class="flex items-center gap-[12px]">
                    <button
                        class="btn btn--ghost save-to-list-btn justify-center gap-0 text-[12.5px]"
                        title="שמירת הפורמולה לרשימה שלי"
                        aria-label="שמירת הפורמולה לרשימה שלי"
                        @click="onSaveToList"
                    >
                        <Icon name="save" :size="15" />
                        <span class="save-to-list-label"
                            >שמירת הפורמולה לרשימה שלי</span
                        >
                    </button>
                    <button
                        v-if="!noPatient"
                        class="btn btn--primary ps-[28px] pe-[28px]"
                        :disabled="!canNext"
                        :title="blocker ? blocker.msg : undefined"
                        :class="
                            canNext
                                ? 'cursor-pointer opacity-100'
                                : 'cursor-not-allowed opacity-40'
                        "
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
            @pick="
                (saved) => {
                    loadSavedFormula(saved);
                    savedOpen = false;
                }
            "
        />
    </div>
</template>

<style>
@keyframes tf-spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
