<script setup>
// Brand mark — official Trifolium logo. tone: 'light' (white, for the
// accent panel) | 'dark' (native black art, for light surfaces).
import logoUrl from '@img/trifolium-logo.png';

defineProps({
    tone: { type: String, default: 'dark' },
    height: { type: Number, default: 120 },
});
</script>

<template>
    <img
        :src="logoUrl"
        alt="Trifolium"
        :style="{
            height: `${height}px`, width: 'auto', display: 'block',
            // The official lockup is ~4:1 — never overflow a narrow card.
            maxWidth: '100%', objectFit: 'contain',
            filter: tone === 'light' ? 'brightness(0) invert(1)' : 'none',
        }"
    />
</template>
