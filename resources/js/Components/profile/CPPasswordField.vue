<script setup>
// Password field with show/hide toggle — bound to the system .input.
import { ref } from 'vue';
import FieldLabel from '@/Components/ui/FieldLabel.vue';
import Icon from '@/Components/ui/Icon.vue';

defineProps({
    label: { type: String, default: '' },
    modelValue: { type: String, default: '' },
    error: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    autocomplete: { type: String, default: 'new-password' },
});

defineEmits(['update:modelValue']);

const show = ref(false);
</script>

<template>
    <div>
        <FieldLabel v-if="label">{{ label }}</FieldLabel>
        <div class="input-wrap">
            <span class="lead-icon"><Icon name="lock" :size="16" /></span>
            <input
                class="input with-icon"
                :type="show ? 'text' : 'password'"
                :value="modelValue"
                :placeholder="placeholder"
                :autocomplete="autocomplete"
                :style="{ paddingLeft: '40px', ...(error ? { borderColor: 'var(--danger)' } : {}) }"
                @input="$emit('update:modelValue', $event.target.value)"
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
            style="display: flex; align-items: center; gap: 5px; margin-top: 6px; font-size: 12px; color: var(--danger); font-weight: 500"
        >
            <Icon name="alert" :size="13" color="var(--danger)" :stroke="1.8" /> {{ error }}
        </div>
    </div>
</template>
