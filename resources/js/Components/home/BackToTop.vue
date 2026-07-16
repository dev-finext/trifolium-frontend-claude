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
        class="back-to-top fixed bottom-[28px] start-[28px] z-[150] flex items-center justify-center w-[48px] h-[48px] border rounded-[50%] cursor-pointer [font-family:inherit] shadow-[0_8px_22px_-8px_rgba(31,46,29,0.34)] [transition:opacity_.25s_ease,transform_.25s_ease,background_.15s_ease,border-color_.15s_ease]"
        aria-label="חזרה לראש הדף"
        title="חזרה לראש הדף"
        :class="[
            hover ? 'bg-accent border-accent' : 'bg-surface border-line',
            shown ? 'opacity-100 [transform:translateY(0)] pointer-events-auto' : 'opacity-0 [transform:translateY(12px)] pointer-events-none',
        ]"
        @click="toTop"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <Icon name="chevron_down" :size="22" :color="hover ? '#fff' : 'var(--ink-2)'" class="[transform:rotate(180deg)]" />
    </button>
</template>
