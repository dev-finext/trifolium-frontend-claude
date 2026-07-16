<script setup>
// Sidebar card shell — title + divider + arbitrary content.
defineProps({
    title: { type: String, required: true },
});
</script>

<template>
    <div class="card p-[20px]">
        <h3 class="m-0 mb-[4px] text-[16px] font-semibold">{{ title }}</h3>
        <div class="divider mx-0 mt-[12px] mb-[16px]" />
        <slot />
    </div>
</template>
