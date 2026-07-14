<script setup>
// Item-type badge — distinguishes shelf products from custom
// personally-compounded formulas. Every cart line carries one.
import { computed } from 'vue';
import Icon from '@/Components/ui/Icon.vue';

const props = defineProps({
    kind: { type: String, required: true }, // 'shelf' | 'formula'
});
const shelf = computed(() => props.kind === 'shelf');
</script>

<template>
    <span
        :style="{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '4px 11px', borderRadius: '999px', fontSize: '12px', fontWeight: 600,
            background: shelf ? 'var(--surface-sunk)' : 'var(--accent-tint-strong)',
            color: shelf ? 'var(--ink-2)' : 'var(--accent-ink)',
            border: shelf ? '1px solid var(--line)' : '1px solid transparent',
        }"
    >
        <Icon :name="shelf ? 'package' : 'flask'" :size="13" :color="shelf ? 'var(--ink-3)' : 'var(--accent)'" />
        {{ shelf ? 'מוצר מדף' : 'פורמולה בהכנה אישית' }}
    </span>
</template>
