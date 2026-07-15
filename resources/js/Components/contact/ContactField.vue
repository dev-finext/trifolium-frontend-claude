<script>
// Module-scoped sequence for auto-generated ids (label↔input association).
let TF_CF_SEQ = 0;
</script>

<script setup>
// Labeled input / textarea for the contact form. Email + phone values are
// LTR data typed in an RTL form → dir="ltr" with right-aligned text.
import { computed } from 'vue';
import FieldLabel from '@/Components/ui/FieldLabel.vue';
import ErrMsg from '@/Components/auth/ErrMsg.vue';

const props = defineProps({
    label: { type: String, required: true },
    type: { type: String, default: 'text' },
    placeholder: { type: String, default: '' },
    modelValue: { type: String, default: '' },
    textarea: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    error: { type: String, default: '' },
    autocomplete: { type: String, default: undefined },
    inputmode: { type: String, default: undefined },
    maxlength: { type: Number, default: undefined },
    enterkeyhint: { type: String, default: undefined },
    id: { type: String, default: '' },
});

defineEmits(['update:modelValue']);

// Stable id per instance (setup runs once) for for/id + aria wiring.
const uid = props.id || `contact-field-${TF_CF_SEQ++}`;
const errorId = `${uid}-error`;
const counterId = `${uid}-counter`;

const isLtrValue = computed(() => props.type === 'email' || props.type === 'tel');
const isEmailType = computed(() => props.type === 'email');
const resolvedInputmode = computed(() => props.inputmode
    || (props.type === 'email' ? 'email' : props.type === 'tel' ? 'tel' : undefined));

const describedBy = computed(() => {
    const ids = [];
    if (props.error) ids.push(errorId);
    if (props.textarea && props.maxlength) ids.push(counterId);
    return ids.length ? ids.join(' ') : undefined;
});
</script>

<template>
    <div>
        <FieldLabel :for="uid">
            {{ label }}<span v-if="required" aria-hidden="true" style="color: var(--danger); margin-inline-start: 3px">*</span>
        </FieldLabel>
        <textarea
            v-if="textarea"
            :id="uid"
            class="input"
            :rows="5"
            :placeholder="placeholder"
            :value="modelValue"
            :maxlength="maxlength"
            :required="required || undefined"
            :aria-required="required || undefined"
            :aria-invalid="error ? 'true' : undefined"
            :aria-describedby="describedBy"
            :enterkeyhint="enterkeyhint"
            :style="{ height: 'auto', padding: '12px 14px', resize: 'vertical', lineHeight: 1.6, ...(error ? { borderColor: 'var(--danger)' } : {}) }"
            @input="$emit('update:modelValue', $event.target.value)"
        />
        <input
            v-else
            :id="uid"
            class="input"
            :type="type"
            :placeholder="placeholder"
            :value="modelValue"
            :dir="isLtrValue ? 'ltr' : undefined"
            :inputmode="resolvedInputmode"
            :autocomplete="autocomplete"
            :maxlength="maxlength"
            :required="required || undefined"
            :aria-required="required || undefined"
            :aria-invalid="error ? 'true' : undefined"
            :aria-describedby="describedBy"
            :enterkeyhint="enterkeyhint"
            :autocapitalize="isEmailType ? 'off' : undefined"
            :autocorrect="isEmailType ? 'off' : undefined"
            :spellcheck="isEmailType ? false : undefined"
            :style="{ ...(isLtrValue ? { textAlign: 'right' } : {}), ...(error ? { borderColor: 'var(--danger)' } : {}) }"
            @input="$emit('update:modelValue', $event.target.value)"
        />
        <div
            v-if="textarea && maxlength"
            :id="counterId"
            style="margin-top: 6px; font-size: 11.5px; color: var(--ink-3); text-align: start"
            dir="ltr"
        >
            {{ (modelValue || '').length }}/{{ maxlength }}
        </div>
        <ErrMsg v-if="error" :id="errorId" role="alert">{{ error }}</ErrMsg>
    </div>
</template>
