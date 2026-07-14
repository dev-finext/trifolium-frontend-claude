<script setup>
// Labeled input / textarea for the contact form. Email + phone values are
// LTR data typed in an RTL form → dir="ltr" with right-aligned text.
import { computed } from 'vue';
import FieldLabel from '@/Components/ui/FieldLabel.vue';

const props = defineProps({
    label: { type: String, required: true },
    type: { type: String, default: 'text' },
    placeholder: { type: String, default: '' },
    modelValue: { type: String, default: '' },
    textarea: { type: Boolean, default: false },
});

defineEmits(['update:modelValue']);

const isLtrValue = computed(() => props.type === 'email' || props.type === 'tel');
</script>

<template>
    <div>
        <FieldLabel>{{ label }}</FieldLabel>
        <textarea
            v-if="textarea"
            class="input"
            :rows="5"
            :placeholder="placeholder"
            :value="modelValue"
            style="height: auto; padding: 12px 14px; resize: vertical; line-height: 1.6"
            @input="$emit('update:modelValue', $event.target.value)"
        />
        <input
            v-else
            class="input"
            :type="type"
            :placeholder="placeholder"
            :value="modelValue"
            :dir="isLtrValue ? 'ltr' : undefined"
            :style="isLtrValue ? { textAlign: 'right' } : undefined"
            @input="$emit('update:modelValue', $event.target.value)"
        />
    </div>
</template>
