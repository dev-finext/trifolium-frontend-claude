<script setup>
// Sidebar card shell — title + divider + arbitrary content.
defineProps({
    title: { type: String, required: true },
});
</script>

<template>
    <div class="card" style="padding: 20px">
        <h3 style="margin: 0 0 4px; font-size: 16px; font-weight: 600">{{ title }}</h3>
        <div class="divider" style="margin: 12px 0 16px" />
        <slot />
    </div>
</template>
