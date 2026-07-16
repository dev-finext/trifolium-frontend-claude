<script setup>
// Profile-editor section card: title + description column beside the fields.
defineProps({
    title: { type: String, required: true },
    desc: { type: String, default: '' },
});
</script>

<template>
    <section class="card p-0 overflow-visible">
        <div class="grid grid-cols-[232px_1fr] gap-0">
            <div class="order-1 pt-[24px] px-[24px] pb-[28px]">
                <h2 class="m-0 text-[15px] font-semibold">{{ title }}</h2>
                <p v-if="desc" class="small muted mt-[8px] mx-0 mb-0 leading-[1.6]">{{ desc }}</p>
            </div>
            <div class="order-2 pt-[24px] px-[28px] pb-[28px] border-s border-s-line">
                <slot />
            </div>
        </div>
    </section>
</template>
