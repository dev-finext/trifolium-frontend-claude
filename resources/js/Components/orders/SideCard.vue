<script setup>
// Sidebar card shell — uppercase eyebrow title + body slot.
defineProps({
    title: { type: String, required: true },
});
</script>

<template>
    <div class="card p-[20px]">
        <h3 class="mt-0 mx-0 mb-[14px] text-[13px] font-bold tracking-[0.04em] uppercase text-ink-3">{{ title }}</h3>
        <slot />
    </div>
</template>
