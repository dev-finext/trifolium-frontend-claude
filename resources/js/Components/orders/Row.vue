<script setup>
// Icon + label + value row for sidebar cards.
import Icon from '@/Components/ui/Icon.vue';

defineProps({
    icon: { type: String, required: true },
    label: { type: String, default: '' },
    value: { type: String, default: '' },
    valueMuted: { type: Boolean, default: false },
});
</script>

<template>
    <div class="flex items-center justify-between gap-[10px]">
        <span class="inline-flex items-center gap-[8px] text-[13px] text-ink-3">
            <Icon :name="icon" :size="14" color="var(--ink-4)" /> {{ label }}
        </span>
        <span class="text-[13px] font-medium text-left" :class="valueMuted ? 'text-ink-3' : 'text-ink'">{{ value }}</span>
    </div>
</template>
