<script setup>
// Inline field error — alert glyph + danger-colored message.
import Icon from '@/Components/ui/Icon.vue';
</script>

<template>
    <div class="flex items-center gap-[5px] mt-[6px] text-[12px] font-medium text-danger">
        <Icon name="alert" :size="13" color="var(--danger)" :stroke="1.8" />
        <slot />
    </div>
</template>
