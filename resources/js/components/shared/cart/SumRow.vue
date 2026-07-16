<script setup>
// One label/value line inside the order-summary card.
defineProps({
    label: { type: String, required: true },
    value: { type: String, required: true },
    accent: { type: Boolean, default: false },
});
</script>

<template>
    <div class="flex justify-between items-baseline px-0 py-[6px]">
        <span class="text-[13.5px] text-ink-2">{{ label }}</span>
        <span class="num text-[14px] font-semibold" :class="accent ? 'text-accent' : 'text-ink'">{{ value }}</span>
    </div>
</template>
