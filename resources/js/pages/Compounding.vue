<script setup>
// Formula Wizard — 3-step flow (the top-level Wizard shell from wizard-v5.jsx).
// Steps: 1 בחירת מטופל · 2 רקיחת פורמולה (with usage directions at its end) ·
// 3 אישור / שמירה.
//
// The prototype received dirty/reset wiring as App-level props; here those cross
// -page concerns live in the wizard store (dirty → mode-switch confirmation,
// resetSignal → wipe-and-restart after a confirmed style switch) and the
// pending-formula hand-off from "My Formulas".
import { Head } from '@inertiajs/vue3';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import StepIndicator from '@/components/shared/wizard/StepIndicator.vue';
import { VOLUME_RULES } from '@/components/shared/wizard/wizard-rules.js';
import WizardFooter from '@/components/shared/wizard/WizardFooter.vue';
import WizardStep2 from '@/components/shared/wizard/WizardStep2.vue';
import WizardStep3 from '@/components/shared/wizard/WizardStep3.vue';
import WizardStep4 from '@/components/shared/wizard/WizardStep4.vue';
import WizardStep5 from '@/components/shared/wizard/WizardStep5.vue';
import { FORMULA_TYPES, HERBS, PATIENTS } from '@/data/mock';
import { useWizardStore } from '@/stores/wizard';

const STEPS = [
    { n: 1, key: 'patient', label: 'בחירת מטופל' },
    { n: 2, key: 'compose', label: 'רקיחת פורמולה' },
    { n: 3, key: 'confirm', label: 'אישור' },
];

// Default formula state — used on first mount AND when restarting after a
// treatment-style switch (we clear the formula but keep the patient).
const makeDefaultFormula = () => ({
    name: '', // internal name (הפורמולות שלי) — never printed on the label
    labelName: '', // the name printed on the label sticker (המדבקה)
    typeId: 'tincture',
    formulaVolume: null,
    tinctureVolume: null,
    evaporation: 'none',
    capsuleCount: null,
    capsuleMultiPacks: false,
    // Powder / tea only: split the batch into N separate packages.
    splitPackaging: false,
    packageCount: 2,
    // Clean start — the practitioner builds the formula from an empty slate.
    ingredients: [],
    dose: { qty: 20, unit: 'drops', perDay: 3 },
    tags: ['לפני האוכל', 'לפני השינה'],
    // No prefilled instructions — example text lives in the textarea placeholders (step 4).
    externalNotes: '',
    internalNotes: '',
    usePoints: false,
    paymentRoute: 'patient',
});

const wizard = useWizardStore();

const step = ref(1);
// Furthest step the user has reached. Lets them step "חזור" / "הבא" freely
// through the process bar without losing any already-entered conditions.
const maxStep = ref(1);
function go(n) {
    step.value = n;
    maxStep.value = Math.max(maxStep.value, n);
}

// Whenever a new step (page) opens in the formula-building flow, jump back to
// the top so the practitioner always starts reading from the beginning.
watch(step, () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
});

// ─── Step 1 — patient ──────────────────────────────────────────
const patientOption = ref('existing');
// No patient pre-selected — the practitioner must choose one proactively.
const existingPatientId = ref(null);
const newPatient = ref({
    firstName: '',
    lastName: '',
    phone: '',
    age: '',
    ageEstimated: false,
    sex: '',
    pregnant: null,
    breastfeeding: null,
    onMeds: null,
    meds: [],
    medsDeclarationAck: false,
});

// ─── Shared formula state (Step 2+) ───────────────────────────
// Percentages are the source of truth; `qty` is derived (pct% × formulaVolume)
// and kept in sync so downstream steps (pricing, step 4/5) keep working
// unchanged. formulaVolume starts as null — the practitioner MUST pick one
// before the ingredient builder unlocks.
const formula = ref(makeDefaultFormula());
const setF = (patch) => {
    formula.value = { ...formula.value, ...patch };
};

// Report whether the formula has any ingredients — drives whether a style
// switch needs the wipe-confirmation popup (mode store reads state.dirty).
watch(
    () => formula.value.ingredients.length,
    (len) => wizard.setDirty(len > 0),
    { immediate: true },
);
onBeforeUnmount(() => wizard.setDirty(false));

// Treatment-style switch: when the mode store bumps resetSignal, we DON'T
// unmount / return to patient selection. We keep the chosen patient, wipe the
// formula clean, and drop the user back on the compose step (step 2) so they
// restart the formula in the newly-selected style.
// A plain watch never fires on mount, so the initial value is naturally
// skipped (matching the prototype's didMountReset ref).
watch(
    () => wizard.state.resetSignal,
    () => {
        formula.value = makeDefaultFormula();
        step.value = 2;
        maxStep.value = 2;
    },
);

// Load a saved formula wholesale (used by the picker inside step 2, and by the
// pending hand-off from "My Formulas"). Saved formulas store legacy qty;
// normalize to percentages on load.
function loadSavedFormula(saved) {
    const sumQty =
        saved.ingredients.reduce((s, i) => s + (+i.qty || 0), 0) || 1;
    // Pick the volume that matches the saved type's unit.
    const fv =
        saved.typeId === 'capsule'
            ? (saved.capsuleCount ?? 200)
            : (saved.tinctureVolume ?? 200);
    const normalized = saved.ingredients.map((i) => {
        const pct = Math.round((i.qty / sumQty) * 1000) / 10; // 1-decimal

        // Chinese mode: keep the saved amount as the part ratio so the parts
        // builder reproduces the same proportions.
        return {
            herbId: i.herbId,
            pct,
            qty: Math.round((pct / 100) * fv),
            parts: Math.max(1, Math.round(i.qty)),
        };
    });
    formula.value = {
        ...formula.value,
        name: saved.name,
        typeId: saved.typeId,
        formulaVolume: fv,
        tinctureVolume: saved.tinctureVolume ?? formula.value.tinctureVolume,
        evaporation: saved.evaporation ?? formula.value.evaporation,
        capsuleCount: saved.capsuleCount ?? formula.value.capsuleCount,
        capsuleMultiPacks:
            saved.capsuleMultiPacks ?? formula.value.capsuleMultiPacks,
        ingredients: normalized,
    };
}

// On mount: consume any pending formula parked by "My Formulas" before routing
// here. We preload the formula but DELIBERATELY stay on step 1 (patient
// selection) — every loaded formula must first be tied to a patient before
// entering the lab. The composed formula is waiting on step 2.
onMounted(() => {
    const pending = wizard.consumePendingFormula();

    if (pending) {
        loadSavedFormula(pending);
        // Stay on step 1 (patient selection); do not jump to the lab.
    }
});

// ─── Patient label + meds (footer + interactions) ─────────────
const existingPatient = computed(() =>
    PATIENTS.find((p) => p.id === existingPatientId.value),
);
const noPatient = computed(() => patientOption.value === 'none');
const patientLabel = computed(() => {
    if (noPatient.value) {
        return null;
    }

    if (patientOption.value === 'existing') {
        return existingPatient.value?.heb || '—';
    }

    const np = newPatient.value;

    return np.firstName ? `${np.firstName} ${np.lastName}`.trim() : '—';
});
const patientMeds = computed(() => {
    if (patientOption.value === 'new') {
        const m = newPatient.value.meds;

        return newPatient.value.onMeds
            ? Array.isArray(m)
                ? m.join(', ')
                : m
            : '';
    }

    if (patientOption.value === 'existing') {
        const m = existingPatient.value?.meds;

        return m && m.length ? m.join(', ') : '';
    }

    return '';
});
// Whether the chosen patient is on any medication — drives the interaction-
// safety declaration on the confirmation step.
const patientOnMeds = computed(() => {
    if (patientOption.value === 'new') {
        return newPatient.value.onMeds === true;
    }

    if (patientOption.value === 'existing') {
        const m = existingPatient.value?.meds;

        return !!(m && m.length);
    }

    return false;
});

// Last-step label adapts when "no patient".
const stepsResolved = computed(() =>
    STEPS.map((s) =>
        s.n === 3 && noPatient.value ? { ...s, label: 'שמירה' } : s,
    ),
);

// ─── Footer values derived live from formula ──────────────────
const ftype = computed(() =>
    FORMULA_TYPES.find((t) => t.id === formula.value.typeId),
);
const itemsCount = computed(() => formula.value.ingredients.length);
// Rough pricing for the footer summary.
const subtotalILS = computed(() => {
    const totalPriceBase = formula.value.ingredients.reduce((s, i) => {
        const h = HERBS.find((h) => h.id === i.herbId);

        return s + (h ? h.price * i.qty : 0);
    }, 0);
    const compoundingFee = 35;
    // Each EXTRA package (beyond the first) adds ₪10 — powder/tea split packaging.
    const extraPackFee =
        formula.value.splitPackaging &&
        (formula.value.typeId === 'powder' || formula.value.typeId === 'tea')
            ? Math.max(0, (formula.value.packageCount || 1) - 1) * 10
            : 0;

    return Math.round(totalPriceBase + compoundingFee + extraPackFee);
});

// Footer volume label = the volume chosen in Zone A (single source of truth).
const footerVolume = computed(() => ({
    value: formula.value.formulaVolume || 0,
    unit:
        VOLUME_RULES?.[formula.value.typeId]?.unit || ftype.value?.unit || 'ml',
}));

const canNext = computed(() => {
    if (step.value === 1) {
        if (patientOption.value === 'existing') {
            return !!existingPatientId.value;
        }

        if (patientOption.value === 'new') {
            const p = newPatient.value;
            const ageNum = Number(p.age);
            const ageValid = p.age !== '' && ageNum >= 0 && ageNum <= 120;
            const needsRepro =
                p.sex === 'female' && ageValid && ageNum >= 15 && ageNum <= 60;

            return (
                p.firstName &&
                p.lastName &&
                p.phone &&
                ageValid &&
                p.sex &&
                p.onMeds !== null &&
                (!needsRepro ||
                    (p.pregnant !== null && p.breastfeeding !== null)) &&
                (p.onMeds !== true || p.medsDeclarationAck === true)
            );
        }

        if (patientOption.value === 'none') {
            return true;
        }
    }

    if (step.value === 2) {
        const f = formula.value;

        if (f.ingredients.length < 1) {
            return false;
        }

        if (!f.name.trim()) {
            return false;
        }

        if (!f.formulaVolume) {
            return false;
        }

        // Unified parts model (both styles): need a volume and at least one
        // ingredient carrying a positive part count. The system normalises to 100%.
        return f.ingredients.some((i) => (+i.parts || 0) > 0);
    }

    if (step.value === 3) {
        return true;
    }

    return true;
});

// Shared process navigation — both the top process bar and the bottom summary
// bar use these. "הבא" is disciplined to the formula state: only active when
// the current step is actually valid to advance (canNext).
const canBack = computed(() => step.value > 1);
const canForward = computed(() => canNext.value && step.value < STEPS.length);
function goBack() {
    if (step.value > 1) {
        step.value -= 1;
    }
}
function goForward() {
    if (canForward.value) {
        go(step.value + 1);
    }
}
</script>

<template>
    <Head title="הכנת פורמולה" />
    <div class="formula-prep bg-bg">
        <div class="[zoom:1.13]">
            <!-- Step indicator -->
            <StepIndicator
                :steps="stepsResolved"
                :current="step"
                :max-step="maxStep"
                :can-back="canBack"
                :can-forward="canForward"
                @jump="go"
                @back="goBack"
                @forward="goForward"
            />

            <!-- Mobile progress header (CSS-gated; replaces the desktop step
                 indicator, which the mobile stylesheet hides). Sticky under the
                 top bar so the practitioner always knows where they are. -->
            <div class="wizard-mobile-progress" aria-hidden="true">
                <div class="wizard-mobile-progress__row">
                    <span class="wizard-mobile-progress__step num"
                        >{{ step }}/{{ stepsResolved.length }}</span
                    >
                    <span class="wizard-mobile-progress__label">{{
                        stepsResolved[step - 1]?.label
                    }}</span>
                </div>
                <div class="wizard-mobile-progress__track">
                    <span
                        v-for="progressStep in stepsResolved"
                        :key="progressStep.n"
                        :class="[
                            'wizard-mobile-progress__seg',
                            {
                                'wizard-mobile-progress__seg--done':
                                    progressStep.n <= step,
                            },
                        ]"
                    />
                </div>
            </div>

            <!-- Step content -->
            <main class="px-[24px] pt-[40px] pb-[120px]">
                <div class="mx-auto my-0 max-w-(--maxw-lab)">
                    <div v-if="step === 1" class="mx-auto my-0 max-w-[720px]">
                        <WizardStep2
                            :option="patientOption"
                            :existing-patient-id="existingPatientId"
                            :new-patient="newPatient"
                            :can-next="canNext"
                            @update:option="patientOption = $event"
                            @update:existing-patient-id="
                                existingPatientId = $event
                            "
                            @update:new-patient="newPatient = $event"
                            @next="canNext && go(2)"
                        />
                    </div>

                    <WizardStep3
                        v-else-if="step === 2"
                        :formula="formula"
                        :patient-meds="patientMeds"
                        :patient-on-meds="patientOnMeds"
                        :no-patient="noPatient"
                        :patient-label="patientLabel"
                        :can-next="canNext"
                        @patch="setF"
                        @load-saved="loadSavedFormula"
                        @back="go(1)"
                        @next="canNext && go(3)"
                    >
                        <!-- Usage directions at the end of the compose step (step 4,
                             embedded). Only when a patient is selected. -->
                        <template #directions>
                            <WizardStep4
                                v-if="!noPatient"
                                :formula="formula"
                                :show-dose="false"
                                embedded
                                @patch="setF"
                            />
                        </template>
                    </WizardStep3>

                    <WizardStep5
                        v-else-if="step === 3"
                        :formula="formula"
                        :patient-label="patientLabel"
                        :no-patient="noPatient"
                        :patient-on-meds="patientOnMeds"
                        :patient-meds="patientMeds"
                        @patch="setF"
                        @back="go(2)"
                    />
                </div>
            </main>

            <!-- Sticky footer — from step 1 onwards. -->
            <WizardFooter
                :patient-label="patientLabel"
                :no-patient="noPatient"
                :preparation="ftype?.heb || '—'"
                :items="itemsCount"
                :volume="footerVolume.value"
                :volume-unit="footerVolume.unit"
                :total="subtotalILS"
                :can-back="canBack"
                :can-forward="canForward"
                @back="goBack"
                @forward="goForward"
            />
        </div>
    </div>
</template>
