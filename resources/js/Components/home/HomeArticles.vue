<script setup>
// ARTICLES SECTION — horizontal, RTL-aware card carousel.
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { ARTICLES } from '@/data/mock';
import { visit } from '@/lib/routes';
import SectionHeader from '@/Components/home/SectionHeader.vue';
import ArticleCard from '@/Components/home/ArticleCard.vue';
import CarouselArrow from '@/Components/home/CarouselArrow.vue';

defineProps({
    articles: { type: Array, default: () => ARTICLES },
});

const trackRef = ref(null);
const atStart = ref(true);
const atEnd = ref(false);

function updateEdges() {
    const el = trackRef.value;
    if (!el) return;
    // RTL-safe: use absolute scroll offset from the inline-start edge
    const max = el.scrollWidth - el.clientWidth;
    const pos = Math.abs(el.scrollLeft);
    atStart.value = pos <= 2;
    atEnd.value = pos >= max - 2;
}

onMounted(() => {
    updateEdges();
    const el = trackRef.value;
    if (!el) return;
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
    if (!el) return;
    const amount = 320 * 2; // ~2 cards
    el.scrollBy({ left: dir === 'next' ? -amount : amount, behavior: 'smooth' });
}

const goArticles = () => visit('articles');
</script>

<template>
    <section style="padding: 40px 24px">
        <div style="max-width: 1200px; margin: 0 auto">
            <SectionHeader title="מאמרים מקצועיים" link-label="לכל המאמרים" @link-click="goArticles" />

            <div style="position: relative">
                <!-- Prev (newer, toward start) -->
                <CarouselArrow dir="prev" :disabled="atStart" @click="scrollByCards('prev')" />

                <div
                    ref="trackRef"
                    class="tf-carousel-track"
                    :style="{
                        display: 'flex',
                        gap: '20px',
                        overflowX: 'auto',
                        scrollSnapType: 'x mandatory',
                        scrollPadding: '0 4px',
                        paddingBottom: '8px',
                        scrollbarWidth: 'none',
                    }"
                >
                    <div v-for="a in articles" :key="a.id" style="flex: 0 0 300px; scroll-snap-align: start">
                        <ArticleCard :article="a" />
                    </div>
                </div>

                <!-- Next (older, toward end) -->
                <CarouselArrow dir="next" :disabled="atEnd" @click="scrollByCards('next')" />
            </div>
        </div>
    </section>
</template>
