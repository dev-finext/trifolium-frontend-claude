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
    <!-- The official lockup is ~4:1 — never overflow a narrow card (max-w-full). -->
    <img
        :src="logoUrl"
        alt="Trifolium"
        class="block w-auto max-w-full object-contain"
        :class="tone === 'light' ? '[filter:brightness(0)_invert(1)]' : '[filter:none]'"
        :style="{ height: `${height}px` }"
    />
</template>
