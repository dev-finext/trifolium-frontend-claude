<script setup>
// The phone home screen — a different composition from desktop, built for a
// practitioner opening the app on the go:
//
//   בוקר טוב, נעמי              ← time-aware greeting + Hebrew date
//   [brand card: panorama + mark + new-formula CTA]
//   [three live stat chips: בהכנה · בהמתנה · נקודות]
//   [צמח היום]                  ← daily herb monograph, straight into the lab
//   events · articles · videos  ← the shared sections, unchanged
//
// Desktop renders the original Home composition untouched (see Pages/Home.vue).
// Sections rise in gently on first paint; motion is skipped for users with
// prefers-reduced-motion.
import { computed } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import { HeroPanorama } from '@/Components/art';
import HerbOfTheDay from '@/Components/home/HerbOfTheDay.vue';
import HomeEvents from '@/Components/home/HomeEvents.vue';
import HomeArticles from '@/Components/home/HomeArticles.vue';
import HomeVideos from '@/Components/home/HomeVideos.vue';
import BackToTop from '@/Components/home/BackToTop.vue';
import markStrongUrl from '@img/trifolium-mark-strong.png';
import { DEMO_USER } from '@/data/user';
import { HOME_ORDERS } from '@/data/mock';
import { useCartStore } from '@/stores/cart';
import { visit } from '@/lib/routes';

defineProps({
    events: { type: Array, required: true },
    articles: { type: Array, required: true },
    videos: { type: Array, required: true },
});

const cart = useCartStore();

// "בוקר טוב" until noon, then צהריים/ערב/לילה — the small thing a person
// notices first.
const greeting = computed(() => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return 'בוקר טוב';
    if (h >= 12 && h < 17) return 'צהריים טובים';
    if (h >= 17 && h < 22) return 'ערב טוב';
    return 'לילה טוב';
});
const todayLabel = new Intl.DateTimeFormat('he-IL', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

const inPrep = HOME_ORDERS.filter((o) => o.status === 'בהכנה').length;

const stats = computed(() => [
    { id: 'orders', label: 'בהכנה', value: inPrep, icon: 'flask' },
    { id: 'pending', label: 'בהמתנה', value: cart.state.pendingItems.length, icon: 'cart_clock' },
    { id: 'profile', label: 'נקודות', value: DEMO_USER.points, icon: 'coin' },
]);
</script>

<template>
    <div class="mhome">
        <!-- greeting -->
        <header class="mhome__greet">
            <h1 class="mhome__hello">{{ greeting }}, {{ DEMO_USER.firstName }}</h1>
            <p class="mhome__date">{{ todayLabel }}</p>
        </header>

        <!-- brand card: mark + primary action, the still-life as a counter
             along the base (fit="strip" — the wide art letterboxes bottom) -->
        <section class="mhome__brand card" aria-label="Trifolium">
            <div class="mhome__brand-art" aria-hidden="true"><HeroPanorama fit="strip" /></div>
            <div class="mhome__brand-body">
                <img :src="markStrongUrl" alt="Trifolium" class="mhome__brand-mark" />
                <div class="mhome__brand-tagline">בית מרקחת לצמחי מרפא</div>
                <button class="btn btn--primary mhome__brand-cta" @click="visit('compounding')">
                    <Icon name="flask" :size="17" color="#fff" />
                    רקיחת פורמולה חדשה
                </button>
            </div>
        </section>

        <!-- live stat chips -->
        <nav class="mhome__stats" aria-label="סיכום מהיר">
            <button v-for="s in stats" :key="s.id" class="mhome__stat" @click="visit(s.id)">
                <Icon :name="s.icon" :size="17" color="var(--accent)" :stroke="1.7" />
                <span class="mhome__stat-value num">{{ s.value }}</span>
                <span class="mhome__stat-label">{{ s.label }}</span>
            </button>
        </nav>

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
.mhome { padding-top: 18px; }
.mhome__greet { padding: 0 16px 14px; }
.mhome__hello {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--ink);
}
.mhome__date {
    margin: 3px 0 0;
    font-size: 13px;
    color: var(--ink-3);
}

/* brand card — content up top, the still-life strip along the base.
   Background blends into the art's top gradient stop so the seam vanishes. */
.mhome__brand {
    position: relative;
    margin: 0 14px;
    min-height: 296px;
    display: flex;
    align-items: stretch;
    background: linear-gradient(180deg, #f8faf3 0%, #f4f6ef 100%);
}
.mhome__brand-art { position: absolute; inset: 0; }
.mhome__brand-body {
    position: relative;
    z-index: 1;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    text-align: center;
    padding: 24px 18px 120px; /* bottom clears the art strip */
}
.mhome__brand-mark {
    height: 84px;
    width: 84px;
    display: block;
    filter: drop-shadow(0 2px 8px rgba(31, 46, 29, 0.22));
}
.mhome__brand-tagline {
    margin: 8px 0 14px;
    font-size: 15.5px;
    font-weight: 700;
    letter-spacing: 0.03em;
    color: var(--accent-ink);
}
.mhome__brand-cta {
    height: 44px;
    padding: 0 22px;
    font-size: 14.5px;
    box-shadow: 0 8px 20px -8px rgba(42, 64, 40, 0.55);
}

/* stat chips */
.mhome__stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    padding: 14px 14px 0;
}
.mhome__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 12px 6px 10px;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--r-card);
    font-family: inherit;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
}
.mhome__stat:active { background: var(--accent-tint); }
.mhome__stat-value {
    font-size: 17px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1.1;
}
.mhome__stat-label {
    font-size: 11.5px;
    font-weight: 600;
    color: var(--ink-3);
}

.mhome__section { padding: 14px 14px 0; }

/* gentle staggered entrance for the above-the-fold blocks — one pass,
   skipped under reduced motion. Below-the-fold sections render plainly. */
@media (prefers-reduced-motion: no-preference) {
    .mhome > *:nth-child(-n + 4) {
        opacity: 0;
        transform: translateY(12px);
        animation: mhome-rise 0.55s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
    }
    .mhome > *:nth-child(1) { animation-delay: 0.02s; }
    .mhome > *:nth-child(2) { animation-delay: 0.1s; }
    .mhome > *:nth-child(3) { animation-delay: 0.18s; }
    .mhome > *:nth-child(4) { animation-delay: 0.26s; }
}
@keyframes mhome-rise {
    to { opacity: 1; transform: none; }
}
</style>
