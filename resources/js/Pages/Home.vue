<script setup>
// ראשי — Practitioner Homepage.
// Two compositions, one page:
//   desktop/tablet — the original design: Hero · Quick Access · Events ·
//                    Articles · Videos (unchanged).
//   phones         — MobileHome: greeting, brand card, live stats,
//                    צמח היום, then the same content sections.
import { Head } from '@inertiajs/vue3';
import { EVENTS, ARTICLES, VIDEOS } from '@/data/mock';
import { useIsMobile } from '@/composables/useIsMobile';
import MobileHome from '@/Components/home/MobileHome.vue';
import HeroPromo from '@/Components/home/HeroPromo.vue';
import QuickAccess from '@/Components/home/QuickAccess.vue';
import HomeEvents from '@/Components/home/HomeEvents.vue';
import HomeArticles from '@/Components/home/HomeArticles.vue';
import HomeVideos from '@/Components/home/HomeVideos.vue';
import BackToTop from '@/Components/home/BackToTop.vue';

// Page-level data as props with mock defaults — a Laravel controller that
// passes real props wins without code changes.
defineProps({
    events: { type: Array, default: () => EVENTS },
    articles: { type: Array, default: () => ARTICLES },
    videos: { type: Array, default: () => VIDEOS },
});

const isMobile = useIsMobile();
</script>

<template>
    <Head title="ראשי" />
    <MobileHome v-if="isMobile" :events="events" :articles="articles" :videos="videos" />
    <div v-else>
        <HeroPromo />
        <QuickAccess />
        <HomeEvents :events="events" />
        <HomeArticles :articles="articles" />
        <HomeVideos :videos="videos" />
        <BackToTop />
    </div>
</template>
