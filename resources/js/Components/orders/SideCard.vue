<script setup>
// Sidebar card shell — uppercase eyebrow title + body slot.
defineProps({
    title: { type: String, required: true },
});
</script>

<template>
    <div class="card" style="padding: 20px">
        <h3 style="margin: 0 0 14px; font-size: 13px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: var(--ink-3)">{{ title }}</h3>
        <slot />
    </div>
</template>
