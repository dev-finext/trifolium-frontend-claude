<script setup>
// Item-type badge — distinguishes shelf products from custom
// personally-compounded formulas. Every cart line carries one.
import { computed } from 'vue';
import Icon from '@/components/ui/Icon.vue';

const props = defineProps({
    kind: { type: String, required: true }, // 'shelf' | 'formula'
});
const shelf = computed(() => props.kind === 'shelf');
</script>

<template>
    <span
        class="inline-flex items-center gap-[6px] rounded-[999px] border px-[11px] py-[4px] text-[12px] font-semibold"
        :class="
            shelf
                ? 'border-line bg-surface-sunk text-ink-2'
                : 'border-transparent bg-accent-tint-strong text-accent-ink'
        "
    >
        <Icon
            :name="shelf ? 'package' : 'flask'"
            :size="13"
            :color="shelf ? 'var(--ink-3)' : 'var(--accent)'"
        />
        {{ shelf ? 'מוצר מדף' : 'פורמולה בהכנה אישית' }}
    </span>
</template>
