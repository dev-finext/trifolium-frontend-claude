<script setup>
// Media half of a promo slide: campaign photo, product illustration,
// or the generic hero illustration — chosen by `media.type`.
import { ProductIllustration, HeroIllustration } from '@/Components/art';

defineProps({
    /** { type: 'photo', src } | { type: 'product', heb } | { type: 'hero' } */
    media: { type: Object, required: true },
});
</script>

<template>
    <template v-if="media.type === 'photo'">
        <img
            :src="media.src"
            alt=""
            style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block"
        />
        <span
            :style="{
                position: 'absolute', bottom: '12px', insetInlineStart: '12px', fontFamily: 'var(--font-latin)', fontSize: '9.5px',
                letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.92)',
                background: 'rgba(31,46,29,0.34)', padding: '3px 9px', borderRadius: '999px', backdropFilter: 'blur(3px)',
            }"
        >תמונת הקמפיין</span>
    </template>
    <div v-else-if="media.type === 'product'" style="position: absolute; inset: 0">
        <ProductIllustration :heb="media.heb" />
    </div>
    <div v-else style="position: absolute; inset: 0">
        <HeroIllustration />
    </div>
</template>
