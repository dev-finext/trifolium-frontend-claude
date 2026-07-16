<script setup>
// HERO — full-bleed botanical banner with a crisp Trifolium lockup.
// The backdrop is HeroPanorama (an illustrated apothecary still-life in the
// app's own art language — jars, herbs, a Chinese decoction pot); it replaced
// the raster hero-bg.png, which only ever shipped as a placeholder gradient.
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { HeroPanorama } from '@/components/shared/art';
import { DEMO_USER } from '@/data/user';
import markGreenUrl from '@img/trifolium-mark-strong.png';

// Personal, time-aware greeting — same as the mobile home hero, so the two
// tiers present an identical brand lockup (perfect app/desktop parity).
const greeting = computed(() => {
    const h = new Date().getHours();

    if (h >= 5 && h < 12) {
        return 'בוקר טוב';
    }

    if (h >= 12 && h < 17) {
        return 'צהריים טובים';
    }

    if (h >= 17 && h < 22) {
        return 'ערב טוב';
    }

    return 'לילה טוב';
});

const seen = ref(false);
let raf = 0;
onMounted(() => {
    raf = requestAnimationFrame(() => {
        seen.value = true;
    });
});
onBeforeUnmount(() => cancelAnimationFrame(raf));

// Staggered rise-in for the lockup pieces (delay in seconds).
const rise = (delay) => ({
    opacity: seen.value ? 1 : 0,
    transform: seen.value ? 'translateY(0)' : 'translateY(14px)',
    transition: `opacity .7s ease ${delay}s, transform .7s cubic-bezier(.22,.61,.36,1) ${delay}s`,
});
</script>

<template>
    <section
        class="relative h-[clamp(320px,34vw,520px)] w-full overflow-hidden border-b border-b-line bg-[#eef0dd]"
    >
        <!-- botanical backdrop — illustrated still-life -->
        <div aria-hidden="true" class="absolute inset-0">
            <HeroPanorama />
        </div>
        <!-- soft luminous wash to lift the lockup off the foliage -->
        <div
            aria-hidden="true"
            class="absolute inset-0"
            style="
                background: radial-gradient(
                    58% 80% at 50% 44%,
                    rgba(247, 249, 238, 0.72) 0%,
                    rgba(247, 249, 238, 0.34) 46%,
                    rgba(247, 249, 238, 0) 74%
                );
            "
        />

        <!-- centered brand lockup -->
        <div
            class="hero-lockup relative z-[2] flex h-full flex-col items-center justify-center px-[24px] py-0 text-center"
        >
            <img
                :src="markGreenUrl"
                alt="Trifolium"
                class="mb-[clamp(8px,1vw,14px)] block h-[clamp(58px,8vw,104px)] w-auto drop-shadow-[0_2px_6px_rgba(31,46,29,0.14)]"
                :style="rise(0.05)"
            />
            <h1
                class="m-0 indent-[0.14em] [font-family:'Cormorant_Garamond',serif] text-[clamp(40px,6.4vw,84px)] leading-[0.96] font-medium tracking-[0.14em] text-accent"
                :style="rise(0.13)"
            >
                TRIFOLIUM
            </h1>

            <!-- divider with center diamond -->
            <div
                class="mx-0 mt-[clamp(12px,1.6vw,22px)] mb-[clamp(10px,1.4vw,18px)] flex w-[clamp(220px,34vw,440px)] items-center justify-center gap-[clamp(10px,1.4vw,18px)]"
                :style="rise(0.2)"
            >
                <span class="h-[1px] flex-1 bg-accent opacity-[0.42]" />
                <span
                    class="h-[7px] w-[7px] shrink-0 [transform:rotate(45deg)] border border-accent opacity-[0.7]"
                />
                <span class="h-[1px] flex-1 bg-accent opacity-[0.42]" />
            </div>

            <p
                class="m-0 font-heb text-[clamp(17px,2.4vw,32px)] font-semibold tracking-[0.04em] whitespace-nowrap text-accent-ink"
                :style="rise(0.27)"
            >
                {{ greeting }}, {{ DEMO_USER.firstName }}
            </p>
        </div>
    </section>
</template>
