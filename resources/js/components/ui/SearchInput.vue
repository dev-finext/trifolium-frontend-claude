<script setup>
// Text input with a leading search icon (v-model compatible).
import Icon from '@/components/ui/Icon.vue';

defineProps({
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: '' },
});

defineEmits(['update:modelValue']);
</script>

<template>
    <div class="input-wrap">
        <span class="lead-icon"><Icon name="search" :size="16" /></span>
        <input
            class="input with-icon"
            :value="modelValue"
            :placeholder="placeholder"
            @input="$emit('update:modelValue', $event.target.value)"
        />
    </div>
</template>
