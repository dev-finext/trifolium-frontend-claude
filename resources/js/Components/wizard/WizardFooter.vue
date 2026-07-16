<script setup>
// Sticky order-summary footer.
// The summary bar rides the viewport bottom while the user works inside the
// formula-prep area, but it must never overlay the site-wide footer. As the
// footer scrolls into view we lift the bar so it comes to rest exactly on top
// of the footer instead of sliding beneath / over it.
import { onBeforeUnmount, onMounted, ref } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import FooterCell from '@/Components/wizard/FooterCell.vue';
import StepNavBtn from '@/Components/wizard/StepNavBtn.vue';

defineProps({
    patientLabel: { type: String, default: null },
    noPatient: { type: Boolean, default: false },
    preparation: { type: String, default: '—' },
    items: { type: Number, default: 0 },
    volume: { type: Number, default: 0 },
    volumeUnit: { type: String, default: 'ml' },
    /** Kept for API parity with the prototype; not displayed in this layout. */
    total: { type: Number, default: 0 },
    canBack: { type: Boolean, default: false },
    canForward: { type: Boolean, default: false },
});

const emit = defineEmits(['back', 'forward']);

const bottom = ref(0);
const barRef = ref(null);
let resizeObserver = null;

function compute() {
    const footer = document.querySelector('.formula-prep ~ footer, footer');
    const strip = document.getElementById('site-compliance-strip');
    // The bar lives inside a zoom:1.13 wrapper; the footer/strip are measured
    // in un-zoomed viewport pixels, so divide by the ancestor zoom to convert
    // the desired visual offset into this context's CSS length.
    let z = 1;
    let el = barRef.value?.parentElement;
    while (el) {
        const zv = parseFloat(getComputedStyle(el).zoom);
        if (zv && zv !== 1) z *= zv;
        el = el.parentElement;
    }
    const stripH = strip ? (strip.offsetHeight || 0) : 0;
    let overlap = 0;
    if (footer) {
        const top = footer.getBoundingClientRect().top;
        overlap = window.innerHeight - top; // how much of the footer is on screen
    }
    // Always clear the fixed compliance strip; lift further once the main
    // footer scrolls into view so the bar rests on top of it.
    bottom.value = Math.max(stripH, overlap) / z;
}

onMounted(() => {
    compute();
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute);
    resizeObserver = new ResizeObserver(compute);
    resizeObserver.observe(document.body);
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', compute);
    window.removeEventListener('resize', compute);
    if (resizeObserver) resizeObserver.disconnect();
});
</script>

<template>
    <div
        ref="barRef"
        class="wizard-footer-bar fixed left-0 right-0 z-40 flex items-center h-[84px] bg-transparent border-none shadow-none pointer-events-none"
        :style="{ bottom: `${bottom}px` }"
    >
        <div
            class="wizard-footer-inner flex items-center w-full max-w-[min(1080px,calc(var(--maxw-lab)_-_24px))] h-[60px] my-0 mx-auto px-[20px] py-0 bg-surface border border-line-strong rounded-[16px] shadow-[var(--summary-shadow,0_20px_48px_rgba(31,46,29,0.28))] pointer-events-auto"
        >
            <!-- חזור — right edge (start) in RTL. -->
            <div class="flex-1 flex justify-start">
                <StepNavBtn dir="back" label="חזור" compact :disabled="!canBack" @click="canBack && emit('back')" />
            </div>

            <!-- Summary — centered in the middle of the bar. -->
            <div class="wizard-footer-summary flex items-center justify-center">
                <FooterCell label="סיכום" highlight />
                <FooterCell label="מטופל" :value="noPatient ? 'ללא מטופל' : (patientLabel || '—')" :warning="noPatient" />
                <FooterCell label="סוג">
                    <span class="inline-flex items-center gap-[6px]">
                        <Icon name="flask" :size="14" color="var(--ink-2)" />
                        {{ preparation }}
                    </span>
                </FooterCell>
                <FooterCell label="רכיבים">
                    <span class="num">{{ items }}</span>
                </FooterCell>
                <FooterCell label="נפח" last>
                    <span class="num">{{ volume }}</span> {{ volumeUnit }}
                </FooterCell>
            </div>

            <!-- Mobile-only compact summary (CSS-gated; the full summary above is
                 hidden on phones). Shows just the two live figures. -->
            <div class="wizard-footer-mini num" aria-hidden="true">
                <span>{{ items }} רכיבים</span>
                <span class="wizard-footer-mini__dot">·</span>
                <span>{{ volume }} {{ volumeUnit }}</span>
            </div>

            <!-- הבא — left edge (end) in RTL. -->
            <div class="flex-1 flex justify-end">
                <StepNavBtn dir="forward" label="הבא" compact :disabled="!canForward" @click="canForward && emit('forward')" />
            </div>
        </div>
    </div>
</template>
