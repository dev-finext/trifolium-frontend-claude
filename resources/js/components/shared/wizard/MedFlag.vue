<script setup>
// "נוטל/ת תרופות" danger pill — flags patients with reported medications.
import Icon from '@/components/ui/Icon.vue';
</script>

<template>
    <span
        class="inline-flex items-center gap-[5px] rounded-[999px] bg-danger-tint py-[2px] pr-[9px] pl-[7px] text-[11.5px] font-semibold whitespace-nowrap text-danger"
    >
        <Icon name="alert" :size="12" :stroke="2" /> נוטל/ת תרופות
    </span>
</template>
