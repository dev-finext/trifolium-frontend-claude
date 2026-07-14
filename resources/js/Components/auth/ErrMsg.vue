<script setup>
// Inline field error — alert glyph + danger-colored message.
import Icon from '@/Components/ui/Icon.vue';
</script>

<template>
    <div
        :style="{
            display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px',
            fontSize: '12px', color: 'var(--danger)', fontWeight: 500,
        }"
    >
        <Icon name="alert" :size="13" color="var(--danger)" :stroke="1.8" />
        <slot />
    </div>
</template>
