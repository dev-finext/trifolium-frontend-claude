<script setup>
// Periodic-sale hero strip (מבצע תקופתי) — one leading discounted product on
// a full-width deep-green band, right under the quick actions on the home
// page (both tiers). Chosen design: one big promo instead of a scattered
// sale shelf, swapped per campaign period.
import Icon from '@/components/ui/Icon.vue';
import { SALE_PROMO } from '@/data/mock';
import { visit } from '@/lib/routes';

const props = defineProps({
    promo: { type: Object, default: () => SALE_PROMO },
});

// Lands on the catalog pre-filtered to the promoted product.
function goToProduct() {
    visit('catalog', { q: props.promo.heb });
}
</script>

<template>
    <section class="px-[24px] pt-[26px]" aria-label="מבצע תקופתי">
        <div class="mx-auto my-0 max-w-[1200px]">
            <div
                class="sale-strip flex flex-wrap items-center gap-x-[22px] gap-y-[12px] rounded-card px-[26px] py-[20px] text-white"
            >
                <span
                    class="num text-[42px] leading-none font-bold whitespace-nowrap"
                    >{{ promo.pct }}%-</span
                >
                <div class="min-w-[220px] flex-1">
                    <div
                        class="mb-[3px] text-[11.5px] font-bold tracking-[0.14em] text-[rgba(255,255,255,0.75)]"
                    >
                        {{ promo.kicker }}
                    </div>
                    <div class="text-[17px] leading-[1.3] font-bold">
                        {{ promo.heb }}
                    </div>
                    <div
                        class="mt-[3px] text-[13px] text-[rgba(255,255,255,0.85)]"
                    >
                        ₪<span class="num font-bold">{{
                            promo.salePrice
                        }}</span>
                        במקום
                        <span class="num line-through opacity-80"
                            >₪{{ promo.listPrice }}</span
                        >
                        · {{ promo.until }}
                    </div>
                </div>
                <button
                    class="inline-flex cursor-pointer items-center gap-[7px] rounded-control border-none bg-white px-[20px] py-[10px] [font-family:inherit] text-[14px] font-bold text-accent-ink"
                    @click="goToProduct"
                >
                    למוצר
                    <Icon
                        name="arrow_left"
                        :size="15"
                        color="var(--accent-ink)"
                    />
                </button>
            </div>
        </div>
    </section>
</template>

<style>
.sale-strip {
    background: linear-gradient(
        105deg,
        var(--accent) 0%,
        var(--accent-ink) 100%
    );
}
</style>
