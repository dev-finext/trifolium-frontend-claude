<script setup>
// Patient picker — opens after "הוסף". Pick a patient or "ללא מטופל".
// Two modes: 'pick' (search existing patients) and 'new' (inline new-patient
// form, identical to the formula wizard's create-patient flow).
import { computed, nextTick, onMounted, ref } from 'vue';
import PatientRow from '@/components/shared/catalog/PatientRow.vue';
import NewPatientForm from '@/components/shared/wizard/NewPatientForm.vue';
import Icon from '@/components/ui/Icon.vue';
import SearchInput from '@/components/ui/SearchInput.vue';
// The prototype resolved this from window.NewPatientForm (shared with the wizard).
import { useModal } from '@/composables/useModal';

const props = defineProps({
    product: { type: Object, required: true },
    patients: { type: Array, required: true },
});

const emit = defineEmits(['close', 'pick']);

const search = ref('');
const mode = ref('pick'); // 'pick' | 'new'
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

const q = computed(() => search.value.trim());
const filtered = computed(() =>
    q.value ? props.patients.filter((p) => p.heb.includes(q.value)) : [],
);

// Same validation as the formula's new-patient step (wizard).
const canCreate = computed(() => {
    const np = newPatient.value;
    const ageNum = Number(np.age);
    const ageValid = np.age !== '' && ageNum >= 0 && ageNum <= 120;
    const needsRepro =
        np.sex === 'female' && ageValid && ageNum >= 15 && ageNum <= 60;

    return Boolean(
        np.firstName &&
        np.lastName &&
        np.phone &&
        ageValid &&
        np.sex &&
        np.onMeds !== null &&
        (!needsRepro || (np.pregnant !== null && np.breastfeeding !== null)) &&
        (np.onMeds !== true || np.medsDeclarationAck === true),
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

// UX: land focus in the patient search (not the close button) so typing —
// and the phone keyboard — start immediately. Runs after useModal's default.
const searchRef = ref(null);
onMounted(() => nextTick(() => searchRef.value?.focus()));
</script>

<template>
    <Teleport to="body">
        <div
            class="fixed inset-0 z-[100] flex animate-[tf-fade-in_.15s_ease] items-center justify-center bg-[rgba(20,18,14,0.46)] p-[24px] backdrop-blur-[2px]"
            @click="emit('close')"
        >
            <div
                ref="dialogRef"
                role="dialog"
                aria-modal="true"
                tabindex="-1"
                aria-labelledby="tf-picker-title"
                class="flex max-h-[84vh] w-[min(520px,100%)] flex-col overflow-hidden rounded-card bg-surface shadow-[0_30px_80px_rgba(0,0,0,0.22)]"
                @click.stop
            >
                <!-- Header -->
                <div
                    class="flex items-start gap-[16px] border-b border-b-line px-[24px] pt-[20px] pb-[16px]"
                >
                    <button
                        v-if="mode === 'new'"
                        class="btn--icon h-[32px] w-[32px] shrink-0 rounded-[50%] border border-line bg-surface text-ink-2"
                        aria-label="חזרה"
                        @click="mode = 'pick'"
                    >
                        <Icon name="arrow_right" :size="14" />
                    </button>
                    <div class="flex-1">
                        <div
                            class="mb-[4px] text-[11px] font-semibold tracking-[0.18em] text-accent uppercase"
                        >
                            {{ mode === 'new' ? 'מטופל חדש' : 'שיוך הזמנה' }}
                        </div>
                        <h3
                            id="tf-picker-title"
                            class="m-0 text-[18px] font-semibold tracking-[-0.005em]"
                        >
                            {{
                                mode === 'new'
                                    ? 'פרטי המטופל'
                                    : 'לאיזה מטופל לשייך?'
                            }}
                        </h3>
                        <p class="muted mx-0 mt-[4px] mb-0 text-[13px]">
                            <strong class="text-ink">{{ product.heb }}</strong>
                            · {{ product.vol }}
                        </p>
                    </div>
                    <button
                        class="btn--icon h-[32px] w-[32px] shrink-0 rounded-[50%] border border-line bg-surface text-ink-2"
                        aria-label="סגור"
                        @click="emit('close')"
                    >
                        <Icon name="x" :size="14" />
                    </button>
                </div>

                <template v-if="mode === 'pick'">
                    <!-- Search -->
                    <div class="border-b border-b-line px-[24px] py-[14px]">
                        <SearchInput
                            ref="searchRef"
                            v-model="search"
                            placeholder="חפש מטופל…"
                        />
                    </div>

                    <!-- List — only after the practitioner types a name -->
                    <div class="flex-1 overflow-y-auto px-[16px] py-[10px]">
                        <div v-if="!q" class="muted small p-[32px] text-center">
                            הקלד שם כדי לחפש מטופל.
                        </div>
                        <div
                            v-else-if="filtered.length === 0"
                            class="muted small p-[32px] text-center"
                        >
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
                    <div
                        class="border-t border-t-line bg-surface-sunk px-[24px] py-[14px]"
                    >
                        <button
                            class="btn btn--ghost h-[44px] w-full justify-center"
                            @click="mode = 'new'"
                        >
                            <Icon name="user" :size="16" /> צור מטופל חדש
                        </button>
                    </div>
                </template>

                <!-- New-patient form — identical to the formula's create-patient flow -->
                <div
                    v-else
                    class="flex-1 overflow-y-auto px-[24px] pt-[20px] pb-[24px]"
                >
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
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
</style>
