<script setup>
// "נוטל/ת תרופות" danger pill — flags patients with reported medications.
import Icon from '@/Components/ui/Icon.vue';
</script>

<template>
    <span
        style="display: inline-flex; align-items: center; gap: 5px; padding: 2px 9px 2px 7px; border-radius: 999px; font-size: 11.5px; font-weight: 600; background: var(--danger-tint); color: var(--danger); white-space: nowrap"
    >
        <Icon name="alert" :size="12" :stroke="2" /> נוטל/ת תרופות
    </span>
</template>
