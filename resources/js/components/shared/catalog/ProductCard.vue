<script setup>
// Product tile — photo (real pharmacy image when available, else an illustrated
// placeholder), an optional corner pill (kids / Chinese series), name +
// condition line + volume, and a price row with the add-to-cart button.
import { ref, computed } from 'vue';
import Icon from '@/components/ui/Icon.vue';
// Placeholder shown for products with no photo, or if a real image fails to load.
import productImg from '@img/product.svg';

const props = defineProps({
    product: { type: Object, required: true },
    inCart: { type: Number, default: 0 },
});

const emit = defineEmits(['add']);

// Fall back to the illustrated placeholder if the hotlinked photo 404s.
const imgFailed = ref(false);
const imgSrc = computed(() =>
    props.product.img && !imgFailed.value ? props.product.img : productImg,
);
const isPlaceholder = computed(() => !props.product.img || imgFailed.value);
// A single flavour pill: children-friendly first, then the Chinese series.
const pill = computed(() =>
    props.product.kids
        ? 'מותאם לילדים'
        : props.product.chinese
          ? 'סדרה סינית'
          : '',
);
</script>

<template>
    <div class="card product-card">
        <div
            class="product-card__media relative h-[180px] overflow-hidden border-b border-b-line bg-surface-sunk"
        >
            <img
                :src="imgSrc"
                :alt="product.heb"
                loading="lazy"
                class="product-card__img block h-full w-full"
                :class="
                    isPlaceholder ? 'object-cover' : 'object-contain p-[10px]'
                "
                @error="imgFailed = true"
            />
            <span
                v-if="pill"
                class="absolute end-[12px] top-[12px] rounded-[999px] border border-line bg-surface px-[10px] py-[3px] text-[11px] font-medium text-ink-2"
                >{{ pill }}</span
            >
        </div>

        <div class="flex flex-1 flex-col gap-[4px] p-[16px]">
            <div class="text-[15px] font-medium">{{ product.heb }}</div>
            <div v-if="product.sub" class="small muted leading-[1.5]">
                {{ product.sub }}
            </div>
            <div v-if="product.vol" class="small muted">{{ product.vol }}</div>

            <div class="mt-[12px] flex items-center justify-between">
                <div>
                    <span class="num text-[20px] font-semibold">{{
                        product.price
                    }}</span>
                    <span class="mr-[2px] text-[13px] text-ink-3"> ₪</span>
                </div>
                <button
                    class="btn btn--ghost btn--sm"
                    :aria-label="
                        inCart > 0
                            ? `${product.heb} — ${inCart} בסל, הוסף עוד`
                            : `הוסף ${product.heb} לסל`
                    "
                    @click.stop="emit('add')"
                >
                    <template v-if="inCart > 0">
                        <span class="num">{{ inCart }}</span> בסל
                    </template>
                    <template v-else>
                        <Icon name="plus" :size="14" /> הוסף
                    </template>
                </button>
            </div>
        </div>
    </div>
</template>

<style>
.product-card {
    display: flex;
    flex-direction: column;
    transition:
        transform 0.25s ease,
        box-shadow 0.25s ease,
        border-color 0.15s ease;
}
.product-card:hover,
.product-card:focus-within {
    border-color: var(--ink-2);
    transform: translateY(-3px);
    box-shadow: 0 8px 24px -8px rgba(31, 46, 29, 0.18);
}
.product-card__img {
    transition: transform 0.5s ease;
}
.product-card:hover .product-card__img,
.product-card:focus-within .product-card__img {
    transform: scale(1.04);
}
@media (prefers-reduced-motion: reduce) {
    .product-card,
    .product-card:hover,
    .product-card:focus-within {
        transform: none;
    }
}
</style>
