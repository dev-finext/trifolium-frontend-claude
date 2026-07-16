<script setup>
// Single pricing line — label + amount, optionally muted or accented.
defineProps({
    label: { type: String, default: '' },
    value: { type: String, default: '' },
    muted: { type: Boolean, default: false },
    accent: { type: Boolean, default: false },
});
</script>

<template>
    <div class="flex justify-between items-baseline py-[6px] px-0">
        <span class="text-[13px] text-ink-2">{{ label }}</span>
        <span
            class="num text-[14px] font-medium"
            :class="accent ? 'text-accent' : muted ? 'text-ink-3' : 'text-ink'"
        >{{ value }}</span>
    </div>
</template>
