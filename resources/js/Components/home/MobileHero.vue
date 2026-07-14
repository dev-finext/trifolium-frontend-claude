<script setup>
// The mobile app header — an immersive deep-green banner in the same identity
// as the app icon (deep herbal gradient + cream botanicals), so opening the
// app visually continues the icon you just tapped. It absorbs what used to be
// three separate blocks (greeting, brand card, stat chips) into one surface:
//
//   date + time-aware greeting (cream)
//   three live glass chips  → their screens
//   cream pill CTA          → the compounding wizard
//
// App-feel details: sprigs draw themselves in on first paint, the decoration
// layer drifts at a slower rate than the page scroll (parallax), and the CTA
// compresses under the finger. All motion respects prefers-reduced-motion.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import markCreamUrl from '@img/trifolium-mark-cream.png';
import { DEMO_USER } from '@/data/user';
import { HOME_ORDERS } from '@/data/mock';
import { useCartStore } from '@/stores/cart';
import { visit } from '@/lib/routes';

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
const chips = computed(() => [
    { id: 'orders', label: 'בהכנה', value: inPrep, icon: 'flask' },
    { id: 'pending', label: 'בהמתנה', value: cart.state.pendingItems.length, icon: 'cart_clock' },
    { id: 'profile', label: 'נקודות', value: DEMO_USER.points, icon: 'coin' },
]);

// Parallax: the decoration layer trails the scroll at ~0.22×. Passive listener,
// transform-only (no layout), disabled under reduced motion.
const decor = ref(null);
let onScroll = null;
onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    onScroll = () => {
        if (decor.value) decor.value.style.transform = `translateY(${Math.min(window.scrollY, 420) * 0.22}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
});
onBeforeUnmount(() => { if (onScroll) window.removeEventListener('scroll', onScroll); });
</script>

<template>
    <section class="apphero" aria-label="Trifolium">
        <!-- decoration layer: watermark mark + self-drawing sprigs -->
        <div ref="decor" class="apphero__decor" aria-hidden="true">
            <img :src="markCreamUrl" alt="" class="apphero__watermark" />
            <svg viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice" class="apphero__sprigs">
                <g fill="none" stroke="#f3efe2" stroke-linecap="round">
                    <!-- arching stem, top-left corner of the banner -->
                    <path d="M 8 96 Q 60 66 96 22" stroke-width="2.4" pathLength="1" class="apphero__draw" style="animation-delay: 0.15s" opacity="0.5" />
                    <path d="M 34 78 q 4 -18 -6 -28 M 52 64 q 6 -16 -2 -28 M 70 48 q 8 -14 2 -26 M 86 33 q 9 -11 4 -22" stroke-width="2" pathLength="1" class="apphero__draw" style="animation-delay: 0.4s" opacity="0.45" />
                    <!-- smaller mirrored sprig, opposite top corner -->
                    <path d="M 394 78 Q 354 58 328 26" stroke-width="2.2" pathLength="1" class="apphero__draw" style="animation-delay: 0.55s" opacity="0.38" />
                    <path d="M 374 68 q -2 -15 7 -24 M 358 56 q -4 -14 4 -24 M 342 42 q -6 -12 0 -22" stroke-width="1.8" pathLength="1" class="apphero__draw" style="animation-delay: 0.75s" opacity="0.32" />
                </g>
            </svg>
        </div>

        <div class="apphero__body">
            <p class="apphero__date">{{ todayLabel }}</p>
            <h1 class="apphero__hello">{{ greeting }}, {{ DEMO_USER.firstName }}</h1>
            <p class="apphero__tag">בית מרקחת לצמחי מרפא</p>

            <div class="apphero__chips">
                <button v-for="c in chips" :key="c.id" class="apphero__chip" @click="visit(c.id)">
                    <Icon :name="c.icon" :size="15" color="#e9e4d2" :stroke="1.8" />
                    <span class="apphero__chip-value num">{{ c.value }}</span>
                    <span class="apphero__chip-label">{{ c.label }}</span>
                </button>
            </div>

            <button class="apphero__cta" @click="visit('compounding')">
                <Icon name="flask" :size="18" color="#24421f" :stroke="2" />
                רקיחת פורמולה חדשה
            </button>
        </div>
    </section>
</template>

<style>
.apphero {
    position: relative;
    margin: 10px 12px 0;
    border-radius: 26px;
    overflow: hidden;
    background: linear-gradient(158deg, #41603c 0%, #2c4629 55%, #223a20 100%);
    box-shadow: 0 18px 40px -18px rgba(24, 38, 22, 0.55);
}
.apphero__decor { position: absolute; inset: -40px 0; pointer-events: none; will-change: transform; }
.apphero__watermark {
    position: absolute;
    inset-inline-start: -62px;
    bottom: -46px;
    width: 240px;
    height: 240px;
    opacity: 0.13;
}
.apphero__sprigs { position: absolute; inset: 40px 0; width: 100%; height: 100%; }

/* stems draw themselves in once on first paint */
.apphero__draw {
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: apphero-draw 1.3s cubic-bezier(0.3, 0, 0.2, 1) forwards;
}
@keyframes apphero-draw { to { stroke-dashoffset: 0; } }
@media (prefers-reduced-motion: reduce) {
    .apphero__draw { animation: none; stroke-dashoffset: 0; }
}

.apphero__body {
    position: relative;
    z-index: 1;
    padding: 26px 22px 24px;
    text-align: center;
}
.apphero__date {
    margin: 0;
    font-size: 12.5px;
    font-weight: 500;
    color: rgba(243, 239, 226, 0.62);
}
.apphero__hello {
    margin: 4px 0 0;
    font-size: 25px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: #f6f2e4;
}
.apphero__tag {
    margin: 5px 0 0;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: rgba(243, 239, 226, 0.72);
}

/* live glass chips */
.apphero__chips {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-top: 20px;
}
.apphero__chip {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 10px 4px 9px;
    background: rgba(246, 242, 228, 0.1);
    border: 1px solid rgba(246, 242, 228, 0.22);
    border-radius: 16px;
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    font-family: inherit;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: transform 0.12s ease, background 0.12s ease;
}
.apphero__chip:active { transform: scale(0.96); background: rgba(246, 242, 228, 0.18); }
.apphero__chip-value {
    font-size: 16.5px;
    font-weight: 700;
    color: #f6f2e4;
    line-height: 1.15;
}
.apphero__chip-label {
    font-size: 11px;
    font-weight: 600;
    color: rgba(243, 239, 226, 0.66);
}

/* cream pill CTA — the one bright element on the dark surface */
.apphero__cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    margin-top: 18px;
    width: 100%;
    height: 50px;
    background: #f6f2e4;
    color: #24421f;
    border: none;
    border-radius: 999px;
    font-family: inherit;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    box-shadow: 0 12px 26px -12px rgba(0, 0, 0, 0.5);
    transition: transform 0.12s ease;
}
.apphero__cta:active { transform: scale(0.97); }
</style>
