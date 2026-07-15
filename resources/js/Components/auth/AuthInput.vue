<script setup>
// Text input bound to the system .input / .field-label styles, with optional
// leading icon and inline error. Latin-ish values (numeric / email) get
// dir="ltr" but stay right-aligned to sit naturally in the RTL form.
import { computed, ref, useId } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import ErrMsg from '@/Components/auth/ErrMsg.vue';

const props = defineProps({
    modelValue: { type: String, default: '' },
    label: { type: String, default: '' },
    type: { type: String, default: 'text' },
    icon: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    error: { type: String, default: '' },
    numeric: { type: Boolean, default: false },
    inputMode: { type: String, default: undefined },
    autoComplete: { type: String, default: undefined },
    maxLength: { type: Number, default: undefined },
    dir: { type: String, default: '' },
    // F7 — mark the field required (visible * + aria-required).
    required: { type: Boolean, default: false },
    // F8 — native date/number bounds passed straight through to the input.
    min: { type: String, default: undefined },
    max: { type: String, default: undefined },
    // X3 — soft-keyboard action hint (e.g. "next" mid-form, "go"/"done" last).
    enterkeyhint: { type: String, default: undefined },
});

const emit = defineEmits(['update:modelValue']);

const isLatin = computed(() => props.numeric || props.type === 'email');
const resolvedDir = computed(() => props.dir || (isLatin.value ? 'ltr' : undefined));

// X3 — disable autocapitalize/autocorrect/spellcheck on latin/id/email values.
const latinAttrs = computed(() =>
    isLatin.value ? { autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false' } : {});

// X1/X2 — stable unique ids to wire label↔input and input↔error.
const uid = useId();
const inputId = `${uid}-input`;
const errorId = `${uid}-error`;

// F2/F5 — allow parent forms to focus this field (first-invalid-on-submit).
const inputEl = ref(null);
defineExpose({ focus: () => inputEl.value?.focus() });
</script>

<template>
    <div>
        <label v-if="label" class="field-label" :for="inputId">
            {{ label }}<span v-if="required" aria-hidden="true" :style="{ color: 'var(--danger)', marginInlineStart: '2px' }">*</span>
        </label>
        <div class="input-wrap">
            <span v-if="icon" class="lead-icon"><Icon :name="icon" :size="16" /></span>
            <input
                :id="inputId"
                ref="inputEl"
                class="input"
                :class="{ 'with-icon': icon, num: numeric }"
                :type="type"
                :value="modelValue"
                :placeholder="placeholder"
                :inputmode="inputMode"
                :autocomplete="autoComplete"
                :maxlength="maxLength"
                :min="min"
                :max="max"
                :dir="resolvedDir"
                :enterkeyhint="enterkeyhint"
                :required="required || undefined"
                :aria-required="required ? 'true' : undefined"
                :aria-invalid="error ? 'true' : undefined"
                :aria-describedby="error ? errorId : undefined"
                v-bind="latinAttrs"
                :style="{
                    ...(isLatin ? { textAlign: 'right' } : {}),
                    ...(error ? { borderColor: 'var(--danger)' } : {}),
                }"
                @input="emit('update:modelValue', $event.target.value)"
            />
        </div>
        <ErrMsg v-if="error" :id="errorId" role="alert">{{ error }}</ErrMsg>
    </div>
</template>
