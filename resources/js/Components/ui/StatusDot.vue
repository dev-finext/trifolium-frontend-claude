<script setup>
// Colored status indicator (dot + label). Tones map to .status--* in app.css.
defineProps({
    /** 'green' | 'amber' | 'red' | 'blue' | 'gray' */
    tone: { type: String, default: 'gray' },
});
</script>

<template>
    <span :class="`status status--${tone}`"><slot /></span>
</template>
