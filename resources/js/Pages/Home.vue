<script setup>
// ראשי — Practitioner Homepage. Composition of:
// Hero (brand banner) · Quick Access · Events · Articles · Videos · Back-to-top
import { Head } from '@inertiajs/vue3';
import { EVENTS, ARTICLES, VIDEOS } from '@/data/mock';
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
</script>

<template>
    <Head title="ראשי" />
    <div>
        <HeroPromo />
        <QuickAccess />
        <HomeEvents :events="events" />
        <HomeArticles :articles="articles" />
        <HomeVideos :videos="videos" />
        <BackToTop />
    </div>
</template>
