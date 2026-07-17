<script setup>
// EVENT BANNERS — "עדכונים ואירועים".
// Desktop (>1080): a bento grid — the first event is the FEATURED story
// (large, 2×2), the second runs wide (2×1) beside it, the rest sit compact.
// Mobile + tablet (≤1080): the bento would get cramped/tall, so we keep ONE
// big, clear FEATURED card on top and put the rest in a horizontal snap
// CAROUSEL (same track/arrows pattern as HomeVideos / HomeArticles).
import {
    computed,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
    nextTick,
} from 'vue';
import CarouselArrow from '@/components/shared/home/CarouselArrow.vue';
import EventCard from '@/components/shared/home/EventCard.vue';
import SectionHeader from '@/components/shared/home/SectionHeader.vue';
import { useMediaQuery } from '@/composables/useMediaQuery';
import { EVENTS } from '@/data/mock';

const props = defineProps({
    events: { type: Array, default: () => EVENTS },
});

// One shared switch for the whole non-desktop range (phones + tablets).
const belowDesktop = useMediaQuery('(max-width: 1080px)');

// Below desktop: first event is the big featured card, the rest ride the carousel.
const featured = computed(() => props.events[0]);
const rest = computed(() => props.events.slice(1));

// Bento cell per position: 0 featured (2×2) · 1 wide (2×1) · rest compact.
const sizeFor = (i) => (i === 0 ? 'featured' : i === 1 ? 'wide' : 'compact');

function spanFor(i) {
    if (i === 0) {
        return 'col-span-2 row-span-2';
    }

    return i === 1 ? 'col-span-2' : 'col-span-1';
}

// ── carousel track (mirrors HomeVideos) ──
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
// The track only exists below desktop; rebind if the viewport crosses a tier.
watch(belowDesktop, () => nextTick(bindTrack));
</script>

<template>
    <section class="px-[24px] pt-[56px] pb-[28px]">
        <div class="mx-auto my-0 max-w-[1200px]">
            <SectionHeader title="עדכונים ואירועים" link-label="לכל האירועים" />

            <!-- Mobile + tablet: one big featured card, then a carousel -->
            <div v-if="belowDesktop">
                <EventCard
                    :event="featured"
                    size="featured"
                    class="mb-[16px] w-full"
                />

                <div v-if="rest.length" class="relative">
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
                            v-for="e in rest"
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
            </div>

            <!-- Desktop: bento grid -->
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
