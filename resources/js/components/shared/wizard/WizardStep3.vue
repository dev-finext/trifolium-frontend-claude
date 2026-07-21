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
// Success popup shown after saving when a patient IS selected (there we stay
// on the page so the practitioner can carry on to checkout).
const savedPopup = ref(false);

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

    // With a patient, saving is a SECONDARY action alongside checkout — just
    // confirm with a popup and stay put. Without a patient ("ללא מטופל"), the
    // whole flow is about the library, so route there.
    if (props.noPatient) {
        savingList.value = true;
        window.setTimeout(() => {
            visit('my-formulas');
            window.scrollTo(0, 0);
        }, 700);
    } else {
        savedPopup.value = true;
    }
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

        <!-- Save-success popup (patient flow): confirm and stay on the page. -->
        <div
            v-if="savedPopup"
            class="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(20,28,24,0.5)] p-[20px]"
            @click.self="savedPopup = false"
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label="הפורמולה נשמרה"
                class="w-[min(420px,100%)] rounded-[12px] bg-surface p-[26px] text-center shadow-[0_30px_80px_-20px_rgba(20,28,24,0.55)]"
            >
                <div
                    class="mx-auto mb-[16px] inline-flex h-[56px] w-[56px] items-center justify-center rounded-full border border-accent-tint-strong bg-accent-tint"
                >
                    <Icon
                        name="check"
                        :size="26"
                        color="var(--accent)"
                        :stroke="2.4"
                    />
                </div>
                <h3 class="m-0 text-[18px] font-bold text-ink">
                    הפורמולה נשמרה לרשימה שלי
                </h3>
                <p class="mt-[8px] text-[13.5px] leading-[1.5] text-ink-3">
                    תוכל/י לטעון אותה מ״הפורמולות שלי״ בכל עת.
                </p>
                <div class="mt-[20px] flex justify-center gap-[10px]">
                    <button
                        class="btn btn--ghost"
                        @click="visit('my-formulas')"
                    >
                        למעבר לפורמולות שלי
                    </button>
                    <button
                        class="btn btn--primary px-[24px]"
                        @click="savedPopup = false"
                    >
                        המשך
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
@keyframes tf-spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
