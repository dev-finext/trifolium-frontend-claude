<script setup>
// The phone home screen. Hero: the "חותם" (seal) direction — the real
// Trifolium mark set as a medallion inside concentric gold + green rings,
// with the personal greeting and the tagline, on a softly-lit cream ground.
// Symmetric, heritage, quiet. No CTA here — a new formula is started from the
// bottom tab bar's central action (and from צמח היום below).
//
// Desktop renders the original Home composition untouched (see Pages/Home.vue).
import { computed } from 'vue';
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
        <!-- hero: the seal medallion, greeting and tagline on a cream ground -->
        <section class="mh-seal" aria-label="Trifolium">
            <div class="mh-seal__emblem">
                <span class="mh-seal__ring mh-seal__ring--gold" aria-hidden="true"></span>
                <span class="mh-seal__ring mh-seal__ring--green" aria-hidden="true"></span>
                <img :src="markStrongUrl" alt="Trifolium" class="mh-seal__mark" />
            </div>
            <h1 class="mh-seal__greet">{{ greeting }}, {{ DEMO_USER.firstName }}</h1>
            <p class="mh-seal__tag">בית מרקחת לצמחי מרפא</p>
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

/* ————— seal hero ————— */
.mh-seal {
    position: relative;
    margin: 0 12px;
    padding: 30px 20px 26px;
    border-radius: 8px;
    overflow: hidden;
    text-align: center;
    background: radial-gradient(120% 92% at 50% 0%, #fbf9f1 0%, #f4f1e6 72%);
    border: 1px solid var(--line);
}

/* medallion: gold outer ring · green inner ring · the real mark */
.mh-seal__emblem {
    position: relative;
    width: 132px;
    height: 132px;
    margin: 0 auto 16px;
}
.mh-seal__ring {
    position: absolute;
    border-radius: 50%;
}
.mh-seal__ring--gold { inset: 0; border: 1px solid #9a6b23; opacity: 0.55; }
.mh-seal__ring--green { inset: 8px; border: 1px solid var(--accent); opacity: 0.5; }
.mh-seal__mark {
    position: absolute;
    inset: 22px;
    width: calc(100% - 44px);
    height: calc(100% - 44px);
    display: block;
    filter: drop-shadow(0 2px 6px rgba(31, 46, 29, 0.14));
}

.mh-seal__greet {
    margin: 0;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--accent-ink);
}
.mh-seal__tag {
    margin: 9px 0 0;
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.2em;
    color: #9a6b23;
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
