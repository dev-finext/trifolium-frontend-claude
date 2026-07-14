<script setup>
// HERO — full-bleed botanical banner with a crisp Trifolium lockup.
// The backdrop is HeroPanorama (an illustrated apothecary still-life in the
// app's own art language — jars, herbs, a Chinese decoction pot); it replaced
// the raster hero-bg.png, which only ever shipped as a placeholder gradient.
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { HeroPanorama } from '@/Components/art';
import markGreenUrl from '@img/trifolium-mark-strong.png';

const seen = ref(false);
let raf = 0;
onMounted(() => {
    raf = requestAnimationFrame(() => { seen.value = true; });
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
        :style="{
            position: 'relative',
            width: '100%',
            height: 'clamp(320px, 34vw, 520px)',
            overflow: 'hidden',
            background: '#eef0dd',
            borderBottom: '1px solid var(--line)',
        }"
    >
        <!-- botanical backdrop — illustrated still-life -->
        <div aria-hidden="true" style="position: absolute; inset: 0">
            <HeroPanorama />
        </div>
        <!-- soft luminous wash to lift the lockup off the foliage -->
        <div
            aria-hidden="true"
            :style="{
                position: 'absolute', inset: 0,
                background:
                    'radial-gradient(58% 80% at 50% 44%, rgba(247,249,238,0.72) 0%, rgba(247,249,238,0.34) 46%, rgba(247,249,238,0) 74%)',
            }"
        />

        <!-- centered brand lockup -->
        <div
            :style="{
                position: 'relative', zIndex: 2, height: '100%',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', padding: '0 24px',
            }"
        >
            <img
                :src="markGreenUrl"
                alt="Trifolium"
                :style="{
                    height: 'clamp(58px, 8vw, 104px)', width: 'auto', display: 'block',
                    marginBottom: 'clamp(8px, 1vw, 14px)',
                    filter: 'drop-shadow(0 2px 6px rgba(31,46,29,0.14))',
                    ...rise(0.05),
                }"
            />
            <h1
                :style="{
                    margin: 0,
                    fontFamily: `'Cormorant Garamond', serif`,
                    fontWeight: 500,
                    fontSize: 'clamp(40px, 6.4vw, 84px)',
                    lineHeight: 0.96,
                    letterSpacing: '0.14em',
                    textIndent: '0.14em',
                    color: 'var(--accent)',
                    ...rise(0.13),
                }"
            >
                TRIFOLIUM
            </h1>

            <!-- divider with center diamond -->
            <div
                :style="{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 'clamp(10px, 1.4vw, 18px)',
                    width: 'clamp(220px, 34vw, 440px)',
                    margin: 'clamp(12px, 1.6vw, 22px) 0 clamp(10px, 1.4vw, 18px)',
                    ...rise(0.2),
                }"
            >
                <span style="flex: 1; height: 1px; background: var(--accent); opacity: 0.42" />
                <span
                    :style="{
                        width: '7px', height: '7px', transform: 'rotate(45deg)',
                        border: '1px solid var(--accent)', opacity: 0.7, flexShrink: 0,
                    }"
                />
                <span style="flex: 1; height: 1px; background: var(--accent); opacity: 0.42" />
            </div>

            <p
                :style="{
                    margin: 0,
                    fontFamily: 'var(--font-heb)',
                    fontWeight: 600,
                    fontSize: 'clamp(17px, 2.4vw, 32px)',
                    letterSpacing: '0.04em',
                    whiteSpace: 'nowrap',
                    color: 'var(--accent-ink)',
                    ...rise(0.27),
                }"
            >
                בית מרקחת לצמחי מרפא
            </p>
        </div>
    </section>
</template>
