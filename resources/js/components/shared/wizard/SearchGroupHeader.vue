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
        class="flex items-center gap-[10px] px-[14px] pb-[7px] bg-surface-sunk"
        :class="first ? 'pt-[10px]' : 'pt-[11px] border-t border-line'"
    >
        <span class="text-[11px] tracking-[.08em] font-bold text-ink-3 whitespace-nowrap">{{ label }}</span>
        <span class="flex-1 h-[1px] bg-(--line)" />
    </div>
</template>
