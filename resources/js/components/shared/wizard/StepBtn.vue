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
        class="inline-flex items-center justify-center w-[38px] h-full border-none bg-transparent text-[18px] font-semibold leading-[1] font-latin"
        :class="disabled ? 'text-ink-4 cursor-not-allowed' : 'text-ink cursor-pointer'"
        @click="$emit('click')"
    >{{ label }}</button>
</template>
