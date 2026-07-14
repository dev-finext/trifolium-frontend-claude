<script setup>
// Text input bound to the system .input / .field-label styles, with optional
// leading icon and inline error. Latin-ish values (numeric / email) get
// dir="ltr" but stay right-aligned to sit naturally in the RTL form.
import { computed } from 'vue';
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
});

const emit = defineEmits(['update:modelValue']);

const isLatin = computed(() => props.numeric || props.type === 'email');
const resolvedDir = computed(() => props.dir || (isLatin.value ? 'ltr' : undefined));
</script>

<template>
    <div>
        <label v-if="label" class="field-label">{{ label }}</label>
        <div class="input-wrap">
            <span v-if="icon" class="lead-icon"><Icon :name="icon" :size="16" /></span>
            <input
                class="input"
                :class="{ 'with-icon': icon, num: numeric }"
                :type="type"
                :value="modelValue"
                :placeholder="placeholder"
                :inputmode="inputMode"
                :autocomplete="autoComplete"
                :maxlength="maxLength"
                :dir="resolvedDir"
                :style="{
                    ...(isLatin ? { textAlign: 'right' } : {}),
                    ...(error ? { borderColor: 'var(--danger)' } : {}),
                }"
                @input="emit('update:modelValue', $event.target.value)"
            />
        </div>
        <ErrMsg v-if="error">{{ error }}</ErrMsg>
    </div>
</template>
