<script setup>
// Patient picker — opens after "הוסף". Pick a patient or "ללא מטופל".
// Two modes: 'pick' (search existing patients) and 'new' (inline new-patient
// form, identical to the formula wizard's create-patient flow).
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import SearchInput from '@/Components/ui/SearchInput.vue';
import PatientRow from '@/Components/catalog/PatientRow.vue';
// The prototype resolved this from window.NewPatientForm (shared with the wizard).
import NewPatientForm from '@/Components/wizard/NewPatientForm.vue';

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

function onKeydown(e) {
    if (e.key === 'Escape') emit('close');
}

onMounted(() => window.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
</script>

<template>
    <Teleport to="body">
        <div
            :style="{
                position: 'fixed', inset: 0,
                background: 'rgba(20, 18, 14, 0.46)',
                zIndex: 100,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '24px', backdropFilter: 'blur(2px)',
                animation: 'tf-fade-in .15s ease',
            }"
            @click="emit('close')"
        >
            <div
                :style="{
                    background: 'var(--surface)',
                    borderRadius: 'var(--r-card)',
                    width: 'min(520px, 100%)',
                    maxHeight: '84vh',
                    display: 'flex', flexDirection: 'column',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.22)',
                    overflow: 'hidden',
                }"
                @click.stop
            >
                <!-- Header -->
                <div style="padding: 20px 24px 16px; border-bottom: 1px solid var(--line); display: flex; align-items: flex-start; gap: 16px">
                    <button
                        v-if="mode === 'new'"
                        class="btn--icon"
                        aria-label="חזרה"
                        style="width: 32px; height: 32px; border: 1px solid var(--line); border-radius: 50%; background: var(--surface); color: var(--ink-2); flex-shrink: 0"
                        @click="mode = 'pick'"
                    >
                        <Icon name="arrow_right" :size="14" />
                    </button>
                    <div style="flex: 1">
                        <div style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); font-weight: 600; margin-bottom: 4px">
                            {{ mode === 'new' ? 'מטופל חדש' : 'שיוך הזמנה' }}
                        </div>
                        <h3 style="margin: 0; font-size: 18px; font-weight: 600; letter-spacing: -0.005em">
                            {{ mode === 'new' ? 'פרטי המטופל' : 'לאיזה מטופל לשייך?' }}
                        </h3>
                        <p class="muted" style="margin: 4px 0 0; font-size: 13px">
                            <strong style="color: var(--ink)">{{ product.heb }}</strong> · {{ product.vol }}
                        </p>
                    </div>
                    <button
                        class="btn--icon"
                        aria-label="סגור"
                        style="width: 32px; height: 32px; border: 1px solid var(--line); border-radius: 50%; background: var(--surface); color: var(--ink-2); flex-shrink: 0"
                        @click="emit('close')"
                    >
                        <Icon name="x" :size="14" />
                    </button>
                </div>

                <template v-if="mode === 'pick'">
                    <!-- Search -->
                    <div style="padding: 14px 24px; border-bottom: 1px solid var(--line)">
                        <SearchInput v-model="search" placeholder="חפש מטופל…" />
                    </div>

                    <!-- List — only after the practitioner types a name -->
                    <div style="flex: 1; overflow-y: auto; padding: 10px 16px">
                        <div v-if="!q" class="muted small" style="padding: 32px; text-align: center">
                            הקלד שם כדי לחפש מטופל.
                        </div>
                        <div v-else-if="filtered.length === 0" class="muted small" style="padding: 32px; text-align: center">
                            לא נמצאו מטופלים מתאימים.
                        </div>
                        <div v-else class="col gap-8">
                            <PatientRow
                                v-for="p in filtered"
                                :key="p.id"
                                :patient="p"
                                @pick="emit('pick', p)"
                            />
                        </div>
                    </div>

                    <!-- Footer — create new patient -->
                    <div style="padding: 14px 24px; border-top: 1px solid var(--line); background: var(--surface-sunk)">
                        <button
                            class="btn btn--ghost"
                            style="width: 100%; height: 44px; justify-content: center"
                            @click="mode = 'new'"
                        >
                            <Icon name="user" :size="16" /> צור מטופל חדש
                        </button>
                    </div>
                </template>

                <!-- New-patient form — identical to the formula's create-patient flow -->
                <div v-else style="flex: 1; overflow-y: auto; padding: 20px 24px 24px">
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
