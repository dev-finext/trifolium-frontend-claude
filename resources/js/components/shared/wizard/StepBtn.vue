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
        class="inline-flex h-full w-[38px] items-center justify-center border-none bg-transparent font-latin text-[18px] leading-[1] font-semibold"
        :class="
            disabled
                ? 'cursor-not-allowed text-ink-4'
                : 'cursor-pointer text-ink'
        "
        @click="$emit('click')"
    >
        {{ label }}
    </button>
</template>
