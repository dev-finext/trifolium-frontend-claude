<script setup>
// Wizard Step 2 — Patient Selection.
// Layout: "search-first" — the existing-patient search is the hero (dominant
// path); "מטופל חדש" / "ללא מטופל" are secondary actions. Functionality is
// unchanged: same option state ('existing' | 'new' | 'none'), same search,
// same new-patient form + interaction-safety flow, same continue gating.
import { computed, ref } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import NewRibbon from '@/Components/ui/NewRibbon.vue';
import EditPatientModal from '@/Components/wizard/EditPatientModal.vue';
import NewPatientForm from '@/Components/wizard/NewPatientForm.vue';
import NoPatientNotice from '@/Components/wizard/NoPatientNotice.vue';
import PatientResultCard from '@/Components/wizard/PatientResultCard.vue';
import SecondaryAction from '@/Components/wizard/SecondaryAction.vue';
import { PATIENTS } from '@/data/mock';

const props = defineProps({
    /** 'existing' | 'new' | 'none' */
    option: { type: String, required: true },
    existingPatientId: { type: String, default: null },
    newPatient: { type: Object, required: true },
    canNext: { type: Boolean, default: false },
    /** The shell passes no back handler on step 1; kept for API parity. */
    showBack: { type: Boolean, default: false },
});

const emit = defineEmits([
    'update:option',
    'update:existingPatientId',
    'update:newPatient',
    'next',
    'back',
]);

const search = ref('');
// Local edits made via the pencil button — keyed by patient id.
// TODO(backend): persist patient edits via API instead of session-local state.
const edits = ref({});
// The patient currently being edited (opens the edit modal), or null.
const editing = ref(null);

// Merge a patient with any local edit + derive display fields.
function displayFor(p) {
    const e = edits.value[p.id] || {};
    return {
        heb: e.heb || p.heb,
        phone: e.phone || phoneFor(p),
        age: e.age != null ? e.age : p.age,
        meds: e.meds != null ? e.meds : (p.meds || []),
    };
}

const trimmed = computed(() => search.value.trim());
const rows = computed(() => {
    if (!trimmed.value) return [];
    return PATIENTS
        .filter((p) => displayFor(p).heb.includes(trimmed.value) || p.heb.includes(trimmed.value))
        .map((p) => ({ p, d: displayFor(p) }));
});
// Scroll only kicks in past 5 patients; up to 5 render at natural height.
const scrolls = computed(() => rows.value.length > 5);
const existingActive = computed(() => props.option === 'existing');
const patientsTotal = PATIENTS.length;

function onSearchInput(e) {
    search.value = e.target.value;
    emit('update:option', 'existing');
}

function saveEdit(form) {
    edits.value = {
        ...edits.value,
        [editing.value.id]: {
            heb: `${form.firstName} ${form.lastName}`.trim(),
            phone: form.phone,
            age: form.age,
            meds: form.onMeds ? (Array.isArray(form.meds) ? form.meds : []) : [],
        },
    };
    editing.value = null;
}

// Full phone for display: 05X-XXX-XXXX (deterministic per patient id)
function phoneFor(p) {
    const h = Math.abs(hashCode(p.id));
    const carriers = ['050', '052', '053', '054', '058'];
    const prefix = carriers[h % carriers.length];
    const mid = String(100 + (Math.floor(h / 7) % 900));
    const last4 = String(1000 + (h % 9000));
    return `${prefix}-${mid}-${last4}`;
}

function hashCode(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
    return h;
}

// ─────────────────────────────────────────────────────────────
// Map a stored patient (+ any prior local edit) into the shape the
// NewPatientForm expects, so the edit screen opens fully pre-filled.
// ─────────────────────────────────────────────────────────────
const FEMALE_FIRST_NAMES = new Set([
    'דנה', 'יעל', 'נעמה', 'מיכל', 'שירה', 'ליאת', 'תמר', 'הדס', 'נועה', 'מירב',
    'נטע', 'רותם', 'שני', 'עדי', 'מור', 'אור', 'טל', 'רוני', 'ספיר', 'יערה',
    'אלה', 'נגה', 'איילת', 'הילה', 'קרן', 'מיטל', 'סיון', 'אביגיל', 'רבקה',
]);

function guessSex(first) {
    if (FEMALE_FIRST_NAMES.has(first)) return 'female';
    if (/[הת]$/.test(first || '')) return 'female';
    return 'male';
}

function patientToForm(p, edit) {
    const heb = (edit && edit.heb) || p.heb || '';
    const parts = heb.trim().split(/\s+/);
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ');
    const rawMeds = (edit && edit.meds != null) ? edit.meds : (p.meds || []);
    const meds = Array.isArray(rawMeds) ? rawMeds : (rawMeds ? [rawMeds] : []);
    return {
        firstName,
        lastName,
        phone: (edit && edit.phone) || phoneFor(p),
        age: String((edit && edit.age != null) ? edit.age : p.age),
        ageEstimated: false,
        sex: guessSex(firstName),
        pregnant: null,
        breastfeeding: null,
        onMeds: meds.length > 0,
        meds,
        medsDeclarationAck: meds.length > 0,
    };
}
</script>

<template>
    <div>
        <!-- Hero search — the dominant path (existing patient) -->
        <div class="input-wrap">
            <span
                :style="{
                    position: 'absolute',
                    insetInlineStart: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: existingActive ? 'var(--accent)' : 'var(--ink-3)',
                    pointerEvents: 'none',
                }"
            >
                <Icon name="search" :size="20" />
            </span>
            <input
                class="input"
                :value="search"
                placeholder="חפש מטופל לפי שם או טלפון…"
                :style="{
                    height: '56px',
                    fontSize: '15.5px',
                    paddingInlineStart: '50px',
                    border: '1.5px solid ' + (existingActive ? 'var(--accent)' : 'var(--line-strong)'),
                    boxShadow: existingActive
                        ? '0 4px 14px -10px rgba(61,90,58,0.35)'
                        : '0 4px 14px -10px rgba(20,18,14,0.25)',
                }"
                @input="onSearchInput"
                @focus="emit('update:option', 'existing')"
            />
        </div>

        <!-- Secondary paths -->
        <div style="display: flex; gap: 12px; margin-top: 14px">
            <SecondaryAction
                icon="user"
                label="מטופל חדש"
                sub="הוסף פרטים ומידע רפואי"
                :active="option === 'new'"
                @click="emit('update:option', 'new')"
            />
            <NewRibbon style="flex: 1; display: flex">
                <SecondaryAction
                    icon="save"
                    label="ללא מטופל"
                    sub="שמירה בטיוטות בלבד"
                    badge="חדש"
                    :active="option === 'none'"
                    @click="emit('update:option', 'none')"
                />
            </NewRibbon>
        </div>

        <!-- Content area — depends on the selected option -->
        <div style="margin-top: 24px; margin-bottom: 28px">
            <div v-if="option === 'existing' && trimmed">
                <div style="font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-3); font-weight: 600; margin-bottom: 12px">
                    תוצאות חיפוש
                </div>
                <div
                    :style="{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        maxHeight: scrolls ? '444px' : 'none',
                        overflowY: scrolls ? 'auto' : 'visible',
                        paddingInlineEnd: scrolls ? '6px' : 0,
                        marginInlineEnd: scrolls ? '-6px' : 0,
                    }"
                >
                    <div v-if="rows.length === 0" class="muted small" style="padding: 16px; text-align: center">
                        לא נמצאו תוצאות.
                    </div>
                    <template v-else>
                        <PatientResultCard
                            v-for="{ p, d } in rows"
                            :key="p.id"
                            :p="p"
                            :heb="d.heb"
                            :phone="d.phone"
                            :age="d.age"
                            :meds="d.meds"
                            :sel="p.id === existingPatientId"
                            @select="emit('update:existingPatientId', p.id)"
                            @edit="editing = p"
                        />
                    </template>
                </div>
                <div v-if="rows.length > 0" class="small muted mt-16">
                    מציג {{ rows.length }} מתוך {{ patientsTotal }} מטופלים פעילים
                </div>
            </div>

            <div
                v-if="option === 'new'"
                style="border: 1px solid var(--line); border-top: 2px solid var(--accent); background: var(--surface); border-radius: var(--r-card); padding: 24px 24px 26px; box-shadow: 0 6px 18px -12px rgba(20,18,14,0.18)"
            >
                <NewPatientForm
                    :value="newPatient"
                    :can-continue="canNext && option === 'new'"
                    @update:value="emit('update:newPatient', $event)"
                    @continue="emit('next')"
                />
            </div>

            <NoPatientNotice v-if="option === 'none'" />
        </div>

        <!-- Continue -->
        <div :style="{ display: 'flex', justifyContent: showBack ? 'space-between' : 'flex-end' }">
            <button v-if="showBack" class="btn btn--ghost" @click="emit('back')">
                <Icon name="arrow_right" :size="16" /> חזור
            </button>
            <button
                class="btn btn--primary"
                :disabled="!canNext"
                :style="{
                    opacity: canNext ? 1 : 0.4,
                    cursor: canNext ? 'pointer' : 'not-allowed',
                    paddingInline: '28px',
                }"
                @click="emit('next')"
            >
                המשך לרקיחת פורמולה
                <Icon name="arrow_left" :size="16" />
            </button>
        </div>

        <EditPatientModal
            v-if="editing"
            :patient="editing"
            :initial="patientToForm(editing, edits[editing.id])"
            @close="editing = null"
            @save="saveEdit"
        />
    </div>
</template>
