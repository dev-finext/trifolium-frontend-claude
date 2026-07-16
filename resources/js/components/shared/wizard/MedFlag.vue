<script setup>
// "נוטל/ת תרופות" danger pill — flags patients with reported medications.
import Icon from '@/components/ui/Icon.vue';
</script>

<template>
    <span
        class="inline-flex items-center gap-[5px] py-[2px] pr-[9px] pl-[7px] text-[11.5px] font-semibold bg-danger-tint text-danger rounded-[999px] whitespace-nowrap"
    >
        <Icon name="alert" :size="12" :stroke="2" /> נוטל/ת תרופות
    </span>
</template>
