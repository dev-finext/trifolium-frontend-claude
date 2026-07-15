<script setup>
// The phone home screen. Hero: the "פנורמה" direction — the illustrated
// apothecary still-life (HeroPanorama) as a full-width counter along the base,
// with the brand lockup floating above it: the real Trifolium mark, the
// TRIFOLIUM wordmark, the diamond divider and the personal greeting, lifted
// off the foliage by a soft radial wash. Immersive, art-forward. No CTA here —
// a new formula is started from the bottom tab bar's central action and from
// צמח היום below.
//
// Desktop renders the original Home composition untouched (see Pages/Home.vue).
import { computed } from 'vue';
import { HeroPanorama } from '@/Components/art';
import HerbOfTheDay from '@/Components/home/HerbOfTheDay.vue';
import HomeEvents from '@/Components/home/HomeEvents.vue';
import HomeArticles from '@/Components/home/HomeArticles.vue';
import HomeVideos from '@/Components/home/HomeVideos.vue';
import BackToTop from '@/Components/home/BackToTop.vue';
import markStrongUrl from '@img/trifolium-mark-strong.png';
import { DEMO_USER } from '@/data/user';

defineProps({
    events: { type: Array, required: true },
    articles: { type: Array, required: true },
    videos: { type: Array, required: true },
});

const greeting = computed(() => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return 'בוקר טוב';
    if (h >= 12 && h < 17) return 'צהריים טובים';
    if (h >= 17 && h < 22) return 'ערב טוב';
    return 'לילה טוב';
});
</script>

<template>
    <div class="mhome">
        <!-- hero: the still-life counter with the brand lockup floating above -->
        <section class="mh-pano" aria-label="Trifolium">
            <!-- fit="strip": the full still-life, bottom-anchored as a counter -->
            <div class="mh-pano__bg" aria-hidden="true"><HeroPanorama fit="strip" /></div>
            <div class="mh-pano__wash" aria-hidden="true"></div>

            <div class="mh-pano__lock">
                <img :src="markStrongUrl" alt="Trifolium" class="mh-pano__mark" />
                <p class="mh-pano__wm">TRIFOLIUM</p>
                <div class="mh-pano__dvd" aria-hidden="true">
                    <span class="mh-pano__dvd-line"></span>
                    <span class="mh-pano__dvd-dot"></span>
                    <span class="mh-pano__dvd-line"></span>
                </div>
                <h1 class="mh-pano__greet">{{ greeting }}, {{ DEMO_USER.firstName }}</h1>
            </div>
        </section>

        <!-- the daily monograph -->
        <div class="mhome__section"><HerbOfTheDay /></div>

        <!-- shared content sections (same components as desktop) -->
        <HomeEvents :events="events" />
        <HomeArticles :articles="articles" />
        <HomeVideos :videos="videos" />

        <BackToTop />
    </div>
</template>

<style>
.mhome { padding-top: 10px; }
.mhome__section { padding: 14px 14px 0; }

/* ————— panorama hero ————— */
.mh-pano {
    position: relative;
    margin: 0 12px;
    height: 312px;
    border-radius: 8px;
    overflow: hidden;
    background: #eef0dd; /* the panorama ground — fills above the still-life band */
}
.mh-pano__bg { position: absolute; inset: 0; }
/* soft luminous wash centered on the lockup, so it lifts off the foliage
   without washing out the still-life counter at the very bottom */
.mh-pano__wash {
    position: absolute;
    inset: 0;
    background: radial-gradient(66% 58% at 50% 40%,
        rgba(247, 249, 238, 0.82) 0%,
        rgba(247, 249, 238, 0.42) 52%,
        rgba(247, 249, 238, 0) 78%);
}

/* the lockup floats in the lower-middle, just above the still-life counter */
.mh-pano__lock {
    position: absolute;
    z-index: 2;
    left: 0;
    right: 0;
    bottom: 104px;
    text-align: center;
    padding: 0 22px;
}
.mh-pano__mark {
    height: 46px;
    width: 46px;
    display: block;
    margin: 0 auto 8px;
    filter: drop-shadow(0 2px 6px rgba(31, 46, 29, 0.16));
}
.mh-pano__wm {
    margin: 0;
    font-family: 'Cormorant Garamond', serif;
    font-weight: 500;
    font-size: 24px;
    line-height: 0.96;
    letter-spacing: 0.14em;
    text-indent: 0.14em;
    color: var(--accent);
}
.mh-pano__dvd {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 128px;
    margin: 11px auto 9px;
}
.mh-pano__dvd-line { flex: 1; height: 1px; background: var(--accent); opacity: 0.42; }
.mh-pano__dvd-dot {
    flex: none;
    width: 7px;
    height: 7px;
    transform: rotate(45deg);
    border: 1px solid var(--accent);
    opacity: 0.72;
}
.mh-pano__greet {
    margin: 0;
    font-size: 16.5px;
    font-weight: 700;
    color: var(--accent-ink);
}

/* gentle entrance for the above-the-fold blocks; skipped under reduced motion */
@media (prefers-reduced-motion: no-preference) {
    .mhome > *:nth-child(-n + 2) {
        opacity: 0;
        transform: translateY(12px);
        animation: mhome-rise 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
    }
    .mhome > *:nth-child(1) { animation-delay: 0.03s; }
    .mhome > *:nth-child(2) { animation-delay: 0.14s; }
}
@keyframes mhome-rise { to { opacity: 1; transform: none; } }
</style>
