<script setup>
// Edit-patient modal — reuses NewPatientForm, pre-filled with the
// selected patient's details. Same fields as "new patient", but the
// data is already populated and the CTA saves the changes.
import { computed, ref } from 'vue';
import NewPatientForm from '@/components/shared/wizard/NewPatientForm.vue';
import PatientAvatar from '@/components/shared/wizard/PatientAvatar.vue';
import Icon from '@/components/ui/Icon.vue';
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
    const needsRepro =
        f.sex === 'female' && ageValid && ageNum >= 15 && ageNum <= 60;

    return !!(
        f.firstName?.trim() &&
        f.lastName?.trim() &&
        f.phone?.trim() &&
        ageValid &&
        f.sex &&
        f.onMeds !== null &&
        (!needsRepro || (f.pregnant !== null && f.breastfeeding !== null)) &&
        (f.onMeds !== true || f.medsDeclarationAck === true)
    );
});

const { dialogRef } = useModal(() => emit('close'));
</script>

<template>
    <div
        class="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-[rgba(20,30,18,0.45)] px-[24px] py-[48px] backdrop-blur-[2px]"
        @click="emit('close')"
    >
        <div
            ref="dialogRef"
            role="dialog"
            aria-modal="true"
            tabindex="-1"
            aria-labelledby="edit-patient-title"
            class="m-auto w-[560px] max-w-full overflow-hidden rounded-[12px] bg-surface shadow-[0_40px_80px_-30px_rgba(20,30,18,0.6)]"
            @click.stop
        >
            <!-- header -->
            <div
                class="relative flex items-center gap-[14px] border-b border-line px-[24px] py-[20px]"
            >
                <PatientAvatar :initials="patient.initials" sel />
                <div class="min-w-0 flex-1">
                    <div
                        class="mb-[3px] text-[11px] font-semibold tracking-[.08em] text-ink-3 uppercase"
                    >
                        עריכת פרטי מטופל
                    </div>
                    <div
                        id="edit-patient-title"
                        class="text-[17px] font-bold text-ink"
                    >
                        {{
                            `${form.firstName} ${form.lastName}`.trim() ||
                            patient.heb
                        }}
                    </div>
                </div>
                <button
                    type="button"
                    aria-label="סגירה"
                    class="inline-flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[8px] border-none bg-surface-sunk"
                    @click="emit('close')"
                >
                    <Icon name="x" :size="18" color="var(--ink-2)" />
                </button>
            </div>

            <!-- body — the same fields as new-patient, pre-filled -->
            <div class="px-[24px] pt-[22px] pb-[26px]">
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
