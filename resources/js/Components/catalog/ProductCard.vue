<script setup>
// Product tile — photo with optional tag pill, name/description/volume, and a
// price row with the add-to-cart button ("בסל" badge once added).
import { ref } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
// TODO(assets): the design prototype hotlinked a real product photo (external
// news-site image, overridable via window.__resources.productImg). Replace
// this placeholder SVG with final product photography when assets arrive.
import productImg from '@img/product.svg';

const PRODUCT_IMG_URL = productImg;

defineProps({
    product: { type: Object, required: true },
    inCart: { type: Number, default: 0 },
});

const emit = defineEmits(['add']);

const hover = ref(false);
</script>

<template>
    <div
        class="card"
        :style="{
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            borderColor: hover ? 'var(--ink-2)' : 'var(--line)',
            transform: hover ? 'translateY(-3px)' : 'none',
            boxShadow: hover ? '0 8px 24px -8px rgba(31, 46, 29, 0.18)' : 'none',
            transition: 'transform .25s ease, box-shadow .25s ease, border-color .15s ease',
        }"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <div style="height: 180px; position: relative; border-bottom: 1px solid var(--line); overflow: hidden; background: var(--surface-sunk)">
            <img
                :src="PRODUCT_IMG_URL"
                :alt="product.heb"
                loading="lazy"
                :style="{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform .5s ease',
                    transform: hover ? 'scale(1.04)' : 'scale(1)',
                }"
            />
            <span
                v-if="product.tag"
                :style="{
                    position: 'absolute', top: '12px', right: '12px',
                    background: '#fff',
                    border: '1px solid var(--line)',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 500,
                    color: 'var(--ink-2)',
                }"
            >{{ product.tag }}</span>
        </div>

        <div style="padding: 16px; display: flex; flex-direction: column; gap: 4px; flex: 1">
            <div style="font-size: 15px; font-weight: 500">{{ product.heb }}</div>
            <div class="small muted" style="line-height: 1.5">{{ product.sub }}</div>
            <div class="small muted">{{ product.vol }}</div>

            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 12px">
                <div>
                    <span class="num" style="font-size: 20px; font-weight: 600">{{ product.price }}</span>
                    <span style="font-size: 13px; color: var(--ink-3); margin-right: 2px"> ₪</span>
                </div>
                <button class="btn btn--ghost btn--sm" @click.stop="emit('add')">
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
