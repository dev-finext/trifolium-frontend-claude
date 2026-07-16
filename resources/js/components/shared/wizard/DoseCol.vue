<script setup>
// One column in the מינון יומי (daily dose) grid: icon + label + control slot.
import Step4Icon from '@/components/shared/wizard/Step4Icon.vue';

defineProps({
    /** Step4Icon type. */
    icon: { type: String, required: true },
    label: { type: String, required: true },
    /** The last column drops its inline divider. */
    isLast: { type: Boolean, default: false },
});
</script>

<template>
    <div
        class="flex flex-col items-center gap-[10px] px-[14px] pt-[20px] pb-[18px]"
        :class="isLast ? '' : 'border-l border-line'"
    >
        <Step4Icon :type="icon" />
        <div class="text-center text-[13px] font-semibold text-ink-2">
            {{ label }}
        </div>
        <div class="w-full">
            <slot />
        </div>
    </div>
</template>
