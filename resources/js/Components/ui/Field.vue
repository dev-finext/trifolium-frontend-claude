<script setup>
// Labeled form-field wrapper: renders the FieldLabel (when given) above the control.
import FieldLabel from '@/Components/ui/FieldLabel.vue';

defineProps({
    label: { type: String, default: '' },
});
</script>

<template>
    <div>
        <FieldLabel v-if="label">{{ label }}</FieldLabel>
        <slot />
    </div>
</template>
