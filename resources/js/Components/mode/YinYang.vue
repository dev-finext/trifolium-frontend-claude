<script setup>
// Yin-yang: clean two-tone glyph (no gradients). Chinese-mode marker.
defineProps({
    size: { type: Number, default: 22 },
});
</script>

<template>
    <svg :width="size" :height="size" viewBox="0 0 24 24">
        <!-- Outer rim -->
        <circle cx="12" cy="12" r="10.5" fill="#1f1f1f" />
        <!-- The S-curve cut: right half white via a path -->
        <path
            d="M12 1.5
               a 10.5 10.5 0 0 1 0 21
               a 5.25 5.25 0 0 1 0 -10.5
               a 5.25 5.25 0 0 0 0 -10.5 z"
            fill="#fafafa"
        />
        <!-- Small dots -->
        <circle cx="12" cy="6.75" r="1.4" fill="#1f1f1f" />
        <circle cx="12" cy="17.25" r="1.4" fill="#fafafa" />
    </svg>
</template>
