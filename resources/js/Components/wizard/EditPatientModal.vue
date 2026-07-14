<script setup>
// Edit-patient modal — reuses NewPatientForm, pre-filled with the
// selected patient's details. Same fields as "new patient", but the
// data is already populated and the CTA saves the changes.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import NewPatientForm from '@/Components/wizard/NewPatientForm.vue';
import PatientAvatar from '@/Components/wizard/PatientAvatar.vue';

const props = defineProps({
    /** Raw patient record (for the header avatar/name fallback). */
    patient: { type: Object, required: true },
    /** Pre-filled NewPatientForm-shaped state (see patientToForm). */
    initial: { type: Object, required: true },
});

const emit = defineEmits(['close', 'save']);

const form = ref({ ...props.initial });

// Same validity rule as the wizard's step-1 "new patient" gating.
const canSave = computed(() => {
    const f = form.value;
    const ageNum = Number(f.age);
    const ageValid = f.age !== '' && ageNum >= 0 && ageNum <= 120;
    const needsRepro = f.sex === 'female' && ageValid && ageNum >= 15 && ageNum <= 60;
    return !!(f.firstName && f.lastName && f.phone && ageValid && f.sex
        && f.onMeds !== null
        && (!needsRepro || (f.pregnant !== null && f.breastfeeding !== null))
        && (f.onMeds !== true || f.medsDeclarationAck === true));
});

function onKey(e) {
    if (e.key === 'Escape') emit('close');
}
onMounted(() => document.addEventListener('keydown', onKey));
onBeforeUnmount(() => document.removeEventListener('keydown', onKey));
</script>

<template>
    <div
        style="position: fixed; inset: 0; z-index: 200; background: rgba(20,30,18,0.45); display: flex; align-items: flex-start; justify-content: center; padding: 48px 24px; overflow-y: auto; backdrop-filter: blur(2px)"
        @click="emit('close')"
    >
        <div
            style="width: 560px; max-width: 100%; background: var(--surface); border-radius: 12px; overflow: hidden; margin: auto; box-shadow: 0 40px 80px -30px rgba(20,30,18,0.6)"
            @click.stop
        >
            <!-- header -->
            <div style="display: flex; align-items: center; gap: 14px; padding: 20px 24px; border-bottom: 1px solid var(--line); position: relative">
                <PatientAvatar :initials="patient.initials" sel />
                <div style="flex: 1; min-width: 0">
                    <div style="font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-3); font-weight: 600; margin-bottom: 3px">
                        עריכת פרטי מטופל
                    </div>
                    <div style="font-size: 17px; font-weight: 700; color: var(--ink)">
                        {{ `${form.firstName} ${form.lastName}`.trim() || patient.heb }}
                    </div>
                </div>
                <button
                    type="button"
                    aria-label="סגירה"
                    style="width: 34px; height: 34px; border-radius: 8px; border: none; background: var(--surface-sunk); cursor: pointer; display: inline-flex; align-items: center; justify-content: center"
                    @click="emit('close')"
                >
                    <Icon name="x" :size="18" color="var(--ink-2)" />
                </button>
            </div>

            <!-- body — the same fields as new-patient, pre-filled -->
            <div style="padding: 22px 24px 26px">
                <NewPatientForm
                    v-model:value="form"
                    :can-continue="canSave"
                    submit-label="שמור שינויים"
                    @continue="emit('save', form)"
                />
            </div>
        </div>
    </div>
</template>
