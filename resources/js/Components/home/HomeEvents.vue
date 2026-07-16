<script setup>
// EVENT BANNERS ROW — 4 static cards under "עדכונים ואירועים".
import { EVENTS } from '@/data/mock';
import SectionHeader from '@/Components/home/SectionHeader.vue';
import EventCard from '@/Components/home/EventCard.vue';

defineProps({
    events: { type: Array, default: () => EVENTS },
});
</script>

<template>
    <section class="pt-[56px] px-[24px] pb-[28px]">
        <div class="max-w-[1200px] mx-auto my-0">
            <SectionHeader title="עדכונים ואירועים" link-label="לכל האירועים" />
            <div class="grid grid-cols-4 gap-[16px]">
                <EventCard v-for="e in events" :key="e.id" :event="e" />
            </div>
        </div>
    </section>
</template>
