<script setup>
// The phone home screen. Hero: the desktop brand lockup set inside an
// apothecary-label frame (option "תווית") — the real Trifolium mark, the
// TRIFOLIUM wordmark, the diamond divider and tagline, plus the personal
// greeting and the primary CTA — floating over a softened HeroPanorama
// still-life. Below it: צמח היום and the shared content sections.
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
import { visit } from '@/lib/routes';

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
        <!-- hero: label-framed brand lockup over the softened still-life -->
        <section class="mh-hero" aria-label="Trifolium">
            <div class="mh-hero__bg" aria-hidden="true"><HeroPanorama /></div>
            <div class="mh-hero__wash" aria-hidden="true"></div>

            <div class="mh-hero__card">
                <img :src="markStrongUrl" alt="Trifolium" class="mh-hero__mark" />
                <p class="mh-hero__wm">TRIFOLIUM</p>
                <div class="mh-hero__dvd" aria-hidden="true">
                    <span class="mh-hero__dvd-line"></span>
                    <span class="mh-hero__dvd-dot"></span>
                    <span class="mh-hero__dvd-line"></span>
                </div>
                <p class="mh-hero__tag">בית מרקחת לצמחי מרפא</p>
                <p class="mh-hero__greet">{{ greeting }}, {{ DEMO_USER.firstName }}</p>
                <button class="mh-hero__cta" @click="visit('compounding')">רקיחת פורמולה חדשה</button>
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

/* ————— label-framed hero ————— */
.mh-hero {
    position: relative;
    margin: 0 12px;
    padding: 18px 14px;
    border-radius: 8px;
    overflow: hidden;
    background: #eef0dd; /* the desktop hero ground, shown through the wash */
    display: flex;
}
.mh-hero__bg { position: absolute; inset: 0; }
/* soften the still-life so the label reads cleanly on top */
.mh-hero__wash {
    position: absolute;
    inset: 0;
    background: radial-gradient(72% 82% at 50% 50%,
        rgba(247, 249, 238, 0.9) 0%,
        rgba(247, 249, 238, 0.66) 58%,
        rgba(247, 249, 238, 0.4) 100%);
}

/* the apothecary label: outer green rule · cream gap · inner green hairline */
.mh-hero__card {
    position: relative;
    z-index: 2;
    flex: 1;
    align-self: center;
    background: rgba(247, 249, 238, 0.84);
    border: 1px solid var(--accent);
    border-radius: 4px;
    box-shadow: inset 0 0 0 3px #f3f6ec, inset 0 0 0 4px rgba(42, 64, 40, 0.5);
    padding: 22px 20px 20px;
    text-align: center;
}
.mh-hero__mark {
    height: 62px;
    width: 62px;
    display: block;
    margin: 0 auto 8px;
    filter: drop-shadow(0 2px 6px rgba(31, 46, 29, 0.16));
}
.mh-hero__wm {
    margin: 0;
    font-family: 'Cormorant Garamond', serif;
    font-weight: 500;
    font-size: 25px;
    line-height: 0.96;
    letter-spacing: 0.14em;
    text-indent: 0.14em; /* balance the trailing tracking → optically centered */
    color: var(--accent);
}
.mh-hero__dvd {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 130px;
    margin: 12px auto 9px;
}
.mh-hero__dvd-line { flex: 1; height: 1px; background: var(--accent); opacity: 0.42; }
.mh-hero__dvd-dot {
    flex: none;
    width: 7px;
    height: 7px;
    transform: rotate(45deg);
    border: 1px solid var(--accent);
    opacity: 0.72;
}
.mh-hero__tag {
    margin: 0;
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: var(--accent-ink);
}
.mh-hero__greet {
    margin: 14px 0 0;
    font-size: 15px;
    font-weight: 700;
    color: var(--ink);
}
.mh-hero__cta {
    margin-top: 12px;
    width: 100%;
    height: 44px;
    border: none;
    border-radius: 999px;
    background: var(--accent);
    color: #f4efe1;
    font-family: inherit;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    box-shadow: 0 10px 22px -12px rgba(20, 32, 18, 0.55);
    transition: transform 0.12s ease, background 0.12s ease;
}
.mh-hero__cta:active { transform: scale(0.98); background: var(--accent-ink); }

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
