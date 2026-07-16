<script setup>
// ARTICLES SECTION — horizontal, RTL-aware card carousel.
import { ref, onMounted, onBeforeUnmount } from 'vue';
import ArticleCard from '@/components/shared/home/ArticleCard.vue';
import CarouselArrow from '@/components/shared/home/CarouselArrow.vue';
import SectionHeader from '@/components/shared/home/SectionHeader.vue';
import { ARTICLES } from '@/data/mock';
import { visit } from '@/lib/routes';

defineProps({
    articles: { type: Array, default: () => ARTICLES },
});

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
    const el = trackRef.value;

    if (!el) {
        return;
    }

    el.addEventListener('scroll', updateEdges, { passive: true });
    window.addEventListener('resize', updateEdges);
});
onBeforeUnmount(() => {
    trackRef.value?.removeEventListener('scroll', updateEdges);
    window.removeEventListener('resize', updateEdges);
});

// In RTL, advancing to "next" (older) cards means scrolling toward negative left.
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

const goArticles = () => visit('articles');
</script>

<template>
    <section class="px-[24px] py-[40px]">
        <div class="mx-auto my-0 max-w-[1200px]">
            <SectionHeader
                title="מאמרים מקצועיים"
                link-label="לכל המאמרים"
                @link-click="goArticles"
            />

            <div class="relative">
                <!-- Prev (newer, toward start) -->
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
                        v-for="a in articles"
                        :key="a.id"
                        class="flex-[0_0_300px] snap-start"
                    >
                        <ArticleCard :article="a" />
                    </div>
                </div>

                <!-- Next (older, toward end) -->
                <CarouselArrow
                    dir="next"
                    :disabled="atEnd"
                    @click="scrollByCards('next')"
                />
            </div>
        </div>
    </section>
</template>
