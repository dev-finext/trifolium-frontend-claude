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
        class="inline-flex items-center gap-[6px] px-[11px] py-[4px] text-[12px] font-semibold border rounded-[999px]"
        :class="shelf ? 'bg-surface-sunk text-ink-2 border-line' : 'bg-accent-tint-strong text-accent-ink border-transparent'"
    >
        <Icon :name="shelf ? 'package' : 'flask'" :size="13" :color="shelf ? 'var(--ink-3)' : 'var(--accent)'" />
        {{ shelf ? 'מוצר מדף' : 'פורמולה בהכנה אישית' }}
    </span>
</template>
