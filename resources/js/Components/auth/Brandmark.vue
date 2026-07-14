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
            filter: tone === 'light' ? 'brightness(0) invert(1)' : 'none',
        }"
    />
</template>
