<script setup>
// The phone home screen — a different composition from desktop:
//
//   [MobileHero]               ← immersive app header: greeting, live chips, CTA
//   [צמח היום]                 ← daily herb monograph, straight into the lab
//   events · articles · videos ← the shared sections, unchanged
//
// Desktop renders the original Home composition untouched (see Pages/Home.vue).
// The two above-the-fold blocks rise in gently on first paint; motion is
// skipped for users with prefers-reduced-motion.
import MobileHero from '@/Components/home/MobileHero.vue';
import HerbOfTheDay from '@/Components/home/HerbOfTheDay.vue';
import HomeEvents from '@/Components/home/HomeEvents.vue';
import HomeArticles from '@/Components/home/HomeArticles.vue';
import HomeVideos from '@/Components/home/HomeVideos.vue';
import BackToTop from '@/Components/home/BackToTop.vue';

defineProps({
    events: { type: Array, required: true },
    articles: { type: Array, required: true },
    videos: { type: Array, required: true },
});
</script>

<template>
    <div class="mhome">
        <MobileHero />

        <!-- the signature card -->
        <div class="mhome__section"><HerbOfTheDay /></div>

        <!-- shared content sections (same components as desktop) -->
        <HomeEvents :events="events" />
        <HomeArticles :articles="articles" />
        <HomeVideos :videos="videos" />

        <BackToTop />
    </div>
</template>

<style>
.mhome { padding-top: 4px; }
.mhome__section { padding: 14px 14px 0; }

/* gentle staggered entrance for the above-the-fold blocks — one pass,
   skipped under reduced motion. Below-the-fold sections render plainly. */
@media (prefers-reduced-motion: no-preference) {
    .mhome > *:nth-child(-n + 2) {
        opacity: 0;
        transform: translateY(12px);
        animation: mhome-rise 0.55s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
    }
    .mhome > *:nth-child(1) { animation-delay: 0.02s; }
    .mhome > *:nth-child(2) { animation-delay: 0.14s; }
}
@keyframes mhome-rise {
    to { opacity: 1; transform: none; }
}
</style>
