<script setup>
// EVENT BANNERS ROW — 4 static cards under "עדכונים ואירועים".
import EventCard from '@/components/shared/home/EventCard.vue';
import SectionHeader from '@/components/shared/home/SectionHeader.vue';
import { EVENTS } from '@/data/mock';

defineProps({
    events: { type: Array, default: () => EVENTS },
});
</script>

<template>
    <section class="px-[24px] pt-[56px] pb-[28px]">
        <div class="mx-auto my-0 max-w-[1200px]">
            <SectionHeader title="עדכונים ואירועים" link-label="לכל האירועים" />
            <div class="grid grid-cols-4 gap-[16px]">
                <EventCard v-for="e in events" :key="e.id" :event="e" />
            </div>
        </div>
    </section>
</template>
