<script setup>
// Edit-patient modal — reuses NewPatientForm, pre-filled with the
// selected patient's details. Same fields as "new patient", but the
// data is already populated and the CTA saves the changes.
import { computed, ref } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import NewPatientForm from '@/Components/wizard/NewPatientForm.vue';
import PatientAvatar from '@/Components/wizard/PatientAvatar.vue';
import { useModal } from '@/composables/useModal';

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
    return !!(f.firstName?.trim() && f.lastName?.trim() && f.phone?.trim() && ageValid && f.sex
        && f.onMeds !== null
        && (!needsRepro || (f.pregnant !== null && f.breastfeeding !== null))
        && (f.onMeds !== true || f.medsDeclarationAck === true));
});

const { dialogRef } = useModal(() => emit('close'));
</script>

<template>
    <div
        class="fixed inset-0 flex items-start justify-center py-[48px] px-[24px] overflow-y-auto bg-[rgba(20,30,18,0.45)] z-[200] backdrop-blur-[2px]"
        @click="emit('close')"
    >
        <div
            ref="dialogRef"
            role="dialog"
            aria-modal="true"
            tabindex="-1"
            aria-labelledby="edit-patient-title"
            class="w-[560px] max-w-full m-auto overflow-hidden bg-surface rounded-[12px] shadow-[0_40px_80px_-30px_rgba(20,30,18,0.6)]"
            @click.stop
        >
            <!-- header -->
            <div class="relative flex items-center gap-[14px] py-[20px] px-[24px] border-b border-line">
                <PatientAvatar :initials="patient.initials" sel />
                <div class="flex-1 min-w-0">
                    <div class="mb-[3px] text-[11px] tracking-[.08em] uppercase font-semibold text-ink-3">
                        עריכת פרטי מטופל
                    </div>
                    <div id="edit-patient-title" class="text-[17px] font-bold text-ink">
                        {{ `${form.firstName} ${form.lastName}`.trim() || patient.heb }}
                    </div>
                </div>
                <button
                    type="button"
                    aria-label="סגירה"
                    class="inline-flex items-center justify-center w-[34px] h-[34px] bg-surface-sunk border-none rounded-[8px] cursor-pointer"
                    @click="emit('close')"
                >
                    <Icon name="x" :size="18" color="var(--ink-2)" />
                </button>
            </div>

            <!-- body — the same fields as new-patient, pre-filled -->
            <div class="pt-[22px] px-[24px] pb-[26px]">
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
