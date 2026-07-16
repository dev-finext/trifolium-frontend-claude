<script setup>
// Small labeled divider between the Chinese and Western groups in the
// ingredient dropdown.
defineProps({
    label: { type: String, required: true },
    first: { type: Boolean, default: false },
});
</script>

<template>
    <div
        dir="rtl"
        class="flex items-center gap-[10px] bg-surface-sunk px-[14px] pb-[7px]"
        :class="first ? 'pt-[10px]' : 'border-t border-line pt-[11px]'"
    >
        <span
            class="text-[11px] font-bold tracking-[.08em] whitespace-nowrap text-ink-3"
            >{{ label }}</span
        >
        <span class="h-[1px] flex-1 bg-(--line)" />
    </div>
</template>
