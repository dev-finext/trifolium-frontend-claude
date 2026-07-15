<script setup>
// Password input with show/hide toggle (lock lead icon, eye trailing button).
import { ref, useId } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import ErrMsg from '@/Components/auth/ErrMsg.vue';

const props = defineProps({
    modelValue: { type: String, default: '' },
    label: { type: String, default: '' },
    error: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    autoComplete: { type: String, default: 'new-password' },
    // X3 — soft-keyboard action hint ("next" mid-form, "done" on the last field).
    enterkeyhint: { type: String, default: undefined },
});

const emit = defineEmits(['update:modelValue']);

const show = ref(false);

// X1/X2 — unique ids to wire label↔input and input↔error.
const uid = useId();
const inputId = `${uid}-input`;
const errorId = `${uid}-error`;

// Allow parent forms to focus this field on validation failure.
const inputEl = ref(null);
defineExpose({ focus: () => inputEl.value?.focus() });
</script>

<template>
    <div>
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
                :autocomplete="autoComplete"
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
                :style="{
                    position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)',
                    background: 'transparent', border: 'none', padding: '4px', cursor: 'pointer',
                    display: 'inline-flex', color: 'var(--ink-3)',
                }"
                @click="show = !show"
            ><Icon :name="show ? 'eye_off' : 'eye'" :size="17" /></button>
        </div>
        <ErrMsg v-if="error" :id="errorId" role="alert">{{ error }}</ErrMsg>
    </div>
</template>
