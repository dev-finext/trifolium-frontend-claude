<script setup>
// EVENT BANNERS — "עדכונים ואירועים".
// Desktop/tablet: a bento grid — the first event is the FEATURED story
// (large, 2×2), the second runs wide (2×1) beside it, the rest sit compact.
// Phones: the bento would stack into a tall column, so instead we show the
// same cards as a horizontal snap CAROUSEL (mirroring HomeVideos / HomeArticles
// so the whole home page reads as one system).
import { onBeforeUnmount, onMounted, ref, watch, nextTick } from 'vue';
import CarouselArrow from '@/components/shared/home/CarouselArrow.vue';
import EventCard from '@/components/shared/home/EventCard.vue';
import SectionHeader from '@/components/shared/home/SectionHeader.vue';
import { useIsMobile } from '@/composables/useIsMobile';
import { EVENTS } from '@/data/mock';

defineProps({
    events: { type: Array, default: () => EVENTS },
});

const isMobile = useIsMobile();

// Bento cell per position: 0 featured (2×2) · 1 wide (2×1) · rest compact.
const sizeFor = (i) => (i === 0 ? 'featured' : i === 1 ? 'wide' : 'compact');

function spanFor(i) {
    if (i === 0) {
        return 'col-span-2 row-span-2';
    }

    return i === 1 ? 'col-span-2' : 'col-span-1';
}

// ── mobile carousel track (mirrors HomeVideos) ──
const trackRef = ref(null);
const atStart = ref(true);
const atEnd = ref(false);

function updateEdges() {
    const el = trackRef.value;

    if (!el) {
        return;
    }

    // RTL-safe: use absolute scroll offset from the inline-start edge.
    const max = el.scrollWidth - el.clientWidth;
    const pos = Math.abs(el.scrollLeft);
    atStart.value = pos <= 2;
    atEnd.value = pos >= max - 2;
}

// In RTL, advancing to "next" cards means scrolling toward negative left.
function scrollByCards(dir) {
    const el = trackRef.value;

    if (!el) {
        return;
    }

    const amount = 280 * 1.5;
    el.scrollBy({
        left: dir === 'next' ? -amount : amount,
        behavior: 'smooth',
    });
}

function bindTrack() {
    const el = trackRef.value;

    if (!el) {
        return;
    }

    updateEdges();
    el.addEventListener('scroll', updateEdges, { passive: true });
}

onMounted(bindTrack);
onBeforeUnmount(() =>
    trackRef.value?.removeEventListener('scroll', updateEdges),
);
// The track only exists on phones; rebind if the viewport crosses the breakpoint.
watch(isMobile, () => nextTick(bindTrack));
</script>

<template>
    <section class="px-[24px] pt-[56px] pb-[28px]">
        <div class="mx-auto my-0 max-w-[1200px]">
            <SectionHeader title="עדכונים ואירועים" link-label="לכל האירועים" />

            <!-- Phones: horizontal snap carousel -->
            <div v-if="isMobile" class="relative">
                <CarouselArrow
                    dir="prev"
                    :disabled="atStart"
                    @click="scrollByCards('prev')"
                />

                <div
                    ref="trackRef"
                    class="tf-carousel-track flex snap-x snap-mandatory [scroll-padding:0_4px] [scrollbar-width:none] gap-[16px] overflow-x-auto pb-[8px]"
                >
                    <div
                        v-for="e in events"
                        :key="e.id"
                        class="flex-[0_0_280px] snap-start"
                    >
                        <EventCard
                            :event="e"
                            size="compact"
                            class="h-full w-full"
                        />
                    </div>
                </div>

                <CarouselArrow
                    dir="next"
                    :disabled="atEnd"
                    @click="scrollByCards('next')"
                />
            </div>

            <!-- Desktop / tablet: bento grid -->
            <div
                v-else
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
