<script setup>
// Floating 10+1 progress pill (מבצע 10+1) — ten dots that fill with every
// shelf product in the cart; the 11th product is free (the cheapest one).
// Floats over the catalog so the promo travels with the practitioner while
// browsing; on phones it sits above the bottom tab bar.
import { computed } from 'vue';
import { useCartStore } from '@/stores/cart';

const cartStore = useCartStore();

// Shelf units across the whole cart (a product with qty 3 counts as 3).
const shelfUnits = computed(() =>
    cartStore.state.items
        .filter((it) => it.kind === 'shelf')
        .reduce((s, it) => s + it.qty, 0),
);

// Progress toward the CURRENT free item (resets after each full 11).
const progress = computed(() => Math.min(shelfUnits.value % 11, 10));
const earned = computed(() => Math.floor(shelfUnits.value / 11));

const message = computed(() => {
    if (earned.value > 0) {
        return 'מבצע 10+1 פעיל — מוצר חינם בסל';
    }

    if (progress.value === 10) {
        return 'עוד מוצר אחד — וה-11 חינם';
    }

    if (progress.value === 0) {
        return 'קונים 10 מוצרי מדף — ה-11 חינם';
    }

    return `עוד ${10 - progress.value} מוצרים — וה-11 חינם`;
});
</script>

<template>
    <div
        class="tenplusone fixed bottom-[22px] left-1/2 z-[140] -translate-x-1/2"
        role="status"
        aria-live="polite"
    >
        <div
            class="flex flex-col items-center gap-[3px] rounded-[18px] border-[1.5px] border-accent bg-surface px-[18px] py-[9px] shadow-[0_8px_22px_-10px_rgba(31,46,29,0.35)]"
        >
            <div class="flex items-center gap-[10px] whitespace-nowrap">
                <span class="flex gap-[3px]" aria-hidden="true">
                    <i
                        v-for="d in 10"
                        :key="d"
                        class="h-[9px] w-[9px] rounded-[50%] border"
                        :class="
                            d <= progress || earned > 0
                                ? 'border-accent bg-accent'
                                : 'border-line-strong bg-surface-sunk'
                        "
                    ></i>
                </span>
                <span class="text-[12.5px] font-semibold text-ink-2"
                    >{{ message }}<span class="text-accent">*</span></span
                >
            </div>
            <span class="text-[10.5px] leading-none text-ink-3"
                >*הזול מביניהם</span
            >
        </div>
    </div>
</template>

<style>
/* Above the bottom tab bar on phones (same clearance as .back-to-top). */
html.tf-mobile .tenplusone {
    bottom: calc(78px + env(safe-area-inset-bottom, 0px));
}
</style>
