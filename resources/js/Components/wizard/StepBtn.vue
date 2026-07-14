<script setup>
// Small +/− stepper button used by the package-count control.
defineProps({
    label: { type: String, required: true },
    disabled: { type: Boolean, default: false },
});
defineEmits(['click']);
</script>

<template>
    <button
        type="button"
        :disabled="disabled"
        :style="{
            width: '38px',
            height: '100%',
            border: 'none',
            background: 'transparent',
            color: disabled ? 'var(--ink-4)' : 'var(--ink)',
            fontSize: '18px',
            fontWeight: 600,
            lineHeight: 1,
            cursor: disabled ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-latin)',
        }"
        @click="$emit('click')"
    >{{ label }}</button>
</template>
