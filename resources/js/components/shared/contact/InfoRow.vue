<script setup>
// One contact-detail row: text on the right, icon chip on the far right.
import Icon from '@/components/ui/Icon.vue';

defineProps({
    icon: { type: String, required: true },
});
</script>

<template>
    <li class="flex items-start justify-end gap-[12px] text-right">
        <div class="text-[14px] leading-[1.5] text-ink-2">
            <slot />
        </div>
        <span
            class="inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] bg-accent-tint"
        >
            <Icon :name="icon" :size="15" color="var(--accent)" />
        </span>
    </li>
</template>
