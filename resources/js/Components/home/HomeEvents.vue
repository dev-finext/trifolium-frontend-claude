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
    <section style="padding: 56px 24px 28px">
        <div style="max-width: 1200px; margin: 0 auto">
            <SectionHeader title="עדכונים ואירועים" link-label="לכל האירועים" />
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px">
                <EventCard v-for="e in events" :key="e.id" :event="e" />
            </div>
        </div>
    </section>
</template>
