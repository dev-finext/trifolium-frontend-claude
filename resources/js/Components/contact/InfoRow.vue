<script setup>
// One contact-detail row: text on the right, icon chip on the far right.
import Icon from '@/Components/ui/Icon.vue';

defineProps({
    icon: { type: String, required: true },
});
</script>

<template>
    <li style="display: flex; align-items: flex-start; justify-content: flex-end; gap: 12px; text-align: right">
        <div style="font-size: 14px; color: var(--ink-2); line-height: 1.5">
            <slot />
        </div>
        <span
            :style="{
                width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
                background: 'var(--accent-tint)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }"
        >
            <Icon :name="icon" :size="15" color="var(--accent)" />
        </span>
    </li>
</template>
