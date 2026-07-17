<script setup>
// Wizard Step 2 — Patient Selection.
// Layout: "search-first" — the existing-patient search is the hero (dominant
// path); "מטופל חדש" / "ללא מטופל" are secondary actions. Functionality is
// unchanged: same option state ('existing' | 'new' | 'none'), same search,
// same new-patient form + interaction-safety flow, same continue gating.
import { computed, onMounted, ref } from 'vue';
import NewRibbon from '@/components/shared/NewRibbon.vue';
import EditPatientModal from '@/components/shared/wizard/EditPatientModal.vue';
import NewPatientForm from '@/components/shared/wizard/NewPatientForm.vue';
import NoPatientNotice from '@/components/shared/wizard/NoPatientNotice.vue';
import PatientResultCard from '@/components/shared/wizard/PatientResultCard.vue';
import SecondaryAction from '@/components/shared/wizard/SecondaryAction.vue';
import Icon from '@/components/ui/Icon.vue';
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
// UX: focus the patient search on entry — desktop types immediately, phones
// get the keyboard right away. (Also applies in the shelf-product picker.)
const searchEl = ref(null);
onMounted(() => searchEl.value?.focus());
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
        meds: e.meds != null ? e.meds : p.meds || [],
    };
}

const trimmed = computed(() => search.value.trim());
const rows = computed(() => {
    if (!trimmed.value) {
        return [];
    }

    return PATIENTS.filter(
        (p) =>
            displayFor(p).heb.includes(trimmed.value) ||
            p.heb.includes(trimmed.value),
    ).map((p) => ({ p, d: displayFor(p) }));
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
            meds: form.onMeds
                ? Array.isArray(form.meds)
                    ? form.meds
                    : []
                : [],
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

    for (let i = 0; i < s.length; i++) {
        h = (h << 5) - h + s.charCodeAt(i);
    }

    return h;
}

// ─────────────────────────────────────────────────────────────
// Map a stored patient (+ any prior local edit) into the shape the
// NewPatientForm expects, so the edit screen opens fully pre-filled.
// ─────────────────────────────────────────────────────────────
const FEMALE_FIRST_NAMES = new Set([
    'דנה',
    'יעל',
    'נעמה',
    'מיכל',
    'שירה',
    'ליאת',
    'תמר',
    'הדס',
    'נועה',
    'מירב',
    'נטע',
    'רותם',
    'שני',
    'עדי',
    'מור',
    'אור',
    'טל',
    'רוני',
    'ספיר',
    'יערה',
    'אלה',
    'נגה',
    'איילת',
    'הילה',
    'קרן',
    'מיטל',
    'סיון',
    'אביגיל',
    'רבקה',
]);

function guessSex(first) {
    if (FEMALE_FIRST_NAMES.has(first)) {
        return 'female';
    }

    if (/[הת]$/.test(first || '')) {
        return 'female';
    }

    return 'male';
}

function patientToForm(p, edit) {
    const heb = (edit && edit.heb) || p.heb || '';
    const parts = heb.trim().split(/\s+/);
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ');
    const rawMeds = edit && edit.meds != null ? edit.meds : p.meds || [];
    const meds = Array.isArray(rawMeds) ? rawMeds : rawMeds ? [rawMeds] : [];

    return {
        firstName,
        lastName,
        phone: (edit && edit.phone) || phoneFor(p),
        age: String(edit && edit.age != null ? edit.age : p.age),
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
                class="pointer-events-none absolute start-[16px] top-[50%] -translate-y-1/2"
                :class="existingActive ? 'text-accent' : 'text-ink-3'"
            >
                <Icon name="search" :size="20" />
            </span>
            <input
                ref="searchEl"
                class="input h-[56px] border-[1.5px] ps-[50px] text-[15.5px]"
                :class="
                    existingActive
                        ? 'border-accent shadow-[0_4px_14px_-10px_rgba(61,90,58,0.35)]'
                        : 'border-line-strong shadow-[0_4px_14px_-10px_rgba(20,18,14,0.25)]'
                "
                :value="search"
                placeholder="חפש מטופל לפי שם או טלפון…"
                @input="onSearchInput"
                @focus="emit('update:option', 'existing')"
            />
        </div>

        <!-- Secondary paths -->
        <div class="mt-[14px] flex gap-[12px]">
            <SecondaryAction
                icon="user"
                label="מטופל חדש"
                sub="הוסף פרטים ומידע רפואי"
                :active="option === 'new'"
                @click="emit('update:option', 'new')"
            />
            <NewRibbon class="flex flex-1">
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
        <div class="mt-[24px] mb-[28px]">
            <div v-if="option === 'existing' && trimmed">
                <div
                    class="mb-[12px] text-[11px] font-semibold tracking-[.08em] text-ink-3 uppercase"
                >
                    תוצאות חיפוש
                </div>
                <div
                    class="flex flex-col gap-[12px]"
                    :class="
                        scrolls
                            ? 'me-[-6px] max-h-[444px] overflow-y-auto pe-[6px]'
                            : 'me-0 max-h-none overflow-y-visible pe-0'
                    "
                >
                    <div
                        v-if="rows.length === 0"
                        class="muted small p-[16px] text-center"
                    >
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
                <div v-if="rows.length > 0" class="small muted mt-[16px]">
                    מציג {{ rows.length }} מתוך {{ patientsTotal }} מטופלים
                    פעילים
                </div>
            </div>

            <div
                v-if="option === 'new'"
                class="rounded-card border border-line bg-surface px-[24px] pt-[24px] pb-[26px] shadow-[0_6px_18px_-12px_rgba(20,18,14,0.18)] [border-top:2px_solid_var(--accent)]"
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
        <div class="flex" :class="showBack ? 'justify-between' : 'justify-end'">
            <button
                v-if="showBack"
                class="btn btn--ghost"
                @click="emit('back')"
            >
                <Icon name="arrow_right" :size="16" /> חזור
            </button>
            <button
                class="btn btn--primary px-[28px]"
                :class="
                    canNext
                        ? 'cursor-pointer opacity-100'
                        : 'cursor-not-allowed opacity-40'
                "
                :disabled="!canNext"
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
