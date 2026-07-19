<script setup>
// One label/value line inside the order-summary card. `strike` renders the
// value struck-through (the list price when discounts apply below it).
defineProps({
    label: { type: String, required: true },
    value: { type: String, required: true },
    accent: { type: Boolean, default: false },
    strike: { type: Boolean, default: false },
});
</script>

<template>
    <div class="flex items-baseline justify-between px-0 py-[6px]">
        <span class="text-[13.5px] text-ink-2">{{ label }}</span>
        <span
            class="num text-[14px] font-semibold"
            :class="
                strike
                    ? 'text-ink-3 line-through'
                    : accent
                      ? 'text-accent'
                      : 'text-ink'
            "
            >{{ value }}</span
        >
    </div>
</template>
