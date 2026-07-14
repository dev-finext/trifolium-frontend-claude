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
    <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px">
        <span style="display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: var(--ink-3)">
            <Icon :name="icon" :size="14" color="var(--ink-4)" /> {{ label }}
        </span>
        <span :style="{ fontSize: '13px', fontWeight: 500, color: valueMuted ? 'var(--ink-3)' : 'var(--ink)', textAlign: 'left' }">{{ value }}</span>
    </div>
</template>
