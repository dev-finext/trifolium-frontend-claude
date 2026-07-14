<script setup>
// One column in the מינון יומי (daily dose) grid: icon + label + control slot.
import Step4Icon from '@/Components/wizard/Step4Icon.vue';

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
        :style="{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            padding: '20px 14px 18px',
            borderLeft: isLast ? 'none' : '1px solid var(--line)',
        }"
    >
        <Step4Icon :type="icon" />
        <div style="font-size: 13px; font-weight: 600; color: var(--ink-2); text-align: center">
            {{ label }}
        </div>
        <div style="width: 100%">
            <slot />
        </div>
    </div>
</template>
