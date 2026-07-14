<script setup>
// Brand-mark SVGs for socials we don't have in the shared Icon set
// (whatsapp reuses the shared icon; facebook/instagram/youtube are inline).
import Icon from '@/Components/ui/Icon.vue';

defineProps({
    /** 'whatsapp' | 'facebook' | 'instagram' | 'youtube' */
    id: { type: String, required: true },
    size: { type: Number, default: 16 },
    color: { type: String, default: 'var(--ink-3)' },
});
</script>

<template>
    <Icon v-if="id === 'whatsapp'" name="whatsapp" :size="size" :color="color" />
    <svg
        v-else-if="id === 'facebook'"
        :width="size" :height="size" viewBox="0 0 24 24" fill="none"
        :stroke="color" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"
        style="flex-shrink: 0"
    >
        <path d="M15 3h-2.5A4.5 4.5 0 0 0 8 7.5V10H6v3h2v8h3v-8h2.5l.5-3H11V7.5A1.5 1.5 0 0 1 12.5 6H15V3z" />
    </svg>
    <svg
        v-else-if="id === 'instagram'"
        :width="size" :height="size" viewBox="0 0 24 24" fill="none"
        :stroke="color" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"
        style="flex-shrink: 0"
    >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" :fill="color" />
    </svg>
    <svg
        v-else-if="id === 'youtube'"
        :width="size" :height="size" viewBox="0 0 24 24" fill="none"
        :stroke="color" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"
        style="flex-shrink: 0"
    >
        <rect x="2.5" y="6" width="19" height="12" rx="3.5" />
        <path d="M10 9.2l5 2.8-5 2.8V9.2z" :fill="color" stroke="none" />
    </svg>
</template>
