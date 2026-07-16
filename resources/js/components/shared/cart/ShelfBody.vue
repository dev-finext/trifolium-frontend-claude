<script setup>
// Shelf-product cart line. No image (the catalog uses illustrated placeholders,
// not real photography) — the product's name, form, tags and description carry
// the line on their own.
import PatientLine from '@/components/shared/cart/PatientLine.vue';
import TypeBadge from '@/components/shared/cart/TypeBadge.vue';
import Icon from '@/components/ui/Icon.vue';

defineProps({
    item: { type: Object, required: true },
});
</script>

<template>
    <div class="min-w-0 flex-1 px-[24px] py-[20px]">
        <!-- patient header + type badge -->
        <div
            class="mb-[10px] flex flex-wrap items-start justify-between gap-[12px]"
        >
            <PatientLine :name="item.patient" :phone="item.phone" />
            <TypeBadge kind="shelf" />
        </div>

        <div class="flex flex-wrap items-baseline gap-[10px]">
            <h3 class="m-0 text-[19px] font-semibold">{{ item.name }}</h3>
            <span class="small muted num">{{ item.vol }}</span>
        </div>

        <div class="mt-[12px] flex flex-wrap gap-[6px]">
            <span
                v-for="(t, i) in item.tags"
                :key="i"
                class="inline-flex items-center gap-[5px] rounded-[999px] bg-accent-tint px-[10px] py-[3px] text-[12px] font-medium text-accent-ink"
            >
                <Icon name="leaf" :size="11" color="var(--accent)" /> {{ t }}
            </span>
        </div>

        <p
            class="m-0 mt-[14px] max-w-[560px] text-[13.5px] leading-[1.65] text-pretty text-ink-3"
        >
            {{ item.desc }}
        </p>
    </div>
</template>
