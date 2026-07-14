<script setup>
// Sidebar — radio row.
defineProps({
    label: { type: String, required: true },
    checked: { type: Boolean, default: false },
});
const emit = defineEmits(['change']);
</script>

<template>
    <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 4px 0" @click="emit('change')">
        <span
            :style="{
                width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                border: '1.5px solid ' + (checked ? 'var(--accent)' : 'var(--line-strong)'),
                background: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                transition: 'border-color .15s',
            }"
        >
            <span v-if="checked" style="width: 9px; height: 9px; border-radius: 50%; background: var(--accent)" />
        </span>
        <span :style="{ fontSize: '14px', color: checked ? 'var(--ink)' : 'var(--ink-2)', fontWeight: checked ? 600 : 400 }">{{ label }}</span>
    </label>
</template>
