<script setup>
// BACK TO TOP — floating button that appears once the user
// scrolls down the homepage; click smooth-scrolls back to the top.
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Icon from '@/Components/ui/Icon.vue';

const shown = ref(false);
const hover = ref(false);

const onScroll = () => { shown.value = window.scrollY > 320; };

onMounted(() => {
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
});
onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll);
});

// Cubic ease-out scroll animation — ported verbatim from the prototype.
function toTop() {
    const start = window.scrollY || window.pageYOffset || 0;
    if (start <= 0) return;
    const duration = 420;
    const t0 = performance.now();
    const ease = (p) => 1 - Math.pow(1 - p, 3);
    const step = (now) => {
        const p = Math.min((now - t0) / duration, 1);
        window.scrollTo(0, Math.round(start * (1 - ease(p))));
        if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}
</script>

<template>
    <button
        class="back-to-top"
        aria-label="חזרה לראש הדף"
        title="חזרה לראש הדף"
        :style="{
            position: 'fixed', bottom: '28px', insetInlineStart: '28px', zIndex: 150,
            width: '48px', height: '48px', borderRadius: '50%',
            background: hover ? 'var(--accent)' : 'var(--surface)',
            border: '1px solid ' + (hover ? 'var(--accent)' : 'var(--line)'),
            boxShadow: '0 8px 22px -8px rgba(31,46,29,0.34)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontFamily: 'inherit',
            opacity: shown ? 1 : 0,
            transform: shown ? 'translateY(0)' : 'translateY(12px)',
            pointerEvents: shown ? 'auto' : 'none',
            transition: 'opacity .25s ease, transform .25s ease, background .15s ease, border-color .15s ease',
        }"
        @click="toTop"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <Icon name="chevron_down" :size="22" :color="hover ? '#fff' : 'var(--ink-2)'" style="transform: rotate(180deg)" />
    </button>
</template>
