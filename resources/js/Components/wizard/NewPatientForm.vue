<script setup>
// Option B — New-patient form (also reused pre-filled by EditPatientModal and
// the catalog's PatientPickerModal). Controlled component: the whole form
// object lives in the parent; every change emits the full next object via
// `update:value` (the prototype's onChange(next)), so it is `v-model:value`
// compatible.
import Field from '@/Components/ui/Field.vue';
import Icon from '@/Components/ui/Icon.vue';
import MedsSafetyDeclaration from '@/Components/ui/MedsSafetyDeclaration.vue';
import MedicationSearchPicker from '@/Components/wizard/MedicationSearchPicker.vue';
import SegmentedControl from '@/Components/wizard/SegmentedControl.vue';
import YesNoToggle from '@/Components/wizard/YesNoToggle.vue';

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

// Age is clamped to 0–120 (whole years); leaving the reproductive range
// (female 15–60) clears the pregnancy/breastfeeding answers so stale answers
// never gate or leak into the flow.
function onAgeInput(e) {
    let v = e.target.value;
    if (v !== '') {
        const n = Math.floor(Number(v));
        if (isNaN(n)) v = '';
        else v = String(Math.max(0, Math.min(120, n)));
    }
    const ageNum = Number(v);
    const inRepro = props.value.sex === 'female' && v !== '' && ageNum >= 15 && ageNum <= 60;
    const next = { ...props.value, age: v };
    if (!inRepro) { next.pregnant = null; next.breastfeeding = null; }
    emit('update:value', next);
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
    <div class="col gap-16">
        <!-- Names + phone — name fields first, then required phone -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px">
            <Field label="שם פרטי *">
                <input class="input" :value="value.firstName" placeholder="יוסי" @input="set('firstName', $event.target.value)" />
            </Field>
            <Field label="שם משפחה *">
                <input class="input" :value="value.lastName" placeholder="כהן" @input="set('lastName', $event.target.value)" />
            </Field>
        </div>

        <Field label="טלפון *">
            <div class="input-wrap">
                <span class="lead-icon"><Icon name="phone" :size="14" /></span>
                <input
                    class="input with-icon num"
                    type="tel"
                    dir="ltr"
                    :value="value.phone"
                    placeholder="050-1234567"
                    style="text-align: right"
                    @input="set('phone', $event.target.value)"
                />
            </div>
        </Field>

        <!-- Age + Sex + Meds toggle — compact single row to save space -->
        <div style="display: flex; gap: 28px; flex-wrap: wrap; align-items: flex-start">
            <Field label="גיל *">
                <div style="display: flex; align-items: center; gap: 12px">
                    <input
                        class="input num"
                        type="number"
                        min="0"
                        max="120"
                        inputmode="numeric"
                        :value="value.age"
                        placeholder="42"
                        style="width: 84px; text-align: center"
                        @input="onAgeInput"
                    />
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; color: var(--ink-2); white-space: nowrap">
                        <input
                            type="checkbox"
                            :checked="value.ageEstimated === true"
                            style="width: 16px; height: 16px; accent-color: var(--ink); cursor: pointer"
                            @change="set('ageEstimated', $event.target.checked)"
                        />
                        גיל משוער
                    </label>
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
            <div v-if="value.onMeds === true" class="col gap-12" style="margin-top: 20px">
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
                    <div class="small muted mt-8" style="display: flex; gap: 6px">
                        <Icon name="info" :size="13" />
                        המידע ישמש לבדיקת אינטראקציות תרופה–צמח בשלב 3.
                    </div>
                </Field>
            </div>
        </div>

        <!-- Submit -->
        <button
            class="btn btn--primary"
            :disabled="!canContinue"
            :style="{
                width: '100%',
                opacity: canContinue ? 1 : 0.4,
                cursor: canContinue ? 'pointer' : 'not-allowed',
            }"
            @click="emit('continue')"
        >
            {{ submitLabel || 'שמור מטופל והמשך' }}
            <Icon name="arrow_left" :size="16" />
        </button>
    </div>
</template>
