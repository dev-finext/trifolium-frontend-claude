<script setup>
// Patient picker — opens after "הוסף". Pick a patient or "ללא מטופל".
// Two modes: 'pick' (search existing patients) and 'new' (inline new-patient
// form, identical to the formula wizard's create-patient flow).
import { computed, ref } from 'vue';
import Icon from '@/components/ui/Icon.vue';
import SearchInput from '@/components/ui/SearchInput.vue';
import PatientRow from '@/components/shared/catalog/PatientRow.vue';
// The prototype resolved this from window.NewPatientForm (shared with the wizard).
import NewPatientForm from '@/components/shared/wizard/NewPatientForm.vue';
import { useModal } from '@/composables/useModal';

const props = defineProps({
    product: { type: Object, required: true },
    patients: { type: Array, required: true },
});

const emit = defineEmits(['close', 'pick']);

const search = ref('');
const mode = ref('pick'); // 'pick' | 'new'
const newPatient = ref({
    firstName: '', lastName: '',
    phone: '',
    age: '', ageEstimated: false, sex: '',
    pregnant: null,
    breastfeeding: null,
    onMeds: null,
    meds: [],
    medsDeclarationAck: false,
});

const q = computed(() => search.value.trim());
const filtered = computed(() => (q.value ? props.patients.filter((p) => p.heb.includes(q.value)) : []));

// Same validation as the formula's new-patient step (wizard).
const canCreate = computed(() => {
    const np = newPatient.value;
    const ageNum = Number(np.age);
    const ageValid = np.age !== '' && ageNum >= 0 && ageNum <= 120;
    const needsRepro = np.sex === 'female' && ageValid && ageNum >= 15 && ageNum <= 60;
    return Boolean(
        np.firstName && np.lastName && np.phone && ageValid && np.sex && np.onMeds !== null
        && (!needsRepro || (np.pregnant !== null && np.breastfeeding !== null))
        && (np.onMeds !== true || np.medsDeclarationAck === true),
    );
});

function handleCreate() {
    const first = newPatient.value.firstName.trim();
    const last = newPatient.value.lastName.trim();
    const heb = `${first} ${last}`.trim();
    const initials = (first[0] || '') + (last[0] || '');
    emit('pick', { id: 'new-' + Date.now(), heb, initials, isNew: true });
}

const { dialogRef } = useModal(() => emit('close'));
</script>

<template>
    <Teleport to="body">
        <div
            class="fixed inset-0 flex items-center justify-center z-[100] p-[24px] bg-[rgba(20,18,14,0.46)] backdrop-blur-[2px] animate-[tf-fade-in_.15s_ease]"
            @click="emit('close')"
        >
            <div
                ref="dialogRef"
                role="dialog"
                aria-modal="true"
                tabindex="-1"
                aria-labelledby="tf-picker-title"
                class="flex flex-col w-[min(520px,100%)] max-h-[84vh] overflow-hidden bg-surface rounded-card shadow-[0_30px_80px_rgba(0,0,0,0.22)]"
                @click.stop
            >
                <!-- Header -->
                <div class="flex items-start gap-[16px] pt-[20px] px-[24px] pb-[16px] border-b border-b-line">
                    <button
                        v-if="mode === 'new'"
                        class="btn--icon w-[32px] h-[32px] shrink-0 text-ink-2 bg-surface border border-line rounded-[50%]"
                        aria-label="חזרה"
                        @click="mode = 'pick'"
                    >
                        <Icon name="arrow_right" :size="14" />
                    </button>
                    <div class="flex-1">
                        <div class="mb-[4px] text-[11px] font-semibold tracking-[0.18em] uppercase text-accent">
                            {{ mode === 'new' ? 'מטופל חדש' : 'שיוך הזמנה' }}
                        </div>
                        <h3 id="tf-picker-title" class="m-0 text-[18px] font-semibold tracking-[-0.005em]">
                            {{ mode === 'new' ? 'פרטי המטופל' : 'לאיזה מטופל לשייך?' }}
                        </h3>
                        <p class="muted mt-[4px] mx-0 mb-0 text-[13px]">
                            <strong class="text-ink">{{ product.heb }}</strong> · {{ product.vol }}
                        </p>
                    </div>
                    <button
                        class="btn--icon w-[32px] h-[32px] shrink-0 text-ink-2 bg-surface border border-line rounded-[50%]"
                        aria-label="סגור"
                        @click="emit('close')"
                    >
                        <Icon name="x" :size="14" />
                    </button>
                </div>

                <template v-if="mode === 'pick'">
                    <!-- Search -->
                    <div class="py-[14px] px-[24px] border-b border-b-line">
                        <SearchInput v-model="search" placeholder="חפש מטופל…" />
                    </div>

                    <!-- List — only after the practitioner types a name -->
                    <div class="flex-1 overflow-y-auto py-[10px] px-[16px]">
                        <div v-if="!q" class="muted small p-[32px] text-center">
                            הקלד שם כדי לחפש מטופל.
                        </div>
                        <div v-else-if="filtered.length === 0" class="muted small p-[32px] text-center">
                            לא נמצאו מטופלים מתאימים.
                        </div>
                        <div v-else class="col gap-[8px]">
                            <PatientRow
                                v-for="p in filtered"
                                :key="p.id"
                                :patient="p"
                                @pick="emit('pick', p)"
                            />
                        </div>
                    </div>

                    <!-- Footer — create new patient -->
                    <div class="py-[14px] px-[24px] border-t border-t-line bg-surface-sunk">
                        <button
                            class="btn btn--ghost w-full h-[44px] justify-center"
                            @click="mode = 'new'"
                        >
                            <Icon name="user" :size="16" /> צור מטופל חדש
                        </button>
                    </div>
                </template>

                <!-- New-patient form — identical to the formula's create-patient flow -->
                <div v-else class="flex-1 overflow-y-auto pt-[20px] px-[24px] pb-[24px]">
                    <NewPatientForm
                        v-model:value="newPatient"
                        :can-continue="canCreate"
                        @continue="handleCreate"
                    />
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style>
/* Overlay fade used by the prototype; not in app.css, so defined here (global). */
@keyframes tf-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>
