<script setup>
// כן / לא toggle — a two-option SegmentedControl with boolean values.
// null (no answer yet) renders with neither side selected.
import SegmentedControl from '@/Components/wizard/SegmentedControl.vue';

defineProps({
    modelValue: { type: Boolean, default: null },
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
    <SegmentedControl
        :options="[
            { value: true, label: 'כן' },
            { value: false, label: 'לא' },
        ]"
        :model-value="modelValue"
        @update:model-value="emit('update:modelValue', $event)"
    />
</template>
