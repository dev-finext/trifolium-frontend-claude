<script setup>
// Sidebar card shell — uppercase eyebrow title + body slot.
defineProps({
    title: { type: String, required: true },
});
</script>

<template>
    <div class="card p-[20px]">
        <h3
            class="mx-0 mt-0 mb-[14px] text-[13px] font-bold tracking-[0.04em] text-ink-3 uppercase"
        >
            {{ title }}
        </h3>
        <slot />
    </div>
</template>
