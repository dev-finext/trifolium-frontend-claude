<script setup>
// Mortar & pestle: minimal line illustration. Western-mode marker.
defineProps({
    size: { type: Number, default: 22 },
});
</script>

<template>
    <svg
        :width="size"
        :height="size"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--accent)"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <!-- Pestle (diagonal) -->
        <path d="M14.5 3.5 L19 8" />
        <circle cx="20" cy="4" r="1.3" fill="var(--accent)" stroke="none" />
        <!-- Mortar bowl -->
        <path d="M4 11 H20 L18.5 18 a3 3 0 0 1 -3 2.5 H8.5 a3 3 0 0 1 -3 -2.5 Z" />
        <!-- Bowl rim highlight -->
        <path d="M6.5 11.5 H17.5" opacity="0.5" />
    </svg>
</template>
