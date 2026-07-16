<script setup>
// One label/value row in the pricing breakdown (step 5, order path).
defineProps({
    label: { type: String, required: true },
    /** Pre-formatted display string (e.g. "₪280", "−₪56"). */
    value: { type: String, default: '' },
    muted: { type: Boolean, default: false },
    accent: { type: Boolean, default: false },
});
</script>

<template>
    <div class="flex justify-between items-baseline px-0 py-[8px]">
        <span class="text-[13px] text-ink-2">{{ label }}</span>
        <span
            class="num text-[14px] font-medium"
            :class="accent ? 'text-accent' : muted ? 'text-ink-3' : 'text-ink'"
        >{{ value }}</span>
    </div>
</template>
