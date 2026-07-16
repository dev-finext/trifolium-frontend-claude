<script setup>
// Native select bound to the system .select style, with a custom chevron on
// the inline-end (left in RTL) and a placeholder-toned empty state.
import Icon from '@/Components/ui/Icon.vue';
import ErrMsg from '@/Components/auth/ErrMsg.vue';

const props = defineProps({
    modelValue: { type: String, default: '' },
    label: { type: String, default: '' },
    options: { type: Array, required: true },
    placeholder: { type: String, default: '' },
    error: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
    <div>
        <label v-if="label" class="field-label">{{ label }}</label>
        <div class="input-wrap">
            <span class="lead-icon right-auto left-[10px]">
                <Icon name="chevron_down" :size="16" />
            </span>
            <select
                class="select appearance-none [-webkit-appearance:none] pl-[34px]"
                :value="modelValue"
                :class="[modelValue ? 'text-ink' : 'text-ink-4', error ? 'border-danger' : '']"
                @change="emit('update:modelValue', $event.target.value)"
            >
                <option value="" disabled>{{ placeholder || 'בחר/י' }}</option>
                <option v-for="o in options" :key="o" :value="o">{{ o }}</option>
            </select>
        </div>
        <ErrMsg v-if="error">{{ error }}</ErrMsg>
    </div>
</template>
