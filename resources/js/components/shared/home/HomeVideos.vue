<script setup>
// Tutorial Videos section — a snap carousel over ALL tutorial videos (the
// same track/arrows pattern as HomeArticles, so the home page reads as one
// system) + the lightbox modal.
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import CarouselArrow from '@/components/shared/home/CarouselArrow.vue';
import SectionHeader from '@/components/shared/home/SectionHeader.vue';
import VideoCard from '@/components/shared/home/VideoCard.vue';
import VideoLightbox from '@/components/shared/home/VideoLightbox.vue';
import { VIDEOS } from '@/data/mock';

const props = defineProps({
    videos: { type: Array, default: () => VIDEOS },
});

const open = ref(null);

const cards = computed(() => props.videos);

// ── carousel track (mirrors HomeArticles) ──
const trackRef = ref(null);
const atStart = ref(true);
const atEnd = ref(false);

function updateEdges() {
    const el = trackRef.value;

    if (!el) {
        return;
    }

    // RTL-safe: use absolute scroll offset from the inline-start edge
    const max = el.scrollWidth - el.clientWidth;
    const pos = Math.abs(el.scrollLeft);
    atStart.value = pos <= 2;
    atEnd.value = pos >= max - 2;
}

onMounted(() => {
    updateEdges();
    trackRef.value?.addEventListener('scroll', updateEdges, { passive: true });
});
onBeforeUnmount(() => {
    trackRef.value?.removeEventListener('scroll', updateEdges);
});

// In RTL, advancing to "next" cards means scrolling toward negative left.
function scrollByCards(dir) {
    const el = trackRef.value;

    if (!el) {
        return;
    }

    const amount = 320 * 2; // ~2 cards
    el.scrollBy({
        left: dir === 'next' ? -amount : amount,
        behavior: 'smooth',
    });
}

// Escape closes the lightbox — listener bound only while it is open,
// mirroring the prototype's effect.
const onKey = (e) => {
    if (e.key === 'Escape') {
        open.value = null;
    }
};
watch(open, (v) => {
    if (v) {
        window.addEventListener('keydown', onKey);
    } else {
        window.removeEventListener('keydown', onKey);
    }
});
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
</script>

<template>
    <section
        class="border-t border-t-line bg-surface-sunk px-[24px] pt-[56px] pb-[72px]"
    >
        <div class="mx-auto my-0 max-w-[1200px]">
            <SectionHeader
                title="סרטוני הדרכה"
                subtitle="למד כיצד להשתמש במערכת בצעדים פשוטים"
                link-label="לכל הסרטונים"
            />

            <div class="relative">
                <CarouselArrow
                    dir="prev"
                    :disabled="atStart"
                    @click="scrollByCards('prev')"
                />

                <div
                    ref="trackRef"
                    class="tf-carousel-track flex snap-x snap-mandatory [scroll-padding:0_4px] [scrollbar-width:none] gap-[20px] overflow-x-auto pb-[8px]"
                >
                    <div
                        v-for="(v, i) in cards"
                        :key="v.id"
                        class="flex-[0_0_340px] snap-start"
                    >
                        <VideoCard :video="v" :index="i" @play="open = v" />
                    </div>
                </div>

                <CarouselArrow
                    dir="next"
                    :disabled="atEnd"
                    @click="scrollByCards('next')"
                />
            </div>
        </div>
        <VideoLightbox v-if="open" :video="open" @close="open = null" />
    </section>
</template>
