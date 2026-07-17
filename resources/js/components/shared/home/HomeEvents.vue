<script setup>
// EVENT BANNERS — bento grid under "עדכונים ואירועים": the first event is
// the FEATURED story (large, 2×2), the second runs wide (2×1) beside it, and
// the rest sit compact (1×1) below it. On phones the grid hammer stacks
// everything to one column, so every card stays readable.
import EventCard from '@/components/shared/home/EventCard.vue';
import SectionHeader from '@/components/shared/home/SectionHeader.vue';
import { EVENTS } from '@/data/mock';

defineProps({
    events: { type: Array, default: () => EVENTS },
});

// Bento cell per position: 0 featured (2×2) · 1 wide (2×1) · rest compact.
const sizeFor = (i) => (i === 0 ? 'featured' : i === 1 ? 'wide' : 'compact');

function spanFor(i) {
    if (i === 0) {
        return 'col-span-2 row-span-2';
    }

    return i === 1 ? 'col-span-2' : 'col-span-1';
}
</script>

<template>
    <section class="px-[24px] pt-[56px] pb-[28px]">
        <div class="mx-auto my-0 max-w-[1200px]">
            <SectionHeader title="עדכונים ואירועים" link-label="לכל האירועים" />
            <div
                class="home-events-grid grid grid-cols-4 grid-rows-[auto_auto] gap-[16px]"
            >
                <div
                    v-for="(e, i) in events"
                    :key="e.id"
                    :class="spanFor(i)"
                    class="flex"
                >
                    <EventCard :event="e" :size="sizeFor(i)" class="w-full" />
                </div>
            </div>
        </div>
    </section>
</template>
