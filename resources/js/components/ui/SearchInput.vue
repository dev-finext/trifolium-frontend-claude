<script setup>
// Text input with a leading search icon (v-model compatible).
import { ref } from 'vue';
import Icon from '@/components/ui/Icon.vue';

defineProps({
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: '' },
});

defineEmits(['update:modelValue']);

const inputEl = ref(null);

// Lets a parent move focus into the field (e.g. autofocus on modal open).
defineExpose({ focus: () => inputEl.value?.focus() });
</script>

<template>
    <div class="input-wrap">
        <span class="lead-icon"><Icon name="search" :size="16" /></span>
        <input
            ref="inputEl"
            class="input with-icon"
            :value="modelValue"
            :placeholder="placeholder"
            @input="$emit('update:modelValue', $event.target.value)"
        />
    </div>
</template>
