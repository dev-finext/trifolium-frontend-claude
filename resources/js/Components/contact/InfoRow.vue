<script setup>
// One contact-detail row: text on the right, icon chip on the far right.
import Icon from '@/Components/ui/Icon.vue';

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
            class="inline-flex items-center justify-center w-[30px] h-[30px] shrink-0 bg-accent-tint rounded-[8px]"
        >
            <Icon :name="icon" :size="15" color="var(--accent)" />
        </span>
    </li>
</template>
