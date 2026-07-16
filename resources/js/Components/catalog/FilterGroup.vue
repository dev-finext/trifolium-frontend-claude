<script setup>
// Sidebar filter section: small uppercase label above a stacked list of rows.
// `last` drops the bottom divider/spacing on the final group.
defineProps({
    label: { type: String, required: true },
    last: { type: Boolean, default: false },
});
</script>

<template>
    <div :class="last ? 'pb-0 mb-0' : 'pb-[18px] mb-[18px] border-b border-b-line'">
        <div class="mb-[10px] text-[11px] font-semibold tracking-[0.08em] uppercase text-ink-3">
            {{ label }}
        </div>
        <div class="flex flex-col gap-[6px]">
            <slot />
        </div>
    </div>
</template>
