<script setup>
// Option B — New-patient form (also reused pre-filled by EditPatientModal and
// the catalog's PatientPickerModal). Controlled component: the whole form
// object lives in the parent; every change emits the full next object via
// `update:value` (the prototype's onChange(next)), so it is `v-model:value`
// compatible.
import { computed, ref } from 'vue';
import Field from '@/Components/ui/Field.vue';
import Icon from '@/Components/ui/Icon.vue';
import MedsSafetyDeclaration from '@/Components/ui/MedsSafetyDeclaration.vue';
import MedicationSearchPicker from '@/Components/wizard/MedicationSearchPicker.vue';
import SegmentedControl from '@/Components/wizard/SegmentedControl.vue';
import YesNoToggle from '@/Components/wizard/YesNoToggle.vue';
import { isPhone } from '@/Components/auth/validators';

const props = defineProps({
    /** Form state: firstName/lastName/phone/age/ageEstimated/sex/pregnant/
        breastfeeding/onMeds/meds/medsDeclarationAck. */
    value: { type: Object, required: true },
    canContinue: { type: Boolean, default: false },
    /** CTA label override (edit modal uses "שמור שינויים"). */
    submitLabel: { type: String, default: '' },
});

const emit = defineEmits(['update:value', 'continue']);

const set = (k, v) => emit('update:value', { ...props.value, [k]: v });

// F23 — phone format validation. Show the inline error only once the field has
// content (don't shout at an empty field), but always block continue until valid.
const phoneValid = computed(() => isPhone(props.value.phone || ''));
const phoneError = computed(() => (props.value.phone || '').trim() !== '' && !phoneValid.value);

// F24 — age range feedback. `age` is clamped to 0–120; surface a hint when the
// raw input falls outside the range so the silent clamp is explained.
const ageError = ref(false);

// F22/F23 — the parent computes `canContinue` on raw truthiness (whitespace
// passes). Gate the button and the continue emit locally on trimmed required
// fields + a valid phone so whitespace-only / malformed phones can't proceed.
const canProceed = computed(() => props.canContinue
    && (props.value.firstName || '').trim() !== ''
    && (props.value.lastName || '').trim() !== ''
    && phoneValid.value);

function tryContinue() {
    if (canProceed.value) emit('continue');
}

// Age is clamped to 0–120 (whole years); leaving the reproductive range
// (female 15–60) clears the pregnancy/breastfeeding answers so stale answers
// never gate or leak into the flow.
function onAgeInput(e) {
    const raw = e.target.value;
    let v = raw;
    if (v !== '') {
        const n = Math.floor(Number(v));
        if (isNaN(n)) v = '';
        else v = String(Math.max(0, Math.min(120, n)));
    }
    // Flag out-of-range so the user understands why the value was clamped.
    const rawNum = Number(raw);
    ageError.value = raw !== '' && (isNaN(rawNum) || rawNum < 0 || rawNum > 120);
    const ageNum = Number(v);
    const inRepro = props.value.sex === 'female' && v !== '' && ageNum >= 15 && ageNum <= 60;
    const next = { ...props.value, age: v };
    if (!inRepro) { next.pregnant = null; next.breastfeeding = null; }
    emit('update:value', next);
}

// F24 — also clamp on blur (not only on input) and clear the range hint.
function onAgeBlur(e) {
    let v = e.target.value;
    if (v !== '') {
        const n = Math.floor(Number(v));
        v = isNaN(n) ? '' : String(Math.max(0, Math.min(120, n)));
    }
    ageError.value = false;
    if (v !== (props.value.age ?? '')) {
        const ageNum = Number(v);
        const inRepro = props.value.sex === 'female' && v !== '' && ageNum >= 15 && ageNum <= 60;
        const next = { ...props.value, age: v };
        if (!inRepro) { next.pregnant = null; next.breastfeeding = null; }
        emit('update:value', next);
    }
}

function onSexChange(v) {
    const next = { ...props.value, sex: v };
    if (v === 'male') { next.pregnant = null; next.breastfeeding = null; }
    emit('update:value', next);
}

function onMedsChange(v) {
    const next = { ...props.value, onMeds: v };
    if (!v) { next.meds = ''; next.medsDeclarationAck = false; }
    emit('update:value', next);
}
</script>

<template>
    <div class="col gap-[16px]">
        <!-- Names + phone — name fields first, then required phone -->
        <div class="grid grid-cols-[1fr_1fr] gap-[16px]">
            <Field label="שם פרטי *">
                <input id="np-firstName" class="input" :value="value.firstName" placeholder="יוסי" @input="set('firstName', $event.target.value)" />
            </Field>
            <Field label="שם משפחה *">
                <input id="np-lastName" class="input" :value="value.lastName" placeholder="כהן" @input="set('lastName', $event.target.value)" />
            </Field>
        </div>

        <Field label="טלפון *">
            <div class="input-wrap">
                <span class="lead-icon"><Icon name="phone" :size="14" /></span>
                <input
                    id="np-phone"
                    class="input with-icon num text-right"
                    type="tel"
                    dir="ltr"
                    :value="value.phone"
                    placeholder="050-1234567"
                    :aria-invalid="phoneError"
                    :aria-describedby="phoneError ? 'np-phone-error' : undefined"
                    @input="set('phone', $event.target.value)"
                />
            </div>
            <div v-if="phoneError" id="np-phone-error" role="alert" class="small mt-[8px] font-semibold text-danger">
                מספר טלפון לא תקין — יש להזין מספר בן 9–10 ספרות (לדוגמה: 050-1234567).
            </div>
        </Field>

        <!-- Age + Sex + Meds toggle — compact single row to save space -->
        <div class="flex flex-wrap items-start gap-[28px]">
            <Field label="גיל *">
                <div class="flex items-center gap-[12px]">
                    <input
                        id="np-age"
                        class="input num w-[84px] text-center"
                        type="number"
                        min="0"
                        max="120"
                        inputmode="numeric"
                        :value="value.age"
                        placeholder="42"
                        :aria-invalid="ageError"
                        :aria-describedby="ageError ? 'np-age-hint' : undefined"
                        @input="onAgeInput"
                        @blur="onAgeBlur"
                    />
                    <label class="flex items-center gap-[8px] cursor-pointer text-[13px] text-ink-2 whitespace-nowrap">
                        <input
                            type="checkbox"
                            :checked="value.ageEstimated === true"
                            class="w-[16px] h-[16px] cursor-pointer accent-(--ink)"
                            @change="set('ageEstimated', $event.target.checked)"
                        />
                        גיל משוער
                    </label>
                </div>
                <div v-if="ageError" id="np-age-hint" role="alert" class="small mt-[8px] font-semibold text-danger">
                    יש להזין גיל בין <span class="num">0</span> ל־<span class="num">120</span>.
                </div>
            </Field>

            <Field label="מין *">
                <SegmentedControl
                    :options="[
                        { value: 'male', label: 'זכר' },
                        { value: 'female', label: 'נקבה' },
                    ]"
                    :model-value="value.sex"
                    @update:model-value="onSexChange"
                />
            </Field>

            <Field label="נוטל/ת תרופות *">
                <YesNoToggle :model-value="value.onMeds" @update:model-value="onMedsChange" />
            </Field>
        </div>

        <!-- Pregnancy + breastfeeding — only if female AND age 15–60 -->
        <template v-if="value.sex === 'female' && value.age !== '' && Number(value.age) >= 15 && Number(value.age) <= 60">
            <Field label="בהריון *">
                <YesNoToggle :model-value="value.pregnant" @update:model-value="set('pregnant', $event)" />
            </Field>
            <Field label="האם מניקה? *">
                <YesNoToggle :model-value="value.breastfeeding" @update:model-value="set('breastfeeding', $event)" />
            </Field>
        </template>

        <!-- Medication details — expansion when taking meds -->
        <div>
            <div v-if="value.onMeds === true" class="col gap-[12px] mt-[20px]">
                <MedsSafetyDeclaration
                    :patient-meds="Array.isArray(value.meds) ? value.meds.join(', ') : (value.meds || '')"
                    confirmable
                    :checked="value.medsDeclarationAck === true"
                    @update:checked="set('medsDeclarationAck', $event)"
                />
                <Field label="פרט את התרופות הנוטלות">
                    <MedicationSearchPicker
                        :model-value="Array.isArray(value.meds) ? value.meds : (value.meds ? [value.meds] : [])"
                        @update:model-value="set('meds', $event)"
                    />
                    <div class="small muted mt-[8px] flex gap-[6px]">
                        <Icon name="info" :size="13" />
                        המידע ישמש לבדיקת אינטראקציות תרופה–צמח בשלב 3.
                    </div>
                </Field>
            </div>
        </div>

        <!-- Submit -->
        <button
            class="btn btn--primary w-full"
            :class="canProceed ? 'opacity-100 cursor-pointer' : 'opacity-40 cursor-not-allowed'"
            :disabled="!canProceed"
            @click="tryContinue"
        >
            {{ submitLabel || 'שמור מטופל והמשך' }}
            <Icon name="arrow_left" :size="16" />
        </button>
    </div>
</template>
