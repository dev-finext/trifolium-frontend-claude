<script setup>
// Password field with show/hide toggle — bound to the system .input.
import { ref, useId } from 'vue';
import Icon from '@/Components/ui/Icon.vue';

const props = defineProps({
    label: { type: String, default: '' },
    modelValue: { type: String, default: '' },
    error: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    autocomplete: { type: String, default: 'new-password' },
    // X3 — soft-keyboard action hint ("next" mid-form, "done" on the last field).
    enterkeyhint: { type: String, default: undefined },
});

const emit = defineEmits(['update:modelValue']);

const show = ref(false);

// X1/X2 — unique ids to wire label↔input and input↔error.
const uid = useId();
const inputId = `${uid}-input`;
const errorId = `${uid}-error`;

// Allow the parent form to focus this field on validation failure.
const inputEl = ref(null);
defineExpose({ focus: () => inputEl.value?.focus() });
</script>

<template>
    <div>
        <!-- plain label (with `for`) mirrors FieldLabel's .field-label styling -->
        <label v-if="label" class="field-label" :for="inputId">{{ label }}</label>
        <div class="input-wrap">
            <span class="lead-icon"><Icon name="lock" :size="16" /></span>
            <input
                :id="inputId"
                ref="inputEl"
                class="input with-icon"
                :type="show ? 'text' : 'password'"
                :value="modelValue"
                :placeholder="placeholder"
                :autocomplete="autocomplete"
                :enterkeyhint="enterkeyhint"
                autocapitalize="off"
                autocorrect="off"
                spellcheck="false"
                :aria-invalid="error ? 'true' : undefined"
                :aria-describedby="error ? errorId : undefined"
                :style="{ paddingLeft: '40px', ...(error ? { borderColor: 'var(--danger)' } : {}) }"
                @input="emit('update:modelValue', $event.target.value)"
            />
            <button
                type="button"
                :aria-label="show ? 'הסתר סיסמה' : 'הצג סיסמה'"
                style="position: absolute; left: 8px; top: 50%; transform: translateY(-50%); background: transparent; border: none; padding: 4px; cursor: pointer; display: inline-flex; color: var(--ink-3)"
                @click="show = !show"
            >
                <Icon :name="show ? 'eye_off' : 'eye'" :size="17" />
            </button>
        </div>
        <div
            v-if="error"
            :id="errorId"
            role="alert"
            style="display: flex; align-items: center; gap: 5px; margin-top: 6px; font-size: 12px; color: var(--danger); font-weight: 500"
        >
            <Icon name="alert" :size="13" color="var(--danger)" :stroke="1.8" /> {{ error }}
        </div>
    </div>
</template>
