<script setup>
// The phone home screen — "פנקס הרוקח": an editorial, print-inspired ledger.
// A deliberate counterpoint to the app's card language: warm paper, hairline
// rules, Hebrew serif display type (Frank Ruhl Libre), figures set like an
// annual report, and press states that invert to ink. No cards anywhere —
// structure comes from rules and whitespace, the way a pharmacopoeia page is
// set.
//
// Composition (content identical to before, only the design changed):
//   masthead      — double rule · TRIFOLIUM wordmark · dateline · greeting
//   figures row   — בהכנה / בהמתנה / נקודות as ledger figures → their screens
//   action rule   — letterpress-style bordered bar → the compounding wizard
//   צמח היום      — editorial monograph entry (see HerbOfTheDay.vue)
//   events · articles · videos — the shared components, flattened to entries
//                   by the scoped overrides at the bottom of this file
//
// Desktop renders the original Home composition untouched (see Pages/Home.vue).
import { computed } from 'vue';
import HerbOfTheDay from '@/Components/home/HerbOfTheDay.vue';
import HomeEvents from '@/Components/home/HomeEvents.vue';
import HomeArticles from '@/Components/home/HomeArticles.vue';
import HomeVideos from '@/Components/home/HomeVideos.vue';
import BackToTop from '@/Components/home/BackToTop.vue';
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

const greeting = computed(() => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return 'בוקר טוב';
    if (h >= 12 && h < 17) return 'צהריים טובים';
    if (h >= 17 && h < 22) return 'ערב טוב';
    return 'לילה טוב';
});
const todayLabel = new Intl.DateTimeFormat('he-IL', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

const inPrep = HOME_ORDERS.filter((o) => o.status === 'בהכנה').length;
const figures = computed(() => [
    { id: 'orders', label: 'בהכנה', value: inPrep },
    { id: 'pending', label: 'בהמתנה', value: cart.state.pendingItems.length },
    { id: 'profile', label: 'נקודות', value: DEMO_USER.points },
]);
</script>

<template>
    <div class="ldg">
        <!-- masthead -->
        <header class="ldg__masthead">
            <div class="ldg__rule ldg__rule--double" aria-hidden="true"></div>
            <div class="ldg__brand">
                <span class="ldg__wordmark">TRIFOLIUM</span>
                <span class="ldg__brandsub">בית מרקחת לצמחי מרפא</span>
            </div>
            <div class="ldg__rule" aria-hidden="true"></div>
            <p class="ldg__dateline">{{ todayLabel }}</p>
            <h1 class="ldg__hello">{{ greeting }}, {{ DEMO_USER.firstName }}</h1>
        </header>

        <!-- ledger figures -->
        <nav class="ldg__figures" aria-label="סיכום מהיר">
            <button v-for="f in figures" :key="f.id" class="ldg__figure" @click="visit(f.id)">
                <span class="ldg__figure-value">{{ f.value }}</span>
                <span class="ldg__figure-label">{{ f.label }}</span>
            </button>
        </nav>

        <!-- the primary action, set like a letterpress rule -->
        <div class="ldg__action-wrap">
            <button class="ldg__action" @click="visit('compounding')">
                רקיחת פורמולה חדשה
                <span aria-hidden="true">←</span>
            </button>
        </div>

        <!-- daily monograph -->
        <HerbOfTheDay />

        <!-- shared content sections, flattened to editorial entries -->
        <HomeEvents :events="events" />
        <HomeArticles :articles="articles" />
        <HomeVideos :videos="videos" />

        <BackToTop />
    </div>
</template>

<style>
/* ————— the ledger sheet ————— */
.ldg {
    --ldg-paper: #faf7ef;
    --ldg-ink: #22301f;
    --ldg-rule: rgba(34, 48, 31, 0.18);
    --ldg-rule-strong: rgba(34, 48, 31, 0.5);
    --ldg-amber: #8f5b1c;
    background: var(--ldg-paper);
    counter-reset: ldgsec;
    padding-bottom: 26px;
}

/* ————— masthead ————— */
.ldg__masthead { padding: 22px 20px 0; text-align: center; }
.ldg__rule { height: 1px; background: var(--ldg-rule-strong); }
.ldg__rule--double {
    height: 4px;
    border-top: 2px solid var(--ldg-rule-strong);
    border-bottom: 1px solid var(--ldg-rule-strong);
    background: none;
}
.ldg__brand {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 10px;
    padding: 9px 0;
}
.ldg__wordmark {
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px;
    font-weight: 600;
    letter-spacing: 0.34em;
    margin-inline-end: -0.34em; /* optically recenter the tracked type */
    color: var(--ldg-ink);
}
.ldg__brandsub {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--ink-3);
}
.ldg__dateline {
    margin: 16px 0 0;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.18em;
    color: var(--ldg-amber);
}
.ldg__hello {
    margin: 4px 0 0;
    font-family: 'Frank Ruhl Libre', serif;
    font-size: 30px;
    font-weight: 500;
    line-height: 1.2;
    color: var(--ldg-ink);
}

/* ————— ledger figures ————— */
.ldg__figures {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin: 22px 20px 0;
    border-top: 1px solid var(--ldg-rule);
    border-bottom: 1px solid var(--ldg-rule);
}
.ldg__figure {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1px;
    padding: 14px 4px 12px;
    background: none;
    border: 0;
    font-family: inherit;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
}
.ldg__figure + .ldg__figure { border-inline-start: 1px solid var(--ldg-rule); }
.ldg__figure:active .ldg__figure-value { color: var(--ldg-amber); }
.ldg__figure-value {
    font-family: 'Frank Ruhl Libre', serif;
    font-size: 27px;
    font-weight: 500;
    line-height: 1.1;
    color: var(--ldg-ink);
    font-variant-numeric: tabular-nums;
    transition: color 0.15s ease;
}
.ldg__figure-label {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.16em;
    color: var(--ink-3);
}

/* ————— the action rule ————— */
.ldg__action-wrap { padding: 22px 20px 0; }
.ldg__action {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    height: 52px;
    background: none;
    border: 1.5px solid var(--ldg-ink);
    border-radius: 3px;
    font-family: inherit;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--ldg-ink);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.15s ease, color 0.15s ease;
}
.ldg__action:active { background: var(--ldg-ink); color: var(--ldg-paper); }

/* ————— shared sections, reset to editorial entries —————
   The section components are shared with desktop, so the redesign lands as
   scoped overrides: card shells flatten to rule-separated entries, headers
   pick up the serif + a printed section index. */
html.tf-mobile .ldg section {
    background: transparent !important;
    border: 0 !important;
    padding: 34px 20px 4px !important;
}
html.tf-mobile .ldg section h2 {
    font-family: 'Frank Ruhl Libre', serif;
    font-size: 23px;
    font-weight: 500;
    letter-spacing: 0;
}
html.tf-mobile .ldg section:not(.ldg-herb) h2::before {
    counter-increment: ldgsec;
    content: counter(ldgsec, decimal-leading-zero);
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: var(--ldg-amber);
    margin-inline-end: 10px;
    vertical-align: 3px;
}
/* header underline becomes a strong scholarly rule */
html.tf-mobile .ldg section [style*='border-bottom'] h2 { margin-bottom: 0; }
/* card shells → flat entries divided by hairlines */
html.tf-mobile .ldg [style*='border-radius: var(--r-card)'] {
    background: transparent !important;
    border: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    transform: none !important;
    border-bottom: 1px solid var(--ldg-rule) !important;
    padding-bottom: 6px;
}
/* single-column entry flow (events/videos grids) */
html.tf-mobile .ldg [style*='repeat(4, 1fr)'],
html.tf-mobile .ldg [style*='repeat(3, 1fr)'] {
    grid-template-columns: 1fr !important;
    gap: 24px !important;
}
/* keep cover images, but framed by a hairline instead of a card edge */
html.tf-mobile .ldg [style*='height: 160px'] {
    border: 1px solid var(--ldg-rule) !important;
    border-radius: 2px;
}
/* section "see all" links go amber, letterpress style */
html.tf-mobile .ldg section a {
    color: var(--ldg-amber) !important;
    font-weight: 600 !important;
    letter-spacing: 0.04em;
}

/* ————— entrance: rules draw in, type settles ————— */
@media (prefers-reduced-motion: no-preference) {
    .ldg__rule, .ldg__rule--double {
        transform: scaleX(0);
        animation: ldg-rule-in 0.7s cubic-bezier(0.3, 0, 0.2, 1) 0.05s forwards;
    }
    .ldg__brand, .ldg__dateline, .ldg__hello, .ldg__figures, .ldg__action-wrap {
        opacity: 0;
        transform: translateY(8px);
        animation: ldg-settle 0.55s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
    }
    .ldg__brand { animation-delay: 0.16s; }
    .ldg__dateline { animation-delay: 0.26s; }
    .ldg__hello { animation-delay: 0.32s; }
    .ldg__figures { animation-delay: 0.42s; }
    .ldg__action-wrap { animation-delay: 0.5s; }
}
@keyframes ldg-rule-in { to { transform: scaleX(1); } }
@keyframes ldg-settle { to { opacity: 1; transform: none; } }
</style>
