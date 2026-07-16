<script setup>
// Gold points coin — a refined metallic disc (crisp SVG, fine rim, soft sheen).
defineProps({
    size: { type: Number, default: 18 },
});
</script>

<template>
    <svg
        :width="size"
        :height="size"
        viewBox="0 0 24 24"
        class="block shrink-0"
        aria-hidden="true"
    >
        <defs>
            <linearGradient id="tf-gc" x1="0" y1="0" x2="0.35" y2="1">
                <stop offset="0%" stop-color="#F7DE92" />
                <stop offset="52%" stop-color="#E6BB4E" />
                <stop offset="100%" stop-color="#CF9E30" />
            </linearGradient>
        </defs>
        <circle
            cx="12"
            cy="12"
            r="9.3"
            fill="url(#tf-gc)"
            stroke="#BC8A22"
            stroke-width="1.1"
        />
        <circle
            cx="12"
            cy="12"
            r="5.9"
            fill="none"
            stroke="#B07F1C"
            stroke-width="0.9"
            opacity="0.45"
        />
        <path
            d="M7.6 7.4a6 6 0 0 1 4.6-2"
            fill="none"
            stroke="#FFF7DD"
            stroke-width="1.4"
            stroke-linecap="round"
            opacity="0.7"
        />
    </svg>
</template>
