<script setup>
// Profile-editor section card: title + description column beside the fields.
defineProps({
    title: { type: String, required: true },
    desc: { type: String, default: '' },
});
</script>

<template>
    <section class="card overflow-visible p-0">
        <div class="grid grid-cols-[232px_1fr] gap-0">
            <div class="order-1 px-[24px] pt-[24px] pb-[28px]">
                <h2 class="m-0 text-[15px] font-semibold">{{ title }}</h2>
                <p
                    v-if="desc"
                    class="small muted mx-0 mt-[8px] mb-0 leading-[1.6]"
                >
                    {{ desc }}
                </p>
            </div>
            <div
                class="order-2 border-s border-s-line px-[28px] pt-[24px] pb-[28px]"
            >
                <slot />
            </div>
        </div>
    </section>
</template>
